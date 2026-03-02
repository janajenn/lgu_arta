import React from 'react';
import { TrophyIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DepartmentRankings({ goodDepartments, needsAttentionDepartments }) {
    const getScoreColor = (score) => {
        if (score >= 4.0) return 'text-green-600';
        if (score >= 3.5) return 'text-emerald-600';
        if (score >= 3.0) return 'text-yellow-600';
        if (score >= 2.0) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performing Well */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <TrophyIcon className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Performing Well (≥ 3.0)</h3>
                </div>
                {goodDepartments?.length > 0 ? (
                    <div className="space-y-3">
                        {goodDepartments.map((dept, index) => (
                            <div key={dept.id} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                                <span className={`text-sm font-bold ${getScoreColor(dept.overall)}`}>
                                    {dept.overall}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No departments in this category.</p>
                )}
            </div>

            {/* Needs Attention */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Needs Attention (&lt; 3.0)</h3>
                </div>
                {needsAttentionDepartments?.length > 0 ? (
                    <div className="space-y-3">
                        {needsAttentionDepartments.map((dept, index) => (
                            <div key={dept.id} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                                <span className={`text-sm font-bold ${getScoreColor(dept.overall)}`}>
                                    {dept.overall}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No departments in this category.</p>
                )}
            </div>
        </div>
    );
}