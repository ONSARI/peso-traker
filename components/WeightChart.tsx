
import React from 'react';
import type { WeightEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeightChartProps {
    data: WeightEntry[];
}

export const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
    if (data.length < 2) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] text-text-secondary">
                <p>Enter at least two weight entries to see your progress chart.</p>
            </div>
        );
    }
    
    const formattedData = data.map(entry => ({
        ...entry,
        // Format date for display on X-axis
        formattedDate: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    // Find min and max weight for Y-axis domain
    const weights = data.map(d => d.weight);
    const yDomainMin = Math.floor(Math.min(...weights) - 2);
    const yDomainMax = Math.ceil(Math.max(...weights) + 2);

    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <LineChart
                    data={formattedData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="formattedDate" tick={{ fill: '#64748b' }} />
                    <YAxis domain={[yDomainMin, yDomainMax]} tick={{ fill: '#64748b' }} unit=" kg"/>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                        }}
                        labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                        formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Weight']}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#14b8a6" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4, fill: '#14b8a6' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
