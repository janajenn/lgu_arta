<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\PermaResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Department;
class PermaReportController extends Controller
{
   
    public function index(Request $request)
    {
        $query = PermaResponse::with(['user', 'department']);

        // Apply filters
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->filled('age_bracket')) {
            $query->where('age_bracket', $request->age_bracket);
        }

        $statsQuery = clone $query;

        // Aggregated statistics
        $stats = [];
        $stats['totalResponses'] = $statsQuery->count();

        // Domain averages
        $domainQuestions = PermaResponse::DOMAINS;
        $averages = [];
        foreach ($domainQuestions as $domain => $questions) {
            if (in_array($domain, ['positive_emotion', 'engagement', 'relationships', 'meaning', 'accomplishment'])) {
                $selects = [];
                foreach ($questions as $q) {
                    $selects[] = "AVG({$q}) as avg_{$q}";
                }
                $row = $statsQuery->clone()
                    ->selectRaw(implode(', ', $selects))
                    ->first();
                $sum = 0;
                $count = 0;
                foreach ($questions as $q) {
                    $val = $row->{"avg_{$q}"} ?? 0;
                    $sum += $val;
                    $count++;
                }
                $averages[$domain] = $count > 0 ? round($sum / $count, 2) : 0;
            }
        }
        $stats['averages'] = $averages;
        $stats['overallAvg'] = count($averages) > 0 ? round(array_sum($averages) / count($averages), 2) : 0;

