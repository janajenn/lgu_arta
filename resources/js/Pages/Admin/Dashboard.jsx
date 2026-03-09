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

    // Wave animation delays for top cards
    const cardDelays = ['0s', '0.2s', '0.4s', '0.6s'];

    // Helper to get color class based on response rate
    const getRateColorClass = (rate) => {
        if (rate >= 70) return 'bg-green-100 text-green-700 border-green-200';
        if (rate >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <AdminLayout title="">
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome back, Admin
                        </h1>
                        <p className="text-gray-500 mt-1">Here's what's happening across all departments</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                            Last updated: {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Overall stats cards with wave animation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { icon: BuildingOfficeIcon, bg: 'indigo', label: 'Total Departments', value: overall.total_departments, suffix: '' },
                        { icon: DocumentTextIcon, bg: 'blue', label: 'Total Transactions', value: overall.total_transactions, suffix: '' },
                        { icon: UserGroupIcon, bg: 'purple', label: 'Total Responses', value: overall.total_responses, suffix: '' },
                        { icon: ChartBarIcon, bg: 'green', label: 'Response Rate', value: overall.overall_response_rate, suffix: '%' },
                    ].map((card, index) => {
                        const Icon = card.icon;
                        const bgColor = {
                            indigo: 'bg-indigo-50',
                            blue: 'bg-blue-50',
                            purple: 'bg-purple-50',
                            green: 'bg-green-50',
                        }[card.bg];
                        const textColor = {
                            indigo: 'text-indigo-600',
                            blue: 'text-blue-600',
                            purple: 'text-purple-600',
                            green: 'text-green-600',
                        }[card.bg];
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-wave ${
                                    mounted ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{ animationDelay: cardDelays[index] }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 ${bgColor} rounded-lg`}>
                                        <Icon className={`h-6 w-6 ${textColor}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{card.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {card.value}{card.suffix}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Department Cards Grid */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <BuildingOfficeIcon className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-lg font-semibold text-gray-900">All Departments</h2>
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
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
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all w-full sm:w-64"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {filteredDepartments.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredDepartments.map(dept => {
                                    const rateColor = getRateColorClass(dept.response_rate);
                                    return (
                                        <div
                                            key={dept.id}
                                            className="group bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                        >
                                            {/* Colored top bar based on response rate */}
                                            <div className={`h-2 ${rateColor.split(' ')[0]}`}></div>

                                            <div className="p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-lg">
                                                            {dept.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                                                            <p className="text-xs text-gray-500">{dept.services_count} services</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${rateColor}`}>
                                                        {dept.response_rate}%
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                                                        <div className="font-bold text-gray-900">{dept.total_transactions}</div>
                                                        <div className="text-xs text-gray-500">Transactions</div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                                                        <div className="font-bold text-gray-900">{dept.total_responses}</div>
                                                        <div className="text-xs text-gray-500">Responses</div>
                                                    </div>
                                                </div>

                                                {/* Minimum required and status */}
                                                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                                                    <div>
                                                        <span className="text-xs text-gray-500">Min required:</span>
                                                        <span className="ml-1 text-sm font-medium text-gray-900">
                                                            {dept.min_required}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {dept.status === 'below' ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                                                Below Minimum
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                Requirement Met
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-500">
                                No departments match your search
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Wave animation keyframes */}
            <style jsx>{`
                @keyframes wave {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-wave {
                    animation: wave 3s ease-in-out infinite;
                }
            `}</style>
        </AdminLayout>
    );
}
