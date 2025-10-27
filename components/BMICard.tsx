import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import type { WeightEntry, UserProfile } from '../types';
import { GoalProgressBar } from './GoalProgressBar';

interface BMICardProps {
    profile: UserProfile;
    entries: WeightEntry[];
    onProfileUpdate: (updates: Partial<UserProfile>) => void;
}

const TrendArrow: React.FC<{ value: number }> = ({ value }) => {
    if (value === 0) return null;
    const isUp = value > 0;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 inline-block ml-1 ${isUp ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
};

export const BMICard: React.FC<BMICardProps> = ({ profile, entries, onProfileUpdate }) => {
    const { t } = useTranslation();
    const [isEditingHeight, setIsEditingHeight] = useState(false);
    const [heightCm, setHeightCm] = useState(profile.height || '');
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');

    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [goalWeightInput, setGoalWeightInput] = useState('');

    const [timePeriod, setTimePeriod] = useState<'all' | '7d' | '30d' | '365d'>('all');

    const weightUnit = profile.weight_unit || 'kg';
    const heightUnit = profile.height_unit || 'cm';
    const { height } = profile;

    useEffect(() => {
        if (height && heightUnit === 'ft') {
            const totalInches = height / 2.54;
            setHeightFt(Math.floor(totalInches / 12).toString());
            setHeightIn(Math.round(totalInches % 12).toString());
        } else {
            setHeightCm(height?.toString() || '');
        }
    }, [height, heightUnit]);
    
     useEffect(() => {
        if (isEditingGoal) {
            if (profile.goal_weight) {
                const displayGoal = weightUnit === 'lbs' ? (profile.goal_weight * 2.20462).toFixed(1) : profile.goal_weight.toFixed(1);
                setGoalWeightInput(displayGoal);
            } else {
                setGoalWeightInput('');
            }
        }
    }, [isEditingGoal, profile.goal_weight, weightUnit]);


    const latestWeight = useMemo(() => {
        return entries.length > 0 ? entries[entries.length - 1].weight : null;
    }, [entries]);

    const startWeight = useMemo(() => {
        return entries.length > 0 ? entries[0].weight : null;
    }, [entries]);
    
    const getBMICategory = (bmi: number): { category: string; color: string } => {
        if (bmi < 18.5) return { category: t('bmiCard.underweight'), color: 'text-blue-500' };
        if (bmi < 25) return { category: t('bmiCard.normal'), color: 'text-green-500' };
        if (bmi < 30) return { category: t('bmiCard.overweight'), color: 'text-yellow-500' };
        if (bmi < 35) return { category: t('bmiCard.obesity1'), color: 'text-orange-500' };
        if (bmi < 40) return { category: t('bmiCard.obesity2'), color: 'text-red-500' };
        return { category: t('bmiCard.obesity3'), color: 'text-red-700' };
    };

    const calculateBMI = (weightKg: number, heightCm: number): number | null => {
        if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) return null;
        const heightInMeters = heightCm / 100;
        return weightKg / (heightInMeters * heightInMeters);
    }
    
    const currentBmi = useMemo(() => {
        if (!latestWeight || !height) return null;
        return calculateBMI(latestWeight, height);
    }, [height, latestWeight]);

    const bmiResult = useMemo(() => {
        if (currentBmi === null) return null;
        return getBMICategory(currentBmi);
    }, [currentBmi, t]);
    
    const improvementData = useMemo(() => {
        if (currentBmi === null || currentBmi < 25 || !height || !latestWeight) {
            return null;
        }

        let targetBmi: number;
        let nextCategoryKey: string;

        if (currentBmi >= 40) { // Obesity III
            targetBmi = 39.9;
            nextCategoryKey = 'bmiCard.obesity2';
        } else if (currentBmi >= 35) { // Obesity II
            targetBmi = 34.9;
            nextCategoryKey = 'bmiCard.obesity1';
        } else if (currentBmi >= 30) { // Obesity I
            targetBmi = 29.9;
            nextCategoryKey = 'bmiCard.overweight';
        } else { // Overweight
            targetBmi = 24.9;
            nextCategoryKey = 'bmiCard.normal';
        }

        const heightInMeters = height / 100;
        const targetWeight = targetBmi * (heightInMeters * heightInMeters);
        const weightToLoseKg = latestWeight - targetWeight;

        if (weightToLoseKg > 0) {
            return {
                weightToLose: weightToLoseKg,
                nextCategoryName: t(nextCategoryKey)
            };
        }

        return null;

    }, [currentBmi, height, latestWeight, t]);


     const weightToGo = useMemo(() => {
        if (!latestWeight || !profile.goal_weight) return null;
        return latestWeight - profile.goal_weight;
    }, [latestWeight, profile.goal_weight]);
    
    const progressData = useMemo(() => {
        if (entries.length < 2 || !height) {
            return { weightChange: null, bmiChangePercent: null };
        }

        const endDate = new Date(entries[entries.length - 1].date);
        let startDate = new Date(entries[0].date);

        if (timePeriod !== 'all') {
            const days = { '7d': 7, '30d': 30, '365d': 365 }[timePeriod];
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - days);
        }

        const relevantEntries = entries.filter(entry => new Date(entry.date) >= startDate);

        if (relevantEntries.length < 2) {
             return { weightChange: null, bmiChangePercent: null };
        }

        const startEntry = relevantEntries[0];
        const endEntry = relevantEntries[relevantEntries.length - 1];

        const weightChange = endEntry.weight - startEntry.weight;

        const startBmi = calculateBMI(startEntry.weight, height);
        const endBmi = calculateBMI(endEntry.weight, height);

        let bmiChangePercent: number | null = null;
        if (startBmi && endBmi && startBmi > 0) {
            bmiChangePercent = ((endBmi - startBmi) / startBmi) * 100;
        }

        return { weightChange, bmiChangePercent };
    }, [entries, height, timePeriod]);

    const handleHeightSave = () => {
        let heightInCm: number;
        if (heightUnit === 'cm') {
            heightInCm = parseFloat(String(heightCm));
        } else {
            const feet = parseFloat(heightFt) || 0;
            const inches = parseFloat(heightIn) || 0;
            heightInCm = (feet * 12 + inches) * 2.54;
        }
        
        if (!isNaN(heightInCm) && heightInCm > 0) {
            onProfileUpdate({ height: heightInCm });
            setIsEditingHeight(false);
        }
    }

    const handleGoalSave = () => {
        const goalValue = parseFloat(goalWeightInput);
        if (!isNaN(goalValue) && goalValue > 0) {
            const goalInKg = weightUnit === 'lbs' ? goalValue / 2.20462 : goalValue;
            onProfileUpdate({ goal_weight: goalInKg });
            setIsEditingGoal(false);
        }
    };
    
    const displayWeight = (weightKg: number | null) => {
        if (weightKg === null) return t('bmiCard.notAvailable');
        if (weightUnit === 'lbs') {
            return `${(weightKg * 2.20462).toFixed(1)} lbs`;
        }
        return `${weightKg.toFixed(1)} kg`;
    };

    const displayHeight = () => {
        if (!height) return t('bmiCard.notAvailable');
        if (heightUnit === 'ft') {
            const totalInches = height / 2.54;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            return `${feet}' ${inches}"`;
        }
        return `${Math.round(height)} cm`;
    };

    const formatChange = (value: number | null, unit: string, precision = 1) => {
        if (value === null) return t('bmiCard.notAvailable');
        const sign = value > 0 ? '+' : '';
        const convertedValue = (unit === 'lbs' && value) ? value * 2.20462 : value;
        return `${sign}${convertedValue.toFixed(precision)}${unit === '%' ? '%' : ` ${unit}`}`;
    };

    const getChangeColor = (value: number | null) => {
        if (value === null || value === 0) return 'text-text-secondary dark:text-gray-400';
        return value < 0 ? 'text-green-500' : 'text-red-500';
    };

    const UnitToggleButton: React.FC<{
        options: { value: string, label: string }[];
        currentValue: string;
        onChange: (value: any) => void;
    }> = ({ options, currentValue, onChange }) => (
         <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 p-0.5">
            {options.map(({ value, label }) => (
                <button 
                    key={value}
                    onClick={() => onChange(value)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${currentValue === value ? 'bg-primary text-white' : 'bg-transparent text-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                    {label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('bmiCard.title')}</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <span className="text-text-secondary dark:text-gray-400">{t('bmiCard.lastWeight')}:</span>
                    <span className="text-2xl font-bold text-primary">{displayWeight(latestWeight)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="text-text-secondary dark:text-gray-400">{t('bmiCard.height')}:</span>
                    {isEditingHeight ? (
                         <div className="flex items-center gap-2">
                            {heightUnit === 'cm' ? (
                                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white" autoFocus />
                            ) : (
                                <>
                                <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="w-16 px-2 py-1 border border-gray-300 rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder={t('bmiCard.units.ft')} autoFocus />
                                <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="w-16 px-2 py-1 border border-gray-300 rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder={t('bmiCard.units.in')} />
                                </>
                            )}
                            <button onClick={handleHeightSave} className="text-green-500 hover:text-green-700">✓</button>
                            <button onClick={() => setIsEditingHeight(false)} className="text-red-500 hover:text-red-700">×</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                             <span className="text-lg font-semibold text-text-primary dark:text-gray-200">{displayHeight()}</span>
                            <button onClick={() => setIsEditingHeight(true)} className="text-text-secondary dark:text-gray-400 hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <hr className="dark:border-gray-700"/>
                <div className="text-center pt-2">
                    <span className="text-text-secondary dark:text-gray-400 text-sm">{t('bmiCard.bmiLabel')}</span>
                    {currentBmi !== null && bmiResult ? (
                        <>
                            <p className={`text-5xl font-bold ${bmiResult.color}`}>{currentBmi.toFixed(1)}</p>
                            <p className={`text-lg font-semibold ${bmiResult.color}`}>{bmiResult.category}</p>
                             {improvementData && (
                                <div className="mt-3 text-sm text-text-secondary dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                    <Trans i18nKey="bmiCard.improvementNeeded"
                                        values={{ 
                                            weight: displayWeight(improvementData.weightToLose), 
                                            category: improvementData.nextCategoryName 
                                        }}
                                        components={{
                                            1: <strong className="text-primary" />,
                                            3: <strong className="text-text-primary dark:text-gray-200" />,
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-2xl font-bold text-text-secondary dark:text-gray-400">{t('bmiCard.notAvailable')}</p>
                    )}
                </div>

                <div className="space-y-2 text-center">
                    <div className="flex justify-center items-baseline gap-4">
                        <span className="text-text-secondary dark:text-gray-400">{t('bmiCard.goalWeight')}:</span>
                         {isEditingGoal ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={goalWeightInput}
                                    onChange={(e) => setGoalWeightInput(e.target.value)}
                                    className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleGoalSave()}
                                />
                                <span className="text-text-secondary dark:text-gray-400">{weightUnit}</span>
                                <button onClick={handleGoalSave} className="text-green-500 hover:text-green-700">✓</button>
                                <button onClick={() => setIsEditingGoal(false)} className="text-red-500 hover:text-red-700">×</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {profile.goal_weight ? (
                                     <>
                                        <span className="text-lg font-semibold text-text-primary dark:text-gray-200">
                                            {displayWeight(profile.goal_weight)}
                                        </span>
                                        <button onClick={() => setIsEditingGoal(true)} className="text-text-secondary dark:text-gray-400 hover:text-primary">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditingGoal(true)} className="text-sm text-primary hover:underline">
                                        {t('bmiCard.setGoal')}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                     {weightToGo !== null && (
                        <div>
                            {Math.abs(weightToGo) < 0.05 ? (
                                <p className="text-lg font-semibold text-green-500">{t('bmiCard.goalReached')}</p>
                            ) : (
                                <p className="text-text-secondary dark:text-gray-400">
                                    <span className="font-bold text-lg text-primary">{displayWeight(Math.abs(weightToGo))}</span> {t(weightToGo > 0 ? 'bmiCard.toLose' : 'bmiCard.toGain')}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {profile.goal_weight && latestWeight && startWeight && (
                     <GoalProgressBar
                        startWeight={startWeight}
                        currentWeight={latestWeight}
                        goalWeight={profile.goal_weight}
                        weightUnit={weightUnit}
                    />
                )}
                
                 <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-semibold text-text-secondary dark:text-gray-400 text-center">{t('bmiCard.units.title')}</h3>
                    <div className="flex justify-around">
                        <div className="flex items-center gap-2">
                            <span className="text-text-secondary dark:text-gray-400 text-sm">{t('bmiCard.units.weight')}:</span>
                            <UnitToggleButton options={[{value: 'kg', label: t('bmiCard.units.kg')}, {value: 'lbs', label: t('bmiCard.units.lbs')}]} currentValue={weightUnit} onChange={(val) => onProfileUpdate({ weight_unit: val })} />
                        </div>
                         <div className="flex items-center gap-2">
                            <span className="text-text-secondary dark:text-gray-400 text-sm">{t('bmiCard.units.height')}:</span>
                             <UnitToggleButton options={[{value: 'cm', label: t('bmiCard.units.cm')}, {value: 'ft', label: t('bmiCard.units.ft')}]} currentValue={heightUnit} onChange={(val) => onProfileUpdate({ height_unit: val })} />
                        </div>
                    </div>
                </div>


                {entries.length > 1 && (
                    <>
                    <hr className="dark:border-gray-700" />
                    <div className="space-y-4 pt-2">
                         <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-text-primary dark:text-gray-100">{t('bmiCard.progress.title')}</h3>
                            <select
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(e.target.value as typeof timePeriod)}
                                className="text-sm border border-gray-300 rounded-md p-1 bg-transparent text-text-secondary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-primary focus:border-primary"
                            >
                                <option value="all">{t('bmiCard.progress.allTime')}</option>
                                <option value="7d">{t('bmiCard.progress.sevenDays')}</option>
                                <option value="30d">{t('bmiCard.progress.thirtyDays')}</option>
                                <option value="365d">{t('bmiCard.progress.oneYear')}</option>
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <span className="text-sm text-text-secondary dark:text-gray-400">{t('bmiCard.progress.weightChange')}</span>
                                <p className={`text-2xl font-bold ${getChangeColor(progressData.weightChange)}`}>
                                    {formatChange(progressData.weightChange, weightUnit)}
                                    {progressData.weightChange !== null && <TrendArrow value={progressData.weightChange} />}
                                </p>
                            </div>
                             <div>
                                <span className="text-sm text-text-secondary dark:text-gray-400">{t('bmiCard.progress.bmiChange')}</span>
                                <p className={`text-2xl font-bold ${getChangeColor(progressData.bmiChangePercent)}`}>
                                    {formatChange(progressData.bmiChangePercent, '%')}
                                    {progressData.bmiChangePercent !== null && <TrendArrow value={progressData.bmiChangePercent} />}
                                </p>
                            </div>
                         </div>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};