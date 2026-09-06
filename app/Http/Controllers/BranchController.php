<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branch;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Branch::all();
        return view('branches.branches-index', compact('branches'));
    }

    public function show(string $id)
    {
        $branch = Branch::findOrFail($id);
        return view('branches.branches-show', compact('branch'));
    }
}
