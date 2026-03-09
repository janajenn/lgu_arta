import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Shared/Layouts/AdminLayout';
import {
    DocumentTextIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ChartBarIcon,
    InformationCircleIcon,
    GlobeAltIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

export default function ReportsIndex({ totalClientsSurveyed, totalTransactions }) {
    const reportCategories = [
        {
            name: 'Service Summary',
            description: 'View survey responses and transactions grouped by internal and external services.',
            icon: BuildingOfficeIcon,
            route: route('admin.reports.service-summary'),
            color: 'emerald',
        },
        {
            name: 'Age Distribution',
            description: 'Breakdown of respondents by age group.',
            icon: UserGroupIcon,
            route: route('admin.reports.age-distribution'),
            color: 'blue',
        },
        {
            name: 'Client Type Distribution',
            description: 'Distribution of respondents by client type (citizen, business, government).',
            icon: ChartBarIcon,
            route: route('admin.reports.client-type-distribution'),
            color: 'amber',
        },
        {
            name: 'CC & SQD Summary',
            description: 'Summary of Citizen\'s Charter awareness and Service Quality Dimension responses.',
            icon: DocumentTextIcon,
            route: route('admin.reports.cc-sqd-summary'),
            color: 'purple',
        },

        {
            name: 'Region Distribution',
            description: 'Geographic distribution of respondents by region.',
            icon: GlobeAltIcon,
            route: route('admin.reports.region-distribution'),
            color: 'green',
        },
        {
            name: 'Gender Distribution',
            description: 'Breakdown of respondents by gender.',
            icon: UsersIcon,
            route: route('admin.reports.gender-distribution'),
            color: 'pink',
        }
    ];

    return (
        <AdminLayout title="Reports">
            <Head title="Reports" />

            <div className="space-y-8">
                {/* Info note */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm text-blue-700">
                                All reports shown here are aggregated across all departments.{' '}
                                <Link
                                    href={route('department-head.departments.index')}
                                    className="font-medium underline text-blue-700 hover:text-blue-600"
                                >
                                    View all departments →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <DocumentTextIcon className="h-10 w-10 text-blue-100" />
                            <span className="text-blue-100 text-sm font-medium">Survey</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Clients Surveyed</h3>
                        <p className="text-3xl font-bold mb-1">{totalClientsSurveyed}</p>
                        <p className="text-blue-100 text-sm">Completed survey forms</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <BuildingOfficeIcon className="h-10 w-10 text-purple-100" />
                            <span className="text-purple-100 text-sm font-medium">Transactions</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
                        <p className="text-3xl font-bold mb-1">{totalTransactions}</p>
                        <p className="text-purple-100 text-sm">All recorded transactions</p>
                    </div>
                </div>

                {/* Report Categories */}
                <h2 className="text-2xl font-bold text-gray-800">Available Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportCategories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.route}
                            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                        >
                            <div className={`p-6 bg-gradient-to-r from-${category.color}-500 to-${category.color}-600`}>
                                <category.icon className="h-12 w-12 text-white" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                                <p className="text-gray-600">{category.description}</p>
                                <div className={`mt-4 inline-flex items-center text-${category.color}-600 font-medium group-hover:underline`}>
                                    View Report
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
