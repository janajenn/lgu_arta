<?php

namespace App\Http\Controllers\DepartmentHead;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'description' => $department->description,
                    'head_name' => $department->head?->name,
                    'head_email' => $department->head?->email,
                    'services_count' => $department->services->count(),
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
                    ];
                }),
            ],
        ]);
    }
}