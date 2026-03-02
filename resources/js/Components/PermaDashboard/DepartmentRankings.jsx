// resources/js/Components/PermaDashboard/DepartmentRankings.jsx
import React from 'react';
import { TrophyIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DepartmentRankings({ topDepartments, bottomDepartments }) {
    const getScoreColor = (score) => {
        if (score >= 4.0) return 'text-green-600';
        if (score >= 3.5) return 'text-emerald-600';
        if (score >= 3.0) return 'text-yellow-600';
        if (score >= 2.0) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Departments */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <TrophyIcon className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Highest Performing Departments</h3>
                </div>
                {topDepartments?.length > 0 ? (
                    <div className="space-y-3">
                        {topDepartments.map((dept, index) => (
                            <div key={dept.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                                    <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                                </div>
                                <span className={`text-sm font-bold ${getScoreColor(dept.overall)}`}>
                                    {dept.overall}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No department data available.</p>
                )}
            </div>

            {/* Bottom Departments */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Departments Needing Attention</h3>
                </div>
                {bottomDepartments?.length > 0 ? (
                    <div className="space-y-3">
                        {bottomDepartments.map((dept, index) => (
                            <div key={dept.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                                    <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                                </div>
                                <span className={`text-sm font-bold ${getScoreColor(dept.overall)}`}>
                                    {dept.overall}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No department data available.</p>
                )}
            </div>
        </div>
    );
}