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
use Illuminate\Support\Facades\DB;
use App\Models\User;

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

        $maxCode = Purchase::max('purchase_code') ?? 0;
        $nextCodeInt = $maxCode + 1;
        $nextPurchaseCode = 'PO-' . str_pad($nextCodeInt, 3, '0', STR_PAD_LEFT);

        return view('purchases.purchases-create', compact('equipment', 'branches', 'accounts', 'nextPurchaseCode'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'vendor_name' => 'required|string',
            'supplier_contact' => 'nullable|string|max:100',
            'branch_id' => 'required|uuid|exists:ms_branches,id',
            'bank_account_id' => 'required|uuid|exists:ms_company_accounts,id',
            'order_date' => 'required|date',
            'expected_arrival_date' => 'nullable|date',
            'status' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.equipment_id' => 'required|uuid|exists:ms_equipment,id',
            'items.*.qty_ordered' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Calculate subtotal
            $subtotal = 0;
            foreach ($request->items as $item) {
                $subtotal += $item['qty_ordered'] * $item['unit_price'];
            }

            $discount = $request->discount ?? 0;
            $tax = $request->tax ?? 0;
            $shippingCost = $request->shipping_cost ?? 0;
            
            $totalAmount = $subtotal - $discount + $tax + $shippingCost;

            $lastPo = Purchase::orderBy('created_at', 'desc')->first();
            $purchaseCode = $lastPo ? $lastPo->purchase_code + 1 : 1;

            $status = $request->status ?: 'DRAFT';

            $purchase = Purchase::create([
                'id' => Str::uuid(),
                'purchase_code' => $purchaseCode,
                'vendor_name' => $request->vendor_name,
                'supplier_contact' => $request->supplier_contact,
                'branch_id' => $request->branch_id,
                'bank_account_id' => $request->bank_account_id,
                'status' => strtoupper($status),
                'order_date' => $request->order_date,
                'expected_arrival_date' => $request->expected_arrival_date,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'total_amount' => $totalAmount,
                'created_by' => auth()->id() ?? User::first()->id, 
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

            // Create Invoice for the purchase
            Invoice::create([
                'id' => Str::uuid(),
                'reference_id' => $purchase->id,
                'customer_id' => null, 
                'vendor_name' => $purchase->vendor_name,
                'type' => 'PURCHASE',
                'status' => 'UNPAID',
                'issue_date' => $purchase->order_date,
                'due_date' => $purchase->order_date, 
                'amount' => $totalAmount,
                'paid_amount' => 0,
                'created_by' => auth()->id() ?? User::first()->id,
            ]);

            DB::commit();
            return redirect()->route('purchases.index')->with('success', 'Purchase Order and Invoice created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error creating purchase order: ' . $e->getMessage())->withInput();
        }
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
