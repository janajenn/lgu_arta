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
/**
 * Update the specified department.
 */
public function update(Request $request, Department $department)
{
    if (!auth()->user()->is_hr_department) {
        abort(403, 'Only HR can manage departments.');
    }

    $validated = $request->validate([
        'department_name' => 'required|string|max:255|unique:departments,name,' . $department->id,
        'department_description' => 'nullable|string|max:500',
        'logo' => 'nullable|image|mimes:png|max:2048',

        // Head fields: if a head already exists, the fields are required (must be present, at least unchanged)
        // If no head exists, they are optional – may be left empty.
        'user_name' => [
            'nullable',
            'string',
            'max:255',
            function ($attribute, $value, $fail) use ($department) {
                // If a head exists, the name must not be empty (could be the current name)
                if ($department->head && empty($value)) {
                    $fail('The full name is required because a department head already exists.');
                }
            },
        ],
        'user_email' => [
            'nullable',
            'string',
            'email',
            'max:255',
            // Ignore the current head's user ID for uniqueness check
            \Illuminate\Validation\Rule::unique('users', 'email')->ignore($department->head?->id),
            function ($attribute, $value, $fail) use ($department) {
                if ($department->head && empty($value)) {
                    $fail('The email address is required because a department head already exists.');
                }
            },
        ],
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

    // Update department basic info
    $department->name = $validated['department_name'];
    $department->description = $validated['department_description'] ?? null;
    $department->save();

    // Update or create department head user – only if name AND email are provided
    if (!empty($validated['user_name']) && !empty($validated['user_email'])) {
        if ($department->head) {
            $user = $department->head;
            $user->name = $validated['user_name'];
            $user->email = $validated['user_email'];
            if (!empty($validated['user_password'])) {
                $user->password = Hash::make($validated['user_password']);
            }
            $user->save();
        } else {
            // Create a new head user (password is required for creation, so we must have one)
            // If password was not provided, you might want to set a default or require it.
            // Here we assume that when creating a head, a password is provided.
            $user = User::create([
                'name' => $validated['user_name'],
                'email' => $validated['user_email'],
                'password' => Hash::make($validated['user_password'] ?? 'password'), // fallback only for safety
                'department_id' => $department->id,
                'role' => 'department_head',
            ]);
        }
    } else {
        // If both name and email are empty, we do nothing with the head.
        // Optionally, you could delete the head if that's desired, but that would be unusual.
        // If you want to allow removing a head, you would need additional logic (e.g., a checkbox).
        // For now, we simply leave the head unchanged.
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
