<?php

namespace App\Http\Controllers\DepartmentHead;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Respondent;
use App\Models\SurveyResponse;
use App\Models\SurveyQuestion;
use App\Models\TransactionLog;

use App\Models\Service;
use App\Models\Department;



class AnalyticsController extends Controller
{
    /**
     * Display CC and SQD analytics.
     */
    /**
 * Display CC and SQD analytics.
 */
 public function index(Request $request)
    {
        if (!$request->user() || !$request->user()->isDepartmentHead()) {
            abort(403, 'Unauthorized access. Department head privileges required.');
        }

        $filters = $request->only([
            'age_group', 'client_type', 'sex', 'region', 'service_availed', 'date_from', 'date_to',
        ]);

        $data = $this->getAnalyticsForDepartment($request->user()->department_id, $filters);

        return Inertia::render('DepartmentHead/Analytics', $data);
    }


     public function show(Request $request, Department $department)
    {
        if (!$request->user()->is_hr_department) {
            abort(403, 'Unauthorized.');
        }

        $filters = $request->only([
            'age_group', 'client_type', 'sex', 'region', 'service_availed', 'date_from', 'date_to',
        ]);

        $data = $this->getAnalyticsForDepartment($department->id, $filters);

        return Inertia::render('DepartmentHead/Analytics', array_merge($data, [
            'viewingDepartment' => $department,
        ]));
    }



 private function getAnalyticsForDepartment($departmentId, $filters)
    {
        // Base query: completed surveys from the given department
        $query = Respondent::completedSurvey()
            ->whereHas('service', fn($q) => $q->where('department_id', $departmentId));

        // Apply filters
        $this->applyFilters($query, $filters);

        // Get filtered respondent IDs
        $respondentIds = $query->pluck('id');

        // Compute analytics
        $ccAnalytics = $this->getCCAnalytics($respondentIds);
        $sqdAnalytics = $this->getSQDAnalytics($respondentIds);
        $totalRespondents = $respondentIds->count();
        $overallSatisfaction = $this->calculateOverallSatisfaction($sqdAnalytics);
        $overallSQDSummary = $this->calculateOverallSQDSummary($sqdAnalytics, $respondentIds);

        // Filter options (scoped to department for regions and services)
        $filterOptions = [
            'client_types' => ['citizen', 'business', 'government'],
            'sexes' => ['male', 'female', 'prefer_not_to_say'],
            'regions' => Respondent::completedSurvey()
                ->whereHas('service', fn($q) => $q->where('department_id', $departmentId))
                ->distinct()
                ->pluck('region_of_residence')
                ->sort()
                ->values(),
            'age_groups' => [
                ['value' => '18_below', 'label' => '18 and below'],
                ['value' => '19_25', 'label' => '19-25 years'],
                ['value' => '26_35', 'label' => '26-35 years'],
                ['value' => '36_45', 'label' => '36-45 years'],
                ['value' => '46_60', 'label' => '46-60 years'],
                ['value' => '61_above', 'label' => '61+ years'],
            ],
            'serviceOptions' => Respondent::completedSurvey()
                ->whereHas('service', fn($q) => $q->where('department_id', $departmentId))
                ->distinct()
                ->pluck('service_availed')
                ->sort()
                ->values(),
        ];

        return [
            'ccAnalytics' => $ccAnalytics,
            'sqdAnalytics' => $sqdAnalytics,
            'overallSQDSummary' => $overallSQDSummary,
            'filterOptions' => $filterOptions,
            'filters' => $filters,
            'totalRespondents' => $totalRespondents,
            'overallSatisfaction' => $overallSatisfaction,
        ];
    }


/**
 * Apply filters to query - extracted as separate method for reusability
 */
private function applyFilters($query, $filters)
{
    if (!empty($filters['age_group'])) {
        switch($filters['age_group']) {
            case '18_below': $query->where('age', '<=', 18); break;
            case '19_25': $query->whereBetween('age', [19, 25]); break;
            case '26_35': $query->whereBetween('age', [26, 35]); break;
            case '36_45': $query->whereBetween('age', [36, 45]); break;
            case '46_60': $query->whereBetween('age', [46, 60]); break;
            case '61_above': $query->where('age', '>=', 61); break;
        }
    }

    if (!empty($filters['client_type'])) {
        $query->where('client_type', $filters['client_type']);
    }

    if (!empty($filters['sex'])) {
        $query->where('sex', $filters['sex']);
    }

    if (!empty($filters['region'])) {
        $query->where('region_of_residence', 'like', '%' . $filters['region'] . '%');
    }

    if (!empty($filters['service_availed'])) {
        $query->where('service_availed', $filters['service_availed']);
    }

    if (!empty($filters['date_from'])) {
        $query->whereDate('date_of_transaction', '>=', $filters['date_from']);
    }

    if (!empty($filters['date_to'])) {
        $query->whereDate('date_of_transaction', '<=', $filters['date_to']);
    }
}
    /**
     * Get CC questions analytics with ALL possible choices.
     */
    private function getCCAnalytics($respondentIds)
    {
        // Define ALL possible answers for each CC question
        $ccQuestionStructures = [
            'CC1' => [
                'question' => 'CC1. Which of the following best describes your awareness of a CC?',
                'choices' => [
                    '1' => 'I know what a CC is and I saw this office\'s CC.',
                    '2' => 'I know what a CC is but I did NOT see this office\'s CC.',
                    '3' => 'I learned of the CC only when I saw this office\'s CC.',
                    '4' => 'I do not know what a CC is and I did not see one in this office.'
                ]
            ],
            'CC2' => [
                'question' => 'CC2. If aware of CC (answered 1–3 in CC1), would you say that the CC of this office was ...?',
                'choices' => [
                    '1' => 'Easy to see',
                    '2' => 'Somewhat easy to see',
                    '3' => 'Difficult to see',
                    '4' => 'Not visible at all',
                    '5' => 'N/A'
                ]
            ],
            'CC3' => [
                'question' => 'CC3. If aware of CC (answered codes 1–3 in CC1), how much did the CC help you in your transaction?',
                'choices' => [
                    '1' => 'Helped very much',
                    '2' => 'Somewhat helped',
                    '3' => 'Did not help',
                    '4' => 'N/A'
                ]
            ]
        ];

        $analytics = [];

        foreach ($ccQuestionStructures as $customId => $questionData) {
            // Get the question from database
            $question = SurveyQuestion::where('custom_id', $customId)->first();

            if (!$question) {
                continue;
            }

            // Get responses for this question
            $responses = SurveyResponse::where('question_id', $question->id)
                ->whereIn('respondent_id', $respondentIds)
                ->get();

            $totalResponses = $responses->count();

            // Initialize all choices with 0 count
            $answerStats = [];
            foreach ($questionData['choices'] as $answerCode => $answerText) {
                $count = $responses->where('answer_value', $answerCode)->count();
                // FIXED: Always use total_responses as denominator
                $percentage = $totalResponses > 0 ? round(($count / $totalResponses) * 100, 1) : 0;

                $answerStats[] = [
                    'code' => $answerCode,
                    'answer' => $answerCode,
                    'text' => $answerText,
                    'count' => $count,
                    'percentage' => $percentage
                ];
            }

            $analytics[$customId] = [
                'question' => $questionData['question'],
                'total_responses' => $totalResponses,
                'answer_stats' => $answerStats,
                'all_choices' => $questionData['choices']
            ];
        }

        return $analytics;
    }

