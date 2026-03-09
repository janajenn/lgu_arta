import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import {
    ChartBarIcon,
    ChartPieIcon,
    UsersIcon,
    UserGroupIcon,
    DocumentTextIcon,
    TableCellsIcon,
    ArrowPathIcon,
    ArrowUpTrayIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
    ChevronUpDownIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    CalendarDaysIcon,
    MapPinIcon,
    EnvelopeIcon,
    LightBulbIcon,
    ServerIcon,
    ChartBarSquareIcon,
    IdentificationIcon,
    Cog6ToothIcon,
    ArrowRightCircleIcon,
    ArrowLeftCircleIcon,
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    QuestionMarkCircleIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    DocumentChartBarIcon,
    DocumentArrowDownIcon,
    AdjustmentsHorizontalIcon,
    EyeIcon,
    EyeSlashIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    QueueListIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import DepartmentHeadLayout from '../../Shared/Layouts/DepartmentHeadLayout'; // adjust the import path as needed


export default function Dashboard({
    auth,
    responses,
    statistics,
    transactionStats,
    filterOptions,
    serviceOptions,
    filters,
    sortField,
    sortDirection,
    totalResponses,
    totalTransactions,
    regionStatistics = null,
    minRequired,
    status
}) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters || {});
    const [suggestionsPreview, setSuggestionsPreview] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [chartType, setChartType] = useState('bar');
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [showInsufficientModal, setShowInsufficientModal] = useState(false);




