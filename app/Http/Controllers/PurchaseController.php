<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\CompanyAccount;
use App\Models\Equipment;
use App\Models\Invoice;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use Illuminate\Http\Request;
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
        $branches = Branch::where('status', 'ACTIVE')->get();
        $accounts = CompanyAccount::where('status', 'ACTIVE')->get();

        return view('purchases.purchases-create', compact('equipment', 'branches', 'accounts'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'vendor_name' => 'required|string',
            'branch_id' => 'required|uuid|exists:ms_branches,id',
            'order_date' => 'required|date',
            'arrival_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.equipment_id' => 'required|uuid|exists:ms_equipment,id',
            'items.*.qty_ordered' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Calculate total amount
        $totalAmount = 0;
        foreach ($request->items as $item) {
            $totalAmount += $item['qty_ordered'] * $item['unit_price'];
        }

        // Generate numeric purchase_code or let it be auto-increment if handled by DB.
        // Assuming we need to set it manually if it doesn't have default.
        $lastPo = Purchase::orderBy('created_at', 'desc')->first();
        $purchaseCode = $lastPo ? $lastPo->purchase_code + 1 : 1;

        $purchase = Purchase::create([
            'id' => Str::uuid(),
            'purchase_code' => $purchaseCode,
            'vendor_name' => $request->vendor_name,
            'branch_id' => $request->branch_id,
            'status' => 'DRAFT',
            'order_date' => $request->order_date,
            'arrival_date' => $request->arrival_date,
            'total_amount' => $totalAmount,
            'created_by' => auth()->id() ?? User::first()->id, // Fallback if no auth
        ]);

        // Create Purchase Items
        foreach ($request->items as $item) {
            PurchaseItem::create([
                'id' => Str::uuid(),
                'purchase_id' => $purchase->id,
                'equipment_id' => $item['equipment_id'],
                'qty_ordered' => $item['qty_ordered'],
                'unit_price' => $item['unit_price'],
            ]);
        }

        // Create Invoice for the purchase (Hutang ke Vendor)
        Invoice::create([
            'id' => Str::uuid(),
            'reference_id' => $purchase->id,
            'customer_id' => null, // Karena ini vendor, bukan customer
            'vendor_name' => $purchase->vendor_name,
            'type' => 'PURCHASE',
            'status' => 'UNPAID',
            'issue_date' => $purchase->order_date,
            'due_date' => $purchase->order_date, // Atau diset H+30 sesuai kebijakan
            'amount' => $totalAmount,
            'paid_amount' => 0,
            'created_by' => auth()->id() ?? User::first()->id,
        ]);

        return redirect()->route('purchases.index')->with('success', 'Purchase Order and Invoice created successfully.');
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
