import React, { useMemo, useState } from 'react';
import type { MeasurementEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface MeasurementChartProps {
    data: MeasurementEntry[];
    measurementUnit: 'cm' | 'in';
    theme: 'light' | 'dark';
}

type MeasurableField = 'waist' | 'hips' | 'chest' | 'bicep' | 'thigh' | 'shoulders' | 'calves';

export const MeasurementChart: React.FC<MeasurementChartProps> = ({ data, measurementUnit, theme }) => {
    const { t, i18n } = useTranslation();
    const [activeChart, setActiveChart] = useState<MeasurableField>('waist');

    const chartData = useMemo(() => {
        const filteredData = data
            .map(entry => ({
                date: entry.date,
                value: entry[activeChart]
            }))
            .filter(item => item.value !== null && item.value !== undefined && item.value > 0);
            
        if (measurementUnit === 'in') {
            return filteredData.map(entry => ({ ...entry, value: entry.value! / 2.54 }));
        }
        return filteredData;
    }, [data, measurementUnit, activeChart]);

    const renderNoDataMessage = () => (
        <div className="flex items-center justify-center h-full min-h-[300px] text-text-secondary dark:text-gray-400">
            <p>{t('charts.noDataMeasurements')}</p>
        </div>
    );

    const textColor = theme === 'dark' ? '#9ca3af' : '#64748b';
    const gridColor = theme === 'dark' ? '#374151' : '#e0e0e0';
    const tooltipBg = theme === 'dark' ? '#1f2937' : '#ffffff';
    const tooltipBorder = theme === 'dark' ? '#4b5563' : '#e2e8f0';
    const tooltipLabelColor = theme === 'dark' ? '#f3f4f6' : '#1e293b';
    
    const colors: Record<MeasurableField, string> = {
        waist: '#8884d8',
        hips: '#82ca9d',
        chest: '#ffc658',
        bicep: '#ff8042',
        thigh: '#0088FE',
        shoulders: '#00C49F',
        calves: '#FFBB28',
    };
    const chartColor = colors[activeChart];
    const chartName = t(`charts.${activeChart}`);
    const yAxisLabel = `${chartName} (${measurementUnit})`;
    const fields: MeasurableField[] = ['waist', 'hips', 'chest', 'bicep', 'thigh', 'shoulders', 'calves'];

    return (
        <>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">{t('charts.measurementTrend')}</h2>
             <div className="flex flex-wrap justify-center rounded-lg border border-gray-300 dark:border-gray-600 p-0.5 gap-1">
                {fields.map(field => (
                     <button 
                        key={field}
                        onClick={() => setActiveChart(field)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${activeChart === field ? 'bg-primary text-white' : 'bg-transparent text-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {t(`charts.${field}`)}
                    </button>
                ))}
            </div>
        </div>
        {chartData.length < 2 ? renderNoDataMessage() : (
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fill: textColor }}
                            tickFormatter={(dateStr) => new Date(`${dateStr}T00:00:00`).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })}
                        />
                        <YAxis 
                            tick={{ fill: textColor }}
                            unit={` ${measurementUnit}`}
                            domain={['dataMin - 2', 'dataMax + 2']}
                            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: textColor }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '0.5rem' }}
                            labelStyle={{ color: tooltipLabelColor, fontWeight: 'bold' }}
                            formatter={(value: number) => [`${value.toFixed(1)} ${measurementUnit}`, chartName]}
                            labelFormatter={(label: string) => {
                                if (!label) return '';
                                return new Date(`${label}T00:00:00`).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'});
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="value" name={chartName} stroke={chartColor} strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4, fill: chartColor }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )}
        </>
    );
};