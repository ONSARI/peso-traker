
import React, { useState, useEffect } from 'react';

interface WeightFormProps {
    onAddEntry: (weight: number) => void;
    latestWeight: number | null;
}

export const WeightForm: React.FC<WeightFormProps> = ({ onAddEntry, latestWeight }) => {
    const [weight, setWeight] = useState('');
    
    useEffect(() => {
        if (latestWeight) {
            setWeight(String(latestWeight));
        }
    }, [latestWeight])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const weightValue = parseFloat(weight);
        if (!isNaN(weightValue) && weightValue > 0) {
            onAddEntry(weightValue);
        } else {
            // Optional: add some error feedback
            alert("Please enter a valid weight.");
        }
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary mb-4">Log Today's Weight</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="weight-input" className="block text-sm font-medium text-text-secondary mb-1">
                        Weight (kg)
                    </label>
                    <div className="relative">
                        <input
                            id="weight-input"
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="e.g., 75.5"
                            required
                            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                         <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary">kg</span>
                    </div>
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300">
                    Save Weight
                </button>
            </form>
        </div>
    );
};
