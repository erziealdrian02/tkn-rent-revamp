<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Delivery;
use App\Models\Driver;
use App\Services\StockService;
use Illuminate\Support\Facades\DB;

class DriverPortalController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index()
    {
        // Get the driver record associated with the logged-in user
        // Assuming we are storing auth()->user()
        $user = auth()->user();
        if (!$user) {
            // Fallback for testing if no auth
            $deliveries = Delivery::with('rental.project')->orderBy('created_at', 'desc')->get();
        } else {
            $driver = Driver::where('user_id', $user->id)->first();
            if (!$driver) {
                abort(403, 'User is not a driver.');
            }
            $deliveries = Delivery::with('rental.project')->where('driver_id', $driver->id)->orderBy('created_at', 'desc')->get();
        }

        return view('driver.driver-deliveries', compact('deliveries'));
    }

    public function show(Delivery $delivery)
    {
        $delivery->load(['rental.project', 'items.rentalItem.equipment']);
        return view('driver.driver-delivery-show', compact('delivery'));
    }

    public function capturePoD(Request $request, Delivery $delivery)
    {
        $request->validate([
            'receiver_name' => 'required|string|max:100',
            'signature_data' => 'required|string', // Assuming base64 for now
            // We need a branch_id to deduct the reserved stock. Ideally, we know which branch dispatched this.
            // For now, let's accept it from the request or assume it's attached to the rental or delivery.
            'branch_id' => 'required|uuid|exists:ms_branches,id',
        ]);

        if ($delivery->status !== 'ON_DELIVERY') {
            return back()->with('error', 'Only deliveries that are ON_DELIVERY can be completed.');
        }

        try {
            DB::transaction(function () use ($request, $delivery) {
                $delivery->update([
                    'status' => 'COMPLETED',
                    'receiver_name' => $request->receiver_name,
                    'signature_data' => $request->signature_data,
                ]);

                // Update Rental status if all deliveries are completed or just assume this makes it on rental
                $rental = $delivery->rental;
                $rental->update(['status' => 'ON_RENTAL']);

                // Deduct stock (move from reserved to on_rental)
                $delivery->load('items.rentalItem');
                foreach ($delivery->items as $deliveryItem) {
                    $equipmentId = $deliveryItem->rentalItem->equipment_id;
                    $quantity = $deliveryItem->qty_delivered;

                    $this->stockService->stockOut(
                        $equipmentId,
                        $request->branch_id,
                        $quantity,
                        'RENTAL_DISPATCH',
                        'Delivery completed for Rental ' . $rental->id
                    );
                }
            });

            return redirect()->route('driver.deliveries.index')->with('success', 'Proof of Delivery captured successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
