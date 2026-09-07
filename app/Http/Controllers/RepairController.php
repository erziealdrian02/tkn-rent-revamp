<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Repair;
use App\Services\StockService;

class RepairController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index()
    {
        $repairs = Repair::with(['equipment', 'branch', 'returnItem.returnRecord.rental'])->orderBy('created_at', 'desc')->get();
        return view('repairs.repairs-index', compact('repairs'));
    }

    public function show(Repair $repair)
    {
        $repair->load(['equipment', 'branch', 'returnItem']);
        return view('repairs.repairs-show', compact('repair'));
    }

    public function markAsFixed(Request $request, Repair $repair)
    {
        $request->validate([
            'cost' => 'nullable|numeric|min:0',
            'resolution' => 'nullable|string'
        ]);

        if ($repair->status === 'FIXED') {
            return back()->with('error', 'This repair is already marked as fixed.');
        }

        try {
            // Deduct from damaged and move back to available
            $this->stockService->repairFixed(
                $repair->equipment_id,
                $repair->branch_id,
                $repair->quantity,
                'Repair ID: ' . $repair->id
            );

            $repair->update([
                'status' => 'FIXED',
                'cost' => $request->cost ?? 0,
                'resolution' => $request->resolution,
            ]);

            return back()->with('success', 'Repair fixed and stock returned to available pool.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
