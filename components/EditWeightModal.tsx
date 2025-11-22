import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { WeightEntry } from '../types';

interface EditWeightModalProps {
    entry: WeightEntry | null;
    onClose: () => void;
    onSave: (id: number, updates: { weight: number; date: string }) => void;
    weightUnit: 'kg' | 'lbs';
}

export const EditWeightModal: React.FC<EditWeightModalProps> = ({ entry, onClose, onSave, weightUnit }) => {
    const { t } = useTranslation();
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (entry) {
            const displayWeight = weightUnit === 'lbs' ? (entry.weight * 2.20462).toFixed(2) : entry.weight.toFixed(2);
            setWeight(displayWeight);
            setDate(entry.date);
        }
    }, [entry, weightUnit]);

    if (!entry) return null;

    const handleSave = () => {
        const weightValue = parseFloat(weight);
        if (!isNaN(weightValue) && weightValue > 0 && date) {
            const weightInKg = weightUnit === 'lbs' ? weightValue / 2.20462 : weightValue;
            onSave(entry.id, { weight: weightInKg, date });
        } else {
            alert(t('weightForm.validationError'));
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-weight-title"
        >
            <div 
                className="bg-card dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="edit-weight-title" className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('history.editWeightTitle')}</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="edit-date-input" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                            {t('weightForm.dateLabel')}
                        </label>
                        <input
                            id="edit-date-input"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-weight-input" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                            {t('weightForm.weightLabel', { unit: weightUnit })}
                        </label>
                        <div className="relative">
                            <input
                                id="edit-weight-input"
                                type="number"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                                className="w-full pl-4 pr-12 rtl:pl-12 rtl:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <span className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center pr-4 rtl:pr-0 rtl:pl-4 text-text-secondary dark:text-gray-400">{weightUnit}</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg text-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            {t('achievements.modalClose')}
                        </button>
                         <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-focus transition-colors">
                            {t('history.saveChanges')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
