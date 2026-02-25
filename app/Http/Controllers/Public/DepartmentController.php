<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DepartmentController extends Controller
{
    /**
     * Show the list of all departments (public).
     */
    public function index()
    {
        $departments = Department::with('services')->get()->map(fn($dept) => [
            'id' => $dept->id,
            'name' => $dept->name,
            'description' => $dept->description,
            'services_count' => $dept->services->count(),
            'logo' => $dept->logo ? Storage::url($dept->logo) : null,
        ]);

        return Inertia::render('Public/Departments', [
            'departments' => $departments
        ]);
    }

    /**
     * Show the welcome page for a specific department (public).
     */
    public function show(Department $department)
    {
        $department->load('services');

        return Inertia::render('Public/DepartmentWelcome', [
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
                'description' => $department->description,
                'services' => $department->services->map(fn($service) => [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                ]),
            ],
        ]);
    }
}