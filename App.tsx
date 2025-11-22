

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, WeightEntry, Achievement, MeasurementEntry } from './types';
import { supabase, supabaseError, supabaseUrl } from './supabaseClient';
import { BMICard } from './components/BMICard';
import { GoldenRatioCard } from './components/GoldenRatioCard';
import { WeightChart } from './components/WeightChart';
import { BMIChart } from './components/BMIChart';
import { WeightForm } from './components/WeightForm';
import { WeightHistory } from './components/WeightHistory';
import { Achievements } from './components/Achievements';
import { AchievementModal } from './components/AchievementModal';
import { TrophyIcon, RocketIcon, StarIcon, ShieldCheckIcon, PencilIcon } from './components/icons';
import { useTranslation, Trans } from 'react-i18next';
import useLocalStorage from './hooks/useLocalStorage';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { MeasurementForm } from './components/MeasurementForm';
import { MeasurementHistory } from './components/MeasurementHistory';
import { AICoach } from './components/AICoach';
import { EditWeightModal } from './components/EditWeightModal';
import { EditMeasurementModal } from './components/EditMeasurementModal';


// --- Components ---

// FIX: The Auth component was not returning any JSX, causing a type error.
// The component's definition was also truncated. It has been completed and now returns a proper JSX structure.
const Auth: React.FC = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const [view, setView] = useState<'login' | 'signup' | 'forgotPassword'>('login');
    
    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Profile data for signup
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [height, setHeight] = useState('');
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');
    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                setError(t('auth.invalidCredentialsError'));
            } else {
                setError(error.message);
            }
        }
        // onAuthStateChange will handle success
        setLoading(false);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        if (!name.trim()) {
            setError(t('auth.nameRequiredError'));
            setLoading(false);
            return;
        }
        let heightInCm: number;
        if (heightUnit === 'cm') {
            heightInCm = parseFloat(height);
        } else {
            const feet = parseFloat(heightFt) || 0;
            const inches = parseFloat(heightIn) || 0;
            heightInCm = (feet * 12 + inches) * 2.54;
        }
        if (isNaN(heightInCm) || heightInCm <= 0) {
            setError(t('auth.invalidHeightError'));
            setLoading(false);
            return;
        }
        
        const profileData = { name: name.trim(), dob, height: heightInCm, height_unit: heightUnit, weight_unit: 'kg' };

        const { data, error } = await supabase!.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
        } else if (data.user) {
            // A trigger in Supabase (`handle_new_user`) creates a profile row automatically.
            // Here, we just UPDATE it with the details from the form.
            const { error: profileError } = await supabase!
                .from('profiles')
                .update(profileData)
                .eq('id', data.user.id);

            if (profileError) {
                setError(t('auth.profileCreationError', { message: profileError.message }));
            } else {
                // If data.session exists, user is logged in automatically (if auto-confirm is on).
                // If not, they need to confirm their email.
                if (!data.session) {
                    setMessage(t('auth.signupSuccessMessage'));
                    setView('login');
                }
                // If a session exists, the onAuthStateChange listener will handle the UI transition.
            }
        }
        setLoading(false);
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');
        const { error } = await supabase!.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin, // Users will be redirected here after password reset
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage(t('auth.passwordResetSuccessMessage'));
        }
        setLoading(false);
    };

    const switchView = (newView: 'login' | 'signup' | 'forgotPassword') => {
        setView(newView);
        setError(null);
        setMessage('');
        setEmail('');
        setPassword('');
    };
    
    const renderContent = () => {
        switch (view) {
            case 'forgotPassword':
                return (
                     <>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('auth.forgotPasswordTitle')}</h2>
                        <p className="text-text-secondary dark:text-gray-400 mb-6">{t('auth.forgotPasswordInstruction')}</p>
                        <form noValidate onSubmit={handlePasswordReset} className="flex flex-col items-center justify-center gap-4">
                           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.emailPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2 disabled:bg-gray-400">
                                {loading ? t('auth.sendingLinkButton') : t('auth.sendResetLinkButton')}
                            </button>
                        </form>
                         <button onClick={() => switchView('login')} className="text-sm text-primary hover:underline mt-4">
                            {t('auth.backToLogin')}
                        </button>
                    </>
                );
            case 'signup':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('auth.signupTitle')}</h2>
                        <p className="text-text-secondary dark:text-gray-400 mb-6">{t('auth.signupInstruction')}</p>
                        <form noValidate onSubmit={handleSignup} className="flex flex-col items-center justify-center gap-4">
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('auth.namePlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" aria-label={t('auth.dobLabel')} />
                            
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-sm font-medium text-text-secondary dark:text-gray-400">{t('auth.heightUnitLabel')}</label>
                                    <div className="flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-600">
                                        <button type="button" onClick={() => setHeightUnit('cm')} className={`px-3 py-1 text-sm rounded-md ${heightUnit === 'cm' ? 'bg-primary text-white' : 'bg-transparent text-text-secondary dark:text-gray-300'}`}>{t('auth.cm')}</button>
                                        <button type="button" onClick={() => setHeightUnit('ft')} className={`px-3 py-1 text-sm rounded-md ${heightUnit === 'ft' ? 'bg-primary text-white' : 'bg-transparent text-text-secondary dark:text-gray-300'}`}>{t('auth.ft')}</button>
                                    </div>
                                </div>
                                {heightUnit === 'cm' ? (
                                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={t('auth.heightPlaceholderCm')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                ) : (
                                    <div className="flex gap-2">
                                        <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder={t('auth.ftPlaceholder')} required className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder={t('auth.inPlaceholder')} required className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>
                                )}
                            </div>

                           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.emailPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.passwordPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2 disabled:bg-gray-400">
                                {loading ? t('auth.signingUpButton') : t('auth.signupButton')}
                            </button>
                        </form>
                        <button onClick={() => switchView('login')} className="text-sm text-primary hover:underline mt-4">
                            {t('auth.switchToLogin')}
                        </button>
                    </>
                );
            case 'login':
            default:
                return (
                    <>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('auth.loginTitle')}</h2>
                        <p className="text-text-secondary dark:text-gray-400 mb-6">{t('auth.loginInstruction')}</p>
                        <form noValidate onSubmit={handleLogin} className="flex flex-col items-center justify-center gap-4">
                           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.emailPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.passwordPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2 disabled:bg-gray-400">
                                {loading ? t('auth.loggingInButton') : t('auth.loginButton')}
                            </button>
                        </form>
                         <div className="text-center mt-4">
                             <button onClick={() => switchView('forgotPassword')} className="text-sm text-primary hover:underline">
                                {t('auth.forgotPasswordLink')}
                            </button>
                        </div>
                         <button onClick={() => switchView('signup')} className="text-sm text-primary hover:underline mt-4">
                            {t('auth.switchToSignup')}
                        </button>
                    </>
                );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background dark:bg-gray-900 px-4">
            <div className="w-full max-w-md p-8 space-y-4 bg-card dark:bg-gray-800 rounded-lg shadow-lg text-center">
                 <div className="flex justify-end">
                    <LanguageSwitcher />
                </div>
                {message && <p className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">{message}</p>}
                {error && <p className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">{error}</p>}
                {renderContent()}
            </div>
        </div>
    );
};

