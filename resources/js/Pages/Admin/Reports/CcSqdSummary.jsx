import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Shared/Layouts/AdminLayout';
import { ArrowLeftIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import InsightsCard from '../Reports/InsightsCard';

export default function CcSqdSummary({ ccData, sqdSummary, ccInsights, sqdInsights }) {
    const responseOptions = [
        'Strongly Agree',
        'Agree',
        'Neither Agree Nor Disagree',
        'Disagree',
        'Strongly Disagree',
        'N/A (Not Applicable)'
    ];

    return (
        <AdminLayout title="CC & SQD Summary">
            <Head title="CC & SQD Summary" />

            <div className="space-y-6">
                <Link
                    href={route('admin.reports.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Reports
                </Link>

                {/* CC Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                    <InsightsCard insights={ccInsights} />

                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            Citizen's Charter (CC) Summary
                        </h2>

                    </div>

                    <div className="p-6 space-y-8">
                        {Object.entries(ccData).map(([questionId, data]) => (
                            <div key={questionId} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                                <h3 className="text-md font-semibold text-gray-800 mb-2">{data.question}</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.answer_stats.map((stat, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{stat.code}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">{stat.text}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{stat.count}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{stat.percentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">Total Responses: {data.total_responses}</div>
                            </div>
                        ))}
                    </div>
                </div>
{/* SQD Section - dimensions as rows, response counts only */}
<div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <InsightsCard insights={sqdInsights} />

    <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Service Quality (SQD) Summary by Dimension
        </h2>
    </div>
    <div className="p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimension</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strongly Agree</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agree</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Neither Agree nor Disagree</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disagree</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strongly Disagree</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N/A</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Responses</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction Score</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {sqdSummary.questions.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{q.label}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{q.counts['Strongly Agree']}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{q.counts['Agree']}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{q.counts['Neither Agree Nor Disagree']}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{q.counts['Disagree']}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{q.counts['Strongly Disagree']}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{q.counts['N/A (Not Applicable)']}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{q.total}</td>
                        <td className="px-4 py-2 text-sm font-bold text-purple-600">{q.satisfaction_score}%</td>
                    </tr>
                ))}
                {/* Total row (sum across all dimensions) */}
                <tr className="bg-gray-100 font-semibold">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">Total</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{sqdSummary.overall_counts['Strongly Agree']}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{sqdSummary.overall_counts['Agree']}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{sqdSummary.overall_counts['Neither Agree Nor Disagree']}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{sqdSummary.overall_counts['Disagree']}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{sqdSummary.overall_counts['Strongly Disagree']}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{sqdSummary.overall_counts['N/A (Not Applicable)']}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{sqdSummary.overall_total}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">—</td>
                </tr>
            </tbody>
        </table>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-800">Overall Satisfaction Score (all dimensions combined):</span>
                <span className="text-2xl font-bold text-purple-700">{sqdSummary.overall_satisfaction}%</span>
            </div>
            <p className="text-xs text-purple-600 mt-1">
                (Strongly Agree + Agree) / (Total Responses - N/A) × 100
            </p>
        </div>
    </div>
</div>
</div>


        </AdminLayout>
    );
}
