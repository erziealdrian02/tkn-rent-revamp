<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::all();
        return view('vehicles.vehicles-index', compact('vehicles'));
    }

    public function show(string $id)
    {
        $vehicle = Vehicle::findOrFail($id);
        return view('vehicles.vehicles-show', compact('vehicle'));
    }
}
