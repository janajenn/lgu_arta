<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Respondent;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // --------------------------------------------------------------
        // Basic overall numbers
        // --------------------------------------------------------------
        $totalDepartments = Department::count();
        $totalTransactions = Respondent::count();
        $totalResponses = Respondent::where('completed_survey', true)->count();
        $responseRate = $totalTransactions > 0 ? round(($totalResponses / $totalTransactions) * 100, 1) : 0;

        // CC Awareness
        $ccAwareness = 0;
        $cc1Question = SurveyQuestion::where('custom_id', 'CC1')->first();
        if ($cc1Question) {
            $respondentIds = Respondent::where('completed_survey', true)->pluck('id');
            $awareCount = SurveyResponse::where('question_id', $cc1Question->id)
                ->whereIn('respondent_id', $respondentIds)
                ->where('answer_value', '1')
                ->count();
            $totalResp = $respondentIds->count();
            $ccAwareness = $totalResp > 0 ? round(($awareCount / $totalResp) * 100, 1) : 0;
        }

        // Overall SQD satisfaction
        $sqdQuestions = SurveyQuestion::where('custom_id', 'like', 'SQD%')->get();
        $sqdOverall = 0;
        $sqdCount = 0;
        foreach ($sqdQuestions as $question) {
            $responses = SurveyResponse::where('question_id', $question->id)
                ->whereHas('respondent', fn($q) => $q->where('completed_survey', true))
                ->get();
            $total = $responses->count();
            $na = $responses->where('answer_value', 'N/A (Not Applicable)')->count();
            $valid = $total - $na;
            $positive = 0;
            foreach ($responses as $r) {
                $ans = $r->answer_value;
                if (str_contains($ans, 'Strongly Agree') || str_contains($ans, 'Kusog kaayo nga Mouyon') ||
                    (str_contains($ans, 'Agree') && !str_contains($ans, 'Strongly')) ||
                    str_contains($ans, 'Mouyon')) {
                    $positive++;
                }
            }
            if ($valid > 0) {
                $sqdOverall += round(($positive / $valid) * 100, 1);
                $sqdCount++;
            }
        }
        $avgSqd = $sqdCount > 0 ? round($sqdOverall / $sqdCount, 1) : 0;

        // Service ratings (for table)
        $serviceRatings = [];
        $services = Service::all();
        foreach ($services as $service) {
            $respondentIds = Respondent::where('service_availed', $service->name)
                ->where('completed_survey', true)
                ->pluck('id');
            if ($respondentIds->isEmpty()) continue;
            $positive = 0;
            $valid = 0;
            foreach ($sqdQuestions as $question) {
                $responses = SurveyResponse::where('question_id', $question->id)
                    ->whereIn('respondent_id', $respondentIds)
                    ->get();
                foreach ($responses as $r) {
                    $ans = $r->answer_value;
                    if (!str_contains($ans, 'N/A')) {
                        $valid++;
                        if (str_contains($ans, 'Strongly Agree') || str_contains($ans, 'Kusog kaayo nga Mouyon') ||
                            (str_contains($ans, 'Agree') && !str_contains($ans, 'Strongly')) ||
                            str_contains($ans, 'Mouyon')) {
                            $positive++;
                        }
                    }
                }
            }
            $rating = $valid > 0 ? round(($positive / $valid) * 100, 1) : null;
            $serviceRatings[] = ['name' => $service->name, 'category' => $service->category, 'rating' => $rating];
        }
        usort($serviceRatings, fn($a, $b) => ($b['rating'] ?? 0) <=> ($a['rating'] ?? 0));

        // --------------------------------------------------------------
        // CHART DATA (aggregated across all departments)
        // --------------------------------------------------------------

        // 1. Service Distribution (responses per service)
        $serviceDistribution = [];
        foreach ($services as $service) {
            $count = Respondent::where('service_availed', $service->name)
                ->where('completed_survey', true)
                ->count();
            if ($count > 0) {
                $serviceDistribution[] = [
                    'name' => $service->name,
                    'count' => $count,
                ];
            }
        }
        usort($serviceDistribution, fn($a, $b) => $b['count'] <=> $a['count']);

        // 2. Monthly Response Trend (last 6 months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();
            $count = Respondent::where('completed_survey', true)
                ->whereBetween('created_at', [$start, $end])
                ->count();
            $monthlyTrend[] = [
                'month' => $month->format('M Y'),
                'responses' => $count,
            ];
        }

        // 3. Age Distribution
        $ageGroups = ['18 and below', '19-25', '26-35', '36-45', '46-60', '61+'];
        $ageDist = [];
        foreach ($ageGroups as $group) {
            $query = Respondent::where('completed_survey', true);
            switch ($group) {
                case '18 and below': $query->where('age', '<=', 18); break;
                case '19-25': $query->whereBetween('age', [19,25]); break;
                case '26-35': $query->whereBetween('age', [26,35]); break;
                case '36-45': $query->whereBetween('age', [36,45]); break;
                case '46-60': $query->whereBetween('age', [46,60]); break;
                case '61+': $query->where('age', '>=', 61); break;
            }
            $count = $query->count();
            $ageDist[] = ['name' => $group, 'count' => $count];
        }

        // 4. Client Type Distribution
        $clientTypes = Respondent::where('completed_survey', true)
            ->selectRaw('client_type, COUNT(*) as count')
            ->groupBy('client_type')
            ->get()
            ->map(fn($item) => ['name' => ucfirst($item->client_type), 'count' => $item->count])
            ->values();

        // 5. Gender Distribution
        $genderDist = Respondent::where('completed_survey', true)
            ->selectRaw('sex, COUNT(*) as count')
            ->groupBy('sex')
            ->get()
            ->map(fn($item) => [
                'name' => $item->sex === 'male' ? 'Male' : ($item->sex === 'female' ? 'Female' : 'Prefer not to say'),
                'count' => $item->count,
            ]);

        // 6. Region Distribution (top 10)
        $regionDist = Respondent::where('completed_survey', true)
            ->selectRaw('region_of_residence, COUNT(*) as count')
            ->groupBy('region_of_residence')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($item) => ['name' => $item->region_of_residence, 'count' => $item->count]);

        // 7. SQD Dimension Satisfaction Scores
        $sqdChartData = [];
        foreach ($sqdQuestions as $question) {
            $responses = SurveyResponse::where('question_id', $question->id)
                ->whereHas('respondent', fn($q) => $q->where('completed_survey', true))
                ->get();
            $total = $responses->count();
            $na = $responses->where('answer_value', 'N/A (Not Applicable)')->count();
            $valid = $total - $na;
            $positive = 0;
            foreach ($responses as $r) {
                $ans = $r->answer_value;
                if (str_contains($ans, 'Strongly Agree') || str_contains($ans, 'Kusog kaayo nga Mouyon') ||
                    (str_contains($ans, 'Agree') && !str_contains($ans, 'Strongly')) ||
                    str_contains($ans, 'Mouyon')) {
                    $positive++;
                }
            }
            $score = $valid > 0 ? round(($positive / $valid) * 100, 1) : 0;
            $sqdChartData[] = [
                'dimension' => $this->getSQDLabel($question->custom_id),
                'score' => $score,
            ];
        }

        // Build the charts array
        $charts = [
            'serviceDistribution' => $serviceDistribution,
            'monthlyTrend' => $monthlyTrend,
            'ageDistribution' => $ageDist,
            'clientTypeDistribution' => $clientTypes,
            'genderDistribution' => $genderDist,
            'regionDistribution' => $regionDist,
            'sqdSatisfaction' => $sqdChartData,
        ];

        return Inertia::render('Admin/Dashboard', [
            'overall' => [
                'total_departments' => $totalDepartments,
                'total_transactions' => $totalTransactions,
                'total_responses' => $totalResponses,
                'response_rate' => $responseRate,
                'cc_awareness' => $ccAwareness,
                'overall_satisfaction' => $avgSqd,
            ],
            'serviceRatings' => $serviceRatings,
            'charts' => $charts,
        ]);
    }

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
}
