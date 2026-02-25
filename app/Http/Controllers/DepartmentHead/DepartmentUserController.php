<?php
// app/Http/Controllers/DepartmentHead/DepartmentUserController.php

namespace App\Http\Controllers\DepartmentHead;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class DepartmentUserController extends Controller
{
    public function store(Request $request)
    {
        // Authorization check (optional)
        // if (!auth()->user()->is_hr_department) {
        //     abort(403);
        // }

        $validated = $request->validate([
            'department_name' => 'required|string|max:255|unique:departments,name',
            'department_description' => 'nullable|string|max:500',
            'logo' => 'required|image|mimes:png|max:2048', // PNG only, max 2MB
            'user_name' => 'required|string|max:255',
            'user_email' => 'required|string|email|max:255|unique:users,email',
            'user_password' => ['required', 'confirmed', Password::defaults()],
            'services' => 'required|array|min:1',
            'services.*.name' => 'required|string|max:255',
            'services.*.description' => 'nullable|string|max:500',
        ]);

        // Store logo
        $logoPath = $request->file('logo')->store('logos', 'public');

        try {
            DB::transaction(function () use ($validated, $logoPath) {
                $department = Department::create([
                    'name' => $validated['department_name'],
                    'description' => $validated['department_description'] ?? null,
                    'logo' => $logoPath,
                ]);

                $user = User::create([
                    'name' => $validated['user_name'],
                    'email' => $validated['user_email'],
                    'password' => Hash::make($validated['user_password']),
                    'department_id' => $department->id,
                    'role' => 'department_head',
                ]);

                foreach ($validated['services'] as $serviceData) {
                    $department->services()->create([
                        'name' => $serviceData['name'],
                        'description' => $serviceData['description'] ?? null,
                    ]);
                }
            });
        } catch (\Exception $e) {
            // Delete uploaded logo if transaction failed
            Storage::disk('public')->delete($logoPath);
            throw $e;
        }

        return redirect()->back()->with('success', 'Department, Department Head, and services created successfully.');
    }

    public function create()
    {
        // Optional: ensure only HR Department Head can access
        // if (!auth()->user()->is_hr_department) {
        //     abort(403);
        // }
        return Inertia::render('DepartmentHead/CreateDepartment');
    }

}