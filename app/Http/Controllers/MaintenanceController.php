<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Maintenance;
use App\Models\Equipment;
use App\Models\Branch;
use App\Services\StockService;
use Illuminate\Support\Str;

class MaintenanceController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index()
    {
        $maintenance = Maintenance::with(['equipment', 'branch'])->orderBy('created_at', 'desc')->get();
        return view('maintenance.maintenance-index', compact('maintenance'));
    }

    public function create()
    {
        $equipment = Equipment::where('status', 'ACTIVE')->get();
        $branches = Branch::where('status', 'ACTIVE')->get();
        return view('maintenance.maintenance-create', compact('equipment', 'branches'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'equipment_id' => 'required|uuid|exists:ms_equipment,id',
            'branch_id' => 'required|uuid|exists:ms_branches,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        // Note: Full implementation would move stock from available to maintenance
        // For brevity, we assume the StockService will have a `moveToMaintenance` method

        $maintenance = Maintenance::create([
            'id' => Str::uuid(),
            'equipment_id' => $request->equipment_id,
            'branch_id' => $request->branch_id,
            'quantity' => $request->quantity,
            'type' => $request->type,
            'status' => 'IN_PROGRESS',
            'start_date' => $request->start_date,
            'notes' => $request->notes,
        ]);

        return redirect()->route('maintenance.index')->with('success', 'Maintenance scheduled.');
    }

    public function show(Maintenance $maintenance)
    {
        $maintenance->load(['equipment', 'branch']);
        return view('maintenance.maintenance-show', compact('maintenance'));
    }
}
