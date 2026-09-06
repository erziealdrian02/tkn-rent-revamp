<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReturnRecord;
use App\Models\Rental;
use App\Models\Branch;
use App\Services\ReturnService;

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
        $rental = $rentalId ? Rental::with('items.equipment')->find($rentalId) : null;
        $branches = Branch::where('status', 'ACTIVE')->get();
        
        return view('returns.returns-create', compact('rental', 'branches'));
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
