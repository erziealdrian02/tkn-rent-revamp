<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Equipment;
use App\Models\EquipmentStock;
use App\Services\StockService;
use Illuminate\Http\Request;

class StockController extends Controller
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index()
    {
        $stocks = EquipmentStock::with(['equipment', 'branch'])->get();
        return view('stock.stock-index', compact('stocks'));
    }

    public function transferForm()
    {
        $equipment = Equipment::orderBy('name')->get();
        $branches = Branch::orderBy('name')->get();
        return view('stock.stock-transfer', compact('equipment', 'branches'));
    }

    public function transfer(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:ms_equipment,id',
            'from_branch_id' => 'required|exists:ms_branches,id',
            'to_branch_id' => 'required|exists:ms_branches,id|different:from_branch_id',
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            $this->stockService->transferStock(
                $validated['equipment_id'],
                $validated['from_branch_id'],
                $validated['to_branch_id'],
                $validated['quantity']
            );
            return redirect()->route('stock.index')->with('success', 'Stock transferred successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }
}