// The following components were added to reconstruct the application's structure,
// as the original file was incomplete.

const Header: React.FC<{
  user: User | null;
  profile: UserProfile | null;
  onProfileUpdate: (updates: Partial<UserProfile>) => Promise<boolean>;
}> = ({ user, profile, onProfileUpdate }) => {
  const { t } = useTranslation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(profile?.name || '');

  const handleNameSave = async () => {
    if (name.trim() && name.trim() !== profile?.name) {
      const success = await onProfileUpdate({ name: name.trim() });
      if (success) {
        setIsEditingName(false);
      }
    } else {
      setIsEditingName(false);
    }
  };

  return (
    <header className="bg-card dark:bg-gray-800/50 shadow-md p-4 sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                className="px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                autoFocus
              />
              <button onClick={handleNameSave} className="text-green-500">✓</button>
              <button onClick={() => setIsEditingName(false)} className="text-red-500">×</button>
            </div>
          ) : (
            <h1 className="text-xl font-bold text-text-primary dark:text-gray-100 flex items-center gap-2">
              {t('header.greeting', { name: profile?.name || user?.email })}
              <button onClick={() => setIsEditingName(true)} className="text-text-secondary hover:text-primary">
                <PencilIcon className="w-4 h-4" />
              </button>
            </h1>
          )}
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
          >
            {t('header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};


const Dashboard: React.FC<{ session: Session }> = ({ session }) => {
    const { t } = useTranslation();
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    // Data state
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
    const [measurementEntries, setMeasurementEntries] = useState<MeasurementEntry[]>([]);
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('charts');
    const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
    const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
    const [editingWeight, setEditingWeight] = useState<WeightEntry | null>(null);
    const [editingMeasurement, setEditingMeasurement] = useState<MeasurementEntry | null>(null);
    const [schemaNeedsFix, setSchemaNeedsFix] = useState(false);
    
    const projectRef = useMemo(() => {
        try {
            return supabaseUrl ? new URL(supabaseUrl).hostname.split('.')[0] : null;
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const allAchievements: Achievement[] = useMemo(() => [
        { id: 'firstStep', titleKey: 'achievements.firstStep.title', descriptionKey: 'achievements.firstStep.description', Icon: RocketIcon },
        { id: 'fivePercent', titleKey: 'achievements.fivePercent.title', descriptionKey: 'achievements.fivePercent.description', Icon: StarIcon },
        { id: 'tenPercent', titleKey: 'achievements.tenPercent.title', descriptionKey: 'achievements.tenPercent.description', Icon: TrophyIcon },
        { id: 'bmiImproved', titleKey: 'achievements.bmiImproved.title', descriptionKey: 'achievements.bmiImproved.description', Icon: ShieldCheckIcon },
        { id: 'goalReached', titleKey: 'achievements.goalReached.title', descriptionKey: 'achievements.goalReached.description', Icon: TrophyIcon },
    ], []);

    const calculateBMI = useCallback((weightKg: number, heightCm: number): number | null => {
        if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) return null;
        return weightKg / ((heightCm / 100) ** 2);
    }, []);
    
    const getBMICategory = useCallback((bmi: number): string => {
        if (bmi < 18.5) return 'underweight';
        if (bmi < 25) return 'normal';
        if (bmi < 30) return 'overweight';
        if (bmi < 35) return 'obesity1';
        if (bmi < 40) return 'obesity2';
        return 'obesity3';
    }, []);

    const checkAchievements = useCallback((currentWeights: WeightEntry[], currentProfile: UserProfile) => {
        if (currentWeights.length === 0 || !currentProfile.height) return;

        const newUnlocked = new Set<string>();
        const startWeight = currentWeights[0].weight;
        const latestWeight = currentWeights[currentWeights.length - 1].weight;

        // 1. First Step
        if (currentWeights.length >= 1) newUnlocked.add('firstStep');

        // 2. Weight Loss Percentages
        if (startWeight > latestWeight) {
            const lossPercentage = ((startWeight - latestWeight) / startWeight) * 100;
            if (lossPercentage >= 5) newUnlocked.add('fivePercent');
            if (lossPercentage >= 10) newUnlocked.add('tenPercent');
        }

        // 3. BMI Category Improved
        if (currentWeights.length > 1) {
            const startBmi = calculateBMI(startWeight, currentProfile.height);
            const latestBmi = calculateBMI(latestWeight, currentProfile.height);
            if (startBmi && latestBmi) {
                const startCat = getBMICategory(startBmi);
                const latestCat = getBMICategory(latestBmi);
                // A simple check if the category string changed for the better (lower index in this ordered array)
                const categories = ['obesity3', 'obesity2', 'obesity1', 'overweight', 'normal'];
                if (categories.indexOf(latestCat) > categories.indexOf(startCat)) {
                    newUnlocked.add('bmiImproved');
                }
            }
        }

        // 4. Final Goal Reached
        if (currentProfile.goal_weight_final && latestWeight <= currentProfile.goal_weight_final) {
            newUnlocked.add('goalReached');
        }

        // Use functional update to avoid dependency on unlockedAchievements state
        setUnlockedAchievements(prevUnlocked => {
            const newlyUnlockedIds = [...newUnlocked].filter(id => !prevUnlocked.has(id));
            if (newlyUnlockedIds.length > 0) {
                const achievementToShow = allAchievements.find(a => a.id === newlyUnlockedIds[0]);
                setShowAchievement(achievementToShow || null);
            }
            return newUnlocked;
        });

    }, [allAchievements, calculateBMI, getBMICategory]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            // 1. Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileError) {
                if (profileError.message.includes('relation "public.profiles" does not exist') || profileError.message.includes('permission denied')) {
                    setError(t('dashboard.rlsErrorBody'));
                } else {
                    setError(t('dashboard.profileFetchError'));
                }
                setLoading(false);
                return;
            }

            if (profileData && (!profileData.hasOwnProperty('goal_weight_1') || !profileData.hasOwnProperty('weight_unit'))) {
                setSchemaNeedsFix(true);
            }
            setProfile(profileData);

            // 2. Fetch Weights
            const { data: weightData, error: weightError } = await supabase
                .from('weights')
                .select('*')
                .eq('user_id', session.user.id)
                .order('date', { ascending: true });

            if (weightError) {
                if (weightError.message.includes('relation "public.weights" does not exist') || weightError.message.includes('permission denied')) {
                    setError(t('dashboard.rlsErrorBody'));
                } else {
                    setError(t('dashboard.weightsFetchError'));
                }
                setLoading(false);
                return;
            }
            setWeightEntries(weightData || []);

            // 3. Fetch Measurements
            const { data: measurementData, error: measurementError } = await supabase
                .from('measurements')
                .select('*')
                .eq('user_id', session.user.id)
                .order('date', { ascending: true });

            if (measurementError) {
                 if (measurementError.message.includes('relation "public.measurements" does not exist') || measurementError.message.includes('permission denied')) {
                    setError(t('dashboard.rlsErrorBody'));
                } else {
                    setError(t('dashboard.measurementFetchError'));
                }
                setLoading(false);
                return;
            }
            setMeasurementEntries(measurementData || []);

            // 4. Run calculations after all data is successfully fetched
            if (profileData && weightData) {
                checkAchievements(weightData, profileData);
            }

            setLoading(false);
        };
        fetchData();
    }, [session.user.id, t]); // Removed checkAchievements from dependencies to prevent loops

    // Data mutation handlers
    const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
        if (!profile) return false;
        if (schemaNeedsFix && ('goal_weight_1' in updates || 'weight_unit' in updates)) {
            alert(t('dashboard.profileUpdateSchemaError'));
            return false;
        }
        const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', profile.id);
        if (updateError) {
            const errorMessage = updateError.message || JSON.stringify(updateError, null, 2);
            alert(`${t('dashboard.profileUpdateError')} ${t('dashboard.errorDetails', { details: errorMessage })}`);
            return false;
        }
        const newProfile = { ...profile, ...updates };
        setProfile(newProfile);
        checkAchievements(weightEntries, newProfile);
        return true;
    };
    
    const handleAddWeightEntry = async (weightInKg: number, date: string): Promise<boolean> => {
        try {
            const { data, error } = await supabase
                .from('weights')
                .insert({ user_id: session.user.id, weight: weightInKg, date })
                .select()
                .single();

            if (error) {
                console.error('Supabase weight insert error:', error);
                const errorMessage = error.message || JSON.stringify(error, null, 2);
                alert(`${t('dashboard.weightAddError')} ${t('dashboard.errorDetails', { details: errorMessage })}`);
                return false;
            }
            
            if (data) {
                const newEntries = [...weightEntries, data].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setWeightEntries(newEntries);
                if(profile) checkAchievements(newEntries, profile);
                return true;
            }

            console.error('Supabase weight insert succeeded but no data was returned. Check SELECT RLS policy.');
            alert(`${t('dashboard.weightAddError')} ${t('dashboard.rlsErrorBody')}`);
            return false;
        } catch (e) {
            const error = e as Error;
            console.error('Caught an unexpected error during weight add:', error);
            const errorMessage = error.message || JSON.stringify(error, null, 2);
            alert(`${t('dashboard.weightAddError')} ${t('dashboard.errorDetails', { details: errorMessage })}`);
            return false;
        }
    };
    
    const handleDeleteWeightEntry = async (id: number) => {
        const { error } = await supabase.from('weights').delete().eq('id', id);
        if (error) {
            const errorMessage = error.message || JSON.stringify(error, null, 2);
            alert(`${t('dashboard.weightDeleteError')} ${t('dashboard.errorDetails', { details: errorMessage })}`);
        } else {
            const newEntries = weightEntries.filter(e => e.id !== id);
            setWeightEntries(newEntries);
            if(profile) checkAchievements(newEntries, profile);
        }
    };

    const handleUpdateWeightEntry = async (id: number, updates: { weight: number; date: string }) => {
        const { data, error } = await supabase.from('weights').update(updates).eq('id', id).select().single();
        if (error) {
            const errorMessage = error.message || JSON.stringify(error, null, 2);
            alert(`${t('dashboard.weightUpdateError')} ${t('dashboard.errorDetails', { details: errorMessage })}`);
        } else if (data) {
            const newEntries = weightEntries.map(e => e.id === id ? data : e).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setWeightEntries(newEntries);
            if(profile) checkAchievements(newEntries, profile);
            setEditingWeight(null);
        }
    };

    const handleAddMeasurementEntry = async (entry: Omit<MeasurementEntry, 'id' | 'user_id'>): Promise<boolean> => {
        try {
            const { data, error } = await supabase
                .from('measurements')
                .insert({ user_id: session.user.id, ...entry })
                .select()
                .single();

            if (error) {
                console.error('Supabase measurement insert error:', error);
                const errorMessage = error.message || JSON.stringify(error, null, 2);
                alert(`${t('dashboard.measurementAddError')} ${t('dashboard.errorDetails', { details: errorMessage })}`);
                return false;
            }
            
            if (data) {
                setMeasurementEntries(prev => [...prev, data].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
                return true;
            }

            console.error('Supabase measurement insert succeeded but no data was returned. Check SELECT RLS policy.');
            alert(`${t('dashboard.measurementAddError')} ${t('dashboard.rlsErrorBody')}`);
            return false;
        } catch (e) {
            const error = e as Error;
            console.error('Caught an unexpected error during measurement add:', error);
            const errorMessage = error.message || JSON.stringify(error, null, 2);
            alert(`${t('dashboard.measurementAddError')} ${t('dashboard.errorDetails', { details: errorMessage })}`);
            return false;
        }
    };

    const handleDeleteMeasurementEntry = async (id: number) => {
        const { error } = await supabase.from('measurements').delete().eq('id', id);
        if (error) {
            const errorMessage = error.message || JSON.stringify(error, null, 2);
            alert(`${t('dashboard.measurementDeleteError')} ${t('dashboard.errorDetails', { details: errorMessage })}`);
        } else {
            setMeasurementEntries(prev => prev.filter(e => e.id !== id));
        }
    };

    const handleUpdateMeasurementEntry = async (id: number, updates: Omit<MeasurementEntry, 'id' | 'user_id'>) => {
        const { data, error } = await supabase.from('measurements').update(updates).eq('id', id).select().single();
        if (error) {
            const errorMessage = error.message || JSON.stringify(error, null, 2);
            alert(`${t('dashboard.measurementUpdateError')} ${t('dashboard.errorDetails', { details: errorMessage })}`);
        } else if (data) {
            setMeasurementEntries(prev => prev.map(e => e.id === id ? data : e).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            setEditingMeasurement(null);
        }
    };

    const bmiChartData = useMemo(() => {
        if (!profile || !profile.height) return [];
        return weightEntries.map(entry => ({
            date: entry.date,
            bmi: parseFloat(calculateBMI(entry.weight, profile.height!)!.toFixed(1))
        }));
    }, [weightEntries, profile, calculateBMI]);
    
    if (loading) return <div className="flex justify-center items-center h-screen">{t('auth.loading')}</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!profile) return <div className="p-8 text-center">{t('dashboard.syncErrorBody')}</div>;
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header user={session.user} profile={profile} onProfileUpdate={handleProfileUpdate} />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <BMICard profile={profile} entries={weightEntries} onProfileUpdate={handleProfileUpdate} schemaNeedsFix={schemaNeedsFix} projectRef={projectRef} />
                        <GoldenRatioCard profile={profile} weightEntries={weightEntries} measurementEntries={measurementEntries} theme={theme} />
                        <Achievements allAchievements={allAchievements} unlockedIds={unlockedAchievements} />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                           <WeightChart data={weightEntries} weightUnit={profile.weight_unit || 'kg'} theme={theme} />
                        </div>
                         <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                           <BMIChart data={bmiChartData} theme={theme} />
                        </div>
                        <div className="space-y-6">
                            <WeightForm onAddEntry={handleAddWeightEntry} weightUnit={profile.weight_unit || 'kg'} />
                            <MeasurementForm onAddEntry={handleAddMeasurementEntry} measurementUnit={profile.measurement_unit || 'cm'} />
                            <WeightHistory entries={weightEntries} onDeleteEntry={handleDeleteWeightEntry} onEditEntry={setEditingWeight} weightUnit={profile.weight_unit || 'kg'} />
                            <MeasurementHistory entries={measurementEntries} onDeleteEntry={handleDeleteMeasurementEntry} onEditEntry={setEditingMeasurement} measurementUnit={profile.measurement_unit || 'cm'} />
                            <AICoach profile={profile} weightEntries={weightEntries} measurementEntries={measurementEntries} />
                        </div>
                    </div>
                </div>
            </main>
            <AchievementModal achievement={showAchievement} onClose={() => setShowAchievement(null)} />
            <EditWeightModal entry={editingWeight} onClose={() => setEditingWeight(null)} onSave={handleUpdateWeightEntry} weightUnit={profile.weight_unit || 'kg'} />
            <EditMeasurementModal entry={editingMeasurement} onClose={() => setEditingMeasurement(null)} onSave={handleUpdateMeasurementEntry} measurementUnit={profile.measurement_unit || 'cm'} />
        </div>
    );
};


const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
   
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div>{t('auth.loading')}</div></div>;
  }
  
  if (supabaseError) {
      return <div className="p-4 text-red-500 text-center">{supabaseError}</div>
  }

  return (
    <div className="bg-background dark:bg-gray-900 text-text-primary dark:text-gray-200 min-h-screen">
      {session ? <Dashboard session={session} key={session.user.id} /> : <Auth />}
    </div>
  );
};

// FIX: The file was missing a default export, which caused an error in index.tsx.
// The main App component is now exported by default.
export default App;