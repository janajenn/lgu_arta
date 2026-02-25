<?php

namespace App\Http\Controllers\DepartmentHead;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Respondent;
use App\Models\TransactionLog;
use App\Models\Service;

class DashboardController extends Controller
{
     /**
     * Display the department head dashboard.
     */
    public function index(Request $request)
{
    // Authorization check remains the same
    if (!$request->user() || !$request->user()->isDepartmentHead()) {
        abort(403, 'Unauthorized access. Department head privileges required.');
    }

    $filters = $request->only([
        'age_group',
        'client_type',
        'sex',
        'region',
        'service_availed',
        'date_from',
        'date_to',
        'search',
        'survey_completed',
    ]);

    // Base query - ALL transactions, then filtered
    $query = Respondent::query();


   
    $query = $this->scopeByDepartment($query, $request->user());

    // Apply user-selected filters (if any)
    $this->applyFilters($query, $filters);

    // ---- ADD THIS LINE ----
    // Only show completed surveys in the table
    $query->where('completed_survey', true);

    // Sorting and pagination
    $sortField = $request->get('sort', 'created_at');
    $sortDirection = $request->get('direction', 'desc');
    $responses = $query->orderBy($sortField, $sortDirection)->paginate(15);

    // Rest of the method unchanged...
    $statistics = $this->getSurveyStatistics($filters, $request->user());
$transactionStats = $this->getTransactionStatistics($filters, $request->user());
$regionStatistics = $this->getRegionStatistics($filters, $request->user());
    $filterOptions = $this->getFilterOptions();
    

    $serviceOptions = [
        'Internal Service 1 – Issuance of Certificates',
        'Internal Service 2 – Issuance of Travel Order',
        'Internal Service 3 – Administration of Leave Application'
    ];

    return Inertia::render('DepartmentHead/Dashboard', [
        'responses' => $responses,
        'statistics' => $statistics,
        'transactionStats' => $transactionStats,
        'regionStatistics' => $regionStatistics,
        'filterOptions' => $filterOptions,
        'serviceOptions' => $serviceOptions,
        'filters' => $filters,
        'sortField' => $sortField,
        'sortDirection' => $sortDirection,
        'totalResponses' => Respondent::where('completed_survey', true)
    ->whereHas('service', fn($q) => $q->where('department_id', $request->user()->department_id))
    ->count(),
'totalTransactions' => Respondent::whereHas('service', fn($q) => $q->where('department_id', $request->user()->department_id))
    ->count(),
    ]);
}
    
    /**
     * Get transaction statistics
     */
    private function getTransactionStatistics($filters = [], $user)
{
    // Start with a base query scoped by department
    $baseQuery = Respondent::query();
    $baseQuery = $this->scopeByDepartment($baseQuery, $user);

    // Apply date filters (if any)
    if (!empty($filters['date_from'])) {
        $baseQuery->whereDate('date_of_transaction', '>=', $filters['date_from']);
    }
    if (!empty($filters['date_to'])) {
        $baseQuery->whereDate('date_of_transaction', '<=', $filters['date_to']);
    }

    // Total transactions
    $totalTransactions = $baseQuery->count();

    // Transactions per service
    $transactionsPerService = (clone $baseQuery)
        ->selectRaw('service_availed, COUNT(*) as count')
        ->groupBy('service_availed')
        ->orderBy('count', 'desc')
        ->get()
        ->mapWithKeys(function ($item) {
            return [$item->service_availed => $item->count];
        })
        ->toArray();

    // Daily trend (last 30 days, but still respecting user's date filters)
    $dailyTrend = (clone $baseQuery)
        ->whereDate('created_at', '>=', now()->subDays(30))
        ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->mapWithKeys(function ($item) {
            return [$item->date => $item->count];
        })
        ->toArray();

    // Hourly distribution (still scoped)
    $hourlyDistribution = (clone $baseQuery)
        ->selectRaw('HOUR(CONVERT_TZ(created_at, "+00:00", "+08:00")) as hour, COUNT(*) as count')
        ->groupBy('hour')
        ->orderBy('hour')
        ->get()
        ->mapWithKeys(function ($item) {
            return [str_pad($item->hour, 2, '0', STR_PAD_LEFT) . ':00' => $item->count];
        })
        ->toArray();

    // Survey completion rate (overall, but scoped)
    $surveyCompletion = (clone $baseQuery)
        ->selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN completed_survey = true THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN completed_survey = false THEN 1 ELSE 0 END) as not_completed
        ')
        ->first();

