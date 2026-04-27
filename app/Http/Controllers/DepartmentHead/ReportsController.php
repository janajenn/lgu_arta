<?php

namespace App\Http\Controllers\DepartmentHead;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Respondent;
use App\Models\Service;
use App\Models\Department;
use App\Models\User;


class ReportsController extends Controller
{
    /**
     * Display the reports selection page with summary stats.
     */
    public function index(Request $request)
    {
        if (!$request->user() || !$request->user()->is_hr_department) {
            abort(403, 'Unauthorized. Only HR can view reports.');
        }

        $totalClientsSurveyed = Respondent::where('completed_survey', true)->count();
        $totalTransactions = Respondent::count();

        return Inertia::render('DepartmentHead/Reports/Index', [
            'totalClientsSurveyed' => $totalClientsSurveyed,
            'totalTransactions'    => $totalTransactions,
        ]);
    }

    /**
     * Display the service summary report (internal/external tables).
     */
public function serviceSummary(Request $request)
{
     $query = $this->getBaseQuery($request);
        $total = $query->count();

    $startDate = $request->get('start_date');
    $endDate = $request->get('end_date');

    $services = Service::all();
    $servicesByCategory = ['internal' => [], 'external' => []];
    $totalResponses = 0;
    $totalTransactions = 0;

    foreach ($services as $service) {
        $serviceName = $service->name;

        // Build query with optional date filter
        $respondentQuery = Respondent::where('service_availed', $serviceName);
        if ($startDate && $endDate) {
            $respondentQuery->whereBetween('date_of_transaction', [$startDate, $endDate]);
        }

        $responsesCount = (clone $respondentQuery)->where('completed_survey', true)->count();
        $totalTransactionsCount = (clone $respondentQuery)->count();

        $responseRate = $totalTransactionsCount > 0
            ? round(($responsesCount / $totalTransactionsCount) * 100, 1)
            : 0;

        $servicesByCategory[$service->category][] = [
            'name'           => $serviceName,
            'responses'      => $responsesCount,
            'total_transactions' => $totalTransactionsCount,
            'response_rate'  => $responseRate,
        ];

        $totalResponses += $responsesCount;
        $totalTransactions += $totalTransactionsCount;
    }

    // Insights
    $insights = [];

    // Overall response rate
    $overallRate = $totalTransactions > 0
        ? round(($totalResponses / $totalTransactions) * 100, 1)
        : 0;
    $insights[] = "Overall response rate across all services is {$overallRate}% (based on {$totalTransactions} total transactions).";

    // Most popular service (by responses)
    $allServices = array_merge($servicesByCategory['internal'], $servicesByCategory['external']);
    if (!empty($allServices)) {
        $maxService = collect($allServices)->sortByDesc('responses')->first();
        $insights[] = "The service with the most survey responses is {$maxService['name']} with {$maxService['responses']} responses (response rate: {$maxService['response_rate']}%).";
    }

    // Service with highest response rate (min 10 transactions to be meaningful)
    $withMinTransactions = array_filter($allServices, fn($s) => $s['total_transactions'] >= 10);
    if (!empty($withMinTransactions)) {
        $highestRate = collect($withMinTransactions)->sortByDesc('response_rate')->first();
        $insights[] = "The service with the highest response rate is {$highestRate['name']} at {$highestRate['response_rate']}% (based on {$highestRate['total_transactions']} transactions).";
    }

    // Category breakdown
    $internalResponses = collect($servicesByCategory['internal'])->sum('responses');
    $externalResponses = collect($servicesByCategory['external'])->sum('responses');
    $internalPercent = $totalResponses > 0 ? round(($internalResponses / $totalResponses) * 100, 1) : 0;
    $externalPercent = $totalResponses > 0 ? round(($externalResponses / $totalResponses) * 100, 1) : 0;
    $insights[] = "Internal services account for {$internalPercent}% of all responses, while external services account for {$externalPercent}%.";

    return Inertia::render('DepartmentHead/Reports/ServiceSummary', [
        'servicesByCategory' => $servicesByCategory,
        'insights'           => $insights,
    ]);
}
    /**
     * Display the age distribution report.
     */
   public function ageDistribution(Request $request)
{
     $query = $this->getBaseQuery($request);
        $total = $query->count();


    $startDate = $request->get('start_date');
    $endDate = $request->get('end_date');

    $query = Respondent::where('completed_survey', true);
    if ($startDate && $endDate) {
        $query->whereBetween('date_of_transaction', [$startDate, $endDate]);
    }

    $total = $query->count();

    $ageGroups = [
        '18 and below' => [0, 18],
        '19-25'        => [19, 25],
        '26-35'        => [26, 35],
        '36-45'        => [36, 45],
        '46-60'        => [46, 60],
        '61+'          => [61, 120],
    ];

    $distribution = [];
    $sumAge = 0;
    $ageCount = 0;
    $under35 = 0;
    $over35 = 0;

    foreach ($ageGroups as $label => $range) {
        $groupQuery = clone $query;
        if ($label === '61+') {
            $groupQuery->where('age', '>=', $range[0]);
        } else {
            $groupQuery->whereBetween('age', [$range[0], $range[1]]);
        }
        $count = $groupQuery->count();

        // Accumulate for average and age categories
        if ($label !== '61+') {
            $sumAge += $groupQuery->sum('age');
            $ageCount += $count;
        }

        if ($label === '18 and below' || $label === '19-25' || $label === '26-35') {
            $under35 += $count;
        } else {
            $over35 += $count;
        }

        $distribution[$label] = [
            'count'      => $count,
            'percentage' => $total ? round(($count / $total) * 100, 1) : 0,
        ];
    }

    $averageAge = $ageCount ? round($sumAge / $ageCount, 1) : null;
    $under35Percent = $total ? round(($under35 / $total) * 100, 1) : 0;
    $over35Percent  = $total ? round(($over35 / $total) * 100, 1) : 0;

    // Find largest and smallest groups
    $maxGroup = null;
    $maxCount = -1;
    $minGroup = null;
    $minCount = PHP_INT_MAX;

    foreach ($distribution as $group => $data) {
        if ($data['count'] > $maxCount) {
            $maxCount = $data['count'];
            $maxGroup = $group;
        }
        if ($data['count'] > 0 && $data['count'] < $minCount) {
            $minCount = $data['count'];
            $minGroup = $group;
        }
    }

    $insights = [];

    if ($maxGroup) {
        $insights[] = "The largest age group is {$maxGroup} with {$distribution[$maxGroup]['count']} respondents ({$distribution[$maxGroup]['percentage']}% of total).";
    }

    if ($minGroup && $minGroup !== $maxGroup) {
        $insights[] = "The smallest age group is {$minGroup} with {$distribution[$minGroup]['count']} respondents ({$distribution[$minGroup]['percentage']}%).";
    }

    if ($averageAge) {
        $insights[] = "The average age of respondents is {$averageAge} years.";
    }

    $insights[] = "Respondents under 35 make up {$under35Percent}% of the total, while those 35 and over make up {$over35Percent}%.";

    return Inertia::render('DepartmentHead/Reports/AgeDistribution', [
        'ageDistribution' => $distribution,
        'total'           => $total,
        'averageAge'      => $averageAge,
        'insights'        => $insights,
    ]);
}