useEffect(() => {
    if (status === 'below') {
        setShowInsufficientModal(true);
    }
}, [status]);



    useEffect(() => {
        setLocalFilters(filters || {});
    }, [filters]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters };
        if (value) {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }
        setLocalFilters(newFilters);
    };

    const applyFilters = () => {
        router.get(route('department-head.dashboard'), localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        setSearchTerm('');
        router.get(route('department-head.dashboard'));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        handleFilterChange('search', searchTerm);
        applyFilters();
    };

    const goToAnalytics = () => {
        router.get(route('department-head.analytics'));
    };

    const handleSort = (field) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        router.get(route('department-head.dashboard'), {
            ...filters,
            sort: field,
            direction: direction
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportToCSV = async () => {
        setExporting(true);
        try {
            const params = new URLSearchParams();
            Object.entries(localFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const url = `${route('department-head.export')}?${params.toString()}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    const calculatePercentage = (count) => {
        const total = statistics.total || totalResponses;
        return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return <ChevronUpDownIcon className="w-4 h-4 ml-1" />;
        return sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />;
    };

    // Prepare service chart data for surveys
    const prepareServiceChartData = () => {
        if (!statistics.serviceDistribution || Object.keys(statistics.serviceDistribution).length === 0) {
            return [];
        }

        return Object.entries(statistics.serviceDistribution).map(([service, count]) => {
            const percentage = calculatePercentage(count);
            const serviceName = service.split('–')[1]?.trim() || service;
            const shortName = serviceName.length > 30 ? serviceName.substring(0, 30) + '...' : serviceName;

            return {
                name: shortName,
                fullName: service,
                count: count,
                percentage: parseFloat(percentage),
                value: count,
            };
        }).sort((a, b) => b.count - a.count);
    };

    // Prepare transaction service data
    const prepareTransactionServiceData = () => {
        if (!transactionStats?.transactionsPerService || Object.keys(transactionStats.transactionsPerService).length === 0) {
            return [];
        }

        return Object.entries(transactionStats.transactionsPerService).map(([service, count]) => {
            const percentage = transactionStats.totalTransactions > 0
                ? ((count / transactionStats.totalTransactions) * 100).toFixed(1)
                : 0;
            const serviceName = service.split('–')[1]?.trim() || service;
            const shortName = serviceName.length > 30 ? serviceName.substring(0, 30) + '...' : serviceName;

            return {
                name: shortName,
                fullName: service,
                count: count,
                percentage: parseFloat(percentage),
                value: count,
            };
        }).sort((a, b) => b.count - a.count);
    };

    const serviceChartData = prepareServiceChartData();
    const transactionServiceData = prepareTransactionServiceData();

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

    const mostPopularSurveyService = serviceChartData.length > 0 ? serviceChartData[0] : null;
    const mostPopularTransactionService = transactionServiceData.length > 0 ? transactionServiceData[0] : null;

    // Calculate completion rate
    const completionRate = totalTransactions > 0
        ? ((totalResponses / totalTransactions) * 100).toFixed(1)
        : 0;

    // Calculate average daily transactions
    const avgDailyTransactions = transactionStats?.dailyTrend && Object.keys(transactionStats.dailyTrend).length > 0
        ? Math.round(Object.values(transactionStats.dailyTrend).reduce((a, b) => a + b, 0) / Object.keys(transactionStats.dailyTrend).length)
        : 0;

    // Prepare daily trend data for chart
    const prepareDailyTrendData = () => {
        if (!transactionStats?.dailyTrend || Object.keys(transactionStats.dailyTrend).length === 0) {
            return [];
        }

        return Object.entries(transactionStats.dailyTrend).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            transactions: count,
            fullDate: date
        }));
    };

    const dailyTrendData = prepareDailyTrendData();

    const allChartData = {
        serviceChartData,
        transactionServiceData,
        dailyTrendData,
        ageChartData: Object.entries(statistics.ageGroups || {}).map(([ageGroup, count]) => ({
            name: ageGroup,
            count: count,
            percentage: calculatePercentage(count)
        })),
        genderChartData: Object.entries(statistics.sexDistribution || {}).map(([gender, count]) => ({
            name: gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Prefer not to say',
            count: count,
            percentage: calculatePercentage(count)
        })),
        clientTypeChartData: Object.entries(statistics.clientTypes || {}).map(([clientType, count]) => ({
            name: clientType.charAt(0).toUpperCase() + clientType.slice(1),
            count: count,
            percentage: calculatePercentage(count)
        }))
    };



    return (
        <DepartmentHeadLayout>
            <Head title="Survey Responses Dashboard" /> {/* Optional: override layout title */}



            <div className="mb-6">

                {/* Flash message for insufficient responses */}
{status === 'below' && (
    <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
        <div className="flex items-start">
            <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">
                    Your department currently has <span className="font-bold">{totalResponses}</span> survey responses,
                    but the statistically recommended minimum is <span className="font-bold">{minRequired}</span> based on your
                    total transactions (<span className="font-bold">{totalTransactions}</span>).
                    Please encourage more customers to complete the survey.
                </p>
            </div>
            <button
                onClick={() => setShowInsufficientModal(true)}
                className="ml-4 flex-shrink-0 text-sm font-medium text-red-700 hover:text-red-600 underline"
            >
                Learn more
            </button>
        </div>
    </div>
)}


    <h1 className="text-3xl font-bold text-gray-900">
        {auth.user.department_name || 'Department'} Dashboard
    </h1>
    <p className="text-gray-600">Welcome back, {auth.user.name}!</p>
</div>

            {/* Main Content - now placed inside layout's children */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* New Department Button moved inside content */}
                <div className="mb-6 flex justify-end">

                </div>

                {/* Enhanced Summary Cards with Transaction Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <QueueListIcon className="h-10 w-10 text-blue-100" />
                            <span className="text-blue-100 text-sm font-medium">Total</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
                        <p className="text-3xl font-bold mb-1">{totalTransactions?.toLocaleString() || 0}</p>
                        <p className="text-blue-100 text-sm">All service requests recorded</p>
                    </div>



                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <UsersIcon className="h-10 w-10 text-emerald-100" />
                            <span className="text-emerald-100 text-sm font-medium">Survey</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Survey Responses</h3>
                        <p className="text-3xl font-bold mb-1">{totalResponses?.toLocaleString() || 0}</p>
                        <p className="text-emerald-100 text-sm">Feedback forms completed</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <ArrowTrendingUpIcon className="h-10 w-10 text-purple-100" />
                            <span className="text-purple-100 text-sm font-medium">Completion</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Survey Rate</h3>
                        <p className="text-3xl font-bold mb-1">{completionRate}%</p>
                        <p className="text-purple-100 text-sm">Of transactions completed survey</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <ClockIcon className="h-10 w-10 text-amber-100" />
                            <span className="text-amber-100 text-sm font-medium">Daily Avg</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Avg Daily</h3>
                        <p className="text-3xl font-bold mb-1">{avgDailyTransactions}</p>
                        <p className="text-amber-100 text-sm">Transactions per day</p>
                    </div>
                </div>

                {/* Transaction vs Survey Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Transaction Statistics Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <QueueListIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Transaction Overview</h2>
                                    <p className="text-gray-600 text-sm">All service requests (with or without survey)</p>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                {transactionServiceData.length} services
                            </div>
                        </div>

                        {transactionServiceData.length > 0 ? (
                            <div className="space-y-4">
                                {transactionServiceData.map((service, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <span className="text-sm font-bold text-blue-600">{service.count}</span>
                                            </div>
                                            <div className="text-sm text-gray-700 truncate max-w-xs">
                                                {service.fullName?.split('–')[1]?.trim() || service.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-32">
                                                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600"
                                                        style={{ width: `${service.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                                                {service.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700">Total Transactions</span>
                                        <span className="text-lg font-bold text-blue-600">{totalTransactions}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <QueueListIcon className="w-12 h-12 mx-auto mb-3" />
                                No transaction data available
                            </div>
                        )}
                    </div>

                    {/* Survey Statistics Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <UsersIcon className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Survey Overview</h2>
                                    <p className="text-gray-600 text-sm">Completed feedback forms only</p>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                {serviceChartData.length} services
                            </div>
                        </div>

                        {serviceChartData.length > 0 ? (
                            <div className="space-y-4">
                                {serviceChartData.map((service, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 hover:bg-emerald-50 rounded-lg transition-colors duration-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                <span className="text-sm font-bold text-emerald-600">{service.count}</span>
                                            </div>
                                            <div className="text-sm text-gray-700 truncate max-w-xs">
                                                {service.fullName?.split('–')[1]?.trim() || service.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-32">
                                                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                                                        style={{ width: `${service.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                                                {service.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700">Total Survey Responses</span>
                                        <span className="text-lg font-bold text-emerald-600">{totalResponses}</span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        {completionRate}% of total transactions
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <UsersIcon className="w-12 h-12 mx-auto mb-3" />
                                No survey data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Daily Transaction Trend */}
                {dailyTrendData.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Daily Transaction Trend</h2>
                                        <p className="text-gray-600 text-sm">Last 30 days of service activity</p>
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                    {Object.keys(transactionStats?.dailyTrend || {}).length} days
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={dailyTrendData}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                                        <XAxis
                                            dataKey="date"
                                            angle={-45}
                                            textAnchor="end"
                                            height={50}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <YAxis
                                            label={{
                                                value: 'Transactions',
                                                angle: -90,
                                                position: 'insideLeft',
                                                offset: -10
                                            }}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`${value} transactions`, 'Count']}
                                            labelFormatter={(label) => `Date: ${label}`}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="transactions"
                                            stroke="#8B5CF6"
                                            strokeWidth={2}
                                            dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Trend Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Peak Day</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {Math.max(...Object.values(transactionStats?.dailyTrend || {})) || 0} transactions
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Average Daily</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {avgDailyTransactions} transactions
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Total Period</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {Object.values(transactionStats?.dailyTrend || {}).reduce((a, b) => a + b, 0)} transactions
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Service Comparison Graph Section */}
                <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <ChartBarIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Service Comparison</h2>
                                    <p className="text-gray-600 text-sm">
                                        Visual analysis of service usage across all survey responses
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2 bg-gray-50 p-1 rounded-lg">
                                <button
                                    onClick={() => setChartType('bar')}
                                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${chartType === 'bar'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <ChartBarIcon className="h-5 w-5 mr-2" />
                                    Bar Chart
                                </button>
                                <button
                                    onClick={() => setChartType('pie')}
                                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${chartType === 'pie'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <ChartPieIcon className="h-5 w-5 mr-2" />
                                    Pie Chart
                                </button>
                            </div>
                        </div>
                    </div>

                    {serviceChartData.length > 0 ? (
                        <div className="p-6">
                            {/* Chart Container */}
                            <div className="h-96 mb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    {chartType === 'bar' ? (
                                        <BarChart
                                            data={serviceChartData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                                            <XAxis
                                                dataKey="name"
                                                angle={-45}
                                                textAnchor="end"
                                                height={70}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                label={{
                                                    value: 'Number of Responses',
                                                    angle: -90,
                                                    position: 'insideLeft',
                                                    offset: -10
                                                }}
                                            />
                                            <Tooltip
                                                formatter={(value, name, props) => {
                                                    if (name === 'count') {
                                                        const percentage = serviceChartData.find(item => item.name === props.payload.name)?.percentage || 0;
                                                        return [`${value} responses (${percentage}%)`, 'Count'];
                                                    }
                                                    return value;
                                                }}
                                                labelFormatter={(label) => {
                                                    const fullName = serviceChartData.find(item => item.name === label)?.fullName;
                                                    return fullName || label;
                                                }}
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e7eb',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="count"
                                                name="Number of Responses"
                                                fill="#3B82F6"
                                                radius={[6, 6, 0, 0]}
                                            />
                                        </BarChart>
                                    ) : (
                                        <PieChart>
                                            <Pie
                                                data={serviceChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={true}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={120}
                                                fill="#3B82F6"
                                                dataKey="count"
                                                nameKey="name"
                                            >
                                                {serviceChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name, props) => {
                                                    const percentage = serviceChartData.find(item => item.name === props.payload.name)?.percentage || 0;
                                                    return [`${value} responses (${percentage}%)`, 'Count'];
                                                }}
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e7eb',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    )}
                                </ResponsiveContainer>
                            </div>

                            {/* Service Details Table */}
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Service
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Response Count
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Percentage
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Visualization
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {serviceChartData.map((service, index) => (
                                            <tr key={index} className="hover:bg-blue-50/50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {service.fullName || service.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                                                            <span className="text-sm font-bold text-blue-600">{service.count}</span>
                                                        </div>
                                                        <span className="text-sm text-gray-700">responses</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {service.percentage}%
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-1">
                                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                                <div
                                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                                                                    style={{ width: `${service.percentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                                                            {service.percentage}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Total Row */}
                                        {serviceChartData.length > 0 && (
                                            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 font-bold">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-blue-900">
                                                        TOTAL ACROSS ALL SERVICES
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-blue-900">
                                                        {serviceChartData.reduce((sum, service) => sum + service.count, 0)} responses
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-blue-900">
                                                        100%
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-1">
                                                            <div className="w-full bg-gray-300 rounded-full h-3">
                                                                <div
                                                                    className="bg-gradient-to-r from-blue-700 to-blue-800 h-3 rounded-full"
                                                                    style={{ width: '100%' }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-bold text-blue-900 w-12 text-right">
                                                            100%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Insights Section */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                    <div className="flex items-center mb-3">
                                        <div className="h-10 w-10 rounded-lg bg-blue-200 flex items-center justify-center mr-3">
                                            <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-blue-800">Most Popular Service</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900 mb-1">
                                        {mostPopularSurveyService ? mostPopularSurveyService.name : 'N/A'}
                                    </p>
                                    <p className="text-blue-700">
                                        {mostPopularSurveyService ? `${mostPopularSurveyService.count} responses (${mostPopularSurveyService.percentage}%)` : ''}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                                    <div className="flex items-center mb-3">
                                        <div className="h-10 w-10 rounded-lg bg-emerald-200 flex items-center justify-center mr-3">
                                            <ServerIcon className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-emerald-800">Service Coverage</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-emerald-900 mb-1">
                                        {serviceChartData.length} Services
                                    </p>
                                    <p className="text-emerald-700">
                                        Currently being tracked and analyzed
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                                    <div className="flex items-center mb-3">
                                        <div className="h-10 w-10 rounded-lg bg-purple-200 flex items-center justify-center mr-3">
                                            <InformationCircleIcon className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-purple-800">Response Rate</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-900 mb-1">
                                        {totalResponses > 0 ? Math.round(totalResponses / serviceChartData.length) : 0}
                                    </p>
                                    <p className="text-purple-700">
                                        Average responses per service category
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-300 mb-4">
                                <ChartBarIcon className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Data Available</h3>
                            <p className="text-gray-500">
                                Survey responses with service information will appear here.
                            </p>
                        </div>
                    )}
                </div>


                {/* Hourly Distribution Section */}
                {transactionStats?.hourlyDistribution && Object.keys(transactionStats.hourlyDistribution).length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                        <ClockIcon className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Hourly Transaction Distribution</h2>
                                        <p className="text-gray-600 text-sm">
                                            Peak hours for service requests throughout the day (Philippine Time GMT+8)
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                    24-hour analysis
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-3">
                                {Object.entries(transactionStats.hourlyDistribution)
                                    .sort(([hourA], [hourB]) => {
                                        const hourNumA = parseInt(hourA.split(':')[0]);
                                        const hourNumB = parseInt(hourB.split(':')[0]);
                                        return hourNumA - hourNumB;
                                    })
                                    .map(([hour, count], index) => {
                                        const maxCount = Math.max(...Object.values(transactionStats.hourlyDistribution));
                                        const heightPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                                        const hour24 = parseInt(hour.split(':')[0]);
                                        const hour12 = hour24 % 12 || 12;
                                        const period = hour24 >= 12 ? 'PM' : 'AM';
                                        const displayHour = `${hour12}${period}`;

                                        return (
                                            <div key={hour} className="text-center">
                                                <div className="mb-2">
                                                    <div
                                                        className="mx-auto w-8 bg-gradient-to-t from-amber-500 to-amber-600 rounded-t-lg transition-all duration-300 hover:from-amber-600 hover:to-amber-700"
                                                        style={{ height: `${Math.max(20, heightPercentage * 2)}px` }}
                                                        title={`${displayHour}: ${count} transactions (${hour} PH Time)`}
                                                    ></div>
                                                </div>
                                                <div className="text-xs font-medium text-gray-700">{displayHour}</div>
                                                <div className="text-xs font-bold text-amber-600">{count}</div>
                                            </div>
                                        );
                                    })}
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Peak Hour</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {(() => {
                                            const peakEntry = Object.entries(transactionStats.hourlyDistribution)
                                                .reduce((a, b) => a[1] > b[1] ? a : b, ['00:00', 0]);
                                            if (peakEntry[1] === 0) return 'N/A';

                                            const hour24 = parseInt(peakEntry[0].split(':')[0]);
                                            const hour12 = hour24 % 12 || 12;
                                            const period = hour24 >= 12 ? 'PM' : 'AM';
                                            return `${hour12}${period}`;
                                        })()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {(() => {
                                            const peakEntry = Object.entries(transactionStats.hourlyDistribution)
                                                .reduce((a, b) => a[1] > b[1] ? a : b, ['00:00', 0]);
                                            return peakEntry[1] > 0 ? `${peakEntry[1]} transactions` : '';
                                        })()}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Peak Transactions</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {Math.max(...Object.values(transactionStats.hourlyDistribution)) || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">Highest hour volume</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Busy Period</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {(() => {
                                            const maxCount = Math.max(...Object.values(transactionStats.hourlyDistribution));
                                            if (maxCount === 0) return 'N/A';

                                            const busyHours = Object.entries(transactionStats.hourlyDistribution)
                                                .filter(([_, count]) => count > maxCount * 0.5)
                                                .map(([hour]) => {
                                                    const hour24 = parseInt(hour.split(':')[0]);
                                                    const hour12 = hour24 % 12 || 12;
                                                    const period = hour24 >= 12 ? 'PM' : 'AM';
                                                    return `${hour12}${period}`;
                                                })
                                                .join(', ');

                                            return busyHours || 'N/A';
                                        })()}
                                    </div>
                                    <div className="text-xs text-gray-500">Hours with 50% of peak</div>
                                </div>
                            </div>

                            {/* Time Range Summary */}
                            <div className="mt-6 bg-blue-50 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-blue-800 mb-2">Business Hours Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-white p-3 rounded-lg">
                                        <div className="text-xs text-gray-600 mb-1">Morning (8AM-12PM)</div>
                                        <div className="text-lg font-bold text-blue-700">
                                            {(() => {
                                                const morningHours = Object.entries(transactionStats.hourlyDistribution)
                                                    .filter(([hour]) => {
                                                        const hour24 = parseInt(hour.split(':')[0]);
                                                        return hour24 >= 8 && hour24 < 12;
                                                    })
                                                    .reduce((sum, [_, count]) => sum + count, 0);
                                                return morningHours;
                                            })()}
                                        </div>
                                        <div className="text-xs text-gray-500">transactions</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <div className="text-xs text-gray-600 mb-1">Afternoon (1PM-5PM)</div>
                                        <div className="text-lg font-bold text-blue-700">
                                            {(() => {
                                                const afternoonHours = Object.entries(transactionStats.hourlyDistribution)
                                                    .filter(([hour]) => {
                                                        const hour24 = parseInt(hour.split(':')[0]);
                                                        return hour24 >= 13 && hour24 <= 17;
                                                    })
                                                    .reduce((sum, [_, count]) => sum + count, 0);
                                                return afternoonHours;
                                            })()}
                                        </div>
                                        <div className="text-xs text-gray-500">transactions</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <div className="text-xs text-gray-600 mb-1">Evening (6PM-8PM)</div>
                                        <div className="text-lg font-bold text-blue-700">
                                            {(() => {
                                                const eveningHours = Object.entries(transactionStats.hourlyDistribution)
                                                    .filter(([hour]) => {
                                                        const hour24 = parseInt(hour.split(':')[0]);
                                                        return hour24 >= 18 && hour24 <= 20;
                                                    })
                                                    .reduce((sum, [_, count]) => sum + count, 0);
                                                return eveningHours;
                                            })()}
                                        </div>
                                        <div className="text-xs text-gray-500">transactions</div>
                                    </div>
                                </div>
                            </div>

                            {/* Time Legend */}
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-100 rounded mr-1"></div>
                                    <span className="text-gray-600">Business Hours (8AM-5PM)</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-amber-100 rounded mr-1"></div>
                                    <span className="text-gray-600">Extended Hours (6PM-8PM)</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-gray-100 rounded mr-1"></div>
                                    <span className="text-gray-600">After Hours (9PM-7AM)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Demographic Distribution Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Age Distribution */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                                <UserGroupIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Age Group Distribution</h3>
                        </div>
                        {allChartData.ageChartData.length > 0 ? (
                            <div className="space-y-4">
                                {allChartData.ageChartData.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div className="w-24 text-sm text-gray-600 font-medium">{item.name}</div>
                                        <div className="flex-1">
                                            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600"
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="w-20 text-right text-sm font-semibold text-gray-700">
                                            {item.count} ({item.percentage}%)
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <UserGroupIcon className="w-12 h-12 mx-auto mb-3" />
                                No age data available
                            </div>
                        )}
                    </div>

                    {/* Gender Distribution */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                                <UsersIcon className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Gender Distribution</h3>
                        </div>
                        {allChartData.genderChartData.length > 0 ? (
                            <div className="space-y-4">
                                {allChartData.genderChartData.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div className="w-24 text-sm text-gray-600 font-medium">{item.name}</div>
                                        <div className="flex-1">
                                            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="w-20 text-right text-sm font-semibold text-gray-700">
                                            {item.count} ({item.percentage}%)
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <UsersIcon className="w-12 h-12 mx-auto mb-3" />
                                No gender data available
                            </div>
                        )}
                    </div>

                    {/* Client Type Distribution */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                                <IdentificationIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Client Type Distribution</h3>
                        </div>
                        {allChartData.clientTypeChartData.length > 0 ? (
                            <div className="space-y-4">
                                {allChartData.clientTypeChartData.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div className="w-24 text-sm text-gray-600 font-medium capitalize">{item.name}</div>
                                        <div className="flex-1">
                                            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600"
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="w-20 text-right text-sm font-semibold text-gray-700">
                                            {item.count} ({item.percentage}%)
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <IdentificationIcon className="w-12 h-12 mx-auto mb-3" />
                                No client type data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Region Report Section */}
                <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <MapPinIcon className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Region Report</h2>
                                    <p className="text-gray-600 text-sm">
                                        Geographic distribution of survey responses across the Philippines
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                {regionStatistics?.total_regions || 0} regions with data
                            </div>
                        </div>
                    </div>

                    {regionStatistics?.regions && regionStatistics.regions.length > 0 ? (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                    <div className="flex items-center mb-3">
                                        <MapPinIcon className="h-8 w-8 text-blue-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-blue-800">Regions with Data</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-900">
                                        {regionStatistics.total_regions}
                                    </p>
                                    <p className="text-blue-700 text-sm">Active survey regions</p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                                    <div className="flex items-center mb-3">
                                        <CheckCircleIcon className="h-8 w-8 text-emerald-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-emerald-800">Top Region</h3>
                                    </div>
                                    <p className="text-xl font-bold text-emerald-900 truncate">
                                        {Object.keys(regionStatistics.region_distribution)[0] || 'N/A'}
                                    </p>
                                    <p className="text-emerald-700 text-sm">
                                        {regionStatistics.region_distribution[Object.keys(regionStatistics.region_distribution)[0]] || 0} responses
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                                    <div className="flex items-center mb-3">
                                        <InformationCircleIcon className="h-8 w-8 text-purple-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-purple-800">Regional Coverage</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-purple-900">
                                        {Math.round((regionStatistics.total_regions / 17) * 100)}%
                                    </p>
                                    <p className="text-purple-700 text-sm">of Philippine regions covered</p>
                                </div>
                            </div>

                            {/* Region Distribution Table */}
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Region
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Response Count
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Percentage
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Most Used Service
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Visualization
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.entries(regionStatistics.region_distribution).map(([region, count], index) => {
                                            const percentage = totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(1) : 0;
                                            const regionServices = regionStatistics.service_by_region[region] || {};
                                            const topService = Object.keys(regionServices)[0] || 'No data';
                                            const topServiceCount = regionServices[topService] || 0;

                                            return (
                                                <tr key={region} className="hover:bg-emerald-50/50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {region}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                                                                <span className="text-sm font-bold text-emerald-600">{count}</span>
                                                            </div>
                                                            <span className="text-sm text-gray-700">responses</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {percentage}%
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                                                {topService.split('–')[1]?.trim() || topService}
                                                            </span>
                                                            {topServiceCount > 0 && (
                                                                <span className="text-xs text-gray-500">
                                                                    ({topServiceCount})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex-1">
                                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                                    <div
                                                                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full"
                                                                        style={{ width: `${percentage}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-300 mb-4">
                                <MapPinIcon className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Region Data Available</h3>
                            <p className="text-gray-500">
                                Regional data will appear as respondents submit surveys
                            </p>
                        </div>
                    )}
                </div>

                {/* Filter Section */}
                {showFilters && (
                    <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-700" />
                                    <h2 className="text-xl font-bold text-gray-800">Advanced Filters</h2>
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                                    Reset All Filters
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Age Group Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Age Group
                                    </label>
                                    <div className="relative">
                                        <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            value={localFilters.age_group || ''}
                                            onChange={(e) => handleFilterChange('age_group', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none"
                                        >
                                            <option value="">All Age Groups</option>
                                            {filterOptions.age_groups.map((group) => (
                                                <option key={group.value} value={group.value}>
                                                    {group.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Client Type Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Client Type
                                    </label>
                                    <div className="relative">
                                        <IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            value={localFilters.client_type || ''}
                                            onChange={(e) => handleFilterChange('client_type', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        >
                                            <option value="">All Client Types</option>
                                            {filterOptions.client_types.map((type) => (
                                                <option key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Gender Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <div className="relative">
                                        <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            value={localFilters.sex || ''}
                                            onChange={(e) => handleFilterChange('sex', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        >
                                            <option value="">All Genders</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="prefer_not_to_say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Region Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Region
                                    </label>
                                    <div className="relative">
                                        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            value={localFilters.region || ''}
                                            onChange={(e) => handleFilterChange('region', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        >
                                            <option value="">All Regions</option>
                                            {filterOptions.regions.map((region) => (
                                                <option key={region} value={region}>
                                                    {region}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Service Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Service Availed
                                    </label>
                                    <div className="relative">
                                        <Cog6ToothIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            value={localFilters.service_availed || ''}
                                            onChange={(e) => handleFilterChange('service_availed', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        >
                                            <option value="">All Services</option>
                                            {serviceOptions.map((service) => (
                                                <option key={service} value={service}>
                                                    {service.split('–')[1]?.trim() || service}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Date Range Filters */}
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                From Date
                                            </label>
                                            <div className="relative">
                                                <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="date"
                                                    value={localFilters.date_from || ''}
                                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                To Date
                                            </label>
                                            <div className="relative">
                                                <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="date"
                                                    value={localFilters.date_to || ''}
                                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={applyFilters}
                                            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            <FunnelIcon className="h-5 w-5 mr-2" />
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Survey Responses Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Survey Responses</h2>
                                <p className="text-gray-600 mt-1">
                                    Showing {responses.from} to {responses.to} of {responses.total} total responses
                                </p>
                            </div>
                            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                                {responses.current_page} of {responses.last_page} pages
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                        onClick={() => handleSort('date_of_transaction')}
                                    >
                                        <div className="flex items-center">
                                            <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                            Date {getSortIcon('date_of_transaction')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                        onClick={() => handleSort('client_type')}
                                    >
                                        <div className="flex items-center">
                                            <IdentificationIcon className="h-4 w-4 mr-2" />
                                            Client Type {getSortIcon('client_type')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <UsersIcon className="h-4 w-4 mr-2" />
                                            Age/Gender
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                        onClick={() => handleSort('region_of_residence')}
                                    >
                                        <div className="flex items-center">
                                            <MapPinIcon className="h-4 w-4 mr-2" />
                                            Region {getSortIcon('region_of_residence')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <Cog6ToothIcon className="h-4 w-4 mr-2" />
                                            Service
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <LightBulbIcon className="h-4 w-4 mr-2" />
                                            Suggestions
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <EnvelopeIcon className="h-4 w-4 mr-2" />
                                            Email
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {responses.data.map((response) => (
                                    <tr key={response.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {formatDate(response.date_of_transaction)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${response.client_type === 'citizen' ? 'bg-blue-100 text-blue-800' :
                                                    response.client_type === 'business' ? 'bg-emerald-100 text-emerald-800' :
                                                        'bg-purple-100 text-purple-800'
                                                } capitalize`}>
                                                {response.client_type === 'citizen' && <UserGroupIcon className="h-3 w-3 mr-1" />}
                                                {response.client_type === 'business' && <IdentificationIcon className="h-3 w-3 mr-1" />}
                                                {response.client_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-semibold text-gray-900">{response.age}</span>
                                                    <span className="text-xs text-gray-500 ml-1">yrs</span>
                                                </div>
                                                <span className="text-gray-300">|</span>
                                                <span className={`text-sm capitalize ${response.sex === 'male' ? 'text-blue-600' :
                                                        response.sex === 'female' ? 'text-pink-600' :
                                                            'text-gray-600'
                                                    }`}>
                                                    {response.sex === 'male' ? '♂ Male' :
                                                        response.sex === 'female' ? '♀ Female' :
                                                            '? Prefer not to say'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {response.region_of_residence}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                                <Cog6ToothIcon className="h-3 w-3 mr-1" />
                                                {response.service_availed.split('–')[1]?.trim() || response.service_availed}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {response.suggestions ? (
                                                <button
                                                    onClick={() => setSuggestionsPreview(response.suggestions)}
                                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900 hover:underline"
                                                >
                                                    <EyeIcon className="h-4 w-4 mr-1" />
                                                    View ({response.suggestions.length} chars)
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center text-sm text-gray-400">
                                                    <EyeSlashIcon className="h-4 w-4 mr-1" />
                                                    No suggestions
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {response.email ? (
                                                <a href={`mailto:${response.email}`} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900 hover:underline">
                                                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                                                    {response.email}
                                                </a>
                                            ) : (
                                                <span className="inline-flex items-center text-sm text-gray-400">
                                                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                                                    No email
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Enhanced Pagination */}
                    {responses.links && responses.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-sm text-gray-700 font-medium">
                                    Page {responses.current_page} of {responses.last_page}
                                    <span className="ml-4 text-gray-500 font-normal">
                                        ({responses.total} total responses)
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {responses.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url, localFilters, {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    });
                                                }
                                            }}
                                            className={`inline-flex items-center justify-center h-10 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${link.active
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                                    : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md hover:border-gray-400'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            disabled={!link.url || link.active}
                                        >
                                            {index === 0 && <ArrowLongLeftIcon className="h-5 w-5 mr-2" />}
                                            {index === responses.links.length - 1 && <ArrowLongRightIcon className="h-5 w-5 ml-2" />}
                                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Suggestions Preview Modal */}
            {suggestionsPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
                                        <LightBulbIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Suggestions Preview</h3>
                                        <p className="text-sm text-gray-600">Submitted feedback from respondent</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSuggestionsPreview(null)}
                                    className="h-10 w-10 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                                >
                                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                            <div className="prose prose-blue max-w-none">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{suggestionsPreview}</p>
                                </div>
                                <div className="mt-6 text-sm text-gray-500 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                                        {suggestionsPreview.length} characters
                                    </div>
                                    <div className="flex items-center">
                                        <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                                        This feedback is confidential
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setSuggestionsPreview(null)}
                                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all duration-300"
                            >
                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Insufficient Responses Modal */}
{showInsufficientModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4 pt-16">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
                        <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Survey Response Alert</h3>
                        <p className="text-sm text-gray-600">Action needed</p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <p className="text-gray-700 mb-4">
                    Your department currently has <span className="font-bold">{totalResponses}</span> survey responses,
                    but the statistically recommended minimum is <span className="font-bold">{minRequired}</span> based on your
                    total transactions (<span className="font-bold">{totalTransactions}</span>).
                </p>
                <p className="text-gray-700 mb-6">
                    To ensure reliable and representative results, please encourage more customers to complete the survey.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Current progress</span>
                        <span className="text-sm font-bold text-gray-900">{Math.round((totalResponses / minRequired) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-red-600 h-2.5 rounded-full"
                            style={{ width: `${Math.min((totalResponses / minRequired) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowInsufficientModal(false)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={() => {
                            // Optional: navigate to a page with tips or QR code
                            setShowInsufficientModal(false);
                        }}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
                    >
                        Learn how to get more responses
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
        </DepartmentHeadLayout>
    );
}
