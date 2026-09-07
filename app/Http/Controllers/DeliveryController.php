<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Delivery;
use App\Models\DeliveryItem;
use App\Models\Rental;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeliveryController extends Controller
{
    public function index()
    {
        $deliveries = Delivery::with(['rental.project', 'driver', 'vehicle'])->orderBy('created_at', 'desc')->get();
        return view('deliveries.deliveries-index', compact('deliveries'));
    }

    public function create(Request $request)
    {
        $rentalId = $request->query('rental_id');
        $rental = $rentalId ? Rental::with('items.equipment')->find($rentalId) : null;
        $drivers = Driver::where('status', 'ACTIVE')->get();
        $vehicles = Vehicle::where('status', 'ACTIVE')->get();
        
        return view('deliveries.deliveries-create', compact('rental', 'drivers', 'vehicles'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'rental_id' => 'required|uuid|exists:rnt_rentals,id',
            'driver_id' => 'required|uuid|exists:ms_drivers,id',
            'vehicle_id' => 'required|uuid|exists:ms_vehicles,id',
            'delivery_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.rental_item_id' => 'required|uuid|exists:rl_rental_items,id',
            'items.*.qty_delivered' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($request) {
                $delivery = Delivery::create([
                    'id' => Str::uuid(),
                    'rental_id' => $request->rental_id,
                    'driver_id' => $request->driver_id,
                    'vehicle_id' => $request->vehicle_id,
                    'status' => 'PREPARING',
                    'delivery_date' => $request->delivery_date,
                ]);

                foreach ($request->items as $item) {
                    DeliveryItem::create([
                        'id' => Str::uuid(),
                        'delivery_id' => $delivery->id,
                        'rental_item_id' => $item['rental_item_id'],
                        'qty_delivered' => $item['qty_delivered'],
                    ]);
                }
            });

            return redirect()->route('deliveries.index')->with('success', 'Delivery order created successfully.');
        } catch (\Exception $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function show(Delivery $delivery)
    {
        $delivery->load(['rental.project', 'driver', 'vehicle', 'items.rentalItem.equipment']);
        return view('deliveries.deliveries-show', compact('delivery'));
    }

    public function dispatchDelivery(Delivery $delivery)
    {
        if ($delivery->status !== 'PREPARING') {
            return back()->with('error', 'Only preparing deliveries can be dispatched.');
        }

        $delivery->update(['status' => 'ON_DELIVERY']);

        return back()->with('success', 'Delivery dispatched successfully.');
    }
}
