import { Head } from '@inertiajs/react';
import DepartmentHeadLayout from '../../Shared/Layouts/DepartmentHeadLayout';
import { BuildingOfficeIcon, DocumentTextIcon, UserGroupIcon, ChartBarIcon, InformationCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function TrackDepartments({ departments, overall }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getRateColorClass = (rate) => {
        if (rate >= 70) return 'bg-green-100 text-green-700 border-green-200';
        if (rate >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-red-100 text-red-700 border-red-200';
    };

    // Calculate departments needing attention
    const departmentsNeedingAttention = departments.filter(d => d.response_rate < 40).length;
    const departmentsModerate = departments.filter(d => d.response_rate >= 40 && d.response_rate < 70).length;
    const departmentsGood = departments.filter(d => d.response_rate >= 70).length;

    return (
        <DepartmentHeadLayout title="Track Departments">
            <Head title="Track Departments" />

            <div className="space-y-6">
                {/* Modern Info Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl p-6 shadow-md border border-indigo-100">
                    {/* Decorative background elements */}
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
                                transaction volume, response count, and calculated response rate. Use this data to
                                identify departments that may need encouragement to improve their survey collection.
                            </p>

                            {/* Quick stats row */}
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                    <span className="text-sm text-gray-700"><span className="font-semibold">{departmentsGood}</span> good (≥70%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                    <span className="text-sm text-gray-700"><span className="font-semibold">{departmentsModerate}</span> moderate (40‑69%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                    <span className="text-sm text-gray-700"><span className="font-semibold">{departmentsNeedingAttention}</span> needs attention (&lt;40%)</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-3 border-t border-indigo-100 pt-3">
                                <span className="font-medium">Response rate formula:</span> (Responses / Transactions) × 100.
                                Low rates may indicate that surveys are not being offered or completed.
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
                                const rateColor = getRateColorClass(dept.response_rate);
                                return (
                                    <div
                                        key={dept.id}
                                        className="group bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
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
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-gray-50 rounded-lg p-2 text-center">
                                                    <div className="font-bold text-gray-900">{dept.total_transactions}</div>
                                                    <div className="text-xs text-gray-500">Transactions</div>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-2 text-center">
                                                    <div className="font-bold text-gray-900">{dept.total_responses}</div>
                                                    <div className="text-xs text-gray-500">Responses</div>
                                                </div>
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
