import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface BmiChartData {
    date: string;
    bmi: number;
}

interface BMIChartProps {
    data: BmiChartData[];
    theme: 'light' | 'dark';
}

export const BMIChart: React.FC<BMIChartProps> = ({ data, theme }) => {
    const { t, i18n } = useTranslation();

    if (data.length < 2) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] text-text-secondary dark:text-gray-400">
                <p>{t('charts.noDataBmi')}</p>
            </div>
        );
    }
    
    const bmis = data.map(d => d.bmi);
    const yDomainMin = Math.floor(Math.min(...bmis) - 1);
    const yDomainMax = Math.ceil(Math.max(...bmis) + 1);

    const textColor = theme === 'dark' ? '#9ca3af' : '#64748b';
    const gridColor = theme === 'dark' ? '#374151' : '#e0e0e0';
    const tooltipBg = theme === 'dark' ? '#1f2937' : '#ffffff';
    const tooltipBorder = theme === 'dark' ? '#4b5563' : '#e2e8f0';
    const tooltipLabelColor = theme === 'dark' ? '#f3f4f6' : '#1e293b';

    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: textColor }}
                        tickFormatter={(dateStr) => new Date(`${dateStr}T00:00:00`).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                        domain={[yDomainMin, yDomainMax]} 
                        tick={{ fill: textColor }}
                        label={{ value: t('charts.yAxisLabelBmi'), angle: -90, position: 'insideLeft', fill: textColor }}
                     />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: '0.5rem',
                        }}
                        labelStyle={{ color: tooltipLabelColor, fontWeight: 'bold' }}
                        formatter={(value: number) => [value.toFixed(1), null]}
                        labelFormatter={(label: string) => {
                             if (!label) return '';
                             return new Date(`${label}T00:00:00`).toLocaleDateString(i18n.language, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                            });
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="bmi" name={t('charts.bmiLabel')} stroke="#64748b" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4, fill: '#64748b' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};