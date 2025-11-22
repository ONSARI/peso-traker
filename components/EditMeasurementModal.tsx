import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { MeasurementEntry } from '../types';

type EditableMeasurementFields = Omit<MeasurementEntry, 'id' | 'user_id' | 'date'>;

interface EditMeasurementModalProps {
    entry: MeasurementEntry | null;
    onClose: () => void;
    onSave: (id: number, updates: Omit<MeasurementEntry, 'id' | 'user_id'>) => void;
    measurementUnit: 'cm' | 'in';
}

export const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({ entry, onClose, onSave, measurementUnit }) => {
    const { t } = useTranslation();
    const [date, setDate] = useState('');
    const [formState, setFormState] = useState<Record<keyof EditableMeasurementFields, string>>({
        waist: '', hips: '', chest: '', bicep: '', thigh: '', shoulders: '', calves: ''
    });

    const toDisplayUnit = (cmValue: number | null | undefined): string => {
        if (cmValue === null || cmValue === undefined) return '';
        if (measurementUnit === 'in') {
            return (cmValue / 2.54).toFixed(1);
        }
        return cmValue.toFixed(1);
    };

    useEffect(() => {
        if (entry) {
            setDate(entry.date);
            setFormState({
                waist: toDisplayUnit(entry.waist),
                hips: toDisplayUnit(entry.hips),
                chest: toDisplayUnit(entry.chest),
                bicep: toDisplayUnit(entry.bicep),
                thigh: toDisplayUnit(entry.thigh),
                shoulders: toDisplayUnit(entry.shoulders),
                calves: toDisplayUnit(entry.calves),
            });
        }
    }, [entry, measurementUnit]);

    if (!entry) return null;

    const handleInputChange = (field: keyof EditableMeasurementFields, value: string) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        const toCm = (val: string): number | null => {
            const num = parseFloat(val);
            if (isNaN(num) || num <= 0) return null;
            return measurementUnit === 'in' ? num * 2.54 : num;
        };

        const updatedEntry: Omit<MeasurementEntry, 'id' | 'user_id'> = {
            date,
            waist: toCm(formState.waist),
            hips: toCm(formState.hips),
            chest: toCm(formState.chest),
            bicep: toCm(formState.bicep),
            thigh: toCm(formState.thigh),
            shoulders: toCm(formState.shoulders),
            calves: toCm(formState.calves),
        };

        onSave(entry.id, updatedEntry);
    };

    const renderInput = (labelKey: string, field: keyof EditableMeasurementFields) => (
        <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                {t(labelKey, { unit: measurementUnit })}
            </label>
            <div className="relative">
                <input
                    type="number" step="0.1" value={formState[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full pl-4 pr-12 rtl:pl-12 rtl:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <span className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center pr-4 rtl:pr-0 rtl:pl-4 text-text-secondary dark:text-gray-400">{measurementUnit}</span>
            </div>
        </div>
    );
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-measurement-title"
        >
            <div 
                className="bg-card dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="edit-measurement-title" className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('history.editMeasurementTitle')}</h2>
                 <div className="space-y-4">
                     <div>
                        <label htmlFor="edit-measurement-date" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                            {t('measurementForm.dateLabel')}
                        </label>
                        <input id="edit-measurement-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {renderInput('measurementForm.waistLabel', 'waist')}
                        {renderInput('measurementForm.hipsLabel', 'hips')}
                        {renderInput('measurementForm.chestLabel', 'chest')}
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {renderInput('measurementForm.shouldersLabel', 'shoulders')}
                        {renderInput('measurementForm.calvesLabel', 'calves')}
                        {renderInput('measurementForm.bicepLabel', 'bicep')}
                        {renderInput('measurementForm.thighLabel', 'thigh')}
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