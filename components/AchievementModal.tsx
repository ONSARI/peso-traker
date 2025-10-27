import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Achievement } from '../types';

interface AchievementModalProps {
    achievement: Achievement | null;
    onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClose }) => {
    const { t } = useTranslation();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (achievement) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [achievement, onClose]);

    if (!achievement) return null;

    const { Icon, titleKey, descriptionKey } = achievement;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-title"
        >
            <div 
                className="bg-card dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
                style={{ animationFillMode: 'forwards' }}
            >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-primary text-white shadow-lg">
                    <Icon className="w-14 h-14" />
                </div>
                <h3 className="text-sm font-bold uppercase text-primary tracking-widest">{t('achievements.modalTitle')}</h3>
                <h2 id="achievement-title" className="text-3xl font-bold text-text-primary dark:text-gray-100 mt-2">{t(titleKey)}</h2>
                <p className="text-text-secondary dark:text-gray-400 mt-3">{t(descriptionKey)}</p>
                <p className="text-5xl mt-6">🎉</p>
                <button
                    onClick={onClose}
                    className="w-full mt-8 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 dark:focus:ring-offset-gray-800"
                >
                    {t('achievements.modalClose')}
                </button>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};