    /**
     * Get SQD questions analytics with ALL possible choices.
     */
    private function getSQDAnalytics($respondentIds)
    {
        // Define mapping for both English and Bisaya answers
        $answerMappings = [
            'Strongly Disagree' => [
                'score' => 1,
                'bisaya' => 'Kusog kaayo nga Dili Mouyon'
            ],
            'Disagree' => [
                'score' => 2,
                'bisaya' => 'Dili Mouyon'
            ],
            'Neither Agree Nor Disagree' => [
                'score' => 3,
                'bisaya' => 'Wala Mouyon o Dili Mouyon'
            ],
            'Agree' => [
                'score' => 4,
                'bisaya' => 'Mouyon'
            ],
            'Strongly Agree' => [
                'score' => 5,
                'bisaya' => 'Kusog kaayo nga Mouyon'
            ],
            'N/A (Not Applicable)' => [
                'score' => 'N/A',
                'bisaya' => 'N/A (Dili Aplikable)'
            ]
        ];

        // Get SQD questions from database
        $sqdQuestions = SurveyQuestion::where('custom_id', 'like', 'SQD%')
            ->orderBy('custom_id')
            ->get();

        $analytics = [];

        foreach ($sqdQuestions as $question) {
            // Get responses for this question
            $responses = SurveyResponse::where('question_id', $question->id)
                ->whereIn('respondent_id', $respondentIds)
                ->get();

            $totalResponses = $responses->count();

            // Initialize all choices with 0 count
            $answerStats = [];
            $validResponsesCount = 0;
            $weightedSum = 0;

            $naCount = 0;
            $agreeCount = 0;
            $stronglyAgreeCount = 0;

            foreach ($answerMappings as $englishAnswer => $mapping) {
                // Count English responses
                $countEnglish = $responses->where('answer_value', $englishAnswer)->count();

                // Count Bisaya responses
                $countBisaya = 0;
                if (isset($mapping['bisaya'])) {
                    $countBisaya = $responses->where('answer_value', $mapping['bisaya'])->count();
                }

                // Total count for this answer category
                $totalCount = $countEnglish + $countBisaya;

                // Count valid responses (non-N/A) for average calculation
                if ($englishAnswer !== 'N/A (Not Applicable)') {
                    $validResponsesCount += $totalCount;
                    $weightedSum += $totalCount * $mapping['score'];

                    // Track Agree and Strongly Agree counts for SQD calculation
                    if ($englishAnswer === 'Agree') {
                        $agreeCount = $totalCount;
                    } elseif ($englishAnswer === 'Strongly Agree') {
                        $stronglyAgreeCount = $totalCount;
                    }
                } else {
                    $naCount = $totalCount;
                }

                // Store count for all answers (using English version for display)
                $answerStats[] = [
                    'answer' => $englishAnswer,
                    'score' => $mapping['score'],
                    'count' => $totalCount,
                    'percentage' => 0 // Will be calculated below
                ];
            }

            // Calculate percentages for ALL answers using total_responses as denominator
            foreach ($answerStats as &$stat) {
                $stat['percentage'] = $totalResponses > 0 ? round(($stat['count'] / $totalResponses) * 100, 1) : 0;
            }

            // Calculate average score (excluding N/A)
            $averageScore = $validResponsesCount > 0 ? round($weightedSum / $validResponsesCount, 2) : 0;

            // Calculate SQD score using the formula: (Strongly Agree + Agree) / (Total Responses - N/A) × 100
            $validTotalResponses = $totalResponses - $naCount;
            $sqdScore = $validTotalResponses > 0
                ? round((($stronglyAgreeCount + $agreeCount) / $validTotalResponses) * 100, 1)
                : 0;

            $analytics[$question->custom_id] = [
                'question' => $question->question_text,
                'question_number' => $question->question_number,
                'total_responses' => $totalResponses,
                'valid_responses' => $validResponsesCount,
                'na_responses' => $naCount,
                'answer_stats' => $answerStats,
                'average_score' => $averageScore,
                'sqd_score' => $sqdScore,
                'all_choices' => $answerMappings
            ];
        }

        return $analytics;
    }


