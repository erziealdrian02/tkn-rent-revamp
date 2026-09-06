<?php

namespace App\Services;

use App\Models\Rental;
use App\Models\RentalItem;
use App\Models\EquipmentStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RentalService
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Create a new draft rental
     */
    public function createDraft(string $projectId, string $startDate, string $returnDate, array $items, ?string $userId = null)
    {
        return DB::transaction(function () use ($projectId, $startDate, $returnDate, $items, $userId) {
            $totalAmount = 0;

            // Create Rental
            $rental = Rental::create([
                'id' => Str::uuid(),
                'project_id' => $projectId,
                'status' => 'PENDING_APPROVAL',
                'start_date' => $startDate,
                'return_date' => $returnDate,
                'total_amount' => 0, // Will update
                'created_by' => $userId,
            ]);

            foreach ($items as $item) {
                // Determine branch from Stock if not specified, assuming branch_id is passed in $items
                $branchId = $item['branch_id'] ?? null;
                
                $rentalItem = RentalItem::create([
                    'id' => Str::uuid(),
                    'rental_id' => $rental->id,
                    'equipment_id' => $item['equipment_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);
                
                $totalAmount += ($item['quantity'] * $item['unit_price']);
            }

            $rental->update(['total_amount' => $totalAmount]);

            return $rental;
        });
    }

    /**
     * Approve the rental and reserve stock
     */
    public function approveRental(string $rentalId, string $branchId)
    {
        return DB::transaction(function () use ($rentalId, $branchId) {
            $rental = Rental::with('items')->findOrFail($rentalId);

            if ($rental->status !== 'PENDING_APPROVAL') {
                throw new \Exception("Only pending rentals can be approved.");
            }

            foreach ($rental->items as $item) {
                // Reserve stock for each item
                $this->stockService->reserveStock(
                    $item->equipment_id,
                    $branchId,
                    $item->quantity,
                    'Rental Approval: ' . $rental->id
                );
            }

            $rental->update(['status' => 'APPROVED']);

            return $rental;
        });
    }

    /**
     * Cancel a rental
     */
    public function cancelRental(string $rentalId, string $branchId)
    {
        return DB::transaction(function () use ($rentalId, $branchId) {
            $rental = Rental::with('items')->findOrFail($rentalId);

            if ($rental->status === 'APPROVED') {
                // Need to release reservation
                foreach ($rental->items as $item) {
                    $this->stockService->releaseReservation(
                        $item->equipment_id,
                        $branchId,
                        $item->quantity,
                        'Rental Cancellation: ' . $rental->id
                    );
                }
            }

            $rental->update(['status' => 'CANCELLED']);

            return $rental;
        });
    }
}