        // Trends
        $trends = $statsQuery->clone()
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as period"),
                DB::raw("AVG((q5 + q10 + q22)/3) as positive_emotion"),
                DB::raw("AVG((q3 + q11 + q21)/3) as engagement"),
                DB::raw("AVG((q6 + q15 + q19)/3) as relationships"),
                DB::raw("AVG((q1 + q9 + q17)/3) as meaning"),
                DB::raw("AVG((q2 + q8 + q16)/3) as accomplishment")
            )
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(fn($item) => [
                'period' => $item->period,
                'positive_emotion' => round($item->positive_emotion ?? 0, 2),
                'engagement'       => round($item->engagement ?? 0, 2),
                'relationships'    => round($item->relationships ?? 0, 2),
                'meaning'          => round($item->meaning ?? 0, 2),
                'accomplishment'   => round($item->accomplishment ?? 0, 2),
            ]);
        $stats['trends'] = $trends;

        // Interpretation distribution
        $responsesForDistribution = $statsQuery->clone()
            ->select('id', 'q1','q2','q3','q4','q5','q6','q7','q8','q9','q10',
                     'q11','q12','q13','q14','q15','q16','q17','q18','q19','q20','q21','q22','q23')
            ->get();
        $interpretationCounts = [
            'Very Low'  => 0,
            'Low'       => 0,
            'Moderate'  => 0,
            'High'      => 0,
            'Very High' => 0,
        ];
        foreach ($responsesForDistribution as $response) {
            $perma = [
                'positive_emotion' => $response->domainAverage('positive_emotion'),
                'engagement'       => $response->domainAverage('engagement'),
                'relationships'    => $response->domainAverage('relationships'),
                'meaning'          => $response->domainAverage('meaning'),
                'accomplishment'   => $response->domainAverage('accomplishment'),
            ];
            $overall = count($perma) > 0 ? round(array_sum($perma) / count($perma), 2) : 0;
            $label = PermaResponse::interpretScore($overall)['label'];
            $interpretationCounts[$label] = ($interpretationCounts[$label] ?? 0) + 1;
        }
        $stats['interpretationDistribution'] = $interpretationCounts;

        // Highest and lowest domains
        $domainNames = [
            'positive_emotion' => 'Positive Emotion',
            'engagement'       => 'Engagement',
            'relationships'    => 'Relationships',
            'meaning'          => 'Meaning',
            'accomplishment'   => 'Accomplishment',
        ];
        $highestKey = array_keys($averages, max($averages))[0] ?? null;
        $lowestKey  = array_keys($averages, min($averages))[0] ?? null;
        $stats['highestDomain'] = $highestKey ? [
            'key'   => $highestKey,
            'name'  => $domainNames[$highestKey],
            'score' => $averages[$highestKey],
        ] : null;
        $stats['lowestDomain'] = $lowestKey ? [
            'key'   => $lowestKey,
            'name'  => $domainNames[$lowestKey],
            'score' => $averages[$lowestKey],
        ] : null;

        // Previous period overall average
        if ($trends->count() >= 2) {
            $lastPeriod = $trends[$trends->count()-2];
            $lastOverall = array_sum([
                $lastPeriod['positive_emotion'],
                $lastPeriod['engagement'],
                $lastPeriod['relationships'],
                $lastPeriod['meaning'],
                $lastPeriod['accomplishment']
            ]) / 5;
            $stats['previousOverallAvg'] = round($lastOverall, 2);
        } else {
            $stats['previousOverallAvg'] = null;
        }

        // Paginated responses with transformations
        $paginated = $query->latest('created_at')->paginate(5)
            ->through(function ($response) {
                $perma = $response->permaAverages();
                $interpreted = [];
                foreach ($perma as $key => $score) {
                    $interpreted[$key] = [
                        'score' => $score,
                        'label' => PermaResponse::interpretScore($score)['label'],
                        'color' => PermaResponse::interpretScore($score)['color'],
                    ];
                }
                $overall = $response->overallPermaAverage();
                $response->perma_scores = $interpreted;
                $response->overall_perma = [
                    'score' => $overall,
                    'label' => PermaResponse::interpretScore($overall)['label'],
                    'color' => PermaResponse::interpretScore($overall)['color'],
                ];
                $response->negative_emotion = $response->domainAverage('negative_emotion');
                $response->health = $response->domainAverage('health');
                $response->loneliness = $response->domainAverage('loneliness');
                return $response;
            });

        $departments = Department::orderBy('name')->get(['id', 'name']);
        $ageBrackets = ['20-29', '30-39', '40-49', '50-59', '60+'];

        // Department performance (overall PERMA average per department)
        $departmentPerformance = $statsQuery->clone()
            ->join('departments', 'perma_responses.department_id', '=', 'departments.id')
            ->select(
                'departments.id',
                'departments.name',
                DB::raw("AVG((q1 + q9 + q17)/3) as meaning_avg"),
                DB::raw("AVG((q2 + q8 + q16)/3) as accomplishment_avg"),
                DB::raw("AVG((q3 + q11 + q21)/3) as engagement_avg"),
                DB::raw("AVG((q4 + q13 + q18)/3) as health_avg"),
                DB::raw("AVG((q5 + q10 + q22)/3) as positive_emotion_avg"),
                DB::raw("AVG((q6 + q15 + q19)/3) as relationships_avg"),
                DB::raw("AVG((q7 + q14 + q20)/3) as negative_emotion_avg"),
                DB::raw("AVG(q12) as loneliness_avg"),
                DB::raw("AVG(q23) as overall_happiness_avg")
            )
            ->whereNotNull('perma_responses.department_id')
            ->groupBy('departments.id', 'departments.name')
            ->get()
            ->map(function ($dept) {
                $overall = round((
                    $dept->positive_emotion_avg +
                    $dept->engagement_avg +
                    $dept->relationships_avg +
                    $dept->meaning_avg +
                    $dept->accomplishment_avg
                ) / 5, 2);

                return [
                    'id'      => $dept->id,
                    'name'    => $dept->name,
                    'overall' => $overall,
                    'domains' => [
                        'positive_emotion' => round($dept->positive_emotion_avg, 2),
                        'engagement'       => round($dept->engagement_avg, 2),
                        'relationships'    => round($dept->relationships_avg, 2),
                        'meaning'          => round($dept->meaning_avg, 2),
                        'accomplishment'   => round($dept->accomplishment_avg, 2),
                        'health'           => round($dept->health_avg, 2),
                        'negative_emotion' => round($dept->negative_emotion_avg, 2),
                        'loneliness'       => round($dept->loneliness_avg, 2),
                        'overall_happiness'=> round($dept->overall_happiness_avg, 2),
                    ],
                ];
            })
            ->sortByDesc('overall')
            ->values();

        // Split based on overall score threshold
        $goodDepartments = $departmentPerformance
            ->filter(fn($dept) => $dept['overall'] >= 3.0)
            ->sortByDesc('overall')
            ->values();

        $needsAttentionDepartments = $departmentPerformance
            ->filter(fn($dept) => $dept['overall'] < 3.0)
            ->sortByDesc('overall')
            ->values();

        $stats['goodDepartments'] = $goodDepartments;
        $stats['needsAttentionDepartments'] = $needsAttentionDepartments;

        return Inertia::render('PermaSurvey/PermaReports', [
            'responses'   => $paginated,
            'filters'     => $request->only(['start_date', 'end_date', 'department_id', 'age_bracket']),
            'stats'       => $stats,
            'departments' => $departments,
            'ageBrackets' => $ageBrackets,
        ]);
    }


    public function show($id)
    {
        $response = PermaResponse::with(['user.department', 'department'])->findOrFail($id);

        $perma = $response->permaAverages();
        $interpreted = [];
        foreach ($perma as $key => $score) {
            $interpreted[$key] = [
                'score' => $score,
                'label' => PermaResponse::interpretScore($score)['label'],
                'color' => PermaResponse::interpretScore($score)['color'],
            ];
        }
        $overall = $response->overallPermaAverage();
        $response->perma_scores = $interpreted;
        $response->overall_perma = [
            'score' => $overall,
            'label' => PermaResponse::interpretScore($overall)['label'],
            'color' => PermaResponse::interpretScore($overall)['color'],
        ];
        $response->negative_emotion = $response->domainAverage('negative_emotion');
        $response->health = $response->domainAverage('health');
        $response->loneliness = $response->domainAverage('loneliness');

        return Inertia::render('PermaSurvey/PermaReportShow', [
            'response' => $response,
        ]);
    }
}