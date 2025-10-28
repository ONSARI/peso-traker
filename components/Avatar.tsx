import React from 'react';
import type { MeasurementEntry } from '../types';

interface AvatarProps {
    heightCm: number;
    latestMeasurements: MeasurementEntry | null;
    initialMeasurements: MeasurementEntry | null;
}

// This function calculates the change FOR A SINGLE body part over time.
// It's kept for limbs, where individual change (e.g., muscle growth) is relevant.
const calculateScale = (latest?: number | null, initial?: number | null, defaultScale = 1): number => {
    if (latest && initial && initial > 0) {
        // Clamp scale to avoid extreme visuals
        return Math.max(0.5, Math.min(1.5, latest / initial));
    }
    return defaultScale;
};


export const Avatar: React.FC<AvatarProps> = ({ heightCm, latestMeasurements, initialMeasurements }) => {

    // These are the base widths of the torso parts in the CSS (e.g., for chest, left: 25%, right: 25% -> width: 50%)
    const baseWidths = {
        chest: 50,
        waist: 40,
        hips: 56,
    };

    // 1. Calculate a stable baseline normalizer from the first measurements.
    // This represents the "100%" scale factor for the user's starting shape.
    // All future shapes will be scaled relative to this baseline.
    let baselineNormalizer = 1.86; // A fallback for a "standard" person if no initial data exists (avg of 95/50, 80/40, 95/56)
    if (initialMeasurements) {
        const props: number[] = [];
        if (initialMeasurements.chest) props.push(initialMeasurements.chest / baseWidths.chest);
        if (initialMeasurements.waist) props.push(initialMeasurements.waist / baseWidths.waist);
        if (initialMeasurements.hips) props.push(initialMeasurements.hips / baseWidths.hips);

        if (props.length > 0) {
            baselineNormalizer = props.reduce((a, b) => a + b, 0) / props.length;
        }
    }

    // 2. This function calculates the new scale for a torso part.
    // It makes the visual width proportional to the actual measurement, correcting the reported issue.
    // It also scales the overall avatar size based on the change from the initial measurements.
    const getProportionalScale = (
        part: keyof typeof baseWidths,
        latestValue?: number | null
    ): number => {
        if (!latestValue || latestValue <= 0) {
            return 1; // Default scale if no measurement
        }
        // The scale is the latest measurement's proportion, normalized by the baseline.
        const scale = (latestValue / baseWidths[part]) / baselineNormalizer;
        // Clamp to avoid extreme visuals
        return Math.max(0.5, Math.min(1.5, scale));
    };


    const scales = {
        // Torso parts use the new proportional logic
        chest: getProportionalScale('chest', latestMeasurements?.chest),
        waist: getProportionalScale('waist', latestMeasurements?.waist),
        hips: getProportionalScale('hips', latestMeasurements?.hips),
        
        // Limbs can still use the old logic to show individual change
        leftArm: calculateScale(latestMeasurements?.left_arm, initialMeasurements?.left_arm),
        rightArm: calculateScale(latestMeasurements?.right_arm, initialMeasurements?.right_arm),
        leftLeg: calculateScale(latestMeasurements?.left_leg, initialMeasurements?.left_leg),
        rightLeg: calculateScale(latestMeasurements?.right_leg, initialMeasurements?.right_leg),
    };

    // Base height in pixels for an average person (e.g., 175cm)
    const basePixelHeight = 280;
    const averageHeightCm = 175;
    const heightScale = heightCm / averageHeightCm;
    const avatarHeight = basePixelHeight * heightScale;

    const bodyPartStyle = "absolute bg-gray-300 dark:bg-gray-600 rounded-full transition-transform duration-500 ease-in-out";
    const limbStyle = "absolute bg-gray-300 dark:bg-gray-600 rounded-full origin-top transition-transform duration-500 ease-in-out";

    return (
        <div className="relative" style={{ height: `${avatarHeight}px`, width: '150px' }}>
            {/* Main Body Structure */}
            <div className="absolute inset-x-0 top-[15%] h-[45%]">
                {/* Chest */}
                <div 
                    className={bodyPartStyle}
                    style={{ 
                        top: '0%', 
                        height: '40%', 
                        left: '25%', 
                        right: '25%', 
                        transform: `scaleX(${scales.chest})`,
                        borderRadius: '50% 50% 20% 20% / 60% 60% 40% 40%'
                    }}
                ></div>
                {/* Waist */}
                <div
                    className={bodyPartStyle}
                    style={{
                        top: '38%',
                        height: '22%',
                        left: '30%',
                        right: '30%',
                        transform: `scaleX(${scales.waist})`,
                        borderRadius: '20% 20% 20% 20% / 50% 50% 50% 50%'
                     }}
                ></div>
                 {/* Hips */}
                <div
                    className={bodyPartStyle}
                    style={{
                        top: '58%',
                        height: '42%',
                        left: '22%',
                        right: '22%',
                        transform: `scaleX(${scales.hips})`,
                        borderRadius: '20% 20% 50% 50% / 40% 40% 60% 60%'
                    }}
                ></div>
            </div>

            {/* Head and Neck */}
            <div
                className={`${bodyPartStyle} bg-gray-400 dark:bg-gray-500`}
                style={{ top: '0%', left: '35%', right: '35%', height: '12%', borderRadius: '50%' }}
            ></div>
             <div
                className={bodyPartStyle}
                style={{ top: '11.5%', left: '42%', right: '42%', height: '4%'}}
            ></div>


             {/* Arms */}
            <div
                className={limbStyle}
                style={{ top: '16%', left: '10%', width: '15%', height: '38%', transform: `scaleX(${scales.leftArm}) rotate(10deg)`}}
            ></div>
             <div
                className={limbStyle}
                style={{ top: '16%', right: '10%', width: '15%', height: '38%', transform: `scaleX(${scales.rightArm}) rotate(-10deg)`}}
            ></div>


            {/* Legs */}
            <div
                className={limbStyle}
                style={{ top: '59%', left: '25%', width: '20%', height: '41%', transform: `scaleX(${scales.leftLeg})`}}
            ></div>
             <div
                className={limbStyle}
                style={{ top: '59%', right: '25%', width: '20%', height: '41%', transform: `scaleX(${scales.rightLeg})`}}
            ></div>

        </div>
    );
};