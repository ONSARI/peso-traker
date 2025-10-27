import React from 'react';

export interface UserProfile {
    id: string; // Corresponds to the user's UUID in Supabase auth
    name: string;
    height: number; // Stored in cm
    dob: string; // YYYY-MM-DD
    weight_unit?: 'kg' | 'lbs';
    height_unit?: 'cm' | 'ft';
    goal_weight_1?: number | null;
    goal_weight_2?: number | null;
    goal_weight_final?: number | null;
}

export interface WeightEntry {
    id: number;
    date: string; // YYYY-MM-DD
    weight: number; // in kg
    user_id: string;
}

export interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}