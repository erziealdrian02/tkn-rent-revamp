<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::orderBy('plate_number')->get();
        return view('vehicles.vehicles-index', compact('vehicles'));
    }

    public function create()
    {
        return view('vehicles.vehicles-create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|max:50|unique:ms_vehicles,plate_number',
            'type' => 'nullable|string|max:50',
            'status' => 'required|in:ACTIVE,INACTIVE,MAINTENANCE'
        ]);

        Vehicle::create($validated);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle created successfully.');
    }

    public function show(Vehicle $vehicle)
    {
        return view('vehicles.vehicles-show', compact('vehicle'));
    }

    public function edit(Vehicle $vehicle)
    {
        return view('vehicles.vehicles-edit', compact('vehicle'));
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|max:50|unique:ms_vehicles,plate_number,' . $vehicle->id,
            'type' => 'nullable|string|max:50',
            'status' => 'required|in:ACTIVE,INACTIVE,MAINTENANCE'
        ]);

        $vehicle->update($validated);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return redirect()->route('vehicles.index')->with('success', 'Vehicle deleted successfully.');
    }
}
