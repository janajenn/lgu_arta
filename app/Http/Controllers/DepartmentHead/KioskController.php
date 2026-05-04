<?php

namespace App\Http\Controllers\DepartmentHead;

use App\Http\Controllers\Controller;
use App\Models\KioskSession;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class KioskController extends Controller
{
    public function index()
    {
        $department = auth()->user()->department;
        $sessions = KioskSession::where('department_id', $department->id)
            ->with('activatedBy', 'deactivatedBy')
            ->orderBy('created_at', 'desc')
            ->get();

        $activeSession = $department->activeKioskSession;

        return Inertia::render('DepartmentHead/KioskManagement', [
            'department' => $department,
            'activeSession' => $activeSession,
            'sessions' => $sessions,
        ]);
    }

   public function activate(Request $request)
{
    $department = auth()->user()->department;

    if ($department->activeKioskSession) {
        return response()->json(['error' => 'A kiosk session is already active.'], 400);
    }

    $now = Carbon::now();
    if ($department->opening_time && $department->closing_time) {
        $opening = Carbon::parse($department->opening_time);
        $closing = Carbon::parse($department->closing_time);
        if (!$now->between($opening, $closing)) {
            return response()->json(['error' => 'Kiosk can only be activated during operating hours.'], 400);
        }
    }

    $expiresAt = $department->closing_time
        ? Carbon::parse($department->closing_time)
        : Carbon::now()->addHours(8);

    $session = KioskSession::create([
        'department_id' => $department->id,
        'activated_at' => now(),
        'expires_at' => $expiresAt,
        'is_active' => true,
        'activated_by' => auth()->id(),
    ]);

    return response()->json([
        'success' => true,
        'token' => $session->token,
        'expires_at' => $expiresAt,
    ]);
}
    public function deactivate(Request $request)
    {
        $department = auth()->user()->department;
        $active = $department->activeKioskSession;

        if (!$active) {
            return redirect()->back()->with('error', 'No active kiosk session found.');
        }

        $active->update([
            'is_active' => false,
            'deactivated_at' => now(),
            'deactivated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Kiosk session deactivated.');
    }

    public function status(Request $request)
    {
        $departmentId = $request->query('department_id');
        $token = $request->query('token');

        $department = Department::findOrFail($departmentId);
        $session = KioskSession::where('department_id', $department->id)
            ->where('token', $token)
            ->where('is_active', true)
            ->where('expires_at', '>', now())
            ->first();

        return response()->json([
            'active' => $session !== null,
            'expires_at' => $session ? $session->expires_at : null,
        ]);
    }
}
