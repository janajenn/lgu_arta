<?php

namespace App\Http\Controllers\DepartmentHead;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Respondent;
use App\Models\TransactionLog;
use App\Models\Service;
use App\Models\Department; // ✅ Moved to the top
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Display the department head dashboard (for the logged-in user's department).
     */
    public function index(Request $request)
    {
        if (!$request->user() || !$request->user()->isDepartmentHead()) {
            abort(403, 'Unauthorized access. Department head privileges required.');
        }

        $filters = $request->only([
            'age_group', 'client_type', 'sex', 'region', 'service_availed',
            'date_from', 'date_to', 'search', 'survey_completed',
        ]);

        // Get data for the user's own department
        $data = $this->getDashboardData($request->user()->department_id, $filters, $request);

        return Inertia::render('DepartmentHead/Dashboard', $data);
    }

    /**
     * Display another department's dashboard (HR only).
     */
   public function show(Request $request, Department $department)
{
    $user = $request->user()->load('department');
    // dd([
    //     'is_hr_department' => $user->is_hr_department,
    //     'department' => $user->department,
    //     'department_id' => $user->department_id,
    //     'is_hr_column' => $user->department?->is_hr,
    // ]);

        $filters = $request->only([
            'age_group', 'client_type', 'sex', 'region', 'service_availed',
            'date_from', 'date_to', 'search', 'survey_completed',
        ]);

        // Get data for the requested department
        $data = $this->getDashboardData($department->id, $filters, $request);

        // Add the viewing department so the UI can show context
        return Inertia::render('DepartmentHead/Dashboard', array_merge($data, [
            'viewingDepartment' => $department,
        ]));
    }

    /**
     * Central method to fetch all dashboard data for a given department.
     */
    private function getDashboardData($departmentId, $filters, Request $request)
    {
        // Base query scoped to the department
        $query = Respondent::whereHas('service', fn($q) => $q->where('department_id', $departmentId));
        $this->applyFilters($query, $filters);

        // Only show completed surveys in the table
        $query->where('completed_survey', true);

        // Sorting and pagination
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $responses = $query->orderBy($sortField, $sortDirection)->paginate(10);

        // Totals
        $totalTransactions = Respondent::whereHas('service', fn($q) => $q->where('department_id', $departmentId))->count();
        $totalResponses = Respondent::where('completed_survey', true)
            ->whereHas('service', fn($q) => $q->where('department_id', $departmentId))
            ->count();

        // Minimum required
        $minRequired = 0;
        if ($totalTransactions > 0) {
            $numerator = $totalTransactions * 384.16;
            $denominator = ($totalTransactions - 1) + 384.16;
            $minRequired = (int) ceil($numerator / $denominator);
        }
        $status = $totalResponses >= $minRequired ? 'met' : 'below';

        // Statistics
        $statistics = $this->getSurveyStatistics($departmentId, $filters);
        $transactionStats = $this->getTransactionStatistics($departmentId, $filters);
        $regionStatistics = $this->getRegionStatistics($departmentId, $filters);
        $filterOptions = $this->getFilterOptions();

        // Example service options – you should fetch these from the actual services
        $serviceOptions = Service::where('department_id', $departmentId)->pluck('name')->toArray();

        return [
            'responses' => $responses,
            'statistics' => $statistics,
            'transactionStats' => $transactionStats,
            'regionStatistics' => $regionStatistics,
            'filterOptions' => $filterOptions,
            'serviceOptions' => $serviceOptions,
            'filters' => $filters,
            'sortField' => $sortField,
            'sortDirection' => $sortDirection,
            'totalResponses' => $totalResponses,
            'totalTransactions' => $totalTransactions,
            'minRequired' => $minRequired,
            'status' => $status,
        ];
    }

    /**
     * Get transaction statistics for a given department.
     */
    private function getTransactionStatistics($departmentId, $filters = [])
    {
        $baseQuery = Respondent::whereHas('service', fn($q) => $q->where('department_id', $departmentId));

        if (!empty($filters['date_from'])) {
            $baseQuery->whereDate('date_of_transaction', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $baseQuery->whereDate('date_of_transaction', '<=', $filters['date_to']);
        }

        $totalTransactions = $baseQuery->count();

        $transactionsPerService = (clone $baseQuery)
            ->selectRaw('service_availed, COUNT(*) as count')
            ->groupBy('service_availed')
            ->orderBy('count', 'desc')
            ->get()
            ->mapWithKeys(fn($item) => [$item->service_availed => $item->count])
            ->toArray();

        $dailyTrend = (clone $baseQuery)
            ->whereDate('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(fn($item) => [$item->date => $item->count])
            ->toArray();

        $hourlyDistribution = (clone $baseQuery)
            ->selectRaw('HOUR(CONVERT_TZ(created_at, "+00:00", "+08:00")) as hour, COUNT(*) as count')
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->mapWithKeys(fn($item) => [str_pad($item->hour, 2, '0', STR_PAD_LEFT) . ':00' => $item->count])
            ->toArray();

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
     * Get survey statistics for a given department.
     */
    private function getSurveyStatistics($departmentId, $filters = [])
    {
        $query = Respondent::where('completed_survey', true)
            ->whereHas('service', fn($q) => $q->where('department_id', $departmentId));

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

        $allRespondents = $query->get();
        $total = $allRespondents->count();

        $ageGroups = [
            '18 and below' => $allRespondents->where('age', '<=', 18)->count(),
            '19-25' => $allRespondents->whereBetween('age', [19, 25])->count(),
            '26-35' => $allRespondents->whereBetween('age', [26, 35])->count(),
            '36-45' => $allRespondents->whereBetween('age', [36, 45])->count(),
            '46-60' => $allRespondents->whereBetween('age', [46, 60])->count(),
            '61+' => $allRespondents->where('age', '>=', 61)->count(),
        ];

        $clientTypes = $allRespondents->groupBy('client_type')
            ->map(fn($group) => $group->count())
            ->sortDesc()
            ->toArray();

        $sexDistribution = $allRespondents->groupBy('sex')
            ->map(fn($group) => $group->count())
            ->toArray();

        $regionDistribution = $allRespondents->groupBy('region_of_residence')
            ->map(fn($group) => $group->count())
            ->sortDesc()
            ->take(10)
            ->toArray();

        $serviceDistribution = $allRespondents->groupBy('service_availed')
            ->map(fn($group) => $group->count())
            ->sortDesc()
            ->toArray();

        $monthlyTrend = $allRespondents->groupBy(fn($item) => $item->date_of_transaction->format('Y-m'))
            ->map(fn($group) => $group->count())
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
     * Get region statistics for a given department.
     */
    private function getRegionStatistics($departmentId, $filters = [])
    {
        $query = Respondent::where('completed_survey', true)
            ->whereHas('service', fn($q) => $q->where('department_id', $departmentId));

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

        $regionDistribution = $query->selectRaw('region_of_residence, COUNT(*) as count')
            ->groupBy('region_of_residence')
            ->orderBy('count', 'desc')
            ->get()
            ->mapWithKeys(fn($item) => [$item->region_of_residence => $item->count])
            ->toArray();

        $regionsWithData = array_keys($regionDistribution);

        $serviceByRegion = [];
        foreach ($regionsWithData as $region) {
            $serviceQuery = Respondent::where('completed_survey', true)
                ->where('region_of_residence', $region)
                ->whereHas('service', fn($q) => $q->where('department_id', $departmentId));

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
     * Apply filters to a query.
     */
    private function applyFilters($query, $filters)
    {
        if (!empty($filters['age_group'])) {
            switch ($filters['age_group']) {
                case '18_below':
                    $query->where('age', '<=', 18);
                    break;
                case '19_25':
                    $query->whereBetween('age', [19, 25]);
                    break;
                case '26_35':
                    $query->whereBetween('age', [26, 35]);
                    break;
                case '36_45':
                    $query->whereBetween('age', [36, 45]);
                    break;
                case '46_60':
                    $query->whereBetween('age', [46, 60]);
                    break;
                case '61_above':
                    $query->where('age', '>=', 61);
                    break;
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
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhere('suggestions', 'like', "%{$search}%")
                    ->orWhere('region_of_residence', 'like', "%{$search}%");
            });
        }
    }

    /**
     * Export survey responses to CSV.
     */
    public function export(Request $request)
    {
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

        $query = Respondent::whereHas('service', fn($q) => $q->where('department_id', $request->user()->department_id));

        $filters = $request->only(['age_group', 'client_type', 'sex', 'region', 'service_availed', 'date_from', 'date_to']);
        foreach ($filters as $key => $value) {
            if (!empty($value)) {
                $query->where($key, $value);
            }
        }

        $responses = $query->get();

        $callback = function () use ($responses) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'ID', 'Date of Transaction', 'Client Type', 'Gender', 'Age',
                'Region of Residence', 'Service Availed', 'Suggestions', 'Email',
                'Created At', 'Age Group'
            ]);

            foreach ($responses as $response) {
                fputcsv($file, [
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
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
