import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MeasurementEntry } from '../types';

interface MeasurementFormProps {
    onAddEntry: (entry: Omit<MeasurementEntry, 'id' | 'user_id'>) => Promise<boolean>;
    measurementUnit: 'cm' | 'in';
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({ onAddEntry, measurementUnit }) => {
    const { t } = useTranslation();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [waist, setWaist] = useState('');
    const [hips, setHips] = useState('');
    const [chest, setChest] = useState('');
    const [bicep, setBicep] = useState('');
    const [thigh, setThigh] = useState('');
    const [shoulders, setShoulders] = useState('');
    const [calves, setCalves] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const toCm = (val: string): number | null => {
            const num = parseFloat(val);
            if (isNaN(num) || num <= 0) return null;
            return measurementUnit === 'in' ? num * 2.54 : num;
        };

        const newEntry: Omit<MeasurementEntry, 'id' | 'user_id'> = {
            date,
            waist: toCm(waist),
            hips: toCm(hips),
            chest: toCm(chest),
            bicep: toCm(bicep),
            thigh: toCm(thigh),
            shoulders: toCm(shoulders),
            calves: toCm(calves),
        };
        
        // Only submit if at least one measurement is entered
        if (Object.values(newEntry).some(v => typeof v === 'number')) {
            const success = await onAddEntry(newEntry);
            if (success) {
                setWaist('');
                setHips('');
                setChest('');
                setBicep('');
                setThigh('');
                setShoulders('');
                setCalves('');
            }
        }
    };
    
    const renderInput = (
        labelKey: string, 
        value: string, 
        setter: (val: string) => void
    ) => (
         <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                {t(labelKey, { unit: measurementUnit })}
            </label>
            <div className="relative">
                <input
                    type="number"
                    step="0.1"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full pl-4 pr-12 rtl:pl-12 rtl:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <span className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center pr-4 rtl:pr-0 rtl:pl-4 text-text-secondary dark:text-gray-400">{measurementUnit}</span>
            </div>
        </div>
    );

    return (
        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('measurementForm.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="measurement-date-input" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                        {t('measurementForm.dateLabel')}
                    </label>
                    <input
                        id="measurement-date-input"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {renderInput('measurementForm.waistLabel', waist, setWaist)}
                    {renderInput('measurementForm.hipsLabel', hips, setHips)}
                    {renderInput('measurementForm.chestLabel', chest, setChest)}
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {renderInput('measurementForm.shouldersLabel', shoulders, setShoulders)}
                    {renderInput('measurementForm.calvesLabel', calves, setCalves)}
                    {renderInput('measurementForm.bicepLabel', bicep, setBicep)}
                    {renderInput('measurementForm.thighLabel', thigh, setThigh)}
                </div>
                <button type="submit" className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-300">
                    {t('measurementForm.saveButton')}
                </button>
            </form>
        </div>
    );
};