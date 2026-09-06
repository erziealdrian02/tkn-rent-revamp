<?php

namespace App\Services;

use App\Models\EquipmentStock;
use App\Models\InventoryMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockService
{
    /**
     * Increase total quantity and available quantity (e.g. initial setup or new purchase)
     */
    public function stockIn(string $equipmentId, string $branchId, int $quantity, string $type, ?string $referenceId = null): void
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $type, $referenceId) {
            $stock = EquipmentStock::firstOrCreate(
                ['equipment_id' => $equipmentId, 'branch_id' => $branchId],
                ['total_qty' => 0, 'available_qty' => 0, 'on_rental_qty' => 0, 'maintenance_qty' => 0, 'damaged_qty' => 0, 'lost_qty' => 0, 'missing_qty' => 0, 'reserved_qty' => 0]
            );

            $stock->total_qty += $quantity;
            $stock->available_qty += $quantity;
            $stock->save();

            $this->logMovement($equipmentId, $type, $quantity, null, $branchId, $referenceId);
        });
    }

    /**
     * Decrease total quantity and available quantity (e.g. sale, disposal, or transfer out)
     */
    public function stockOut(string $equipmentId, string $branchId, int $quantity, string $type, ?string $referenceId = null): void
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $type, $referenceId) {
            $stock = $this->getStockOrFail($equipmentId, $branchId);

            if ($stock->available_qty < $quantity) {
                throw new \Exception("Insufficient available stock for equipment {$equipmentId} at branch {$branchId}.");
            }

            $stock->total_qty -= $quantity;
            $stock->available_qty -= $quantity;
            $stock->save();

            $this->logMovement($equipmentId, $type, -$quantity, $branchId, null, $referenceId);
        });
    }

    /**
     * Reserve stock for an upcoming rental
     */
    public function reserveStock(string $equipmentId, string $branchId, int $quantity, ?string $referenceId = null): void
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $referenceId) {
            $stock = $this->getStockOrFail($equipmentId, $branchId);

            if ($stock->available_qty < $quantity) {
                throw new \Exception("Insufficient available stock to reserve for equipment {$equipmentId} at branch {$branchId}.");
            }

            $stock->available_qty -= $quantity;
            $stock->reserved_qty += $quantity;
            $stock->save();

            $this->logMovement($equipmentId, 'RESERVED', $quantity, $branchId, $branchId, $referenceId);
        });
    }

    /**
     * Release previously reserved stock back to available pool
     */
    public function releaseReservation(string $equipmentId, string $branchId, int $quantity, ?string $referenceId = null): void
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $referenceId) {
            $stock = $this->getStockOrFail($equipmentId, $branchId);

            if ($stock->reserved_qty < $quantity) {
                throw new \Exception("Cannot release more than reserved stock for equipment {$equipmentId} at branch {$branchId}.");
            }

            $stock->reserved_qty -= $quantity;
            $stock->available_qty += $quantity;
            $stock->save();

            $this->logMovement($equipmentId, 'RESERVATION_RELEASED', $quantity, $branchId, $branchId, $referenceId);
        });
    }

    /**
     * Confirm a rental (moving from reserved/available to on_rental)
     */
    public function rentOut(string $equipmentId, string $branchId, int $quantity, bool $fromReserved = true, ?string $referenceId = null): void
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $fromReserved, $referenceId) {
            $stock = $this->getStockOrFail($equipmentId, $branchId);

            if ($fromReserved) {
                if ($stock->reserved_qty < $quantity) {
                    throw new \Exception("Insufficient reserved stock to rent out.");
                }
                $stock->reserved_qty -= $quantity;
            } else {
                if ($stock->available_qty < $quantity) {
                    throw new \Exception("Insufficient available stock to rent out.");
                }
                $stock->available_qty -= $quantity;
            }

            $stock->on_rental_qty += $quantity;
            $stock->save();

            $this->logMovement($equipmentId, 'RENT_OUT', $quantity, $branchId, 'CUSTOMER', $referenceId);
        });
    }

    /**
     * Return equipment from rental
     */
    public function returnFromRental(string $equipmentId, string $branchId, int $quantity, string $condition = 'GOOD', ?string $referenceId = null): void
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $condition, $referenceId) {
            $stock = $this->getStockOrFail($equipmentId, $branchId);

            if ($stock->on_rental_qty < $quantity) {
                throw new \Exception("Cannot return more than what is on rental.");
            }

            $stock->on_rental_qty -= $quantity;

            if ($condition === 'GOOD') {
                $stock->available_qty += $quantity;
            } elseif ($condition === 'DAMAGED') {
                $stock->damaged_qty += $quantity;
            } elseif ($condition === 'LOST') {
                $stock->lost_qty += $quantity;
                $stock->total_qty -= $quantity; // Decrease total as it's lost
            } else {
                throw new \Exception("Unknown condition status: {$condition}");
            }

            $stock->save();
            $this->logMovement($equipmentId, "RETURN_{$condition}", $quantity, 'CUSTOMER', $branchId, $referenceId);
        });
    }

    /**
     * Move available stock to maintenance
     */
    public function moveToMaintenance(string $equipmentId, string $branchId, int $quantity, ?string $referenceId = null): void
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $referenceId) {
            $stock = $this->getStockOrFail($equipmentId, $branchId);

            if ($stock->available_qty < $quantity) {
                throw new \Exception("Insufficient available stock to move to maintenance.");
            }

            $stock->available_qty -= $quantity;
            $stock->maintenance_qty += $quantity;
            $stock->save();

            $this->logMovement($equipmentId, 'TO_MAINTENANCE', $quantity, $branchId, $branchId, $referenceId);
        });
    }

    /**
     * Complete maintenance and return to available
     */
    public function completeMaintenance(string $equipmentId, string $branchId, int $quantity, ?string $referenceId = null): void
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $referenceId) {
            $stock = $this->getStockOrFail($equipmentId, $branchId);

            if ($stock->maintenance_qty < $quantity) {
                throw new \Exception("Cannot complete maintenance for more than current maintenance stock.");
            }

            $stock->maintenance_qty -= $quantity;
            $stock->available_qty += $quantity;
            $stock->save();

            $this->logMovement($equipmentId, 'MAINTENANCE_COMPLETED', $quantity, $branchId, $branchId, $referenceId);
        });
    }

    /**
     * Transfer stock between branches
     */
    public function transferStock(string $equipmentId, string $fromBranchId, string $toBranchId, int $quantity, ?string $referenceId = null): void
    {
        DB::transaction(function () use ($equipmentId, $fromBranchId, $toBranchId, $quantity, $referenceId) {
            // Out from source
            $this->stockOut($equipmentId, $fromBranchId, $quantity, 'TRANSFER_OUT', $referenceId);
            
            // In to destination
            $this->stockIn($equipmentId, $toBranchId, $quantity, 'TRANSFER_IN', $referenceId);
        });
    }

    /**
     * Internal helper to fetch stock record or fail
     */
    private function getStockOrFail(string $equipmentId, string $branchId): EquipmentStock
    {
        $stock = EquipmentStock::where('equipment_id', $equipmentId)
            ->where('branch_id', $branchId)
            ->lockForUpdate() // Prevent race conditions
            ->first();

        if (!$stock) {
            throw new \Exception("Stock record not found for equipment {$equipmentId} at branch {$branchId}.");
        }

        return $stock;
    }

    /**
     * Log the inventory movement
     */
    private function logMovement(string $equipmentId, string $type, int $quantity, ?string $sourceLocation, ?string $destinationLocation, ?string $referenceId): void
    {
        DB::table('log_inventory_movements')->insert([
            'id' => Str::uuid(),
            'equipment_id' => $equipmentId,
            'type' => $type,
            'quantity' => $quantity,
            'source_location' => $sourceLocation,
            'destination_location' => $destinationLocation,
            'reference_id' => $referenceId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
