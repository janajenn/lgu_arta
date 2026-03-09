import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Shared/Layouts/AdminLayout';
import {
    BuildingOfficeIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ChartBarIcon,
    MagnifyingGlassIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function Dashboard({ departments, overall }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Animation delays for top cards
    const cardDelays = ['0s', '0.1s', '0.2s', '0.3s'];

    return (
        <AdminLayout title="">
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Welcome Section - Enhanced with subtle gradient and better typography */}
                <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm">
                            Overview of all departments and survey performance
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium shadow-sm">
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Overall stats cards – Modernized with indigo accents, better shadows, and subtle hover scale */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        {
                            icon: BuildingOfficeIcon,
                            label: 'Total Departments',
                            value: overall.total_departments,
                            suffix: '',
                            description: 'Active departments',
                            color: 'indigo'
                        },
                        {
                            icon: DocumentTextIcon,
                            label: 'Total Transactions',
                            value: overall.total_transactions,
                            suffix: '',
                            description: 'All service transactions',
                            color: 'blue'
                        },
                        {
                            icon: UserGroupIcon,
                            label: 'Total Responses',
                            value: overall.total_responses,
                            suffix: '',
                            description: 'Completed surveys',
                            color: 'purple'
                        },
                        {
                            icon: ChartBarIcon,
                            label: 'Response Rate',
                            value: overall.overall_response_rate,
                            suffix: '%',
                            description: 'Across all departments',
                            color: 'cyan'
                        },
                    ].map((card, index) => {
                        const Icon = card.icon;
                        const bgColor = `bg-${card.color}-50`;
                        const textColor = `text-${card.color}-600`;
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:scale-[1.02] ${
                                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                                style={{ transitionDelay: cardDelays[index] }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 ${bgColor} rounded-lg`}>
                                        <Icon className={`h-6 w-6 ${textColor}`} />
                                    </div>
                                    <span className={`text-xs font-medium uppercase tracking-wider text-gray-500 bg-gray-50 px-3 py-1 rounded-full`}>
                                        {card.label}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {card.value.toLocaleString()}{card.suffix}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Department Cards Grid - Enhanced with better borders, hover effects, and green/red progress indicators */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <BuildingOfficeIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">Departments</h2>
                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                                    {filteredDepartments.length} / {departments.length}
                                </span>
                            </div>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search departments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all w-full sm:w-72 bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {filteredDepartments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredDepartments.map(dept => {
                                    const progress = dept.min_required > 0
                                        ? Math.min((dept.total_responses / dept.min_required) * 100, 100)
                                        : 0;
                                    const progressColor = progress >= 100 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500';

                                    return (
                                        <div
                                            key={dept.id}
                                            className="group bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-indigo-200"
                                        >
                                            <div className="p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm">
                                                            {dept.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 text-base">{dept.name}</h3>
                                                            <p className="text-xs text-gray-500 flex items-center mt-0.5">
                                                                <ClockIcon className="h-3 w-3 mr-1" />
                                                                {dept.services_count} services
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        dept.total_responses >= dept.min_required
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {dept.total_responses >= dept.min_required ? (
                                                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                        ) : (
                                                            <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                                        )}
                                                        {dept.total_responses >= dept.min_required ? 'Met' : 'Below Min'}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100 shadow-inner">
                                                        <div className="text-xl font-bold text-gray-900">{dept.total_transactions}</div>
                                                        <div className="text-xs text-gray-500">Transactions</div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100 shadow-inner">
                                                        <div className="text-xl font-bold text-gray-900">{dept.total_responses}</div>
                                                        <div className="text-xs text-gray-500">Responses</div>
                                                    </div>
                                                </div>

                                                {/* Progress towards minimum - Enhanced with color gradients */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-500">Min required: {dept.min_required}</span>
                                                        <span className="font-medium text-gray-700">{Math.round(progress)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-500 ${progressColor}`}
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                                                    <span className="text-gray-500">Response rate: {dept.response_rate}%</span>
                                                    {dept.total_responses >= dept.min_required ? (
                                                        <span className="flex items-center text-green-600">
                                                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                            Target met
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-red-600">
                                                            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                                            {dept.min_required - dept.total_responses} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-16 text-center text-gray-500">
                                <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-lg font-medium text-gray-900">No departments match your search</p>
                                <p className="text-sm mt-1 text-gray-500">Try adjusting your search term</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick insights – Modernized with color accents and hover effects */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md flex items-center space-x-4 hover:shadow-lg transition-all duration-300 hover:border-green-200">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Departments meeting target</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {departments.filter(d => d.total_responses >= d.min_required).length}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md flex items-center space-x-4 hover:shadow-lg transition-all duration-300 hover:border-red-200">
                        <div className="p-3 bg-red-50 rounded-lg">
                            <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Below minimum</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {departments.filter(d => d.total_responses < d.min_required).length}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md flex items-center space-x-4 hover:shadow-lg transition-all duration-300 hover:border-indigo-200">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <ArrowTrendingUpIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Average response rate</p>
                            <p className="text-2xl font-bold text-gray-900">{overall.overall_response_rate}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced animations */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
            `}</style>
        </AdminLayout>
    );
}
