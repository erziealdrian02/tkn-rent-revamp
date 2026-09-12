<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('customer')->orderBy('name')->get();

        return view('projects.projects-index', compact('projects'));
    }

    public function create()
    {
        $customers = Customer::orderBy('name')->get();

        return view('projects.projects-create', compact('customers'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:ms_customers,id',
            'name' => 'required|string|max:100',
            'location' => 'required|string',
            'status' => 'required|in:ACTIVE,INACTIVE,COMPLETED',
        ]);

        Project::create($validated);

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function show(Project $project)
    {
        $project->load('customer');

        return view('projects.projects-show', compact('project'));
    }

    public function edit(Project $project)
    {
        $customers = Customer::orderBy('name')->get();

        return view('projects.projects-edit', compact('project', 'customers'));
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:ms_customers,id',
            'name' => 'required|string|max:100',
            'location' => 'required|string',
            'status' => 'required|in:ACTIVE,INACTIVE,COMPLETED',
        ]);

        $project->update($validated);

        return redirect()->route('projects.index')->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }
}
