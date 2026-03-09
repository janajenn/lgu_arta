import { Head, Link } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import { BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import InsightsCard from '../Reports/InsightsCard';

export default function ServiceSummary({ servicesByCategory, insights }) {
    return (
        <DepartmentHeadLayout title="Service Summary">
            <Head title="Service Summary" />

            <div className="space-y-6">

                <Link
                    href={route('department-head.reports.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Reports
                </Link>

                 <InsightsCard insights={insights} />

                {/* Internal Services Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                            Internal Services
                        </h2>
                    </div>
                    <div className="p-6">
                        {servicesByCategory.internal.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Survey Responses</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Transactions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {servicesByCategory.internal.map((service, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.responses}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.total_transactions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">No internal services found.</p>
                        )}
                    </div>
                </div>

                {/* External Services Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                            External Services
                        </h2>
                    </div>
                    <div className="p-6">
                        {servicesByCategory.external.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Survey Responses</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Transactions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {servicesByCategory.external.map((service, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.responses}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.total_transactions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">No external services found.</p>
                        )}
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
