import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserProfile, WeightEntry, MeasurementEntry } from '../types';
import { AureoIndexCalculator, AureoInput } from '../AureoIndexCalculator';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface GoldenRatioCardProps {
    profile: UserProfile;
    weightEntries: WeightEntry[];
    measurementEntries: MeasurementEntry[];
    theme: 'light' | 'dark';
}

export const GoldenRatioCard: React.FC<GoldenRatioCardProps> = ({ profile, weightEntries, measurementEntries, theme }) => {
    const { t } = useTranslation();
    const [gender, setGender] = useState<'H' | 'M'>('H');

    const latestData = useMemo(() => {
        if (weightEntries.length === 0 || measurementEntries.length === 0) {
            return null;
        }
        // Use the most recent entry by date
        const latestWeight = [...weightEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        const latestMeasurement = [...measurementEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        return { latestWeight, latestMeasurement };
    }, [weightEntries, measurementEntries]);

    const aureoData = useMemo(() => {
        if (!latestData || !profile.dob || !profile.height) {
            return { error: t('goldenRatioCard.noData') };
        }

        const { latestWeight, latestMeasurement } = latestData;
        const { waist, shoulders } = latestMeasurement;
        
        if (!waist || !shoulders) {
            return { error: t('goldenRatioCard.noMeasurements') };
        }
        
        const birthDate = new Date(profile.dob);
        const age = new Date(Date.now() - birthDate.getTime()).getUTCFullYear() - 1970;

        const input: AureoInput = {
            gender,
            age,
            heightCm: profile.height,
            weightKg: latestWeight.weight,
            waistCm: waist,
            shoulderCm: shoulders,
            chestCm: latestMeasurement.chest || waist * 1.2,
            bicepsCm: latestMeasurement.bicep || waist * 0.4,
            thighCm: latestMeasurement.thigh || waist * 0.6,
            calfCm: latestMeasurement.calves || waist * 0.4,
            hipCm: latestMeasurement.hips || waist * 1.1,
        };

        const score = AureoIndexCalculator.calculate(input);
        const rankTitle = AureoIndexCalculator.getRankTitle(score, gender);
        const rankColor = AureoIndexCalculator.getRankColor(score);
        const percentage = Math.max(0, Math.min(100, (score / 1.618) * 100));

        return { score, rankTitle, rankColor, percentage };

    }, [latestData, profile, gender, t]);

    const renderContent = () => {
        if (!aureoData) {
             return <div className="flex items-center justify-center h-48"><p className="text-center text-text-secondary dark:text-gray-400 p-4">{t('goldenRatioCard.noData')}</p></div>;
        }
        if ('error' in aureoData) {
            return <div className="flex items-center justify-center h-48"><p className="text-center text-text-secondary dark:text-gray-400 p-4">{aureoData.error}</p></div>;
        }

        const { score, rankTitle, rankColor, percentage } = aureoData;
        
        const pieData = [
            { name: 'Progress', value: percentage },
            { name: 'Remaining', value: 100 - percentage },
        ];

        return (
            <div className="flex flex-col items-center">
                <div className="w-48 h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                startAngle={90}
                                endAngle={450}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell fill={rankColor} />
                                <Cell fill={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-bold" style={{ color: rankColor }}>{score.toFixed(3)}</span>
                        <span className="text-sm text-text-secondary dark:text-gray-400">{t('goldenRatioCard.index')}</span>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-text-secondary dark:text-gray-400">{t('goldenRatioCard.rank')}</p>
                    <p className="text-2xl font-bold" style={{ color: rankColor }}>{rankTitle}</p>
                </div>
            </div>
        );
    };

    return (
         <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">{t('goldenRatioCard.title')}</h2>
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 p-0.5">
                    <button onClick={() => setGender('H')} className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${gender === 'H' ? 'bg-primary text-white' : 'bg-transparent text-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{t('goldenRatioCard.male')}</button>
                    <button onClick={() => setGender('M')} className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${gender === 'M' ? 'bg-primary text-white' : 'bg-transparent text-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{t('goldenRatioCard.female')}</button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};