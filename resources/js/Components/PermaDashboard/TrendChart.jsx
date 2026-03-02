import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrendChart({ data }) {
    return (
        <div>
            <p className="text-sm text-gray-600 mb-2">
                Trends in PERMA domains over time. Use this to track changes after interventions or identify seasonal patterns.
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[1, 5]} /> {/* Adjusted to 1–5 scale */}
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="positive_emotion" stroke="#8884d8" name="Positive Emotion" />
                    <Line type="monotone" dataKey="engagement" stroke="#82ca9d" name="Engagement" />
                    <Line type="monotone" dataKey="relationships" stroke="#ffc658" name="Relationships" />
                    <Line type="monotone" dataKey="meaning" stroke="#ff7300" name="Meaning" />
                    <Line type="monotone" dataKey="accomplishment" stroke="#d884d8" name="Accomplishment" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}