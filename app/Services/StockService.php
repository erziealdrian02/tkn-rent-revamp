<?php

namespace App\Services;

use App\Models\EquipmentStock;
use App\Models\InventoryMovement;
use Illuminate\Support\Facades\DB;
use Exception;

class StockService
{
    /**
     * Add stock to a specific branch
     */
    public function stockIn(string $equipmentId, string $branchId, int $quantity, string $type, ?string $referenceId = null)
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $type, $referenceId) {
            $stock = EquipmentStock::firstOrCreate(
                ['equipment_id' => $equipmentId, 'branch_id' => $branchId],
                [
                    'total_qty' => 0,
                    'available_qty' => 0,
                    'on_rental_qty' => 0,
                    'maintenance_qty' => 0,
                    'damaged_qty' => 0,
                    'lost_qty' => 0,
                    'missing_qty' => 0,
                    'reserved_qty' => 0,
                ]
            );

            $stock->increment('total_qty', $quantity);
            $stock->increment('available_qty', $quantity);

            $this->logMovement($equipmentId, $type, $quantity, null, $branchId, $referenceId);
        });
    }

    /**
     * Remove stock from a specific branch
     */
    public function stockOut(string $equipmentId, string $branchId, int $quantity, string $type, ?string $referenceId = null)
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity, $type, $referenceId) {
            $stock = EquipmentStock::where('equipment_id', $equipmentId)
                ->where('branch_id', $branchId)
                ->lockForUpdate()
                ->first();

            if (!$stock || $stock->available_qty < $quantity) {
                throw new Exception("Insufficient stock for equipment {$equipmentId} at branch {$branchId}");
            }

            $stock->decrement('total_qty', $quantity);
            $stock->decrement('available_qty', $quantity);

            $this->logMovement($equipmentId, $type, -$quantity, $branchId, null, $referenceId);
        });
    }

    /**
     * Reserve stock for a future rental
     */
    public function reserveStock(string $equipmentId, string $branchId, int $quantity)
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity) {
            $stock = EquipmentStock::where('equipment_id', $equipmentId)
                ->where('branch_id', $branchId)
                ->lockForUpdate()
                ->first();

            if (!$stock || $stock->available_qty < $quantity) {
                throw new Exception("Insufficient stock to reserve for equipment {$equipmentId} at branch {$branchId}");
            }

            $stock->decrement('available_qty', $quantity);
            $stock->increment('reserved_qty', $quantity);

            $this->logMovement($equipmentId, 'Reservation', $quantity, $branchId, $branchId, null);
        });
    }

    /**
     * Release previously reserved stock
     */
    public function releaseReservation(string $equipmentId, string $branchId, int $quantity)
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity) {
            $stock = EquipmentStock::where('equipment_id', $equipmentId)
                ->where('branch_id', $branchId)
                ->lockForUpdate()
                ->first();

            if (!$stock || $stock->reserved_qty < $quantity) {
                throw new Exception("Invalid reservation release amount for equipment {$equipmentId} at branch {$branchId}");
            }

            $stock->decrement('reserved_qty', $quantity);
            $stock->increment('available_qty', $quantity);

            $this->logMovement($equipmentId, 'Release Reservation', $quantity, $branchId, $branchId, null);
        });
    }

    /**
     * Move available stock to maintenance
     */
    public function moveToMaintenance(string $equipmentId, string $branchId, int $quantity)
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity) {
            $stock = EquipmentStock::where('equipment_id', $equipmentId)
                ->where('branch_id', $branchId)
                ->lockForUpdate()
                ->first();

            if (!$stock || $stock->available_qty < $quantity) {
                throw new Exception("Insufficient stock to move to maintenance for equipment {$equipmentId} at branch {$branchId}");
            }

            $stock->decrement('available_qty', $quantity);
            $stock->increment('maintenance_qty', $quantity);

            $this->logMovement($equipmentId, 'Move to Maintenance', $quantity, $branchId, $branchId, null);
        });
    }

    /**
     * Move available stock to damaged
     */
    public function moveToDamaged(string $equipmentId, string $branchId, int $quantity)
    {
        DB::transaction(function () use ($equipmentId, $branchId, $quantity) {
            $stock = EquipmentStock::where('equipment_id', $equipmentId)
                ->where('branch_id', $branchId)
                ->lockForUpdate()
                ->first();

            if (!$stock || $stock->available_qty < $quantity) {
                throw new Exception("Insufficient stock to report as damaged for equipment {$equipmentId} at branch {$branchId}");
            }

            $stock->decrement('available_qty', $quantity);
            $stock->increment('damaged_qty', $quantity);

            $this->logMovement($equipmentId, 'Move to Damaged', $quantity, $branchId, $branchId, null);
        });
    }

    /**
     * Create an audit trail log for inventory movement
     */
    private function logMovement(string $equipmentId, string $type, int $quantity, ?string $sourceLocation, ?string $destLocation, ?string $referenceId)
    {
        $movement = new InventoryMovement();
        $movement->equipment_id = $equipmentId;
        $movement->type = $type;
        $movement->quantity = $quantity;
        $movement->source_location = $sourceLocation;
        $movement->destination_location = $destLocation;
        $movement->reference_id = $referenceId;
        $movement->save();
    }
}
