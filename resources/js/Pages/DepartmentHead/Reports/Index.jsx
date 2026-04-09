import { Head, Link } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import {
    DocumentTextIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ChartBarIcon,
    InformationCircleIcon,
    GlobeAltIcon,
    UsersIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function ReportsIndex({ totalClientsSurveyed, totalTransactions }) {
    const reportCategories = [
        {
            name: 'Service Summary',
            description: 'View survey responses and transactions grouped by internal and external services.',
            icon: BuildingOfficeIcon,
            route: route('department-head.reports.service-summary'),
            gradient: 'from-emerald-500 to-teal-600',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            name: 'Age Distribution',
            description: 'Breakdown of respondents by age group.',
            icon: UserGroupIcon,
            route: route('department-head.reports.age-distribution'),
            gradient: 'from-blue-500 to-cyan-600',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            name: 'Client Type Distribution',
            description: 'Distribution of respondents by client type (citizen, business, government).',
            icon: ChartBarIcon,
            route: route('department-head.reports.client-type-distribution'),
            gradient: 'from-amber-500 to-orange-600',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
        },
        {
            name: 'CC & SQD Summary',
            description: 'Summary of Citizen\'s Charter awareness and Service Quality Dimension responses.',
            icon: DocumentTextIcon,
            route: route('department-head.reports.cc-sqd-summary'),
            gradient: 'from-purple-500 to-indigo-600',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            name: 'Region Distribution',
            description: 'Geographic distribution of respondents by region.',
            icon: GlobeAltIcon,
            route: route('department-head.reports.region-distribution'),
            gradient: 'from-green-500 to-lime-600',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            name: 'Gender Distribution',
            description: 'Breakdown of respondents by gender.',
            icon: UsersIcon,
            route: route('department-head.reports.gender-distribution'),
            gradient: 'from-pink-500 to-rose-600',
            iconBg: 'bg-pink-100',
            iconColor: 'text-pink-600',
        },
        {
            name: 'Summary of Result',
            description: 'Overall CC metrics, response rate, and satisfaction score with insights.',
            icon: DocumentTextIcon,
            route: route('department-head.reports.summary-of-result'),
            gradient: 'from-indigo-500 to-blue-600',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
        },
        {
            name: 'Service Ratings',
            description: 'Satisfaction ratings for each service based on SQD responses.',
            icon: ChartBarIcon,
            route: route('department-head.reports.service-ratings'),
            gradient: 'from-teal-500 to-cyan-600',
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-600',
        },
    ];

    return (
        <DepartmentHeadLayout title="Reports">
            <Head title="Reports" />

            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                    <p className="mt-2 text-gray-600">
                        Comprehensive analytics and insights across all departments
                    </p>
                </div>

                {/* Elegant Info Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-blue-900 font-medium">
                                All reports shown here are aggregated across all departments.
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                                Want to see details per department?{' '}
                                <Link
                                    href={route('department-head.departments.index')}
                                    className="font-semibold underline text-blue-700 hover:text-blue-800 transition-colors"
                                >
                                    View all departments →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Clients Surveyed
                                    </p>
                                    <p className="mt-2 text-4xl font-bold text-gray-900">
                                        {totalClientsSurveyed}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Completed survey forms
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                        <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Total Transactions
                                    </p>
                                    <p className="mt-2 text-4xl font-bold text-gray-900">
                                        {totalTransactions}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        All recorded transactions
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reports Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Reports</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {reportCategories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.route}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 flex flex-col"
                            >
                                <div className={`h-2 bg-gradient-to-r ${category.gradient}`}></div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`h-12 w-12 rounded-xl ${category.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <category.icon className={`h-6 w-6 ${category.iconColor}`} />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 flex-1">
                                        {category.description}
                                    </p>
                                    <div className="inline-flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                        View Report
                                        <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
