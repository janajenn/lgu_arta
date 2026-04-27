<?php

namespace App\Http\Controllers;

use App\Models\SurveyQuestion;
use App\Models\Respondent;
use App\Models\SurveyResponse;
use App\Http\Requests\StoreSurveyResponseRequest;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\TransactionLog;
use App\Models\Service;
class SurveyController extends Controller
{
    // app/Http/Controllers/SurveyController.php

    public function create(Request $request)
    {
        $serviceId = $request->query('service_id');
        $service = null;
        $department = null;
        $services = [];

        if ($serviceId) {
            $service = Service::with('department')->find($serviceId);
            if ($service) {
                $department = $service->department;
                // Get all services of this department for the dropdown
                $services = $department->services()->pluck('name')->toArray();
            }
        }

        $questions = SurveyQuestion::where('is_active', true)
            ->orderBy('question_set')
            ->orderBy('question_number')
            ->get();

        return Inertia::render('Survey/Create', [
            'firstSetQuestions' => $questions->where('question_set', 'first')->values(),
            'secondSetQuestions' => $questions->where('question_set', 'second')->values(),
            'service' => $service,
            'department' => $department,
            'services' => $services,
        ]);
    }

/**
 * Record a transaction without survey
 */
public function recordTransaction(Request $request)
{
    $request->validate([
        'service_id' => 'required|exists:services,id'
    ]);

    $service = Service::find($request->service_id);

    Respondent::create([
        'service_id' => $service->id,
        'service_availed' => $service->name,
        'date_of_transaction' => now()->format('Y-m-d'),
        'completed_survey' => false,
        // other fields remain null
    ]);

    return redirect()->route('survey.thank-you');
}

public function store(StoreSurveyResponseRequest $request)
{
    $validated = $request->validated(); // ← get validated data

    DB::beginTransaction();

    try {
        $respondent = Respondent::create([
    'client_type' => $validated['respondent']['client_type'],
    'date_of_transaction' => $validated['respondent']['date_of_transaction'],
    'sex' => $validated['respondent']['sex'],
    'civil_status' => $validated['respondent']['civil_status'] ?? null,  // <-- new
    'age' => $validated['respondent']['age'],
    'region_of_residence' => $validated['respondent']['region_of_residence'],
    'service_id' => $validated['service_id'],
    'service_availed' => $validated['respondent']['service_availed'],
    'suggestions' => $validated['suggestions'] ?? '',
    'email' => $validated['email'] ?? '',
    'completed_survey' => true,
]);

            // Get all questions to map custom_id to database id
            $questions = SurveyQuestion::whereIn('custom_id', array_keys($request->input('responses', [])))
                ->pluck('id', 'custom_id')
                ->toArray();

            // Prepare responses for bulk insert
            $responses = [];
            foreach ($request->input('responses', []) as $customId => $responseData) {
                if (isset($questions[$customId])) {
                    $responses[] = [
                        'respondent_id' => $respondent->id,
                        'question_id' => $questions[$customId],
                        'answer_value' => is_array($responseData) ? $responseData['answer_value'] : $responseData,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            // Bulk insert responses
            if (!empty($responses)) {
                SurveyResponse::insert($responses);
            }

            DB::commit();

            return redirect()->route('survey.thank-you');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to save survey. Please try again.']);
        }
    }

    public function thankYou()
    {
        return Inertia::render('Survey/ThankYou');
    }
}
