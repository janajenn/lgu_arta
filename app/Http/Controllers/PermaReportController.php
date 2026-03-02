<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\PermaResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermaReportController extends Controller
{
   
    public function index(Request $request)
    {
        // Base query on perma_responses only (no join needed)
        $query = PermaResponse::query();
    
        // Date range filters (only)
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
    
        // Clone for stats (before pagination)
        $statsQuery = clone $query;
    
        // --- Aggregated statistics ---
        $stats = [];
    
        // Total responses count
        $stats['totalResponses'] = $statsQuery->count();
    
        // Domain averages: compute average of each question, then combine
        $domainQuestions = PermaResponse::DOMAINS; // must be public
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
    
        // Overall PERMA average
        $stats['overallAvg'] = count($averages) > 0 ? round(array_sum($averages) / count($averages), 2) : 0;
    
        $trends = $statsQuery->clone()
        ->select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as period"),
            // Positive Emotion: q5, q10, q22
            DB::raw("AVG((q5 + q10 + q22)/3) as positive_emotion"),
            // Engagement: q3, q11, q21
            DB::raw("AVG((q3 + q11 + q21)/3) as engagement"),
            // Relationships: q6, q15, q19
            DB::raw("AVG((q6 + q15 + q19)/3) as relationships"),
            // Meaning: q1, q9, q17
            DB::raw("AVG((q1 + q9 + q17)/3) as meaning"),
            // Accomplishment: q2, q8, q16
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
    
        // --- Paginated responses with transformations ---
        $paginated = $query->with('user') // eager load user if you want to show name (but user_id may be null)
            ->latest('created_at')
            ->paginate(5)
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
    
        // Departments for filter dropdown (optional) – we can send empty array or fetch all if needed
        $departments = [];
    
        return Inertia::render('PermaSurvey/PermaReports', [
            'responses'   => $paginated,
            'filters'     => $request->only(['start_date', 'end_date']), // exclude department_id
            'stats'       => $stats,
            'departments' => $departments,
        ]);
    }

    public function show($id)
{
    $response = PermaResponse::with('user.department')->findOrFail($id);
    
    // Calculate scores and interpretations (similar to index)
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