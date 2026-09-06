<?php

namespace App\Services;

use App\Models\Rental;
use App\Models\ReturnRecord;
use App\Models\ReturnItem;
use App\Models\Repair;
use App\Models\Claim;
use App\Models\ClaimItem;
use App\Models\Equipment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReturnService
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Process a return and auto-trigger repairs and claims
     */
    public function processReturn(string $rentalId, string $branchId, string $returnDate, array $items, ?string $inspectorId = null)
    {
        return DB::transaction(function () use ($rentalId, $branchId, $returnDate, $items, $inspectorId) {
            $rental = Rental::with('project.customer')->findOrFail($rentalId);
            
            // Create the Return Record
            $returnRecord = ReturnRecord::create([
                'id' => Str::uuid(),
                'rental_id' => $rentalId,
                'return_date' => $returnDate,
                'status' => 'INSPECTED',
                'inspected_by' => $inspectorId,
            ]);

            $claimTotal = 0;
            $claimItemsData = [];

            foreach ($items as $item) {
                // Ensure equipment exists
                $equipment = Equipment::findOrFail($item['equipment_id']);
                
                $returnItem = ReturnItem::create([
                    'id' => Str::uuid(),
                    'return_id' => $returnRecord->id,
                    'equipment_id' => $equipment->id,
                    'qty_good' => $item['qty_good'] ?? 0,
                    'qty_damaged' => $item['qty_damaged'] ?? 0,
                    'qty_missing' => $item['qty_missing'] ?? 0,
                    'qty_lost' => $item['qty_lost'] ?? 0,
                    'notes' => $item['notes'] ?? null,
                ]);

                // 1. Process Good Quantity
                if ($returnItem->qty_good > 0) {
                    $this->stockService->returnGoodStock(
                        $equipment->id,
                        $branchId,
                        $returnItem->qty_good,
                        'Return ID: ' . $returnRecord->id
                    );
                }

                // 2. Process Damaged Quantity
                if ($returnItem->qty_damaged > 0) {
                    $this->stockService->markAsDamaged(
                        $equipment->id,
                        $branchId,
                        $returnItem->qty_damaged,
                        'Return ID: ' . $returnRecord->id
                    );

                    // Auto-Trigger Repair Ticket
                    Repair::create([
                        'id' => Str::uuid(),
                        'return_item_id' => $returnItem->id,
                        'equipment_id' => $equipment->id,
                        'branch_id' => $branchId,
                        'quantity' => $returnItem->qty_damaged,
                        'status' => 'PENDING',
                        'cost' => 0, // To be estimated later
                    ]);

                    // Auto-Trigger Claim for Damage
                    // Using a generic fee or 0 for now, could be evaluated later by mechanic
                    $estimatedDamageFee = 0; // Placeholder
                    $claimItemsData[] = [
                        'return_item_id' => $returnItem->id,
                        'amount_charged' => $estimatedDamageFee,
                        'type' => 'DAMAGE',
                        'description' => "Damaged item: {$equipment->name} (Qty: {$returnItem->qty_damaged})",
                    ];
                    $claimTotal += $estimatedDamageFee;
                }

                // 3. Process Lost or Missing Quantity
                $lostOrMissingQty = $returnItem->qty_lost + $returnItem->qty_missing;
                if ($lostOrMissingQty > 0) {
                    $this->stockService->markAsLost(
                        $equipment->id,
                        $branchId,
                        $lostOrMissingQty,
                        'Return ID: ' . $returnRecord->id
                    );

                    // Auto-Trigger Claim for Loss (using replacement value)
                    $lossFee = $equipment->replacement_value * $lostOrMissingQty;
                    $claimItemsData[] = [
                        'return_item_id' => $returnItem->id,
                        'amount_charged' => $lossFee,
                        'type' => 'LOSS',
                        'description' => "Lost/Missing item: {$equipment->name} (Qty: {$lostOrMissingQty})",
                    ];
                    $claimTotal += $lossFee;
                }
            }

            // Create Master Claim if there are any charges/issues
            if (count($claimItemsData) > 0) {
                $claim = Claim::create([
                    'id' => Str::uuid(),
                    'return_id' => $returnRecord->id,
                    'customer_id' => $rental->project->customer_id,
                    'type' => 'DAMAGE_LOSS',
                    'status' => 'DRAFT',
                    'amount' => $claimTotal,
                    'description' => 'Auto-generated claim for damaged or lost items during rental return.',
                ]);

                foreach ($claimItemsData as $cItem) {
                    ClaimItem::create([
                        'id' => Str::uuid(),
                        'claim_id' => $claim->id,
                        'return_item_id' => $cItem['return_item_id'],
                        'amount_charged' => $cItem['amount_charged'],
                    ]);
                }
            }

            // Mark Rental as COMPLETED (or RETURNED depending on your business logic)
            $rental->update(['status' => 'COMPLETED']);

            return $returnRecord;
        });
    }
}
