<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:50',
            'license_number' => 'nullable|string|max:100',
            'status' => 'required|in:Available,Off Duty,ACTIVE,INACTIVE',
            'license_exp' => 'nullable|date',
        ]);

        $status = strtoupper($validated['status']) === 'OFF DUTY' ? 'INACTIVE' : 'ACTIVE';

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'username' => strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $validated['name'])).rand(100, 999),
            'password_hash' => bcrypt('password123'), // Default password
            'status' => 'ACTIVE',
            'created_by' => auth()->id(),
        ]);

        // Attach Driver Role
        $user->roles()->attach('01a0751f-aed6-712c-b97c-05040c3241b9', [
            'id' => (string) Str::uuid(),
        ]);

        // Create driver
        Driver::create([
            'user_id' => $user->id,
            'driver_code' => Driver::generateDriverCode($validated['name']),
            'license_number' => $validated['license_number'],
            'status' => $status,
            'license_exp' => $validated['license_exp'] ?? null,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('drivers.index')->with('success', 'Driver created successfully.');
    }

    public function show(Driver $driver)
    {
        $driver->load('user');

        return view('drivers.drivers-show', compact('driver'));
    }

    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:50',
            'license_number' => 'nullable|string|max:100',
            'status' => 'required|in:Available,Off Duty,ACTIVE,INACTIVE',
            'license_exp' => 'nullable|date',
        ]);

        $status = strtoupper($validated['status']) === 'OFF DUTY' ? 'INACTIVE' : 'ACTIVE';

        // Update user
        if ($driver->user) {
            $driver->user->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
            ]);
        }

        // Update driver
        $driver->update([
            'license_number' => $validated['license_number'],
            'license_exp' => $validated['license_exp'] ?? null,
            'status' => $status,
        ]);

        return redirect()->route('drivers.index')->with('success', 'Driver updated successfully.');
    }

    public function destroy(Driver $driver)
    {
        if ($driver->user) {
            $driver->user->update(['status' => 'INACTIVE']);
        }
        $driver->update(['status' => 'INACTIVE']);

        return redirect()->route('drivers.index')->with('success', 'Driver deleted successfully.');
    }
}
