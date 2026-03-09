import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Shared/Layouts/AdminLayout';
import { ArrowLeftIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function SummaryOfResult({ metrics, insightParagraph, totalResponses, totalTransactions }) {
    return (
        <AdminLayout title="Summary of Result">
            <Head title="Summary of Result" />
            <div className="space-y-6">
                <Link href={route('admin.reports.index')} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Reports
                </Link>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <DocumentTextIcon className="h-5 w-5 mr-2" /> Summary of Results
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <p className="text-sm text-blue-600 font-medium">CC Awareness</p>
                                <p className="text-3xl font-bold text-blue-800">{metrics.cc_awareness}%</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                <p className="text-sm text-green-600 font-medium">CC Visibility</p>
                                <p className="text-3xl font-bold text-green-800">{metrics.cc_visibility}%</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                <p className="text-sm text-purple-600 font-medium">CC Helpfulness</p>
                                <p className="text-3xl font-bold text-purple-800">{metrics.cc_helpfulness}%</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                <p className="text-sm text-amber-600 font-medium">Response Rate</p>
                                <p className="text-3xl font-bold text-amber-800">{metrics.response_rate}%</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                                <p className="text-sm text-emerald-600 font-medium">Overall Score</p>
                                <p className="text-3xl font-bold text-emerald-800">{metrics.overall_score}%</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-600" /> Insight Analysis
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{insightParagraph}</p>
                            <div className="mt-4 text-sm text-gray-500">
                                Based on {totalResponses} survey responses from {totalTransactions} total transactions.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
