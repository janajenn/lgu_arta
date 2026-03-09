import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function PermaRadarChart({ data }) {
    return (
        <div>
            <p className="text-sm text-gray-600 mb-2">
                Radar chart showing the balance across all five PERMA domains. A larger, more balanced shape indicates overall wellbeing.
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius="80%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[1, 5]} /> {/* Changed to 1–5 scale */}
                    <Radar name="Current" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}   