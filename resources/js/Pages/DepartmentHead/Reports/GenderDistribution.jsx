import { Head, Link } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import { UsersIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import InsightsCard from '../Reports/InsightsCard';


export default function GenderDistribution({ genders, total,insights }) {
    const formatLabel = (key) => {
        if (key === 'male') return 'Male';
        if (key === 'female') return 'Female';
        if (key === 'prefer_not_to_say') return 'Prefer not to say';
        return key;
    };

    return (
        <DepartmentHeadLayout title="Gender Distribution">
            <Head title="Gender Distribution" />

            <div className="space-y-6">
                <Link
                    href={route('department-head.reports.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Reports
                </Link>



                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <UsersIcon className="h-5 w-5 mr-2" />
                            Gender Distribution
                        </h2>
                    </div>

                    {/* Insights Card */}
                                    <InsightsCard insights={insights} />

                    <div className="p-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respondents</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Object.entries(genders).map(([key, count]) => (
                                    <tr key={key} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatLabel(key)}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">{count}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                            {total > 0 ? ((count / total) * 100).toFixed(1) : 0}%
                                        </td>
                                    </tr>
                                ))}
                                {Object.keys(genders).length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-2 text-center text-gray-500">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">Total</td>
                                    <td className="px-4 py-2 text-sm font-bold text-gray-900">{total}</td>
                                    <td className="px-4 py-2 text-sm text-gray-500">100%</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
