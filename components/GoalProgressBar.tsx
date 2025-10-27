import React from 'react';
import { useTranslation } from 'react-i18next';

interface GoalProgressBarProps {
    startWeight: number;
    currentWeight: number;
    goalWeight: number;
    weightUnit: 'kg' | 'lbs';
}

export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({ startWeight, currentWeight, goalWeight, weightUnit }) => {
    const { t } = useTranslation();

    const displayWeight = (weightKg: number) => {
        if (weightUnit === 'lbs') {
            return `${(weightKg * 2.20462).toFixed(1)} lbs`;
        }
        return `${weightKg.toFixed(1)} kg`;
    };

    const isLosingWeight = goalWeight < startWeight;
    let progress = 0;

    if (startWeight !== goalWeight) {
      if (isLosingWeight) {
          progress = ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100;
      } else { // Gaining weight
          progress = ((currentWeight - startWeight) / (goalWeight - startWeight)) * 100;
      }
    }

    progress = Math.max(0, Math.min(100, progress)); // Clamp between 0 and 100

    return (
        <div className="space-y-2 pt-4">
            <div className="flex justify-between items-center mb-1">
                 <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">{t('bmiCard.goalProgress.title')}</h3>
                 <span className="font-semibold text-primary">{t('bmiCard.goalProgress.progressComplete', { percentage: progress.toFixed(0) })}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
                <div
                    className="bg-primary h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>
            <div className="flex justify-between text-xs text-text-secondary dark:text-gray-400">
                <span>{t('bmiCard.goalProgress.startLabel')}: {displayWeight(startWeight)}</span>
                <span>{t('bmiCard.goalProgress.goalLabel')}: {displayWeight(goalWeight)}</span>
            </div>
        </div>
    );
};