import { Head } from '@inertiajs/react';
import DepartmentHeadLayout from '../../Shared/Layouts/DepartmentHeadLayout';
import {
    BuildingOfficeIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ChartBarIcon,
    InformationCircleIcon,
    LightBulbIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function TrackDepartments({ departments, overall }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Count departments by status
    const departmentsMet = departments.filter(d => d.status === 'met').length;
    const departmentsBelow = departments.filter(d => d.status === 'below').length;

    return (
        <DepartmentHeadLayout title="Track Departments">
            <Head title="Track Departments" />

            <div className="space-y-6">
                {/* Modern Info Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl p-6 shadow-md border border-indigo-100">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-200">
                            <LightBulbIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Department Monitoring Dashboard</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Track survey activity across all departments. The cards below show each department's
                                transaction volume, responses, minimum required sample, and current status.
                            </p>

                            {/* Quick stats row */}
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                    <span className="text-sm text-gray-700">
                                        <span className="font-semibold">{departmentsMet}</span> met minimum
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                    <span className="text-sm text-gray-700">
                                        <span className="font-semibold">{departmentsBelow}</span> below minimum
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-3 border-t border-indigo-100 pt-3">
                                <span className="font-medium">Minimum required formula:</span> Cochran’s sample size with finite population correction (95% confidence, 5% margin of error).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Overall stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Departments</p>
                                <p className="text-2xl font-bold text-gray-900">{overall.total_departments}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">{overall.total_transactions}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <UserGroupIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Responses</p>
                                <p className="text-2xl font-bold text-gray-900">{overall.total_responses}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <ChartBarIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Response Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{overall.overall_response_rate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Department Cards Grid */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">All Departments</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {departments.map((dept, index) => {
                                const progress = dept.min_required > 0
                                    ? Math.min((dept.total_responses / dept.min_required) * 100, 100)
                                    : 0;

                                return (
                                    <div
                                        key={dept.id}
                                        className="group bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="h-2 bg-gray-300"></div>
                                        <div className="p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-lg">
                                                        {dept.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                                                        <p className="text-xs text-gray-500 flex items-center mt-0.5">
                                                            <ClockIcon className="h-3 w-3 mr-1" />
                                                            {dept.services_count} services
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    dept.status === 'met'
                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                        : 'bg-red-100 text-red-700 border-red-200'
                                                }`}>
                                                    {dept.status === 'met' ? (
                                                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                                    )}
                                                    {dept.status === 'met' ? 'Met' : 'Below Min'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                                <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                                                    <div className="font-bold text-gray-900">{dept.total_transactions}</div>
                                                    <div className="text-xs text-gray-500">Transactions</div>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                                                    <div className="font-bold text-gray-900">{dept.total_responses}</div>
                                                    <div className="text-xs text-gray-500">Responses</div>
                                                </div>
                                            </div>

                                            {/* Progress towards minimum */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">Min required: {dept.min_required}</span>
                                                    <span className="font-medium text-gray-700">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full transition-all duration-500 ${
                                                            progress >= 100 ? 'bg-green-500' : 'bg-amber-500'
                                                        }`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                                                <span className="text-gray-500">Response rate: {dept.response_rate}%</span>
                                                {dept.status === 'met' ? (
                                                    <span className="flex items-center text-green-600">
                                                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                        Target met
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-amber-600">
                                                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                                        {dept.min_required - dept.total_responses} more needed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
