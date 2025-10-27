import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Achievement } from '../types';

interface AchievementsProps {
    allAchievements: Achievement[];
    unlockedIds: Set<string>;
}

const AchievementBadge: React.FC<{ achievement: Achievement, isUnlocked: boolean }> = ({ achievement, isUnlocked }) => {
    const { t } = useTranslation();
    const { Icon, titleKey, descriptionKey } = achievement;
    
    return (
        <div className={`flex items-center gap-4 p-4 border-l-4 rounded-r-lg transition-all duration-300 ${isUnlocked ? 'border-primary bg-teal-50 dark:bg-gray-700/50' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/20'}`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                <Icon className="w-7 h-7" />
            </div>
            <div className={`transition-opacity duration-500 ${!isUnlocked && 'opacity-50'}`}>
                <h4 className="font-bold text-text-primary dark:text-gray-200">{t(titleKey)}</h4>
                <p className="text-sm text-text-secondary dark:text-gray-400">{t(descriptionKey)}</p>
            </div>
        </div>
    );
};

export const Achievements: React.FC<AchievementsProps> = ({ allAchievements, unlockedIds }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('achievements.title')}</h2>
            <div className="space-y-4">
                {allAchievements.map(ach => (
                    <AchievementBadge
                        key={ach.id}
                        achievement={ach}
                        isUnlocked={unlockedIds.has(ach.id)}
                    />
                ))}
            </div>
        </div>
    );
};