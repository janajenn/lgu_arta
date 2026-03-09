import { Head, Link } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import { ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import InsightsCard from '../Reports/InsightsCard';

export default function ClientTypeDistribution({ clientTypes, insights }) {
    return (
        <DepartmentHeadLayout title="Client Type Distribution">
            <Head title="Client Type Distribution" />

            <div className="space-y-6">
                <Link
                    href={route('department-head.reports.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Reports
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <ChartBarIcon className="h-5 w-5 mr-2" />
                            Client Type Distribution
                        </h2>
                    </div>
                    <InsightsCard insights={insights} />
                    <div className="p-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respondents</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Object.entries(clientTypes).map(([type, count]) => (
                                    <tr key={type} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count}</td>
                                    </tr>
                                ))}
                                {Object.keys(clientTypes).length === 0 && (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-center text-gray-500">No data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
