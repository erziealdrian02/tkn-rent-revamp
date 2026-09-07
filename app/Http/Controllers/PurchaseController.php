<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Purchase;
use App\Models\Equipment;
use Illuminate\Support\Str;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with(['equipment', 'creator'])->orderBy('created_at', 'desc')->get();
        return view('purchases.purchases-index', compact('purchases'));
    }

    public function create()
    {
        $equipment = Equipment::where('status', 'ACTIVE')->get();
        return view('purchases.purchases-create', compact('equipment'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'equipment_id' => 'required|uuid|exists:ms_equipment,id',
            'vendor_name' => 'required|string',
            'qty_ordered' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'expected_delivery' => 'nullable|date',
            'notes' => 'nullable|string'
        ]);

        $purchase = Purchase::create([
            'id' => Str::uuid(),
            'po_number' => 'PO-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
            'equipment_id' => $request->equipment_id,
            'vendor_name' => $request->vendor_name,
            'qty_ordered' => $request->qty_ordered,
            'unit_price' => $request->unit_price,
            'total_amount' => $request->qty_ordered * $request->unit_price,
            'status' => 'DRAFT',
            'order_date' => now()->toDateString(),
            'expected_delivery' => $request->expected_delivery,
            'notes' => $request->notes,
            'created_by' => auth()->id()
        ]);

        return redirect()->route('purchases.show', $purchase->id)->with('success', 'Purchase Order created successfully.');
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['equipment', 'creator', 'goodsReceipts']);
        return view('purchases.purchases-show', compact('purchase'));
    }

    public function approve(Purchase $purchase)
    {
        if ($purchase->status !== 'DRAFT') {
            return back()->with('error', 'Only draft POs can be approved.');
        }

        $purchase->update(['status' => 'APPROVED']);
        return back()->with('success', 'PO approved.');
    }
}
