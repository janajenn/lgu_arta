import { Head, Link } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import { ArrowLeftIcon, ChartBarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function ServiceRatings({ serviceRatings, overallRating, startDate, endDate }) {
    const internal = serviceRatings.filter(s => s.category === 'internal');
    const external = serviceRatings.filter(s => s.category === 'external');

    const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'all time';

    return (
        <DepartmentHeadLayout title="Service Ratings">
            <Head title="Service Ratings" />

            <div className="space-y-6">
                <Link
                    href={route('department-head.reports.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Reports
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <ChartBarIcon className="h-5 w-5 mr-2" />
                            Service Satisfaction Ratings
                        </h2>
                        <p className="text-teal-100 text-sm mt-1">
                            Based on SQD responses (Agree/Strongly Agree) – Period: {formatDate(startDate)} to {formatDate(endDate)}
                        </p>
                    </div>

                    <div className="p-6">
                        {/* Overall Rating */}
                        <div className="mb-8 p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border border-teal-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-teal-800">Overall Satisfaction Rating</h3>
                                    <p className="text-sm text-teal-600">Across all services</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-bold text-teal-700">
                                        {overallRating !== null ? `${overallRating}%` : 'N/A'}
                                    </span>
                                    <p className="text-xs text-teal-500 mt-1">
                                        Based on {serviceRatings.reduce((acc, s) => acc + s.valid, 0)} valid responses
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Internal Services */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-emerald-600" />
                                Internal Services
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>

                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {internal.length > 0 ? internal.map((s, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {s.rating !== null ? `${s.rating}%` : 'No data'}
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {s.positive} / {s.valid}
                                                </td> */}
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No internal services</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* External Services */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-purple-600" />
                                External Services
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>

                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {external.length > 0 ? external.map((s, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {s.rating !== null ? `${s.rating}%` : 'No data'}
                                                </td>

                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No external services</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-6 text-xs text-gray-400">
                            * Rating = (Agree + Strongly Agree) ÷ (Total valid responses excluding N/A) × 100
                        </div>
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