    /**
     * Calculate overall satisfaction average from all SQD questions.
     */
    private function calculateOverallSatisfaction($sqdAnalytics)
    {
        $totalScore = 0;
        $questionCount = 0;

        foreach ($sqdAnalytics as $questionData) {
            if ($questionData['average_score'] > 0) {
                $totalScore += $questionData['average_score'];
                $questionCount++;
            }
        }

        return $questionCount > 0 ? round($totalScore / $questionCount, 2) : 0;
    }

    /**
     * Export analytics data to CSV.
     */
    public function export(Request $request)
{
    // Check if user is department head
    if (!$request->user() || !$request->user()->isDepartmentHead()) {
        abort(403, 'Unauthorized access.');
    }

    $fileName = 'survey-analytics-' . date('Y-m-d') . '.csv';
    $headers = [
        "Content-type"        => "text/csv",
        "Content-Disposition" => "attachment; filename=$fileName",
        "Pragma"              => "no-cache",
        "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
        "Expires"             => "0"
    ];

    // Get analytics data - ONLY for completed surveys
    $filters = $request->only(['age_group', 'client_type', 'sex', 'region', 'service_availed', 'date_from', 'date_to']);

    $query = Respondent::completedSurvey();

    $query = $this->scopeByDepartment($query, $request->user());

    // Apply filters using the same method
    $this->applyFilters($query, $filters);

    $respondentIds = $query->pluck('id');

    $ccAnalytics = $this->getCCAnalytics($respondentIds);
    $sqdAnalytics = $this->getSQDAnalytics($respondentIds);
    $overallSQDSummary = $this->calculateOverallSQDSummary($sqdAnalytics, $respondentIds);

    $callback = function() use($ccAnalytics, $sqdAnalytics, $overallSQDSummary) {
        $file = fopen('php://output', 'w');

        // Export CC Analytics
        fputcsv($file, ['CITIZEN\'S CHARTER (CC) ANALYTICS']);
        fputcsv($file, ['Question ID', 'Question', 'Answer Code', 'Answer Description', 'Count', 'Percentage']);

        foreach ($ccAnalytics as $ccId => $data) {
            foreach ($data['answer_stats'] as $stat) {
                fputcsv($file, [
                    $ccId,
                    $data['question'],
                    $stat['code'],
                    $stat['text'],
                    $stat['count'],
                    $stat['percentage'] . '%'
                ]);
            }
            fputcsv($file, ['', 'Total Responses:', '', '', $data['total_responses']]);
            fputcsv($file, []); // Empty row
        }

        // Export Overall SQD Summary
        fputcsv($file, []);
        fputcsv($file, ['OVERALL SQD SUMMARY (SQD0-SQD8)']);
        fputcsv($file, ['Response Type', 'Respondent Count', 'Percentage of Total Respondents']);

        if ($overallSQDSummary) {
            fputcsv($file, ['Strongly Agree', $overallSQDSummary['strongly_agree_responses'],
                $overallSQDSummary['total_responses'] > 0 ? round(($overallSQDSummary['strongly_agree_responses'] / $overallSQDSummary['total_responses']) * 100, 1) . '%' : '0%']);
            fputcsv($file, ['Agree', $overallSQDSummary['agree_responses'],
                $overallSQDSummary['total_responses'] > 0 ? round(($overallSQDSummary['agree_responses'] / $overallSQDSummary['total_responses']) * 100, 1) . '%' : '0%']);
            fputcsv($file, ['Neither Agree Nor Disagree', $overallSQDSummary['answer_totals']['Neither Agree Nor Disagree'],
                $overallSQDSummary['total_responses'] > 0 ? round(($overallSQDSummary['answer_totals']['Neither Agree Nor Disagree'] / $overallSQDSummary['total_responses']) * 100, 1) . '%' : '0%']);
            fputcsv($file, ['Disagree', $overallSQDSummary['answer_totals']['Disagree'],
                $overallSQDSummary['total_responses'] > 0 ? round(($overallSQDSummary['answer_totals']['Disagree'] / $overallSQDSummary['total_responses']) * 100, 1) . '%' : '0%']);
            fputcsv($file, ['Strongly Disagree', $overallSQDSummary['answer_totals']['Strongly Disagree'],
                $overallSQDSummary['total_responses'] > 0 ? round(($overallSQDSummary['answer_totals']['Strongly Disagree'] / $overallSQDSummary['total_responses']) * 100, 1) . '%' : '0%']);
            fputcsv($file, ['N/A (Not Applicable)', $overallSQDSummary['na_responses'],
                $overallSQDSummary['total_responses'] > 0 ? round(($overallSQDSummary['na_responses'] / $overallSQDSummary['total_responses']) * 100, 1) . '%' : '0%']);

            fputcsv($file, ['', '', '']);
            fputcsv($file, ['Total Respondents (Answered SQD)', $overallSQDSummary['total_responses'], '100%']);
            fputcsv($file, ['Valid Respondents (Non-N/A)', $overallSQDSummary['valid_responses'], '']);
            fputcsv($file, ['Overall SQD Percentage', $overallSQDSummary['overall_sqd_percentage'] . '%', '']);
            fputcsv($file, ['Formula: (Strongly Agree + Agree) ÷ (Total Respondents − N/A) × 100', '', '']);
        }

        // Export SQD Analytics
        fputcsv($file, []);
        fputcsv($file, ['SERVICE QUALITY DIMENSIONS (SQD) ANALYTICS']);
        fputcsv($file, ['Question ID', 'Question', 'Answer', 'Score', 'Response Count', 'Percentage']);

        foreach ($sqdAnalytics as $sqdId => $data) {
            foreach ($data['answer_stats'] as $stat) {
                fputcsv($file, [
                    $sqdId,
                    $data['question'],
                    $stat['answer'],
                    $stat['score'],
                    $stat['count'],
                    $stat['percentage'] . '%'
                ]);
            }
            fputcsv($file, ['', 'Total Responses:', '', '', $data['total_responses']]);
            fputcsv($file, ['', 'Valid Responses (non-N/A):', '', '', $data['valid_responses']]);
            fputcsv($file, ['', 'Average Score:', '', '', $data['average_score'] . '/5']);
            fputcsv($file, ['', 'SQD Score:', '', '', $data['sqd_score'] . '%']);
            fputcsv($file, []); // Empty row
        }

        fclose($file);
    };

    return response()->stream($callback, 200, $headers);
}
/**
 * Calculate overall SQD summary across all SQD questions.
 */
private function calculateOverallSQDSummary($sqdAnalytics, $respondentIds)
{
    // --- Respondent-based counts (for the six cards) ---
    $sqdRespondentIds = SurveyResponse::whereIn('respondent_id', $respondentIds)
        ->whereHas('question', fn($q) => $q->where('custom_id', 'like', 'SQD%'))
        ->pluck('respondent_id')
        ->unique()
        ->values();

    $totalRespondents = $sqdRespondentIds->count();

    $naRespondents = SurveyResponse::whereIn('respondent_id', $sqdRespondentIds)
        ->whereHas('question', fn($q) => $q->where('custom_id', 'like', 'SQD%'))
        ->where('answer_value', 'N/A (Not Applicable)')
        ->pluck('respondent_id')
        ->unique()
        ->count();

    $stronglyAgreeRespondents = SurveyResponse::whereIn('respondent_id', $sqdRespondentIds)
        ->whereHas('question', fn($q) => $q->where('custom_id', 'like', 'SQD%'))
        ->where('answer_value', 'Strongly Agree')
        ->pluck('respondent_id')
        ->unique()
        ->count();

    $agreeRespondents = SurveyResponse::whereIn('respondent_id', $sqdRespondentIds)
        ->whereHas('question', fn($q) => $q->where('custom_id', 'like', 'SQD%'))
        ->where('answer_value', 'Agree')
        ->pluck('respondent_id')
        ->unique()
        ->count();

    $disagreeRespondents = SurveyResponse::whereIn('respondent_id', $sqdRespondentIds)
        ->whereHas('question', fn($q) => $q->where('custom_id', 'like', 'SQD%'))
        ->where('answer_value', 'Disagree')
        ->pluck('respondent_id')
        ->unique()
        ->count();

    $stronglyDisagreeRespondents = SurveyResponse::whereIn('respondent_id', $sqdRespondentIds)
        ->whereHas('question', fn($q) => $q->where('custom_id', 'like', 'SQD%'))
        ->where('answer_value', 'Strongly Disagree')
        ->pluck('respondent_id')
        ->unique()
        ->count();

    $neutralRespondents = SurveyResponse::whereIn('respondent_id', $sqdRespondentIds)
        ->whereHas('question', fn($q) => $q->where('custom_id', 'like', 'SQD%'))
        ->where('answer_value', 'Neither Agree Nor Disagree')
        ->pluck('respondent_id')
        ->unique()
        ->count();

    $validRespondents = $totalRespondents - $naRespondents;

    // --- Response-based totals (for the overall percentage) ---
    $totalValidResponses = 0;
    $totalPositiveResponses = 0;

    foreach ($sqdAnalytics as $questionData) {
        $validResponses = $questionData['total_responses'] - $questionData['na_responses'];
        $positiveResponses = 0;
        foreach ($questionData['answer_stats'] as $stat) {
            if ($stat['answer'] === 'Agree' || $stat['answer'] === 'Strongly Agree') {
                $positiveResponses += $stat['count'];
            }
        }
        $totalValidResponses += $validResponses;
        $totalPositiveResponses += $positiveResponses;
    }

    $overallSQDPercentage = $totalValidResponses > 0
        ? round(($totalPositiveResponses / $totalValidResponses) * 100, 1)
        : 0;

    return [
        // Respondent-based (for the six cards)
        'answer_totals' => [
            'Strongly Disagree'      => $stronglyDisagreeRespondents,
            'Disagree'                => $disagreeRespondents,
            'Neither Agree Nor Disagree' => $neutralRespondents,
            'Agree'                   => $agreeRespondents,
            'Strongly Agree'          => $stronglyAgreeRespondents,
            'N/A (Not Applicable)'    => $naRespondents,
        ],
        'total_responses'          => $totalRespondents,
        'valid_responses'          => $validRespondents,
        'na_responses'             => $naRespondents,
        'agree_responses'          => $agreeRespondents,
        'strongly_agree_responses' => $stronglyAgreeRespondents,

        // Response-based overall percentage (now ≤ 100%)
        'overall_sqd_percentage'   => $overallSQDPercentage,
    ];
}


/**
 * Scope query to only include respondents from the user's department.
 */
private function scopeByDepartment($query, $user)
{
    return $query->whereHas('service', function ($q) use ($user) {
        $q->where('department_id', $user->department_id);
    });
}






}
