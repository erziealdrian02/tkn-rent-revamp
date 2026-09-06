<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Claim;

class ClaimController extends Controller
{
    public function index()
    {
        $claims = Claim::with(['customer', 'returnRecord.rental'])->orderBy('created_at', 'desc')->get();
        return view('claims.claims-index', compact('claims'));
    }

    public function show(Claim $claim)
    {
        $claim->load(['customer', 'returnRecord', 'items.returnItem.equipment']);
        return view('claims.claims-show', compact('claim'));
    }

    public function approve(Claim $claim)
    {
        if ($claim->status !== 'DRAFT') {
            return back()->with('error', 'Only draft claims can be approved.');
        }

        $claim->update(['status' => 'APPROVED']);
        return back()->with('success', 'Claim approved successfully.');
    }

    public function reject(Claim $claim)
    {
        if ($claim->status !== 'DRAFT') {
            return back()->with('error', 'Only draft claims can be rejected.');
        }

        $claim->update(['status' => 'REJECTED']);
        return back()->with('success', 'Claim rejected.');
    }
}
