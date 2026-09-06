<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GoodsReceipt;
use App\Models\Purchase;
use App\Models\Branch;
use App\Services\StockService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class GoodsReceiptController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index()
    {
        $receipts = GoodsReceipt::with(['purchase.equipment', 'branch', 'receiver'])->orderBy('created_at', 'desc')->get();
        return view('goods-receipts.goods-receipts-index', compact('receipts'));
    }

    public function create(Request $request)
    {
        $purchaseId = $request->query('purchase_id');
        $purchase = $purchaseId ? Purchase::with('equipment')->findOrFail($purchaseId) : null;
        $branches = Branch::where('status', 'ACTIVE')->get();
        
        return view('goods-receipts.goods-receipts-create', compact('purchase', 'branches'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'purchase_id' => 'required|uuid|exists:rnt_purchases,id',
            'branch_id' => 'required|uuid|exists:ms_branches,id',
            'qty_received' => 'required|integer|min:1',
            'received_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        try {
            DB::transaction(function () use ($request) {
                $purchase = Purchase::findOrFail($request->purchase_id);
                
                $receipt = GoodsReceipt::create([
                    'id' => Str::uuid(),
                    'gr_number' => 'GR-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
                    'purchase_id' => $request->purchase_id,
                    'branch_id' => $request->branch_id,
                    'qty_received' => $request->qty_received,
                    'received_date' => $request->received_date,
                    'notes' => $request->notes,
                    'received_by' => auth()->id()
                ]);

                // Update PO status to RECEIVED (simplified)
                $purchase->update(['status' => 'RECEIVED']);

                // Auto-Trigger: Increment Stock
                $this->stockService->stockIn(
                    $purchase->equipment_id,
                    $request->branch_id,
                    $request->qty_received,
                    'PURCHASE_RECEIPT',
                    $receipt->id
                );
            });

            return redirect()->route('purchases.index')->with('success', 'Goods Receipt processed successfully and stock updated.');
        } catch (\Exception $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function show(GoodsReceipt $goodsReceipt)
    {
        $goodsReceipt->load(['purchase.equipment', 'branch', 'receiver']);
        return view('goods-receipts.goods-receipts-show', compact('goodsReceipt'));
    }
}
