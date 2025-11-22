import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WeightFormProps {
    onAddEntry: (weightInKg: number, date: string) => Promise<boolean>;
    weightUnit: 'kg' | 'lbs';
}

export const WeightForm: React.FC<WeightFormProps> = ({ onAddEntry, weightUnit }) => {
    const { t } = useTranslation();
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const weightValue = parseFloat(weight);
        if (!isNaN(weightValue) && weightValue > 0 && date) {
            const weightInKg = weightUnit === 'lbs' ? weightValue / 2.20462 : weightValue;
            const success = await onAddEntry(weightInKg, date);
            if (success) {
                setWeight('');
            }
        } else {
            alert(t('weightForm.validationError'));
        }
    };

    return (
        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('weightForm.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="date-input" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                        {t('weightForm.dateLabel')}
                    </label>
                    <input
                        id="date-input"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div>
                    <label htmlFor="weight-input" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                        {t('weightForm.weightLabel', { unit: weightUnit })}
                    </label>
                    <div className="relative">
                        <input
                            id="weight-input"
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder={t('weightForm.weightPlaceholder', { unit: weightUnit })}
                            required
                            className="w-full pl-4 pr-12 rtl:pl-12 rtl:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                         <span className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center pr-4 rtl:pr-0 rtl:pl-4 text-text-secondary dark:text-gray-400">{weightUnit}</span>
                    </div>
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300">
                    {t('weightForm.saveButton')}
                </button>
            </form>
        </div>
    );
};