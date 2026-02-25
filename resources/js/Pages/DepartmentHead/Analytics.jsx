import { Head, Link, router, usePage } from '@inertiajs/react';
import DepartmentHeadLayout from '../../Shared/Layouts/DepartmentHeadLayout';
import { useState, useEffect } from 'react';
import {
    ChartBarIcon,
    ChartPieIcon,
    TableCellsIcon,
    DocumentChartBarIcon,
    DocumentTextIcon,
    QuestionMarkCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronUpDownIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ArrowPathIcon,
    ArrowRightCircleIcon,
    ArrowLeftCircleIcon,
    DocumentArrowDownIcon,
    UsersIcon,
    UserGroupIcon,
    IdentificationIcon,
    Cog6ToothIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    InformationCircleIcon,
    LightBulbIcon,
    ExclamationCircleIcon,
    CalculatorIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline';


export default function Analytics({
    auth,
    ccAnalytics,
    sqdAnalytics,
    overallSQDSummary,
    filterOptions,
    filters,
    totalRespondents,
    overallSatisfaction
}) {
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters || {});
    const [exporting, setExporting] = useState(false);
    const [activeTab, setActiveTab] = useState('cc');

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
        router.get(route('department-head.analytics'), localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get(route('department-head.analytics'));
    };

    const exportToCSV = async () => {
        setExporting(true);
        try {
            const params = new URLSearchParams();
            Object.entries(localFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const url = `${route('department-head.analytics.export')}?${params.toString()}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <DepartmentHeadLayout title='Analytics'>
            <Head title="Question Analytics" />

            {/* Analytics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <UsersIcon className="h-10 w-10 text-blue-100" />
                        <span className="text-blue-100 text-sm font-medium">Survey</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Survey Respondents</h3>
                    <p className="text-3xl font-bold mb-1">{totalRespondents}</p>
                    <p className="text-blue-100 text-sm">Completed survey forms</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <DocumentTextIcon className="h-10 w-10 text-emerald-100" />
                        <span className="text-emerald-100 text-sm font-medium">Questions</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">CC Questions</h3>
                    <p className="text-3xl font-bold mb-1">{Object.keys(ccAnalytics || {}).length}</p>
                    <p className="text-emerald-100 text-sm">Citizen's Charter Awareness</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <QuestionMarkCircleIcon className="h-10 w-10 text-purple-100" />
                        <span className="text-purple-100 text-sm font-medium">Questions</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">SQD Questions</h3>
                    <p className="text-3xl font-bold mb-1">{Object.keys(sqdAnalytics || {}).length}</p>
                    <p className="text-purple-100 text-sm">Service Quality Dimensions</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <ChartBarIcon className="h-10 w-10 text-amber-100" />
                        <span className="text-amber-100 text-sm font-medium">Score</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Overall Satisfaction</h3>
                    <p className="text-3xl font-bold mb-1">{overallSatisfaction}/5</p>
                    <p className="text-amber-100 text-sm">Average satisfaction score</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-700" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Response Filters</h2>
                                <p className="text-gray-600 text-sm">Filter question responses by respondent demographics</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                            >
                                <ArrowPathIcon className="h-5 w-5 mr-2" />
                                Reset All
                            </button>
                            <button
                                onClick={applyFilters}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                            >
                                <FunnelIcon className="h-5 w-5 mr-2" />
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                    {filterOptions.serviceOptions.map((service) => (
                                        <option key={service} value={service}>
                                            {service.split('–')[1]?.trim() || service}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Region Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Region
                            </label>
                            <div className="relative">
                                <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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

                        {/* Export Button */}
                        <div className="flex items-end">
                            <button
                                onClick={exportToCSV}
                                disabled={exporting}
                                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                            >
                                {exporting ? (
                                    <>
                                        <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                        Export Analytics CSV
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('cc')}
                        className={`flex items-center px-6 py-4 text-lg font-medium transition-all duration-300 ${activeTab === 'cc'
                            ? 'border-b-2 border-blue-600 text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        <DocumentTextIcon className="h-6 w-6 mr-3" />
                        Citizen's Charter (CC)
                        <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {Object.keys(ccAnalytics || {}).length} questions
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('sqd')}
                        className={`flex items-center px-6 py-4 text-lg font-medium transition-all duration-300 ${activeTab === 'sqd'
                            ? 'border-b-2 border-purple-600 text-purple-600 bg-gradient-to-r from-purple-50 to-purple-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        <QuestionMarkCircleIcon className="h-6 w-6 mr-3" />
                        Service Quality (SQD)
                        <span className="ml-3 bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {Object.keys(sqdAnalytics || {}).length} questions
                        </span>
                    </button>
                </div>
            </div>

            {/* CC Analytics */}
            {activeTab === 'cc' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-200 flex items-center justify-center">
                                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Citizen's Charter Awareness Analysis</h2>
                                    <p className="text-gray-600 text-sm">Detailed breakdown of CC question responses with percentages</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            {Object.entries(ccAnalytics || {}).map(([questionId, data]) => (
                                <div key={questionId} className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-lg font-bold text-blue-600">{questionId}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{data.question}</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                                        <CalculatorIcon className="h-4 w-4 mr-2" />
                                                        Total Responses: {data.total_responses}
                                                    </div>
                                                    <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                                        <InformationCircleIcon className="h-4 w-4 mr-2" />
                                                        Question Type: Awareness Assessment
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-bold">
                                            CC
                                        </div>
                                    </div>

                                    {/* Enhanced Response Table */}
                                    <div className="overflow-hidden rounded-xl border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Choice Code
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Description
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
                                                {data.answer_stats.map((stat, index) => (
                                                    <tr key={index} className="hover:bg-blue-50/50 transition-colors duration-200">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-800 font-bold">
                                                                {stat.code}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm text-gray-900">{stat.text}</p>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className={`text-lg font-bold ${stat.count > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                                    {stat.count}
                                                                </span>
                                                                <span className="text-sm text-gray-600 ml-2">responses</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`text-lg font-bold ${stat.count > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                                {stat.percentage}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex-1">
                                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                                        <div
                                                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                                                                            style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                                                                    {stat.percentage}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Insights Section */}
                                    <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                        <div className="flex items-center mb-2">
                                            <LightBulbIcon className="h-5 w-5 text-blue-600 mr-2" />
                                            <h4 className="font-semibold text-blue-800">Key Insights</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold">Most Common Response:</span>{' '}
                                                    {data.answer_stats.find(s => s.count === Math.max(...data.answer_stats.map(s => s.count)))?.text || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold">Response Distribution:</span>{' '}
                                                    {data.answer_stats.filter(s => s.count > 0).length} out of {data.answer_stats.length} options selected
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {Object.keys(ccAnalytics || {}).length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-300 mb-4">
                                        <DocumentTextIcon className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No CC Response Data Available</h3>
                                    <p className="text-gray-500">
                                        CC question responses will appear here as data becomes available
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SQD Analytics */}
            {activeTab === 'sqd' && (
                <div className="space-y-6">
                    {/* Overall SQD Summary Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-200">
                        <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-purple-200 flex items-center justify-center">
                                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Overall SQD Summary (SQD0–SQD8)</h2>
                                    <p className="text-gray-600 text-sm">Aggregated results across all Service Quality Dimensions</p>
                                    <p className="text-xs text-purple-500 mt-1">
                                        <InformationCircleIcon className="h-4 w-4 inline mr-1" />
                                        Counts represent unique respondents who gave each response type
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Response Distribution Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center shadow-lg">
                                    <div className="text-2xl font-bold">{overallSQDSummary?.strongly_agree_responses || 0}</div>
                                    <div className="text-sm font-medium mt-1 text-blue-100">Strongly Agree</div>
                                    <div className="text-xs text-blue-200 mt-1">
                                        {overallSQDSummary?.total_responses > 0
                                            ? Math.round((overallSQDSummary.strongly_agree_responses / overallSQDSummary.total_responses) * 100)
                                            : 0}%
                                    </div>
                                    <div className="text-xs text-blue-300 mt-1">respondents</div>
                                </div>

                                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white text-center shadow-lg">
                                    <div className="text-2xl font-bold">{overallSQDSummary?.agree_responses || 0}</div>
                                    <div className="text-sm font-medium mt-1 text-green-100">Agree</div>
                                    <div className="text-xs text-green-200 mt-1">
                                        {overallSQDSummary?.total_responses > 0
                                            ? Math.round((overallSQDSummary.agree_responses / overallSQDSummary.total_responses) * 100)
                                            : 0}%
                                    </div>
                                    <div className="text-xs text-green-300 mt-1">respondents</div>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white text-center shadow-lg">
                                    <div className="text-2xl font-bold">{overallSQDSummary?.answer_totals?.['Neither Agree Nor Disagree'] || 0}</div>
                                    <div className="text-sm font-medium mt-1 text-yellow-100">Neutral</div>
                                    <div className="text-xs text-yellow-200 mt-1">
                                        {overallSQDSummary?.total_responses > 0
                                            ? Math.round((overallSQDSummary.answer_totals['Neither Agree Nor Disagree'] / overallSQDSummary.total_responses) * 100)
                                            : 0}%
                                    </div>
                                    <div className="text-xs text-yellow-300 mt-1">respondents</div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white text-center shadow-lg">
                                    <div className="text-2xl font-bold">{overallSQDSummary?.answer_totals?.['Disagree'] || 0}</div>
                                    <div className="text-sm font-medium mt-1 text-orange-100">Disagree</div>
                                    <div className="text-xs text-orange-200 mt-1">
                                        {overallSQDSummary?.total_responses > 0
                                            ? Math.round((overallSQDSummary.answer_totals['Disagree'] / overallSQDSummary.total_responses) * 100)
                                            : 0}%
                                    </div>
                                    <div className="text-xs text-orange-300 mt-1">respondents</div>
                                </div>

                                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white text-center shadow-lg">
                                    <div className="text-2xl font-bold">{overallSQDSummary?.answer_totals?.['Strongly Disagree'] || 0}</div>
                                    <div className="text-sm font-medium mt-1 text-red-100">Strongly Disagree</div>
                                    <div className="text-xs text-red-200 mt-1">
                                        {overallSQDSummary?.total_responses > 0
                                            ? Math.round((overallSQDSummary.answer_totals['Strongly Disagree'] / overallSQDSummary.total_responses) * 100)
                                            : 0}%
                                    </div>
                                    <div className="text-xs text-red-300 mt-1">respondents</div>
                                </div>

                                <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-4 text-white text-center shadow-lg">
                                    <div className="text-2xl font-bold">{overallSQDSummary?.na_responses || 0}</div>
                                    <div className="text-sm font-medium mt-1 text-gray-100">N/A</div>
                                    <div className="text-xs text-gray-200 mt-1">
                                        {overallSQDSummary?.total_responses > 0
                                            ? Math.round((overallSQDSummary.na_responses / overallSQDSummary.total_responses) * 100)
                                            : 0}%
                                    </div>
                                    <div className="text-xs text-gray-300 mt-1">respondents</div>
                                </div>
                            </div>

                            {/* Overall SQD Calculation */}
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-purple-900 mb-2">Overall SQD Percentage</h3>
                                        <div className="flex items-center space-x-4 text-gray-700">
                                            <div className="text-sm">
                                                <span className="font-semibold">Formula:</span> (Strongly Agree + Agree) ÷ (Total Respondents − N/A) × 100
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-semibold">Calculation:</span>
                                                ({overallSQDSummary?.strongly_agree_responses || 0} + {overallSQDSummary?.agree_responses || 0}) ÷
                                                ({overallSQDSummary?.total_responses || 0} - {overallSQDSummary?.na_responses || 0}) × 100
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-purple-700">
                                            {overallSQDSummary?.overall_sqd_percentage || 0}%
                                        </div>
                                        <div className="text-sm text-purple-600 font-medium mt-1">
                                            Overall SQD Score
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar Visualization */}
                                <div className="mt-6">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Overall Satisfaction Level</span>
                                        <span>{overallSQDSummary?.overall_sqd_percentage || 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-purple-600 h-4 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(overallSQDSummary?.overall_sqd_percentage || 0, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>0%</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <div className="flex items-center">
                                        <UsersIcon className="h-8 w-8 text-blue-500 mr-3" />
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{overallSQDSummary?.total_responses || 0}</div>
                                            <div className="text-sm text-gray-600">Total Respondents</div>
                                            <div className="text-xs text-gray-500">Answered SQD questions</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <div className="flex items-center">
                                        <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{overallSQDSummary?.valid_responses || 0}</div>
                                            <div className="text-sm text-gray-600">Valid Respondents</div>
                                            <div className="text-xs text-gray-500">Did not answer N/A</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <div className="flex items-center">
                                        <ExclamationCircleIcon className="h-8 w-8 text-gray-500 mr-3" />
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{overallSQDSummary?.na_responses || 0}</div>
                                            <div className="text-sm text-gray-600">N/A Respondents</div>
                                            <div className="text-xs text-gray-500">Answered N/A for any question</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-purple-100">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-purple-200 flex items-center justify-center">
                                    <QuestionMarkCircleIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Service Quality Dimensions Analysis</h2>
                                    <p className="text-gray-600 text-sm">Detailed breakdown of SQD question responses (1-5 Likert scale)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            {Object.entries(sqdAnalytics || {}).map(([questionId, data]) => (
                                <div key={questionId} className="bg-gradient-to-r from-purple-50 to-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-lg font-bold text-purple-600">{questionId}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{data.question}</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                                        <CalculatorIcon className="h-4 w-4 mr-2" />
                                                        Total: {data.total_responses} | Valid: {data.valid_responses} | N/A: {data.total_responses - data.valid_responses}
                                                    </div>
                                                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                                                        <PresentationChartLineIcon className="h-4 w-4 mr-2" />
                                                        Average Score: {data.average_score}/5
                                                    </div>
                                                    <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                                        <InformationCircleIcon className="h-4 w-4 mr-2" />
                                                        Question Type: Satisfaction Rating
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl font-bold">
                                            SQD
                                        </div>
                                    </div>

                                    {/* Enhanced SQD Response Table */}
                                    <div className="overflow-hidden rounded-xl border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Response
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Score
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
                                                {data.answer_stats.map((stat, index) => (
                                                    <tr key={index} className="hover:bg-purple-50/50 transition-colors duration-200">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.answer === 'Strongly Disagree' ? 'bg-red-100' :
                                                                        stat.answer === 'Disagree' ? 'bg-orange-100' :
                                                                            stat.answer === 'Neither Agree Nor Disagree' ? 'bg-yellow-100' :
                                                                                stat.answer === 'Agree' ? 'bg-green-100' :
                                                                                    stat.answer === 'Strongly Agree' ? 'bg-blue-100' :
                                                                                        'bg-gray-100'
                                                                    }`}>
                                                                    <span className={`text-sm font-bold ${stat.answer === 'Strongly Disagree' ? 'text-red-600' :
                                                                            stat.answer === 'Disagree' ? 'text-orange-600' :
                                                                                stat.answer === 'Neither Agree Nor Disagree' ? 'text-yellow-600' :
                                                                                    stat.answer === 'Agree' ? 'text-green-600' :
                                                                                        stat.answer === 'Strongly Agree' ? 'text-blue-600' :
                                                                                            'text-gray-600'
                                                                        }`}>
                                                                        {stat.answer.charAt(0)}
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm text-gray-900 font-medium">{stat.answer}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${stat.answer === 'Strongly Disagree' ? 'bg-red-100 text-red-800' :
                                                                    stat.answer === 'Disagree' ? 'bg-orange-100 text-orange-800' :
                                                                        stat.answer === 'Neither Agree Nor Disagree' ? 'bg-yellow-100 text-yellow-800' :
                                                                            stat.answer === 'Agree' ? 'bg-green-100 text-green-800' :
                                                                                stat.answer === 'Strongly Agree' ? 'bg-blue-100 text-blue-800' :
                                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {stat.score}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className={`text-lg font-bold ${stat.count > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                                    {stat.count}
                                                                </span>
                                                                <span className="text-sm text-gray-600 ml-2">responses</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`text-lg font-bold ${stat.count > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                                {stat.percentage}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex-1">
                                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                                        <div
                                                                            className={`h-3 rounded-full ${stat.answer === 'Strongly Disagree' ? 'bg-red-500' :
                                                                                    stat.answer === 'Disagree' ? 'bg-orange-500' :
                                                                                        stat.answer === 'Neither Agree Nor Disagree' ? 'bg-yellow-500' :
                                                                                            stat.answer === 'Agree' ? 'bg-green-500' :
                                                                                                stat.answer === 'Strongly Agree' ? 'bg-blue-500' :
                                                                                                    'bg-gray-400'
                                                                                }`}
                                                                            style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                                                                    {stat.percentage}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* SQD Insights Section */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                            <div className="flex items-center mb-2">
                                                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                                                <h4 className="font-semibold text-blue-800">Positive Responses</h4>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {data.answer_stats
                                                    .filter(s => s.answer === 'Agree' || s.answer === 'Strongly Agree')
                                                    .reduce((sum, s) => sum + s.count, 0)} responses
                                            </p>
                                            <p className="text-sm text-blue-700 mt-1">Agree + Strongly Agree</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                                            <div className="flex items-center mb-2">
                                                <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                                                <h4 className="font-semibold text-red-800">Negative Responses</h4>
                                            </div>
                                            <p className="text-2xl font-bold text-red-900">
                                                {data.answer_stats
                                                    .filter(s => s.answer === 'Disagree' || s.answer === 'Strongly Disagree')
                                                    .reduce((sum, s) => sum + s.count, 0)} responses
                                            </p>
                                            <p className="text-sm text-red-700 mt-1">Disagree + Strongly Disagree</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                            <div className="flex items-center mb-2">
                                                <PresentationChartLineIcon className="h-5 w-5 text-purple-600 mr-2" />
                                                <h4 className="font-semibold text-purple-800">SQD Score</h4>
                                            </div>
                                            <p className="text-2xl font-bold text-purple-900">
                                                {data.sqd_score}%
                                            </p>
                                            <p className="text-sm text-purple-700 mt-1">(Agree+Strongly Agree)/(Valid Responses)</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center mb-2">
                                                <InformationCircleIcon className="h-5 w-5 text-gray-600 mr-2" />
                                                <h4 className="font-semibold text-gray-800">Satisfaction Rate</h4>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {data.valid_responses > 0 ?
                                                    Math.round((data.answer_stats
                                                        .filter(s => s.answer === 'Agree' || s.answer === 'Strongly Agree')
                                                        .reduce((sum, s) => sum + s.count, 0) / data.valid_responses) * 100) : 0}%
                                            </p>
                                            <p className="text-sm text-gray-700 mt-1">Based on valid responses</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {Object.keys(sqdAnalytics || {}).length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-300 mb-4">
                                        <QuestionMarkCircleIcon className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No SQD Response Data Available</h3>
                                    <p className="text-gray-500">
                                        SQD question responses will appear here as data becomes available
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DepartmentHeadLayout>
    );
}