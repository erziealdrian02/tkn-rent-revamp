<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GeneralLedger;
use App\Models\CompanyAccount;

class LedgerController extends Controller
{
    public function index(Request $request)
    {
        $accountId = $request->query('account_id');
        
        $query = GeneralLedger::with(['companyAccount', 'creator'])->orderBy('transaction_date', 'desc')->orderBy('created_at', 'desc');
        
        if ($accountId) {
            $query->where('company_account_id', $accountId);
        }

        $ledgerEntries = $query->get();
        $companyAccounts = CompanyAccount::where('status', 'ACTIVE')->get();

        return view('finance.finance-ledger', compact('ledgerEntries', 'companyAccounts', 'accountId'));
    }
}
