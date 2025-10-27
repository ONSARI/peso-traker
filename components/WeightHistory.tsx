import React from 'react';
import type { WeightEntry } from '../types';
import { useTranslation } from 'react-i18next';

interface WeightHistoryProps {
    entries: WeightEntry[];
    onDeleteEntry: (id: number) => void;
    weightUnit: 'kg' | 'lbs';
}

export const WeightHistory: React.FC<WeightHistoryProps> = ({ entries, onDeleteEntry, weightUnit }) => {
    const { t, i18n } = useTranslation();
    const reversedEntries = [...entries].reverse();

    return (
        <div className="bg-card dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('history.title')}</h2>
            <div className="overflow-x-auto max-h-96">
                {entries.length === 0 ? (
                    <p className="text-center text-text-secondary dark:text-gray-400 py-8">{t('history.noEntries')}</p>
                ) : (
                <table className="w-full text-left rtl:text-right">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/50 z-10">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-text-secondary dark:text-gray-300 tracking-wider">{t('history.dateHeader')}</th>
                            <th className="p-3 text-sm font-semibold text-text-secondary dark:text-gray-300 tracking-wider text-right rtl:text-left">{t('history.weightHeader', { unit: weightUnit })}</th>
                            <th className="p-3 text-sm font-semibold text-text-secondary dark:text-gray-300 tracking-wider text-center">{t('history.actionsHeader')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {reversedEntries.map(entry => {
                            const displayWeight = weightUnit === 'lbs' ? (entry.weight * 2.20462).toFixed(1) : entry.weight.toFixed(1);
                            return (
                                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 whitespace-nowrap text-text-primary dark:text-gray-200 font-medium">
                                        {new Date(`${entry.date}T00:00:00`).toLocaleDateString(i18n.language, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-3 whitespace-nowrap text-text-primary dark:text-gray-200 text-right rtl:text-left">{displayWeight} {weightUnit}</td>
                                    <td className="p-3 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => onDeleteEntry(entry.id)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full"
                                            aria-label={t('history.deleteLabel')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 )}
            </div>
        </div>
    );
};