    return [
        'totalTransactions' => $totalTransactions,
        'transactionsPerService' => $transactionsPerService,
        'dailyTrend' => $dailyTrend,
        'hourlyDistribution' => $hourlyDistribution,
        'surveyCompletion' => $surveyCompletion,
    ];
}
    
    /**
     * Get survey statistics for charts (only completed surveys)
     */
    private function getSurveyStatistics($filters = [] , $user )
    {
        $query = Respondent::where('completed_survey', true);
        $query = $this->scopeByDepartment($query, $user);
    
        // Apply same filters for statistics
        foreach ($filters as $key => $value) {
            if (!empty($value) && in_array($key, ['client_type', 'sex', 'region', 'service_availed', 'date_from', 'date_to'])) {
                if ($key === 'date_from') {
                    $query->whereDate('date_of_transaction', '>=', $value);
                } elseif ($key === 'date_to') {
                    $query->whereDate('date_of_transaction', '<=', $value);
                } elseif ($key === 'region') {
                    $query->where('region_of_residence', 'like', '%' . $value . '%');
                } else {
                    $query->where($key, $value);
                }
            }
        }
    
        // Get all respondents for age calculation
        $allRespondents = $query->get();
        $total = $allRespondents->count();
        
        // Calculate age groups using collection methods
        $ageGroups = [
            '18 and below' => $allRespondents->where('age', '<=', 18)->count(),
            '19-25' => $allRespondents->whereBetween('age', [19, 25])->count(),
            '26-35' => $allRespondents->whereBetween('age', [26, 35])->count(),
            '36-45' => $allRespondents->whereBetween('age', [36, 45])->count(),
            '46-60' => $allRespondents->whereBetween('age', [46, 60])->count(),
            '61+' => $allRespondents->where('age', '>=', 61)->count(),
        ];
    
        // Calculate client types
        $clientTypes = $allRespondents->groupBy('client_type')
            ->map(function ($group) {
                return $group->count();
            })
            ->sortDesc()
            ->toArray();
    
        // Calculate sex distribution
        $sexDistribution = $allRespondents->groupBy('sex')
            ->map(function ($group) {
                return $group->count();
            })
            ->toArray();
    
        // Calculate region distribution (top 10)
        $regionDistribution = $allRespondents->groupBy('region_of_residence')
            ->map(function ($group) {
                return $group->count();
            })
            ->sortDesc()
            ->take(10)
            ->toArray();
    
        // Calculate service distribution
        $serviceDistribution = $allRespondents->groupBy('service_availed')
            ->map(function ($group) {
                return $group->count();
            })
            ->sortDesc()
            ->toArray();
    
        // Calculate monthly trend
        $monthlyTrend = $allRespondents->groupBy(function ($item) {
                return $item->date_of_transaction->format('Y-m');
            })
            ->map(function ($group) {
                return $group->count();
            })
            ->sortKeys()
            ->toArray();
    
        return [
            'ageGroups' => $ageGroups,
            'clientTypes' => $clientTypes,
            'sexDistribution' => $sexDistribution,
            'regionDistribution' => $regionDistribution,
            'serviceDistribution' => $serviceDistribution,
            'monthlyTrend' => $monthlyTrend,
            'total' => $total,
        ];
    }
    

    /**
     * Get filter options for dropdowns.
     */
    private function getFilterOptions()
    {
        return [
            'client_types' => ['citizen', 'business', 'government'],
            'sexes' => ['male', 'female', 'prefer_not_to_say'],
            'regions' => Respondent::distinct()->pluck('region_of_residence')->sort()->values(),
            'age_groups' => [
                ['value' => '18_below', 'label' => '18 and below'],
                ['value' => '19_25', 'label' => '19-25 years'],
                ['value' => '26_35', 'label' => '26-35 years'],
                ['value' => '36_45', 'label' => '36-45 years'],
                ['value' => '46_60', 'label' => '46-60 years'],
                ['value' => '61_above', 'label' => '61+ years'],
            ],
        ];
    }

    /**
     * Export survey responses to CSV.
     */
    public function export(Request $request)
    {
        // Check if user is department head
        if (!$request->user() || !$request->user()->isDepartmentHead()) {
            abort(403, 'Unauthorized access.');
        }

        $fileName = 'survey-responses-' . date('Y-m-d') . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $query = Respondent::query();
        
        // Apply filters if present
        $filters = $request->only(['age_group', 'client_type', 'sex', 'region', 'service_availed', 'date_from', 'date_to']);
        
        foreach ($filters as $key => $value) {
            if (!empty($value)) {
                $query->where($key, $value);
            }
        }
        
        $responses = $query->get();

        $callback = function() use($responses) {
            $file = fopen('php://output', 'w');
            
            // Headers
            fputcsv($file, [
                'ID', 'Date of Transaction', 'Client Type', 'Gender', 'Age', 
                'Region of Residence', 'Service Availed', 'Suggestions', 'Email', 
                'Created At', 'Age Group'
            ]);

            foreach ($responses as $response) {
                $row = [
                    $response->id,
                    $response->date_of_transaction->format('Y-m-d'),
                    ucfirst($response->client_type),
                    $response->sex_formatted,
                    $response->age,
                    $response->region_of_residence,
                    $response->service_availed,
                    $response->suggestions ?? '',
                    $response->email ?? '',
                    $response->created_at->format('Y-m-d H:i:s'),
                    $response->age_group,
                ];

                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }



    private function getRegionStatistics($filters = [], $user)
{
    // Main query – scoped by department
    $query = Respondent::where('completed_survey', true);
    $query = $this->scopeByDepartment($query, $user);

    // Apply global filters
    foreach ($filters as $key => $value) {
        if (!empty($value) && in_array($key, ['client_type', 'sex', 'service_availed', 'date_from', 'date_to'])) {
            if ($key === 'date_from') {
                $query->whereDate('date_of_transaction', '>=', $value);
            } elseif ($key === 'date_to') {
                $query->whereDate('date_of_transaction', '<=', $value);
            } else {
                $query->where($key, $value);
            }
        }
    }

    // Region distribution
    $regionDistribution = $query->selectRaw('region_of_residence, COUNT(*) as count')
        ->groupBy('region_of_residence')
        ->orderBy('count', 'desc')
        ->get()
        ->mapWithKeys(fn($item) => [$item->region_of_residence => $item->count])
        ->toArray();

    $regionsWithData = array_keys($regionDistribution);

    // Service per region – MUST also be scoped by department
    $serviceByRegion = [];
    foreach ($regionsWithData as $region) {
        $serviceQuery = Respondent::where('completed_survey', true)
            ->where('region_of_residence', $region);
        $serviceQuery = $this->scopeByDepartment($serviceQuery, $user); // ← ADD THIS LINE

        // Apply the same filters
        foreach ($filters as $key => $value) {
            if (!empty($value) && in_array($key, ['client_type', 'sex', 'service_availed', 'date_from', 'date_to'])) {
                if ($key === 'date_from') {
                    $serviceQuery->whereDate('date_of_transaction', '>=', $value);
                } elseif ($key === 'date_to') {
                    $serviceQuery->whereDate('date_of_transaction', '<=', $value);
                } else {
                    $serviceQuery->where($key, $value);
                }
            }
        }

        $serviceDistribution = $serviceQuery->selectRaw('service_availed, COUNT(*) as count')
            ->groupBy('service_availed')
            ->orderBy('count', 'desc')
            ->get()
            ->mapWithKeys(fn($item) => [$item->service_availed => $item->count])
            ->toArray();

        $serviceByRegion[$region] = $serviceDistribution;
    }

    return [
        'regions' => $regionsWithData,
        'region_distribution' => $regionDistribution,
        'service_by_region' => $serviceByRegion,
        'total_regions' => count($regionsWithData),
    ];
}



    
    /**
     * Apply filters to query
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

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhere('suggestions', 'like', "%{$search}%")
                  ->orWhere('region_of_residence', 'like', "%{$search}%");
            });
        }
    }

    private function scopeByDepartment($query, $user)
{
    return $query->whereHas('service', function ($q) use ($user) {
        $q->where('department_id', $user->department_id);
    });
}
}