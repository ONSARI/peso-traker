import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserProfile, MeasurementEntry } from '../types';
import { Avatar } from './Avatar';

interface AvatarCardProps {
    profile: UserProfile;
    measurements: MeasurementEntry[];
}

const findFirstValidMeasurement = (entries: MeasurementEntry[]): MeasurementEntry | null => {
    for (const entry of entries) {
        if (Object.values(entry).some(val => typeof val === 'number' && val > 0)) {
            return entry;
        }
    }
    return null;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({ profile, measurements }) => {
    const { t, i18n } = useTranslation();

    const latestMeasurements = useMemo(() => {
        if (measurements.length === 0) return null;
        return measurements[measurements.length - 1];
    }, [measurements]);

    const initialMeasurements = useMemo(() => {
        return findFirstValidMeasurement(measurements);
    }, [measurements]);

    const displayDate = latestMeasurements
        ? new Date(`${latestMeasurements.date}T00:00:00`).toLocaleDateString(i18n.language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : null;

    return (
        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-2 text-center">{t('avatarCard.title')}</h2>
            
            {!latestMeasurements ? (
                <div className="flex items-center justify-center h-72 text-center text-text-secondary dark:text-gray-400">
                    <p>{t('avatarCard.noData')}</p>
                </div>
            ) : (
                <>
                    <p className="text-center text-sm text-text-secondary dark:text-gray-400 mb-4">
                        {t('avatarCard.showingDataFor', { date: displayDate })}
                    </p>
                    <div className="flex justify-center items-center h-72">
                        <Avatar
                            heightCm={profile.height}
                            latestMeasurements={latestMeasurements}
                            initialMeasurements={initialMeasurements}
                        />
                    </div>
                </>
            )}
        </div>
    );
};