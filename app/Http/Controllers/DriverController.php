<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\User;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = Driver::with('user')->get();
        return view('drivers.drivers-index', compact('drivers'));
    }

    public function create()
    {
        $users = User::orderBy('name')->get();
        return view('drivers.drivers-create', compact('users'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:ms_users,id',
            'license_number' => 'nullable|string|max:100',
            'status' => 'required|in:ACTIVE,INACTIVE'
        ]);

        Driver::create($validated);

        return redirect()->route('drivers.index')->with('success', 'Driver created successfully.');
    }

    public function show(Driver $driver)
    {
        $driver->load('user');
        return view('drivers.drivers-show', compact('driver'));
    }

    public function edit(Driver $driver)
    {
        $users = User::orderBy('name')->get();
        return view('drivers.drivers-edit', compact('driver', 'users'));
    }

    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:ms_users,id',
            'license_number' => 'nullable|string|max:100',
            'status' => 'required|in:ACTIVE,INACTIVE'
        ]);

        $driver->update($validated);

        return redirect()->route('drivers.index')->with('success', 'Driver updated successfully.');
    }

    public function destroy(Driver $driver)
    {
        $driver->delete();
        return redirect()->route('drivers.index')->with('success', 'Driver deleted successfully.');
    }
}
