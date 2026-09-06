<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index()
    {
        $equipment = Equipment::orderBy('name')->get();
        return view('equipment.equipment-index', compact('equipment'));
    }

    public function create()
    {
        return view('equipment.equipment-create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:ms_equipment,name',
            'category' => 'nullable|string|max:50',
            'daily_rate' => 'required|numeric|min:0',
            'replacement_value' => 'required|numeric|min:0',
            'status' => 'required|in:ACTIVE,INACTIVE,MAINTENANCE'
        ]);

        Equipment::create($validated);

        return redirect()->route('equipment.index')->with('success', 'Equipment created successfully.');
    }

    public function show(Equipment $equipment)
    {
        return view('equipment.equipment-show', compact('equipment'));
    }

    public function edit(Equipment $equipment)
    {
        return view('equipment.equipment-edit', compact('equipment'));
    }

    public function update(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:ms_equipment,name,' . $equipment->id,
            'category' => 'nullable|string|max:50',
            'daily_rate' => 'required|numeric|min:0',
            'replacement_value' => 'required|numeric|min:0',
            'status' => 'required|in:ACTIVE,INACTIVE,MAINTENANCE'
        ]);

        $equipment->update($validated);

        return redirect()->route('equipment.index')->with('success', 'Equipment updated successfully.');
    }

    public function destroy(Equipment $equipment)
    {
        $equipment->delete();
        return redirect()->route('equipment.index')->with('success', 'Equipment deleted successfully.');
    }
}
