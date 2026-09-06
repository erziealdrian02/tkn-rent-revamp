<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Driver;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = Driver::with('user')->get();
        return view('drivers.drivers-index', compact('drivers'));
    }

    public function show(string $id)
    {
        $driver = Driver::with('user')->findOrFail($id);
        return view('drivers.drivers-show', compact('driver'));
    }
}
