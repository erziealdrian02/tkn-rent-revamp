<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicle::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('vehicle_code', 'like', "%{$search}%")
                    ->orWhere('plate_number', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $vehicles = $query->orderBy('plate_number')->get();

        return view('vehicles.vehicles-index', compact('vehicles'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|max:50|unique:ms_vehicles,plate_number',
            'type' => 'nullable|string|max:50',
            'brand' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer',
            'tax_expiry' => 'required|date',
            'status' => 'required|in:Available,Maintenance,ACTIVE,INACTIVE',
        ]);

        $status = in_array(strtoupper($validated['status']), ['AVAILABLE', 'ACTIVE']) ? 'Available' : 'Maintenance';

        $validated['vehicle_code'] = Vehicle::generateVehicleCode($validated['plate_number']);
        $validated['status'] = $status;
        $validated['created_by'] = auth()->id() ?? (string) Str::uuid();

        // Remove capacity if it's not in the database table to prevent SQL errors
        if (! Schema::hasColumn('ms_vehicles', 'capacity')) {
            unset($validated['capacity']);
        }

        Vehicle::create($validated);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle created successfully.');
    }

    public function show(Vehicle $vehicle)
    {
        return view('vehicles.vehicles-show', compact('vehicle'));
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|max:50|unique:ms_vehicles,plate_number,'.$vehicle->id,
            'type' => 'nullable|string|max:50',
            'brand' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer',
            'tax_expiry' => 'required|date',
            'status' => 'required|in:Available,Maintenance,ACTIVE,INACTIVE',
        ]);

        $status = in_array(strtoupper($validated['status']), ['AVAILABLE', 'ACTIVE']) ? 'Available' : 'Maintenance';
        $validated['status'] = $status;

        if (! Schema::hasColumn('ms_vehicles', 'capacity')) {
            unset($validated['capacity']);
        }

        $vehicle->update($validated);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->update(['status' => 'INACTIVE']);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle deactivated successfully.');
    }
}
