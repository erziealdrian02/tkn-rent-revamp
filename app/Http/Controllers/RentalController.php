<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\Project;
use App\Models\Equipment;
use App\Models\Branch;
use App\Services\RentalService;

class RentalController extends Controller
{
    protected $rentalService;

    public function __construct(RentalService $rentalService)
    {
        $this->rentalService = $rentalService;
    }

    public function index()
    {
        $rentals = Rental::with(['project.customer', 'creator'])->orderBy('created_at', 'desc')->get();
        return view('rentals.rentals-index', compact('rentals'));
    }

    public function create()
    {
        $projects = Project::with('customer')->where('status', 'ACTIVE')->get();
        $equipment = Equipment::where('status', 'ACTIVE')->get();
        $branches = Branch::where('status', 'ACTIVE')->get();
        return view('rentals.rentals-create', compact('projects', 'equipment', 'branches'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|uuid|exists:ms_projects,id',
            'start_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:start_date',
            'items' => 'required|array|min:1',
            'items.*.equipment_id' => 'required|uuid|exists:ms_equipment,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            // optional branch_id in items if needed
        ]);

        try {
            $rental = $this->rentalService->createDraft(
                $request->project_id,
                $request->start_date,
                $request->return_date,
                $request->items,
                auth()->id() // Will be null if not logged in but it handles it
            );

            return redirect()->route('rentals.show', $rental->id)->with('success', 'Rental draft created successfully.');
        } catch (\Exception $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function show(Rental $rental)
    {
        $rental->load(['project.customer', 'items.equipment', 'deliveries', 'creator']);
        return view('rentals.rentals-show', compact('rental'));
    }

    public function approve(Request $request, Rental $rental)
    {
        $request->validate([
            'branch_id' => 'required|uuid|exists:ms_branches,id',
        ]);

        try {
            $this->rentalService->approveRental($rental->id, $request->branch_id);
            return back()->with('success', 'Rental approved successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function cancel(Request $request, Rental $rental)
    {
        $request->validate([
            'branch_id' => 'required|uuid|exists:ms_branches,id',
        ]);

        try {
            $this->rentalService->cancelRental($rental->id, $request->branch_id);
            return back()->with('success', 'Rental cancelled successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