    /**
     * Display the client type distribution report.
     */
    public function clientTypeDistribution(Request $request)
{
     $query = $this->getBaseQuery($request);
        $total = $query->count();

    $startDate = $request->get('start_date');
    $endDate = $request->get('end_date');

    $query = Respondent::where('completed_survey', true);
    if ($startDate && $endDate) {
        $query->whereBetween('date_of_transaction', [$startDate, $endDate]);
    }

    $clientTypes = $query
        ->selectRaw('client_type, COUNT(*) as count')
        ->groupBy('client_type')
        ->pluck('count', 'client_type')
        ->toArray();

    $total = array_sum($clientTypes);

    $insights = [];

    if ($total > 0) {
        // Most common type
        $maxType = array_keys($clientTypes, max($clientTypes))[0];
        $maxCount = $clientTypes[$maxType];
        $maxPercent = round(($maxCount / $total) * 100, 1);
        $insights[] = "The most frequent client type is {$maxType} with {$maxCount} respondents ({$maxPercent}% of total).";

        // Add a sentence for every type
        foreach ($clientTypes as $type => $count) {
            $percent = round(($count / $total) * 100, 1);
            $insights[] = "" . ucfirst($type) . " respondents: {$count} ({$percent}%).";
        }

        // Optional: still include the "citizen majority" note if you want
        if ($maxType === 'citizen' && $maxPercent >= 50) {
            $insights[] = "Citizens make up the majority of respondents, which is expected for a government service.";
        }
    } else {
        $insights[] = "No data available for the selected period.";
    }

    return Inertia::render('DepartmentHead/Reports/ClientTypeDistribution', [
        'clientTypes' => $clientTypes,
        'insights'    => $insights,
    ]);
}



public function ccSqdSummary(Request $request)
{


    if (!$request->user() || !$request->user()->is_hr_department) {
        abort(403, 'Unauthorized. Only HR can view reports.');
    }

     $query = $this->getBaseQuery($request);
        $total = $query->count();

     $startDate = $request->get('start_date');
    $endDate = $request->get('end_date');

    $respondentIds = Respondent::where('completed_survey', true)
        ->when($startDate && $endDate, function ($q) use ($startDate, $endDate) {
            $q->whereBetween('date_of_transaction', [$startDate, $endDate]);
        })
        ->pluck('id');


    // Get all respondent IDs who completed the survey
    $respondentIds = Respondent::where('completed_survey', true)->pluck('id');

    // --- CC Analytics ---
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

    $ccData = [];

    foreach ($ccQuestionStructures as $questionId => $questionData) {
        $question = SurveyQuestion::where('custom_id', $questionId)->first();
        if (!$question) {
            continue;
        }

        $responses = SurveyResponse::where('question_id', $question->id)
            ->whereIn('respondent_id', $respondentIds)
            ->get();

        $totalResponses = $responses->count();

        $answerStats = [];
        foreach ($questionData['choices'] as $code => $text) {
            $count = $responses->where('answer_value', $code)->count();
            $percentage = $totalResponses > 0 ? round(($count / $totalResponses) * 100, 1) : 0;
            $answerStats[] = [
                'code' => $code,
                'text' => $text,
                'count' => $count,
                'percentage' => $percentage,
            ];
        }

        $ccData[$questionId] = [
            'question' => $questionData['question'],
            'total_responses' => $totalResponses,
            'answer_stats' => $answerStats,
        ];
    }

    // --- SQD per‑dimension breakdown ---
    $sqdQuestions = SurveyQuestion::where('custom_id', 'like', 'SQD%')
        ->orderBy('custom_id')
        ->get();

    $sqdPerQuestion = [];
    $overallCounts = [
        'Strongly Agree' => 0,
        'Agree' => 0,
        'Neither Agree Nor Disagree' => 0,
        'Disagree' => 0,
        'Strongly Disagree' => 0,
        'N/A (Not Applicable)' => 0,
    ];
    $overallTotal = 0;

    foreach ($sqdQuestions as $question) {
        $responses = SurveyResponse::where('question_id', $question->id)
            ->whereIn('respondent_id', $respondentIds)
            ->get();

        $questionTotal = $responses->count();
        $overallTotal += $questionTotal;

        $counts = [
            'Strongly Agree' => 0,
            'Agree' => 0,
            'Neither Agree Nor Disagree' => 0,
            'Disagree' => 0,
            'Strongly Disagree' => 0,
            'N/A (Not Applicable)' => 0,
        ];

        foreach ($responses as $response) {
            $answer = $response->answer_value;
            if (str_contains($answer, 'Strongly Agree')) {
                $counts['Strongly Agree']++;
                $overallCounts['Strongly Agree']++;
            } elseif (str_contains($answer, 'Agree') && !str_contains($answer, 'Strongly')) {
                $counts['Agree']++;
                $overallCounts['Agree']++;
            } elseif (str_contains($answer, 'Neither') || str_contains($answer, 'Wala Mouyon o Dili Mouyon')) {
                $counts['Neither Agree Nor Disagree']++;
                $overallCounts['Neither Agree Nor Disagree']++;
            } elseif (str_contains($answer, 'Disagree') && !str_contains($answer, 'Strongly')) {
                $counts['Disagree']++;
                $overallCounts['Disagree']++;
            } elseif (str_contains($answer, 'Strongly Disagree')) {
                $counts['Strongly Disagree']++;
                $overallCounts['Strongly Disagree']++;
            } elseif (str_contains($answer, 'N/A')) {
                $counts['N/A (Not Applicable)']++;
                $overallCounts['N/A (Not Applicable)']++;
            }
        }

        // Compute satisfaction score for this dimension
        $validResponses = $questionTotal - $counts['N/A (Not Applicable)'];
        $satisfactionScore = $validResponses > 0
            ? round((($counts['Strongly Agree'] + $counts['Agree']) / $validResponses) * 100, 1)
            : 0;

        $sqdPerQuestion[] = [
            'id' => $question->custom_id,
            'label' => $this->getSQDLabel($question->custom_id),
            'total' => $questionTotal,
            'counts' => $counts,
            'satisfaction_score' => $satisfactionScore,
        ];
    }

    // Compute overall satisfaction score (based on valid responses, excluding N/A)
    $validTotal = $overallTotal - $overallCounts['N/A (Not Applicable)'];
    $overallSatisfaction = $validTotal > 0
        ? round((($overallCounts['Strongly Agree'] + $overallCounts['Agree']) / $validTotal) * 100, 1)
        : 0;

    $sqdSummary = [
        'questions' => $sqdPerQuestion,
        'overall_counts' => $overallCounts,
        'overall_total' => $overallTotal,
        'overall_satisfaction' => $overallSatisfaction,
    ];

 $ccInsights = [];
    $sqdInsights = [];

    // CC insights
    if (isset($ccData['CC1'])) {
        $cc1Stats = $ccData['CC1']['answer_stats'];
        $unaware = collect($cc1Stats)->firstWhere('code', '4');
        if ($unaware && $unaware['count'] > 0) {
            $ccInsights[] = "CC Awareness: {$unaware['count']} respondents ({$unaware['percentage']}%) were unaware of the Citizen's Charter (chose option 4 in CC1).";
        }

        $mostCommonCC1 = collect($cc1Stats)->sortByDesc('count')->first();
        if ($mostCommonCC1 && $mostCommonCC1['count'] > 0) {
            $ccInsights[] = "Most Common CC1 Response: \"{$mostCommonCC1['text']}\" chosen by {$mostCommonCC1['count']} respondents ({$mostCommonCC1['percentage']}%).";
        }
    }

    // SQD insights
    if (isset($sqdSummary['overall_satisfaction'])) {
        $sqdInsights[] = "Overall Satisfaction: {$sqdSummary['overall_satisfaction']}%.";

        $dimensions = $sqdSummary['questions'];
        if (!empty($dimensions)) {
            $highest = collect($dimensions)->sortByDesc('satisfaction_score')->first();
            $lowest  = collect($dimensions)->sortBy('satisfaction_score')->first();

            if ($highest) {
                $sqdInsights[] = "Highest Dimension: {$highest['label']} ({$highest['satisfaction_score']}%).";
            }
            if ($lowest && $lowest['id'] !== $highest['id']) {
                $sqdInsights[] = "Lowest Dimension: {$lowest['label']} ({$lowest['satisfaction_score']}%).";
            }
        }

        $naCount = $sqdSummary['overall_counts']['N/A (Not Applicable)'] ?? 0;
        $naPercent = $sqdSummary['overall_total'] > 0 ? round(($naCount / $sqdSummary['overall_total']) * 100, 1) : 0;
        if ($naPercent > 20) {
            $sqdInsights[] = "High N/A Rate: {$naPercent}% of responses were N/A – some questions may not apply to many respondents.";
        }
    }

    return Inertia::render('DepartmentHead/Reports/CcSqdSummary', [
        'ccData'      => $ccData,
        'sqdSummary'  => $sqdSummary,
        'ccInsights'  => $ccInsights,
        'sqdInsights' => $sqdInsights,
    ]);
}

/**
 * Map SQD custom_id to a human‑readable label.
 */
private function getSQDLabel($customId)
{
    $labels = [
        'SQD0' => 'Overall Satisfaction',
        'SQD1' => 'Responsiveness',
        'SQD2' => 'Reliability',
        'SQD3' => 'Access and Facilities',
        'SQD4' => 'Communication',
        'SQD5' => 'Costs',
        'SQD6' => 'Integrity',
        'SQD7' => 'Assurance',
        'SQD8' => 'Outcome',
    ];
    return $labels[$customId] ?? $customId;
}


/**
 * Display region distribution report.
 */
public function regionDistribution(Request $request)
{

     $query = $this->getBaseQuery($request);
        $total = $query->count();


    $startDate = $request->get('start_date');
    $endDate = $request->get('end_date');

    $query = Respondent::where('completed_survey', true);
    if ($startDate && $endDate) {
        $query->whereBetween('date_of_transaction', [$startDate, $endDate]);
    }

    $regions = $query
        ->selectRaw('region_of_residence, COUNT(*) as count')
        ->groupBy('region_of_residence')
        ->orderBy('count', 'desc')
        ->pluck('count', 'region_of_residence')
        ->toArray();

    $total = array_sum($regions);

    $insights = [];

    if (!empty($regions) && $total > 0) {
        // Top region
        $topRegion = array_key_first($regions);
        $topCount = $regions[$topRegion];
        $topPercent = round(($topCount / $total) * 100, 1);
        $insights[] = "The region with the most respondents is {$topRegion} with {$topCount} respondents ({$topPercent}% of total).";

        // Bottom region (least, but ignore zero)
        $nonZero = array_filter($regions);
        if (count($nonZero) > 1) {
            $bottomRegion = array_key_last($nonZero);
            $bottomCount = $nonZero[$bottomRegion];
            $insights[] = "The region with the fewest respondents is {$bottomRegion} with only {$bottomCount} respondents.";
        }

        // Check if NCR is included
        if (isset($regions['National Capital Region (NCR)'])) {
            $ncrPercent = round(($regions['National Capital Region (NCR)'] / $total) * 100, 1);
            $insights[] = "NCR accounts for {$ncrPercent}% of respondents.";
        }

        // If one region dominates (over 50%)
        if ($topPercent > 50) {
            $insights[] = "Respondents are heavily concentrated in {$topRegion}, which may indicate limited reach in other areas.";
        }
    } else {
        $insights[] = "No region data available.";
    }

    return Inertia::render('DepartmentHead/Reports/RegionDistribution', [
        'regions'  => $regions,
        'total'    => $total,
        'insights' => $insights,
    ]);
}


/**
 * Display gender distribution report.
 */
public function genderDistribution(Request $request)
{

     $query = $this->getBaseQuery($request);
        $total = $query->count();


    $startDate = $request->get('start_date');
    $endDate = $request->get('end_date');

    $query = Respondent::where('completed_survey', true);
    if ($startDate && $endDate) {
        $query->whereBetween('date_of_transaction', [$startDate, $endDate]);
    }

    $genders = $query
        ->selectRaw('sex, COUNT(*) as count')
        ->groupBy('sex')
        ->pluck('count', 'sex')
        ->toArray();

    $total = array_sum($genders);

    $insights = [];

    if ($total > 0) {
        // Map internal keys to display labels
        $labels = ['male' => 'Male', 'female' => 'Female', 'prefer_not_to_say' => 'Prefer not to say'];

        // Most common gender
        $maxGenderKey = array_keys($genders, max($genders))[0];
        $maxGenderLabel = $labels[$maxGenderKey] ?? $maxGenderKey;
        $maxCount = $genders[$maxGenderKey];
        $maxPercent = round(($maxCount / $total) * 100, 1);
        $insights[] = "The most common gender is {$maxGenderLabel} with {$maxCount} respondents ({$maxPercent}% of total).";

        // Percentage of each gender
        foreach ($genders as $key => $count) {
            $label = $labels[$key] ?? $key;
            $percent = round(($count / $total) * 100, 1);
            $insights[] = "{$label} represents {$percent}% of respondents ({$count} individuals).";
        }

        // If "prefer not to say" is high, add observation
        if (isset($genders['prefer_not_to_say']) && $genders['prefer_not_to_say'] / $total > 0.15) {
            $insights[] = "A significant number of respondents ({$genders['prefer_not_to_say']}, " . round(($genders['prefer_not_to_say']/$total)*100,1) . "%) chose not to disclose their gender.";
        }
    } else {
        $insights[] = "No gender data available.";
    }

    return Inertia::render('DepartmentHead/Reports/GenderDistribution', [
        'genders'  => $genders,
        'total'    => $total,
        'insights' => $insights,
    ]);
}

protected function getBaseQuery(Request $request)
    {
        $query = Respondent::where('completed_survey', true)
            ->whereHas('service', function ($q) {
                $q->where('department_id', auth()->user()->department_id);
            });

        if ($startDate = $request->get('start_date')) {
            $query->whereDate('date_of_transaction', '>=', $startDate);
        }
        if ($endDate = $request->get('end_date')) {
            $query->whereDate('date_of_transaction', '<=', $endDate);
        }

        return $query;
    }

/**
 * Display the summary of results report.
 */
public function summaryOfResult(Request $request)
{
    if (!$request->user() || !$request->user()->is_hr_department) {
        abort(403, 'Unauthorized.');
    }

    $startDate = $request->get('start_date');
    $endDate = $request->get('end_date');

    $respondentIds = Respondent::where('completed_survey', true)
        ->when($startDate && $endDate, fn($q) => $q->whereBetween('date_of_transaction', [$startDate, $endDate]))
        ->pluck('id');

    $totalResponses = $respondentIds->count();
    $totalTransactions = Respondent::when($startDate && $endDate, fn($q) => $q->whereBetween('date_of_transaction', [$startDate, $endDate]))
        ->count();

    // CC percentages
    $ccPercentages = [];
    $ccQuestions = ['CC1', 'CC2', 'CC3'];
    foreach ($ccQuestions as $customId) {
        $question = SurveyQuestion::where('custom_id', $customId)->first();
        if (!$question) {
            $ccPercentages[$customId] = 0;
            continue;
        }

        $count = SurveyResponse::where('question_id', $question->id)
            ->whereIn('respondent_id', $respondentIds)
            ->where('answer_value', '1')
            ->count();

        $ccPercentages[$customId] = $totalResponses > 0 ? round(($count / $totalResponses) * 100, 2) : 0;
    }

    // Overall SQD satisfaction score
    $sqdQuestions = SurveyQuestion::where('custom_id', 'like', 'SQD%')->get();
    $totalPositive = 0;
    $totalValid = 0;

    foreach ($sqdQuestions as $question) {
        $responses = SurveyResponse::where('question_id', $question->id)
            ->whereIn('respondent_id', $respondentIds)
            ->get();

        foreach ($responses as $response) {
            $answer = $response->answer_value;
            if (str_contains($answer, 'Strongly Agree')) {
                $totalPositive++;
                $totalValid++;
            } elseif (str_contains($answer, 'Agree') && !str_contains($answer, 'Strongly')) {
                $totalPositive++;
                $totalValid++;
            } elseif (str_contains($answer, 'Neither') || str_contains($answer, 'Wala Mouyon o Dili Mouyon')) {
                $totalValid++;
            } elseif (str_contains($answer, 'Disagree') && !str_contains($answer, 'Strongly')) {
                $totalValid++;
            } elseif (str_contains($answer, 'Strongly Disagree')) {
                $totalValid++;
            } // N/A excluded
        }
    }

    $overallScore = $totalValid > 0 ? round(($totalPositive / $totalValid) * 100, 2) : 0;
    $responseRate = $totalTransactions > 0 ? round(($totalResponses / $totalTransactions) * 100, 2) : 0;

    $metrics = [
        'cc_awareness'   => $ccPercentages['CC1'],
        'cc_visibility'  => $ccPercentages['CC2'],
        'cc_helpfulness' => $ccPercentages['CC3'],
        'response_rate'  => $responseRate,
        'overall_score'  => $overallScore,
    ];

    $insightParagraph = $this->generateInsightParagraph($metrics, $totalResponses, $totalTransactions);

    return Inertia::render('DepartmentHead/Reports/SummaryOfResult', [
        'metrics'          => $metrics,
        'insightParagraph' => $insightParagraph,
        'totalResponses'   => $totalResponses,
        'totalTransactions'=> $totalTransactions,
    ]);
}

/**
 * Generate a dynamic insight paragraph based on metrics.
 */
private function generateInsightParagraph($metrics, $totalResponses, $totalTransactions)
{
    // LGU name – can be set in config/app.php or env
    $lguName = config('app.lgu_name', 'LGU Opol');

    // Thresholds for qualitative descriptors
    $thresholds = [
        'very_low'  => [0, 30],
        'low'       => [31, 50],
        'moderate'  => [51, 70],
        'high'      => [71, 89],
        'very_high' => [90, 100],
    ];

    // Helper to get descriptor based on value
    $getDescriptor = function($value) use ($thresholds) {
        foreach ($thresholds as $key => [$min, $max]) {
            if ($value >= $min && $value <= $max) return $key;
        }
        return 'moderate'; // fallback
    };

    // Descriptor mappings to adjectives/phrases
    $adjectives = [
        'very_low'  => ['very low', 'extremely low', 'concerning', 'minimal'],
        'low'       => ['low', 'below average', 'limited', 'modest'],
        'moderate'  => ['moderate', 'satisfactory', 'acceptable', 'fair'],
        'high'      => ['high', 'strong', 'commendable', 'impressive'],
        'very_high' => ['very high', 'exceptional', 'outstanding', 'remarkable'],
    ];

    // Sentence templates for each metric
    $templates = [
        'cc_awareness' => [
            'CC awareness is {adjective} at {value}%, indicating {interpretation}.',
            'Awareness of the Citizen’s Charter stands at {value}%, which is {adjective}. {interpretation}',
            'The survey shows {adjective} CC awareness ({value}%), {interpretation}.',
        ],
        'cc_visibility' => [
            'CC visibility is {adjective} at {value}%, meaning {interpretation}.',
            'At {value}%, the visibility of the Citizen’s Charter is {adjective}. {interpretation}',
            'Respondents rated CC visibility as {adjective} ({value}%), {interpretation}.',
        ],
        'cc_helpfulness' => [
            'CC helpfulness is {adjective} at {value}%, suggesting {interpretation}.',
            'Helpfulness of the Citizen’s Charter scored {value}%, which is {adjective}. {interpretation}',
            'With {value}%, CC helpfulness is {adjective}, {interpretation}.',
        ],
        'response_rate' => [
            'The response rate is {adjective} at {value}%, {interpretation}.',
            'At {value}%, the response rate is {adjective}, indicating {interpretation}.',
            'A {adjective} response rate of {value}% was achieved, {interpretation}.',
        ],
        'overall_score' => [
            'Overall satisfaction is {adjective} at {value}%, reflecting {interpretation}.',
            'The overall satisfaction score of {value}% is {adjective}, {interpretation}.',
            'Clients rated their overall experience as {adjective} ({value}%), {interpretation}.',
        ],
    ];

    // Interpretations based on descriptor and context
    $interpretations = [
        'cc_awareness' => [
            'very_low'  => 'many clients are unaware of the Citizen’s Charter, highlighting a need for better information dissemination.',
            'low'       => 'awareness is limited; efforts to promote the Charter should be intensified.',
            'moderate'  => 'a fair proportion of clients know about the Charter, but there is room for improvement.',
            'high'      => 'most clients are aware of the Charter, indicating effective communication.',
            'very_high' => 'awareness is nearly universal, a testament to excellent public information campaigns.',
        ],
        'cc_visibility' => [
            'very_low'  => 'the Charter is hard to find, which may hinder transparency.',
            'low'       => 'visibility could be improved to make the Charter more accessible.',
            'moderate'  => 'the Charter is reasonably visible, but enhancements could benefit clients.',
            'high'      => 'the Charter is easily seen by most clients, supporting transparency.',
            'very_high' => 'the Charter is prominently displayed and easily noticed by almost all clients.',
        ],
        'cc_helpfulness' => [
            'very_low'  => 'the Charter is not helping clients as intended; a review of its content may be needed.',
            'low'       => 'helpfulness is limited; clarifying the Charter’s information could improve this.',
            'moderate'  => 'the Charter provides fair guidance, though some clients may still find it lacking.',
            'high'      => 'most clients find the Charter helpful in navigating transactions.',
            'very_high' => 'the Charter is extremely useful, greatly assisting clients in their transactions.',
        ],
        'response_rate' => [
            'very_low'  => 'participation is very low, which may affect the reliability of results.',
            'low'       => 'response rate is below ideal; more encouragement may be needed.',
            'moderate'  => 'a satisfactory number of clients participated, providing a decent data set.',
            'high'      => 'a strong response rate ensures the findings are representative.',
            'very_high' => 'an outstanding response rate gives high confidence in the results.',
        ],
        'overall_score' => [
            'very_low'  => 'overall satisfaction is concerning; service improvements are urgently needed.',
            'low'       => 'satisfaction is below expectations; areas for improvement should be identified.',
            'moderate'  => 'satisfaction is acceptable, but there is potential to do better.',
            'high'      => 'clients are generally satisfied, indicating good service delivery.',
            'very_high' => 'exceptionally high satisfaction reflects excellent service quality.',
        ],
    ];

    // Start with fixed introductory sentence
    $intro = "In compliance with ARTA Memorandum Circular No. 2022-05, as amended by ARTA Memorandum Circular No. 2023-05, and further supplemented by Joint Memorandum Circular No. 1, Series of 2023, the {$lguName} conducted its Client Satisfaction Measurement (CSM) to assess the quality of service delivery across various frontline services. This report presents the findings, analysis, and recommendations based on the CSM survey conducted during the specified period.";

    // Build sentences for each metric
    $sentences = [];
    $metricKeys = ['cc_awareness', 'cc_visibility', 'cc_helpfulness', 'response_rate', 'overall_score'];
    foreach ($metricKeys as $key) {
        $value = $metrics[$key];
        $descriptor = $getDescriptor($value);
        $adjList = $adjectives[$descriptor];
        $adjective = $adjList[array_rand($adjList)]; // random adjective from pool

        $templateList = $templates[$key];
        $template = $templateList[array_rand($templateList)];

        $interpretation = $interpretations[$key][$descriptor] ?? '';

        $sentence = str_replace(
            ['{adjective}', '{value}', '{interpretation}'],
            [$adjective, $value, $interpretation],
            $template
        );
        $sentences[] = $sentence;
    }

    // Concluding sentence
    $conclusion = "These results reaffirm {$lguName}'s commitment to delivering efficient, transparent, and citizen-centered public services.";

    // Combine all parts
    $paragraph = $intro . " " . implode(' ', $sentences) . " " . $conclusion;

    return $paragraph;
}



/**
 * Display service satisfaction ratings.
 */
public function serviceRatings(Request $request)
{
    if (!$request->user() || !$request->user()->is_hr_department) {
        abort(403, 'Unauthorized.');
    }

    $startDate = $request->get('start_date');
    $endDate = $request->get('end_date');

    $services = Service::all();

    $serviceRatings = [];
    $overallPositive = 0;
    $overallValid = 0;

    foreach ($services as $service) {
        // Get respondents who availed this service and completed the survey
        $respondentIds = Respondent::where('service_availed', $service->name)
            ->where('completed_survey', true)
            ->when($startDate && $endDate, fn($q) => $q->whereBetween('date_of_transaction', [$startDate, $endDate]))
            ->pluck('id');

        if ($respondentIds->isEmpty()) {
            $serviceRatings[] = [
                'name'     => $service->name,
                'category' => $service->category,
                'rating'   => null,
                'positive' => 0,
                'valid'    => 0,
            ];
            continue;
        }

        $sqdQuestions = SurveyQuestion::where('custom_id', 'like', 'SQD%')->get();

        $positive = 0;
        $valid = 0;

        foreach ($sqdQuestions as $question) {
            $responses = SurveyResponse::where('question_id', $question->id)
                ->whereIn('respondent_id', $respondentIds)
                ->get();

            foreach ($responses as $response) {
                $answer = $response->answer_value;
                if (str_contains($answer, 'Strongly Agree')) {
                    $positive++;
                    $valid++;
                } elseif (str_contains($answer, 'Agree') && !str_contains($answer, 'Strongly')) {
                    $positive++;
                    $valid++;
                } elseif (str_contains($answer, 'Neither') || str_contains($answer, 'Wala Mouyon o Dili Mouyon')) {
                    $valid++;
                } elseif (str_contains($answer, 'Disagree') && !str_contains($answer, 'Strongly')) {
                    $valid++;
                } elseif (str_contains($answer, 'Strongly Disagree')) {
                    $valid++;
                }
                // N/A is excluded
            }
        }

        $rating = $valid > 0 ? round(($positive / $valid) * 100, 2) : null;

        $serviceRatings[] = [
            'name'     => $service->name,
            'category' => $service->category,
            'rating'   => $rating,
            'positive' => $positive,
            'valid'    => $valid,
        ];

        $overallPositive += $positive;
        $overallValid   += $valid;
    }

    $overallRating = $overallValid > 0 ? round(($overallPositive / $overallValid) * 100, 2) : null;

    return Inertia::render('DepartmentHead/Reports/ServiceRatings', [
        'serviceRatings' => $serviceRatings,
        'overallRating'  => $overallRating,
        'startDate'      => $startDate,
        'endDate'        => $endDate,
    ]);
}





/**
 * Preview all reports combined.
 */
public function preview(Request $request)
{
    if (!$request->user() || !$request->user()->is_hr_department) {
        abort(403, 'Unauthorized. Only HR can view reports.');
    }

    $data = $this->getAllReportData($request);

    return Inertia::render('DepartmentHead/Reports/Preview', $data);
}

/**
 * Collect all report data into one array.
 */
private function getAllReportData(Request $request)
{
    // Reuse existing logic but return data arrays instead of Inertia responses
    $startDate = $request->get('start_date');
    $endDate = $request->get('end_date');

    // 1. Service Summary
    $services = Service::all();
    $servicesByCategory = ['internal' => [], 'external' => []];
    $totalResponses = 0;
    $totalTransactions = 0;
    foreach ($services as $service) {
        $respondentQuery = Respondent::where('service_availed', $service->name);
        if ($startDate && $endDate) {
            $respondentQuery->whereBetween('date_of_transaction', [$startDate, $endDate]);
        }
        $responsesCount = (clone $respondentQuery)->where('completed_survey', true)->count();
        $totalTransactionsCount = (clone $respondentQuery)->count();
        $responseRate = $totalTransactionsCount > 0 ? round(($responsesCount / $totalTransactionsCount) * 100, 1) : 0;
        $servicesByCategory[$service->category][] = [
            'name' => $service->name,
            'responses' => $responsesCount,
            'total_transactions' => $totalTransactionsCount,
            'response_rate' => $responseRate,
        ];
        $totalResponses += $responsesCount;
        $totalTransactions += $totalTransactionsCount;
    }
    $serviceSummaryData = [
        'servicesByCategory' => $servicesByCategory,
        'insights' => $this->getServiceSummaryInsights($servicesByCategory, $totalResponses, $totalTransactions),
    ];

    // 2. Age Distribution
    $ageQuery = Respondent::where('completed_survey', true);
    if ($startDate && $endDate) {
        $ageQuery->whereBetween('date_of_transaction', [$startDate, $endDate]);
    }
    $total = $ageQuery->count();
    $ageGroups = ['18 and below' => [0,18], '19-25'=>[19,25], '26-35'=>[26,35], '36-45'=>[36,45], '46-60'=>[46,60], '61+'=>[61,120]];
    $distribution = [];
    $sumAge = 0; $ageCount = 0;
    foreach ($ageGroups as $label => $range) {
        $groupQuery = clone $ageQuery;
        if ($label === '61+') {
            $groupQuery->where('age', '>=', $range[0]);
        } else {
            $groupQuery->whereBetween('age', [$range[0], $range[1]]);
        }
        $count = $groupQuery->count();
        if ($label !== '61+') {
            $sumAge += $groupQuery->sum('age');
            $ageCount += $count;
        }
        $distribution[$label] = ['count' => $count, 'percentage' => $total ? round(($count/$total)*100,1) : 0];
    }
    $averageAge = $ageCount ? round($sumAge / $ageCount, 1) : null;
    $ageDistributionData = [
        'ageDistribution' => $distribution,
        'total' => $total,
        'averageAge' => $averageAge,
        'insights' => $this->getAgeInsights($distribution, $total, $averageAge),
    ];

    // 3. Client Type Distribution
    $clientQuery = Respondent::where('completed_survey', true);
    if ($startDate && $endDate) $clientQuery->whereBetween('date_of_transaction', [$startDate, $endDate]);
    $clientTypes = $clientQuery->selectRaw('client_type, COUNT(*) as count')->groupBy('client_type')->pluck('count', 'client_type')->toArray();
    $clientTypeData = [
        'clientTypes' => $clientTypes,
        'insights' => $this->getClientTypeInsights($clientTypes),
    ];

    // 4. Gender Distribution
    $genderQuery = Respondent::where('completed_survey', true);
    if ($startDate && $endDate) $genderQuery->whereBetween('date_of_transaction', [$startDate, $endDate]);
    $genders = $genderQuery->selectRaw('sex, COUNT(*) as count')->groupBy('sex')->pluck('count', 'sex')->toArray();
    $genderTotal = array_sum($genders);
    $genderData = [
        'genders' => $genders,
        'total' => $genderTotal,
        'insights' => $this->getGenderInsights($genders, $genderTotal),
    ];

    // 5. Region Distribution
    $regionQuery = Respondent::where('completed_survey', true);
    if ($startDate && $endDate) $regionQuery->whereBetween('date_of_transaction', [$startDate, $endDate]);
    $regions = $regionQuery->selectRaw('region_of_residence, COUNT(*) as count')->groupBy('region_of_residence')->orderBy('count', 'desc')->pluck('count', 'region_of_residence')->toArray();
    $regionTotal = array_sum($regions);
    $regionData = [
        'regions' => $regions,
        'total' => $regionTotal,
        'insights' => $this->getRegionInsights($regions, $regionTotal),
    ];

    // 6. CC & SQD Summary
    $respondentIds = Respondent::where('completed_survey', true)
        ->when($startDate && $endDate, fn($q) => $q->whereBetween('date_of_transaction', [$startDate, $endDate]))
        ->pluck('id');
    // CC Data (same as in ccSqdSummary method)
    $ccQuestionStructures = [
        'CC1' => ['question' => 'CC1. Which of the following best describes your awareness of a CC?', 'choices' => ['1' => 'I know what a CC is and I saw this office\'s CC.', '2' => 'I know what a CC is but I did NOT see this office\'s CC.', '3' => 'I learned of the CC only when I saw this office\'s CC.', '4' => 'I do not know what a CC is and I did not see one in this office.']],
        'CC2' => ['question' => 'CC2. If aware of CC (answered 1–3 in CC1), would you say that the CC of this office was ...?', 'choices' => ['1' => 'Easy to see', '2' => 'Somewhat easy to see', '3' => 'Difficult to see', '4' => 'Not visible at all', '5' => 'N/A']],
        'CC3' => ['question' => 'CC3. If aware of CC (answered codes 1–3 in CC1), how much did the CC help you in your transaction?', 'choices' => ['1' => 'Helped very much', '2' => 'Somewhat helped', '3' => 'Did not help', '4' => 'N/A']],
    ];
    $ccData = [];
    foreach ($ccQuestionStructures as $qId => $qData) {
        $question = SurveyQuestion::where('custom_id', $qId)->first();
        if (!$question) continue;
        $responses = SurveyResponse::where('question_id', $question->id)->whereIn('respondent_id', $respondentIds)->get();
        $totalRes = $responses->count();
        $answerStats = [];
        foreach ($qData['choices'] as $code => $text) {
            $count = $responses->where('answer_value', $code)->count();
            $percentage = $totalRes > 0 ? round(($count / $totalRes) * 100, 1) : 0;
            $answerStats[] = ['code' => $code, 'text' => $text, 'count' => $count, 'percentage' => $percentage];
        }
        $ccData[$qId] = ['question' => $qData['question'], 'total_responses' => $totalRes, 'answer_stats' => $answerStats];
    }
    // SQD Data
    $sqdQuestions = SurveyQuestion::where('custom_id', 'like', 'SQD%')->orderBy('custom_id')->get();
    $sqdPerQuestion = [];
    $overallCounts = ['Strongly Agree'=>0, 'Agree'=>0, 'Neither Agree Nor Disagree'=>0, 'Disagree'=>0, 'Strongly Disagree'=>0, 'N/A (Not Applicable)'=>0];
    $overallTotal = 0;
    foreach ($sqdQuestions as $question) {
        $responses = SurveyResponse::where('question_id', $question->id)->whereIn('respondent_id', $respondentIds)->get();
        $qt = $responses->count();
        $overallTotal += $qt;
        $counts = ['Strongly Agree'=>0, 'Agree'=>0, 'Neither Agree Nor Disagree'=>0, 'Disagree'=>0, 'Strongly Disagree'=>0, 'N/A (Not Applicable)'=>0];
        foreach ($responses as $r) {
            $ans = $r->answer_value;
            if (str_contains($ans, 'Strongly Agree')) { $counts['Strongly Agree']++; $overallCounts['Strongly Agree']++; }
            elseif (str_contains($ans, 'Agree') && !str_contains($ans, 'Strongly')) { $counts['Agree']++; $overallCounts['Agree']++; }
            elseif (str_contains($ans, 'Neither') || str_contains($ans, 'Wala Mouyon o Dili Mouyon')) { $counts['Neither Agree Nor Disagree']++; $overallCounts['Neither Agree Nor Disagree']++; }
            elseif (str_contains($ans, 'Disagree') && !str_contains($ans, 'Strongly')) { $counts['Disagree']++; $overallCounts['Disagree']++; }
            elseif (str_contains($ans, 'Strongly Disagree')) { $counts['Strongly Disagree']++; $overallCounts['Strongly Disagree']++; }
            elseif (str_contains($ans, 'N/A')) { $counts['N/A (Not Applicable)']++; $overallCounts['N/A (Not Applicable)']++; }
        }
        $valid = $qt - $counts['N/A (Not Applicable)'];
        $satisfaction = $valid > 0 ? round((($counts['Strongly Agree'] + $counts['Agree']) / $valid) * 100, 1) : 0;
        $sqdPerQuestion[] = ['id' => $question->custom_id, 'label' => $this->getSQDLabel($question->custom_id), 'total' => $qt, 'counts' => $counts, 'satisfaction_score' => $satisfaction];
    }
    $validTotal = $overallTotal - $overallCounts['N/A (Not Applicable)'];
    $overallSatisfaction = $validTotal > 0 ? round((($overallCounts['Strongly Agree'] + $overallCounts['Agree']) / $validTotal) * 100, 1) : 0;
    $sqdSummary = ['questions' => $sqdPerQuestion, 'overall_counts' => $overallCounts, 'overall_total' => $overallTotal, 'overall_satisfaction' => $overallSatisfaction];
    $ccInsights = []; $sqdInsights = [];
    if (isset($ccData['CC1'])) {
        $cc1Stats = $ccData['CC1']['answer_stats'];
        $unaware = collect($cc1Stats)->firstWhere('code', '4');
        if ($unaware && $unaware['count'] > 0) $ccInsights[] = "CC Awareness: {$unaware['count']} respondents ({$unaware['percentage']}%) were unaware of the Citizen's Charter.";
        $mostCommon = collect($cc1Stats)->sortByDesc('count')->first();
        if ($mostCommon) $ccInsights[] = "Most Common CC1 Response: \"{$mostCommon['text']}\" chosen by {$mostCommon['count']} respondents ({$mostCommon['percentage']}%).";
    }
    if (isset($sqdSummary['overall_satisfaction'])) {
        $sqdInsights[] = "Overall Satisfaction: {$sqdSummary['overall_satisfaction']}%.";
        $dims = $sqdSummary['questions'];
        if (!empty($dims)) {
            $highest = collect($dims)->sortByDesc('satisfaction_score')->first();
            $lowest = collect($dims)->sortBy('satisfaction_score')->first();
            if ($highest) $sqdInsights[] = "Highest Dimension: {$highest['label']} ({$highest['satisfaction_score']}%).";
            if ($lowest && $lowest['id'] !== $highest['id']) $sqdInsights[] = "Lowest Dimension: {$lowest['label']} ({$lowest['satisfaction_score']}%).";
        }
        $naPercent = $sqdSummary['overall_total'] > 0 ? round(($sqdSummary['overall_counts']['N/A (Not Applicable)'] / $sqdSummary['overall_total']) * 100, 1) : 0;
        if ($naPercent > 20) $sqdInsights[] = "High N/A Rate: {$naPercent}% of responses were N/A – some questions may not apply.";
    }
    $ccSqdData = ['ccData' => $ccData, 'sqdSummary' => $sqdSummary, 'ccInsights' => $ccInsights, 'sqdInsights' => $sqdInsights];

    // 7. Summary of Result (metrics)
    $totalResp = $respondentIds->count();
    $totalTrans = Respondent::when($startDate && $endDate, fn($q) => $q->whereBetween('date_of_transaction', [$startDate, $endDate]))->count();
    $ccPercentages = [];
    foreach (['CC1','CC2','CC3'] as $cId) {
        $question = SurveyQuestion::where('custom_id', $cId)->first();
        if (!$question) { $ccPercentages[$cId] = 0; continue; }
        $count = SurveyResponse::where('question_id', $question->id)->whereIn('respondent_id', $respondentIds)->where('answer_value', '1')->count();
        $ccPercentages[$cId] = $totalResp > 0 ? round(($count / $totalResp) * 100, 2) : 0;
    }
    $sqdQ = SurveyQuestion::where('custom_id', 'like', 'SQD%')->get();
    $pos = 0; $val = 0;
    foreach ($sqdQ as $q) {
        $resp = SurveyResponse::where('question_id', $q->id)->whereIn('respondent_id', $respondentIds)->get();
        foreach ($resp as $r) {
            $ans = $r->answer_value;
            if (str_contains($ans, 'Strongly Agree')) { $pos++; $val++; }
            elseif (str_contains($ans, 'Agree') && !str_contains($ans, 'Strongly')) { $pos++; $val++; }
            elseif (str_contains($ans, 'Neither') || str_contains($ans, 'Wala Mouyon o Dili Mouyon')) $val++;
            elseif (str_contains($ans, 'Disagree') && !str_contains($ans, 'Strongly')) $val++;
            elseif (str_contains($ans, 'Strongly Disagree')) $val++;
        }
    }
    $overallScore = $val > 0 ? round(($pos / $val) * 100, 2) : 0;
    $responseRate = $totalTrans > 0 ? round(($totalResp / $totalTrans) * 100, 2) : 0;
    $metrics = ['cc_awareness' => $ccPercentages['CC1'], 'cc_visibility' => $ccPercentages['CC2'], 'cc_helpfulness' => $ccPercentages['CC3'], 'response_rate' => $responseRate, 'overall_score' => $overallScore];
    $insightParagraph = $this->generateInsightParagraph($metrics, $totalResp, $totalTrans);
    $summaryData = ['metrics' => $metrics, 'insightParagraph' => $insightParagraph, 'totalResponses' => $totalResp, 'totalTransactions' => $totalTrans];

    // 8. Service Ratings
    $servicesAll = Service::all();
    $serviceRatings = [];
    $overallPositive = 0; $overallValid = 0;
    foreach ($servicesAll as $s) {
        $respIds = Respondent::where('service_availed', $s->name)->where('completed_survey', true)
            ->when($startDate && $endDate, fn($q) => $q->whereBetween('date_of_transaction', [$startDate, $endDate]))
            ->pluck('id');
        if ($respIds->isEmpty()) {
            $serviceRatings[] = ['name' => $s->name, 'category' => $s->category, 'rating' => null, 'positive' => 0, 'valid' => 0];
            continue;
        }
        $pos = 0; $val = 0;
        foreach ($sqdQ as $q) {
            $r = SurveyResponse::where('question_id', $q->id)->whereIn('respondent_id', $respIds)->get();
            foreach ($r as $resp) {
                $ans = $resp->answer_value;
                if (str_contains($ans, 'Strongly Agree')) { $pos++; $val++; }
                elseif (str_contains($ans, 'Agree') && !str_contains($ans, 'Strongly')) { $pos++; $val++; }
                elseif (str_contains($ans, 'Neither') || str_contains($ans, 'Wala Mouyon o Dili Mouyon')) $val++;
                elseif (str_contains($ans, 'Disagree') && !str_contains($ans, 'Strongly')) $val++;
                elseif (str_contains($ans, 'Strongly Disagree')) $val++;
            }
        }
        $rating = $val > 0 ? round(($pos / $val) * 100, 2) : null;
        $serviceRatings[] = ['name' => $s->name, 'category' => $s->category, 'rating' => $rating, 'positive' => $pos, 'valid' => $val];
        $overallPositive += $pos; $overallValid += $val;
    }
    $overallRating = $overallValid > 0 ? round(($overallPositive / $overallValid) * 100, 2) : null;
    $serviceRatingsData = ['serviceRatings' => $serviceRatings, 'overallRating' => $overallRating, 'startDate' => $startDate, 'endDate' => $endDate];

    return [
        'serviceSummaryData' => $serviceSummaryData,
        'ageDistributionData' => $ageDistributionData,
        'clientTypeData' => $clientTypeData,
        'genderData' => $genderData,
        'regionData' => $regionData,
        'ccSqdData' => $ccSqdData,
        'summaryData' => $summaryData,
        'serviceRatingsData' => $serviceRatingsData,
    ];
}

// Helper methods (insights) – you already have them, but we need to expose them as private. Keep existing ones.


/**
 * Generate insights for service summary.
 */
private function getServiceSummaryInsights($servicesByCategory, $totalResponses, $totalTransactions)
{
    $insights = [];
    $overallRate = $totalTransactions > 0 ? round(($totalResponses / $totalTransactions) * 100, 1) : 0;
    $insights[] = "Overall response rate across all services is {$overallRate}% (based on {$totalTransactions} total transactions).";

    $allServices = array_merge($servicesByCategory['internal'], $servicesByCategory['external']);
    if (!empty($allServices)) {
        $maxService = collect($allServices)->sortByDesc('responses')->first();
        $insights[] = "The service with the most survey responses is {$maxService['name']} with {$maxService['responses']} responses (response rate: {$maxService['response_rate']}%).";
    }

    $withMinTransactions = array_filter($allServices, fn($s) => $s['total_transactions'] >= 10);
    if (!empty($withMinTransactions)) {
        $highestRate = collect($withMinTransactions)->sortByDesc('response_rate')->first();
        $insights[] = "The service with the highest response rate is {$highestRate['name']} at {$highestRate['response_rate']}% (based on {$highestRate['total_transactions']} transactions).";
    }

    $internalResponses = collect($servicesByCategory['internal'])->sum('responses');
    $externalResponses = collect($servicesByCategory['external'])->sum('responses');
    $internalPercent = $totalResponses > 0 ? round(($internalResponses / $totalResponses) * 100, 1) : 0;
    $externalPercent = $totalResponses > 0 ? round(($externalResponses / $totalResponses) * 100, 1) : 0;
    $insights[] = "Internal services account for {$internalPercent}% of all responses, while external services account for {$externalPercent}%.";

    return $insights;
}

/**
 * Generate insights for age distribution.
 */
private function getAgeInsights($distribution, $total, $averageAge)
{
    $insights = [];
    $maxGroup = null;
    $maxCount = -1;
    $minGroup = null;
    $minCount = PHP_INT_MAX;
    foreach ($distribution as $group => $data) {
        if ($data['count'] > $maxCount) {
            $maxCount = $data['count'];
            $maxGroup = $group;
        }
        if ($data['count'] > 0 && $data['count'] < $minCount) {
            $minCount = $data['count'];
            $minGroup = $group;
        }
    }
    if ($maxGroup) {
        $insights[] = "The largest age group is {$maxGroup} with {$distribution[$maxGroup]['count']} respondents ({$distribution[$maxGroup]['percentage']}% of total).";
    }
    if ($minGroup && $minGroup !== $maxGroup) {
        $insights[] = "The smallest age group is {$minGroup} with {$distribution[$minGroup]['count']} respondents ({$distribution[$minGroup]['percentage']}%).";
    }
    if ($averageAge) {
        $insights[] = "The average age of respondents is {$averageAge} years.";
    }

    $under35 = 0;
    $over35 = 0;
    foreach ($distribution as $group => $data) {
        if (in_array($group, ['18 and below', '19-25', '26-35'])) {
            $under35 += $data['count'];
        } else {
            $over35 += $data['count'];
        }
    }
    $under35Percent = $total ? round(($under35 / $total) * 100, 1) : 0;
    $over35Percent = $total ? round(($over35 / $total) * 100, 1) : 0;
    $insights[] = "Respondents under 35 make up {$under35Percent}% of the total, while those 35 and over make up {$over35Percent}%.";

    return $insights;
}

/**
 * Generate insights for client type distribution.
 */
private function getClientTypeInsights($clientTypes)
{
    $insights = [];
    $total = array_sum($clientTypes);
    if ($total > 0) {
        $maxType = array_keys($clientTypes, max($clientTypes))[0];
        $maxCount = $clientTypes[$maxType];
        $maxPercent = round(($maxCount / $total) * 100, 1);
        $insights[] = "The most frequent client type is {$maxType} with {$maxCount} respondents ({$maxPercent}% of total).";
        foreach ($clientTypes as $type => $count) {
            $percent = round(($count / $total) * 100, 1);
            $insights[] = ucfirst($type) . " respondents: {$count} ({$percent}%).";
        }
        if ($maxType === 'citizen' && $maxPercent >= 50) {
            $insights[] = "Citizens make up the majority of respondents, which is expected for a government service.";
        }
    } else {
        $insights[] = "No data available for the selected period.";
    }
    return $insights;
}

/**
 * Generate insights for gender distribution.
 */
private function getGenderInsights($genders, $total)
{
    $insights = [];
    $labels = ['male' => 'Male', 'female' => 'Female', 'prefer_not_to_say' => 'Prefer not to say'];
    if ($total > 0) {
        $maxGenderKey = array_keys($genders, max($genders))[0];
        $maxGenderLabel = $labels[$maxGenderKey] ?? $maxGenderKey;
        $maxCount = $genders[$maxGenderKey];
        $maxPercent = round(($maxCount / $total) * 100, 1);
        $insights[] = "The most common gender is {$maxGenderLabel} with {$maxCount} respondents ({$maxPercent}% of total).";
        foreach ($genders as $key => $count) {
            $label = $labels[$key] ?? $key;
            $percent = round(($count / $total) * 100, 1);
            $insights[] = "{$label} represents {$percent}% of respondents ({$count} individuals).";
        }
        if (isset($genders['prefer_not_to_say']) && $genders['prefer_not_to_say'] / $total > 0.15) {
            $insights[] = "A significant number of respondents ({$genders['prefer_not_to_say']}, " . round(($genders['prefer_not_to_say']/$total)*100,1) . "%) chose not to disclose their gender.";
        }
    } else {
        $insights[] = "No gender data available.";
    }
    return $insights;
}

/**
 * Generate insights for region distribution.
 */
private function getRegionInsights($regions, $total)
{
    $insights = [];
    if (!empty($regions) && $total > 0) {
        $topRegion = array_key_first($regions);
        $topCount = $regions[$topRegion];
        $topPercent = round(($topCount / $total) * 100, 1);
        $insights[] = "The region with the most respondents is {$topRegion} with {$topCount} respondents ({$topPercent}% of total).";
        $nonZero = array_filter($regions);
        if (count($nonZero) > 1) {
            $bottomRegion = array_key_last($nonZero);
            $bottomCount = $nonZero[$bottomRegion];
            $insights[] = "The region with the fewest respondents is {$bottomRegion} with only {$bottomCount} respondents.";
        }
        if (isset($regions['National Capital Region (NCR)'])) {
            $ncrPercent = round(($regions['National Capital Region (NCR)'] / $total) * 100, 1);
            $insights[] = "NCR accounts for {$ncrPercent}% of respondents.";
        }
        if ($topPercent > 50) {
            $insights[] = "Respondents are heavily concentrated in {$topRegion}, which may indicate limited reach in other areas.";
        }
    } else {
        $insights[] = "No region data available.";
    }
    return $insights;
}

}
