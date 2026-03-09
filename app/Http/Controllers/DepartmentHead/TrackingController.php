<?php

namespace App\Http\Controllers\DepartmentHead;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Respondent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrackingController extends Controller
{
    /**
     * Display the tracking page (requires PIN verification).
     */
public function index(Request $request)
{
    // Only HR department heads can access
    if (!$request->user()->is_hr_department) {
        abort(403, 'Unauthorized.');
    }

    // Check if PIN has been verified in this session
    if (!session('tracking_pin_verified', false)) {
        return redirect()->route('department-head.dashboard')
            ->with('error', 'PIN verification required.');
    }

    // Get all departments with stats
    $departments = Department::withCount('services')->get();

    $departmentStats = [];
    $overallTransactions = 0;
    $overallResponses = 0;

     foreach ($departments as $dept) {
        $transactions = Respondent::whereHas('service', fn($q) => $q->where('department_id', $dept->id))->count();
        $responses = Respondent::whereHas('service', fn($q) => $q->where('department_id', $dept->id))
            ->where('completed_survey', true)
            ->count();

        // Calculate minimum required respondents
        $minRequired = 0;
        if ($transactions > 0) {
            $numerator = $transactions * 384.16;
            $denominator = ($transactions - 1) + 384.16;
            $minRequired = (int) ceil($numerator / $denominator);
        }

        $overallTransactions += $transactions;
        $overallResponses += $responses;

        $departmentStats[] = [
            'id' => $dept->id,
            'name' => $dept->name,
            'services_count' => $dept->services_count,
            'total_transactions' => $transactions,
            'total_responses' => $responses,
            'min_required' => $minRequired,               // ✅ add this
            'response_rate' => $transactions ? round(($responses / $transactions) * 100, 1) : 0,
            'status' => $responses >= $minRequired ? 'met' : 'below', // ✅ add this
        ];
    }

    $overall = [
        'total_departments' => $departments->count(),
        'total_transactions' => $overallTransactions,
        'total_responses' => $overallResponses,
        'overall_response_rate' => $overallTransactions ? round(($overallResponses / $overallTransactions) * 100, 1) : 0,
    ];

    return Inertia::render('DepartmentHead/TrackDepartments', [
        'departments' => $departmentStats,
        'overall' => $overall,
    ]);
}

    /**
     * Verify the PIN and set session flag.
     */
    public function verifyPin(Request $request)
    {
        $request->validate(['pin' => 'required|string']);

        // Get PIN from config (set in .env)
        $validPin = config('app.tracking_pin', '2026');

        if ($request->pin === $validPin) {
            session(['tracking_pin_verified' => true]);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Invalid PIN'], 422);
    }
}
