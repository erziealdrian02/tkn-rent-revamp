<?php

namespace App\Http\Controllers;

use App\Models\CompanyAccount;
use Illuminate\Http\Request;

class CompanyAccountController extends Controller
{
    public function index(Request $request)
    {
        $query = CompanyAccount::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('account_name', 'like', "%{$search}%")
                  ->orWhere('bank_name', 'like', "%{$search}%")
                  ->orWhere('account_number', 'like', "%{$search}%")
                  ->orWhere('account_code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $accounts = $query->orderBy('name')->get();
        return view('accounts.accounts-index', compact('accounts'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'account_name' => 'required|string|max:255',
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $validated['account_code'] = CompanyAccount::generateAccountCode($validated['bank_name']);
        
        // Add auth user ID if available, otherwise just use a dummy UUID for now since it's required
        $validated['created_by'] = auth()->id() ?? \Illuminate\Support\Str::uuid()->toString();

        CompanyAccount::create($validated);

        return redirect()->route('accounts.index')->with('success', 'Account added successfully.');
    }

    public function update(Request $request, CompanyAccount $account)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'account_name' => 'required|string|max:255',
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $account->update($validated);

        return redirect()->route('accounts.index')->with('success', 'Account updated successfully.');
    }

    public function destroy(CompanyAccount $account)
    {
        // Use soft delete by setting status to INACTIVE to preserve related billing data
        $account->update(['status' => 'INACTIVE']);
        return redirect()->route('accounts.index')->with('success', 'Account deactivated successfully.');
    }
}
