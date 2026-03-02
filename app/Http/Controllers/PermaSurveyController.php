<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PermaResponse;
use App\Models\Department;

class PermaSurveyController extends Controller
{
    public function create()
    {
        return Inertia::render('PermaSurvey/PermaLanding');
    }

   

    public function form(Request $request)
{

    
        // // Prevent resubmission via cookie
        // if ($request->cookie('perma_submitted')) {
        //     return redirect()->route('perma.thankyou')->with('info', 'You have already completed this survey.');
        // }


    $departments = Department::orderBy('name')->get(['id', 'name']);
    return Inertia::render('PermaSurvey/PermaForm', [
        'departments' => $departments,
    ]);
}

    
       

        public function store(Request $request)
        {

             // // Double‑check cookie
        // if ($request->cookie('perma_submitted')) {
        //     return redirect()->route('perma.thankyou')->with('error', 'You have already submitted.');
        // }

        
            $rules = [
                'department_id' => 'required|exists:departments,id',
                'age_bracket'   => 'required|in:20-29,30-39,40-49,50-59,60+',
            ];
            for ($i = 1; $i <= 23; $i++) {
                $rules["q$i"] = 'required|integer|min:1|max:5';
            }
            // respondent_name is optional – no validation rule
        
            $validated = $request->validate($rules);
        
            // Add optional fields if present
            if ($request->has('respondent_name')) {
                $validated['respondent_name'] = $request->respondent_name;
            }
        
            if (auth()->check()) {
                $validated['user_id'] = auth()->id();
            }
        
            PermaResponse::create($validated);
        
            return redirect()->route('perma.thankyou')
                             ->cookie('perma_submitted', '1', 60*24*365);
        }

    public function thankyou()
    {
        // Fetch real counts from database
        $totalResponses = PermaResponse::count(); // all‑time total
        $monthlyResponses = PermaResponse::whereMonth('created_at', now()->month)
                                          ->whereYear('created_at', now()->year)
                                          ->count(); // this month

        return Inertia::render('PermaSurvey/PermaThankYou', [
            'totalResponses' => $totalResponses,
            'monthlyResponses' => $monthlyResponses,
        ]);
    }
}