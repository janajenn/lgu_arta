import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
    'Very High': '#10b981',
    'High': '#34d399',
    'Moderate': '#fbbf24',
    'Low': '#f97316',
    'Very Low': '#ef4444',
};

export default function InterpretationDonut({ data }) {
    const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
    return (
        <div>
            <p className="text-sm text-gray-600 mb-2">
                Distribution of overall PERMA scores across wellbeing levels. Helps identify the proportion of employees at risk.
            </p>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#9ca3af'} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}