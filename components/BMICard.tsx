
import React, { useMemo, useState } from 'react';

interface BMICardProps {
    height: number | null;
    weight: number | null;
    onHeightChange: (height: number) => void;
}

const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obesity', color: 'text-red-500' };
};

export const BMICard: React.FC<BMICardProps> = ({ height, weight, onHeightChange }) => {
    const [isEditingHeight, setIsEditingHeight] = useState(false);
    const [newHeight, setNewHeight] = useState(height || '');

    const bmi = useMemo(() => {
        if (!height || !weight || height <= 0 || weight <= 0) return null;
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
    }, [height, weight]);

    const bmiResult = useMemo(() => {
        if (bmi === null) return null;
        return getBMICategory(bmi);
    }, [bmi]);
    
    const handleHeightSave = () => {
        const heightValue = parseFloat(String(newHeight));
        if (!isNaN(heightValue) && heightValue > 0) {
            onHeightChange(heightValue);
            setIsEditingHeight(false);
        }
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary mb-4">Your Status</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <span className="text-text-secondary">Latest Weight:</span>
                    <span className="text-2xl font-bold text-primary">{weight ? `${weight.toFixed(1)} kg` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="text-text-secondary">Height:</span>
                    {isEditingHeight ? (
                         <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={newHeight}
                                onChange={(e) => setNewHeight(e.target.value)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                                autoFocus
                            />
                            <button onClick={handleHeightSave} className="text-green-500 hover:text-green-700">✓</button>
                            <button onClick={() => setIsEditingHeight(false)} className="text-red-500 hover:text-red-700">×</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                             <span className="text-lg font-semibold text-text-primary">{height ? `${height} cm` : 'N/A'}</span>
                            <button onClick={() => setIsEditingHeight(true)} className="text-text-secondary hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <hr/>
                <div className="text-center pt-2">
                    <span className="text-text-secondary text-sm">Your BMI</span>
                    {bmi !== null && bmiResult ? (
                        <>
                            <p className={`text-5xl font-bold ${bmiResult.color}`}>{bmi.toFixed(1)}</p>
                            <p className={`text-lg font-semibold ${bmiResult.color}`}>{bmiResult.category}</p>
                        </>
                    ) : (
                        <p className="text-2xl font-bold text-text-secondary">N/A</p>
                    )}
                </div>
            </div>
        </div>
    );
};
