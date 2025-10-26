
import React from 'react';
import type { WeightEntry } from '../types';

interface WeightHistoryProps {
    entries: WeightEntry[];
    onDeleteEntry: (id: number) => void;
}

export const WeightHistory: React.FC<WeightHistoryProps> = ({ entries, onDeleteEntry }) => {
    const reversedEntries = [...entries].reverse();

    return (
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary mb-4">Weight History</h2>
            <div className="overflow-x-auto max-h-96">
                {entries.length === 0 ? (
                    <p className="text-center text-text-secondary py-8">No weight entries yet. Add one to get started!</p>
                ) : (
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-text-secondary tracking-wider">Date</th>
                            <th className="p-3 text-sm font-semibold text-text-secondary tracking-wider text-right">Weight (kg)</th>
                            <th className="p-3 text-sm font-semibold text-text-secondary tracking-wider text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reversedEntries.map(entry => (
                            <tr key={entry.id} className="hover:bg-gray-50">
                                <td className="p-3 whitespace-nowrap text-text-primary font-medium">
                                    {new Date(entry.date).toLocaleDateString('en-GB', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </td>
                                <td className="p-3 whitespace-nowrap text-text-primary text-right">{entry.weight.toFixed(1)} kg</td>
                                <td className="p-3 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => onDeleteEntry(entry.id)}
                                        className="text-red-500 hover:text-red-700 p-1 rounded-full"
                                        aria-label="Delete entry"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 )}
            </div>
        </div>
    );
};
