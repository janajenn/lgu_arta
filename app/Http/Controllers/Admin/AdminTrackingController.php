<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Respondent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTrackingController extends Controller
{
    public function index(Request $request)
    {
        $departments = Department::withCount('services')->get();
        $departmentStats = [];

        foreach ($departments as $dept) {
            $transactions = Respondent::whereHas('service', fn($q) => $q->where('department_id', $dept->id))->count();
            $responses = Respondent::whereHas('service', fn($q) => $q->where('department_id', $dept->id))
                ->where('completed_survey', true)
                ->count();

            // Cochran formula for minimum required
            $minRequired = 0;
            if ($transactions > 0) {
                $numerator = $transactions * 384.16;
                $denominator = ($transactions - 1) + 384.16;
                $minRequired = (int) ceil($numerator / $denominator);
            }

            $departmentStats[] = [
                'id' => $dept->id,
                'name' => $dept->name,
                'services_count' => $dept->services_count,
                'total_transactions' => $transactions,
                'total_responses' => $responses,
                'min_required' => $minRequired,
                'response_rate' => $transactions ? round(($responses / $transactions) * 100, 1) : 0,
                'status' => $responses >= $minRequired ? 'met' : 'below',
            ];
        }

        return Inertia::render('Admin/Tracking', [
            'departments' => $departmentStats,
        ]);
    }
}
