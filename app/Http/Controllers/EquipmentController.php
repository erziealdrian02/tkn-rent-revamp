<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Equipment;

class EquipmentController extends Controller
{
    public function index()
    {
        $equipment = Equipment::all();
        return view('equipment.equipment-index', compact('equipment'));
    }

    public function show(string $id)
    {
        $item = Equipment::findOrFail($id);
        return view('equipment.equipment-show', compact('item'));
    }
}
