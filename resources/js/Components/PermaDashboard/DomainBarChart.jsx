import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const getBarColor = (score) => {
    if (score >= 4.0) return '#10b981'; // Very High
    if (score >= 3.5) return '#34d399'; // High
    if (score >= 3.0) return '#fbbf24'; // Moderate
    if (score >= 2.0) return '#f97316'; // Low
    return '#ef4444'; // Very Low
};

export default function DomainBarChart({ data }) {
    return (
        <div>
            <p className="text-sm text-gray-600 mb-2">
                Average scores for each PERMA domain. Higher scores (green) indicate flourishing; lower scores (red/orange) suggest areas needing attention.
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[1, 5]} />
                    <YAxis dataKey="domain" type="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">
                Interpretation: Very High (4.0–5.0), High (3.5–3.99), Moderate (3.0–3.49), Low (2.0–2.99), Very Low (1.0–1.99)
            </p>
        </div>
    );
}