import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PermaReportsLayout from '../../Shared/Layouts/PermaReportsLayout';
import FilterBar from '../../Components/PermaDashboard/FilterBar';
import SummaryCards from '../../Components/PermaDashboard/SummaryCards';
import DomainBarChart from '../../Components/PermaDashboard/DomainBarChart';
import PermaRadarChart from '../../Components/PermaDashboard/RadarChart';
import TrendChart from '../../Components/PermaDashboard/TrendChart';
import InterpretationDonut from '../../Components/PermaDashboard/InterpretationDonut';
import DepartmentRankings from '../../Components/PermaDashboard/DepartmentRankings';

export default function PermaReports({ responses, filters, stats, departments, ageBrackets }) {
    const getColorClass = (color) => {
        const map = {
            green: 'bg-green-100 text-green-800 border-green-300',
            emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            orange: 'bg-orange-100 text-orange-800 border-orange-300',
            red: 'bg-red-100 text-red-800 border-red-300',
        };
        return map[color] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const domainBarData = stats ? [
        { domain: 'Positive Emotion', score: stats.averages.positive_emotion },
        { domain: 'Engagement', score: stats.averages.engagement },
        { domain: 'Relationships', score: stats.averages.relationships },
        { domain: 'Meaning', score: stats.averages.meaning },
        { domain: 'Accomplishment', score: stats.averages.accomplishment },
    ] : [];

    const radarData = stats ? [
        { subject: 'Positive Emotion', A: stats.averages.positive_emotion, fullMark: 10 },
        { subject: 'Engagement', A: stats.averages.engagement, fullMark: 10 },
        { subject: 'Relationships', A: stats.averages.relationships, fullMark: 10 },
        { subject: 'Meaning', A: stats.averages.meaning, fullMark: 10 },
        { subject: 'Accomplishment', A: stats.averages.accomplishment, fullMark: 10 },
    ] : [];

    return (
        <PermaReportsLayout>
            <Head title="PERMA Reports" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">PERMA Survey Reports</h1>
            </div>

            <FilterBar filters={filters} departments={departments} ageBrackets={ageBrackets} />

            {stats && <SummaryCards stats={stats} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="text-lg font-semibold mb-4">Domain Averages</h3>
                    {domainBarData.length > 0 ? (
                        <DomainBarChart data={domainBarData} />
                    ) : (
                        <p className="text-gray-500">No data available</p>
                    )}
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="text-lg font-semibold mb-4">Wellbeing Profile</h3>
                    {radarData.length > 0 ? (
                        <PermaRadarChart data={radarData} />
                    ) : (
                        <p className="text-gray-500">No data available</p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">Trend Over Time</h3>
                {stats?.trends?.length ? (
                    <TrendChart data={stats.trends} />
                ) : (
                    <p className="text-gray-500">No trend data for selected period</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="text-lg font-semibold mb-4">Overall Wellbeing Distribution</h3>
                    {stats?.interpretationDistribution ? (
                        <InterpretationDonut data={stats.interpretationDistribution} />
                    ) : (
                        <p className="text-gray-500">No distribution data</p>
                    )}
                </div>



                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="text-lg font-semibold mb-4">Insights</h3>
                    {stats ? (
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <span className="font-medium">Highest domain:</span>{' '}
                                {stats.highestDomain?.name} ({stats.highestDomain?.score})
                            </li>
                            <li>
                                <span className="font-medium">Lowest domain:</span>{' '}
                                {stats.lowestDomain?.name} ({stats.lowestDomain?.score})
                            </li>
                            <li>
                                <span className="font-medium">Overall PERMA:</span> {stats.overallAvg}
                            </li>
                            <li>
                                <span className="font-medium">Total responses:</span> {stats.totalResponses}
                            </li>
                        </ul>
                    ) : (
                        <p className="text-gray-500">Apply filters to see insights</p>
                    )}
                </div>

                
            </div>

            {/* Department Rankings */}
{(stats?.topDepartments?.length > 0 || stats?.bottomDepartments?.length > 0) && (
  <div className="mb-6">
   <DepartmentRankings
    goodDepartments={stats.goodDepartments}
    needsAttentionDepartments={stats.needsAttentionDepartments}
/>
  </div>
)}



            <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Respondent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Age</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Date</th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600">P</th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600">E</th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600">R</th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600">M</th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600">A</th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600">Overall</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {responses.data.map((response, idx) => (
                                <tr key={response.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {response.respondent_name || (response.user?.name || 'Anonymous')}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {response.department?.name || response.user?.department?.name || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {response.age_bracket || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(response.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getColorClass(response.perma_scores.positive_emotion.color)}`}>
                                            {response.perma_scores.positive_emotion.score}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getColorClass(response.perma_scores.engagement.color)}`}>
                                            {response.perma_scores.engagement.score}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getColorClass(response.perma_scores.relationships.color)}`}>
                                            {response.perma_scores.relationships.score}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getColorClass(response.perma_scores.meaning.color)}`}>
                                            {response.perma_scores.meaning.score}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getColorClass(response.perma_scores.accomplishment.color)}`}>
                                            {response.perma_scores.accomplishment.score}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getColorClass(response.overall_perma.color)}`}>
                                            {response.overall_perma.score}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <Link
                                            href={`/perma-reports/${response.id}`}
                                            className="font-medium text-indigo-600 hover:text-indigo-900"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {responses.links && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{responses.from}</span> to{' '}
                        <span className="font-medium">{responses.to}</span> of{' '}
                        <span className="font-medium">{responses.total}</span> results
                    </div>
                    <div className="flex gap-2">
                        {responses.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => router.get(link.url, filters, { preserveState: true, preserveScroll: true })}
                                disabled={!link.url}
                                className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium shadow-sm transition-colors ${
                                    link.active
                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </PermaReportsLayout>
    );
}