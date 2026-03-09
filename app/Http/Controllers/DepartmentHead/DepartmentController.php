<?php

namespace App\Http\Controllers\DepartmentHead;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\User;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index()
    {
        if (!auth()->user()->is_hr_department) {
            abort(403, 'Only HR can manage departments.');
        }

        
        $departments = Department::with('head', 'services')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($department) {
            $services = $department->services;
            return [
                'id' => $department->id,
                'name' => $department->name,
                'description' => $department->description,
                'head_name' => $department->head?->name,
                'head_email' => $department->head?->email,
                'services_count' => $services->count(),
                'internal_services_count' => $services->where('category', 'internal')->count(),
                'external_services_count' => $services->where('category', 'external')->count(),
                'created_at' => $department->created_at->format('Y-m-d'),
            ];
        });

    return Inertia::render('DepartmentHead/Departments/Index', [
        'departments' => $departments,
    ]);
}

    /**
     * Display the specified department.
     */
    public function show(Department $department)
{
    if (!auth()->user()->is_hr_department) {
        abort(403, 'Only HR can manage departments.');
    }

    $department->load('head', 'services');

    return Inertia::render('DepartmentHead/Departments/Show', [
        'department' => [
            'id' => $department->id,
            'name' => $department->name,
            'description' => $department->description,
            'created_at' => $department->created_at->format('Y-m-d'),
            'head' => $department->head ? [
                'id' => $department->head->id,
                'name' => $department->head->name,
                'email' => $department->head->email,
            ] : null,
            'services' => $department->services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'category' => $service->category, // <-- ADD THIS
                ];
            }),
        ],
    ]);
}


/**
 * Show the form for editing the specified department.
 */
public function edit(Department $department)
{
    if (!auth()->user()->is_hr_department) {
        abort(403, 'Only HR can manage departments.');
    }

    $department->load('head', 'services');

    return Inertia::render('DepartmentHead/Departments/EditDepartment', [
        'department' => [
            'id' => $department->id,
            'name' => $department->name,
            'description' => $department->description,
            'logo' => $department->logo, // path relative to storage
            'created_at' => $department->created_at->format('Y-m-d'),
            'head' => $department->head ? [
                'id' => $department->head->id,
                'name' => $department->head->name,
                'email' => $department->head->email,
            ] : null,
            'services' => $department->services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'category' => $service->category,
                ];
            }),
        ],
    ]);
}

/**
 * Update the specified department.
 */
public function update(Request $request, Department $department)
{
    if (!auth()->user()->is_hr_department) {
        abort(403, 'Only HR can manage departments.');
    }

    $validated = $request->validate([
        // Use 'department_name' to match the form field
        'department_name' => 'required|string|max:255|unique:departments,name,' . $department->id,
        'department_description' => 'nullable|string|max:500',
        'logo' => 'nullable|image|mimes:png|max:2048',
        'user_name' => 'required|string|max:255',
        'user_email' => 'required|string|email|max:255|unique:users,email,' . ($department->head?->id ?: 'NULL'),
        'user_password' => ['nullable', 'confirmed', Password::defaults()],
        'services' => 'required|array|min:1',
        'services.*.id' => 'nullable|exists:services,id',
        'services.*.name' => 'required|string|max:255',
        'services.*.description' => 'nullable|string|max:500',
        'services.*.category' => 'required|in:internal,external',
    ]);

    // Handle logo upload
    if ($request->hasFile('logo')) {
        if ($department->logo) {
            Storage::disk('public')->delete($department->logo);
        }
        $logoPath = $request->file('logo')->store('logos', 'public');
        $department->logo = $logoPath;
    }

    // Update department basic info (note: use 'department_name' from validated)
    $department->name = $validated['department_name'];
    $department->description = $validated['department_description'] ?? null;
    $department->save();

    // Update or create department head user
    if ($department->head) {
        $user = $department->head;
        $user->name = $validated['user_name'];
        $user->email = $validated['user_email'];
        if (!empty($validated['user_password'])) {
            $user->password = Hash::make($validated['user_password']);
        }
        $user->save();
    } else {
        $user = User::create([
            'name' => $validated['user_name'],
            'email' => $validated['user_email'],
            'password' => Hash::make($validated['user_password'] ?? 'password'), // Ensure password is provided
            'department_id' => $department->id,
            'role' => 'department_head',
        ]);
    }

    // Sync services
    $incomingServiceIds = collect($validated['services'])->pluck('id')->filter();
    $department->services()->whereNotIn('id', $incomingServiceIds)->delete();

    foreach ($validated['services'] as $serviceData) {
        if (isset($serviceData['id'])) {
            $service = $department->services()->find($serviceData['id']);
            if ($service) {
                $service->update([
                    'name' => $serviceData['name'],
                    'description' => $serviceData['description'] ?? null,
                    'category' => $serviceData['category'],
                ]);
            }
        } else {
            $department->services()->create([
                'name' => $serviceData['name'],
                'description' => $serviceData['description'] ?? null,
                'category' => $serviceData['category'],
            ]);
        }
    }

    return redirect()->route('department-head.departments.index')
        ->with('success', 'Department updated successfully.');
}



}