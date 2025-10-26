
export interface User {
    name: string;
    height: number; // in cm
    dob: string; // YYYY-MM-DD
    email: string;
    phone: string;
}

export interface WeightEntry {
    id: number;
    date: string; // YYYY-MM-DD
    weight: number; // in kg
}
