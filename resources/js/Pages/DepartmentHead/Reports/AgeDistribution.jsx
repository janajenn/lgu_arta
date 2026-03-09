import { Head, Link } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import { UsersIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import InsightsCard from '../Reports/InsightsCard';

export default function AgeDistribution({ ageDistribution, total, averageAge, insights }) {
    return (
        <DepartmentHeadLayout title="Age Distribution">
            <Head title="Age Distribution" />

            <div className="space-y-6">
                <Link
                    href={route('department-head.reports.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Reports
                </Link>

                {/* Insights Card */}
                <InsightsCard insights={insights} />

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <UsersIcon className="h-5 w-5 mr-2" />
                            Age Distribution
                        </h2>
                    </div>

                    <div className="p-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respondents</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Object.entries(ageDistribution).map(([group, data]) => (
                                    <tr key={group} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100%</td>
                                </tr>
                            </tfoot>
                        </table>

                        {/* Display average age if available */}
                        {averageAge && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-blue-800">
                                    <span className="font-semibold">Average Age:</span> {averageAge} years
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
