<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Rental;
use App\Models\ReturnItem;
use App\Models\ReturnRecord;
use App\Services\ReturnService;
use Illuminate\Http\Request;

class ReturnController extends Controller
{
    protected $returnService;

    public function __construct(ReturnService $returnService)
    {
        $this->returnService = $returnService;
    }

    public function index()
    {
        $returns = ReturnRecord::with(['rental.project', 'inspector'])->orderBy('created_at', 'desc')->get();

        return view('returns.returns-index', compact('returns'));
    }

    public function create(Request $request)
    {
        $rentalId = $request->query('rental_id');
        $rental = $rentalId ? Rental::with(['items.equipment', 'deliveries.items'])->find($rentalId) : null;
        $branches = Branch::where('status', 'ACTIVE')->get();

        $rentedItems = [];
        if ($rental) {
            // Sum all qty_delivered per rental_item_id across deliveries
            $deliveredMap = [];
            foreach ($rental->deliveries as $delivery) {
                foreach ($delivery->items as $di) {
                    $deliveredMap[$di->rental_item_id] = ($deliveredMap[$di->rental_item_id] ?? 0) + $di->qty_delivered;
                }
            }

            // Sum already returned per rental_item_id
            $returnedMap = [];
            $existingReturnItems = ReturnItem::whereHas('returnRecord', function ($q) use ($rental) {
                $q->where('rental_id', $rental->id);
            })->get();
            foreach ($existingReturnItems as $ri) {
                $returnedMap[$ri->rental_item_id] = ($returnedMap[$ri->rental_item_id] ?? 0)
                    + $ri->qty_good + $ri->qty_damaged + $ri->qty_lost;
            }

            foreach ($rental->items as $item) {
                $delivered = $deliveredMap[$item->id] ?? $item->quantity;
                $returned = $returnedMap[$item->id] ?? 0;
                $remaining = max(0, $delivered - $returned);

                if ($remaining > 0) {
                    $rentedItems[] = [
                        'rental_item_id' => $item->id,
                        'equipment_id' => $item->equipment_id,
                        'equipment_name' => $item->equipment->name ?? '-',
                        'remaining' => $remaining,
                    ];
                }
            }
        }

        return view('returns.returns-create', compact('rental', 'branches', 'rentedItems'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'rental_id' => 'required|uuid|exists:rnt_rentals,id',
            'branch_id' => 'required|uuid|exists:ms_branches,id',
            'return_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.equipment_id' => 'required|uuid|exists:ms_equipment,id',
            'items.*.qty_good' => 'nullable|integer|min:0',
            'items.*.qty_damaged' => 'nullable|integer|min:0',
            'items.*.qty_missing' => 'nullable|integer|min:0',
            'items.*.qty_lost' => 'nullable|integer|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        try {
            $returnRecord = $this->returnService->processReturn(
                $request->rental_id,
                $request->branch_id,
                $request->return_date,
                $request->items,
                auth()->id()
            );

            return redirect()->route('returns.show', $returnRecord->id)->with('success', 'Return processed and stocks updated successfully.');
        } catch (\Exception $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function show(ReturnRecord $return)
    {
        $return->load(['rental.project', 'inspector', 'items.equipment']);

        return view('returns.returns-show', compact('return'));
    }
}
