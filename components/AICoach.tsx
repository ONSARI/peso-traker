import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from '@google/genai';
import type { UserProfile, WeightEntry, MeasurementEntry } from '../types';

interface AICoachProps {
    profile: UserProfile;
    weightEntries: WeightEntry[];
    measurementEntries: MeasurementEntry[];
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const formatText = (text: string) => {
        // Simple replacements for basic markdown
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary dark:text-gray-200">$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/^\s*[\-\*]\s+(.*)/gm, '<li class="ml-4 list-disc">$1</li>'); // List items
    };

    const paragraphs = content.split('\n').map(p => p.trim()).filter(p => p.length > 0);

    return (
        <div className="space-y-2 text-left rtl:text-right">
            {paragraphs.map((p, index) => {
                 if (p.startsWith('<li')) {
                    return <ul key={index} className="space-y-1" dangerouslySetInnerHTML={{ __html: p }} />;
                }
                return <p key={index} dangerouslySetInnerHTML={{ __html: formatText(p) }} />;
            })}
        </div>
    );
};


export const AICoach: React.FC<AICoachProps> = ({ profile, weightEntries, measurementEntries }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGetAnalysis = async () => {
        setLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const formattedWeightHistory = weightEntries.map(e => `  - ${e.date}: ${e.weight.toFixed(1)} kg`).join('\n');
            const formattedMeasurementHistory = measurementEntries.map(e => {
                const parts = [
                    e.waist && `Waist: ${e.waist.toFixed(1)} cm`,
                    e.hips && `Hips: ${e.hips.toFixed(1)} cm`,
                    e.chest && `Chest: ${e.chest.toFixed(1)} cm`,
                ].filter(Boolean).join(', ');
                return `  - ${e.date}: ${parts}`;
            }).join('\n');

            const systemInstruction = `You are a friendly, encouraging, and knowledgeable fitness and wellness coach named Zen. 
Your goal is to provide positive and actionable advice based on the user's progress data. 
Analyze their weight and body measurement trends. Always use the user's name. 
Keep the analysis concise, friendly, and motivating. 
Respond in Markdown format. Start with a positive observation, then provide one or two simple, actionable tips.`;

            const prompt = `
Hello Zen, my name is ${profile.name}. Please analyze my progress.

**My Profile:**
- Height: ${profile.height} cm
- Final Goal Weight: ${profile.goal_weight_final ? `${profile.goal_weight_final.toFixed(1)} kg` : 'Not set'}

**My Weight History (last 10 entries):**
${formattedWeightHistory.split('\n').slice(-10).join('\n')}

**My Measurement History (last 10 entries):**
${formattedMeasurementHistory.split('\n').slice(-10).join('\n')}

Based on my data, please provide a brief analysis of my progress and one or two simple, actionable tips to help me improve. Keep it positive and motivating.
`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                }
            });

            setAnalysis(response.text);

        } catch (err) {
            console.error("AI analysis failed:", err);
            setError(t('aiCoach.error'));
        }

        setLoading(false);
    };

    return (
        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('aiCoach.title')}</h2>
            <div className="text-center">
                {!analysis && !loading && (
                    <button
                        onClick={handleGetAnalysis}
                        disabled={loading}
                        className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:bg-gray-400"
                    >
                        {t('aiCoach.getAnalysisButton')}
                    </button>
                )}
                {loading && (
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-text-secondary dark:text-gray-400">{t('aiCoach.loading')}</p>
                    </div>
                )}
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {analysis && (
                     <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-text-secondary dark:text-gray-300">
                         <MarkdownRenderer content={analysis} />
                         <button onClick={handleGetAnalysis} className="mt-4 text-sm text-primary hover:underline">
                            {t('aiCoach.getAnalysisButton')}
                         </button>
                    </div>
                )}
            </div>
        </div>
    );
};
