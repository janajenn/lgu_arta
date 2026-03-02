// resources/js/Components/PermaDashboard/SummaryCards.jsx
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'; // install heroicons if not present

export default function SummaryCards({ stats }) {
    const { totalResponses, overallAvg, highestDomain, lowestDomain, previousOverallAvg } = stats;
    const trend = overallAvg - (previousOverallAvg || 0);
    const TrendIcon = trend >= 0 ? ArrowUpIcon : ArrowDownIcon;
    const trendColor = trend >= 0 ? 'text-green-600' : 'text-red-600';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
                <div className="rounded-full bg-indigo-100 p-3 mr-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Overall PERMA</p>
                    <p className="text-2xl font-bold text-gray-900">{overallAvg}</p>
                    <p className="text-xs flex items-center">
                        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                        <span className={trendColor}>{Math.abs(trend).toFixed(2)} vs last period</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Responses</p>
                    <p className="text-2xl font-bold text-gray-900">{totalResponses}</p>
                </div>
            </div>

            {highestDomain && (
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
                    <div className="rounded-full bg-emerald-100 p-3 mr-4">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Highest</p>
                        <p className="text-lg font-semibold text-gray-900">{highestDomain.name}</p>
                        <p className="text-sm text-gray-600">{highestDomain.score}</p>
                    </div>
                </div>
            )}

            {lowestDomain && (
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
                    <div className="rounded-full bg-orange-100 p-3 mr-4">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Lowest</p>
                        <p className="text-lg font-semibold text-gray-900">{lowestDomain.name}</p>
                        <p className="text-sm text-gray-600">{lowestDomain.score}</p>
                    </div>
                </div>
            )}
        </div>
    );
}