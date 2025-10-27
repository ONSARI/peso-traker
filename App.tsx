import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, WeightEntry, Achievement } from './types';
import { supabase } from './supabaseClient';
import { BMICard } from './components/BMICard';
import { WeightChart } from './components/WeightChart';
import { BMIChart } from './components/BMIChart';
import { WeightForm } from './components/WeightForm';
import { WeightHistory } from './components/WeightHistory';
import { Achievements } from './components/Achievements';
import { AchievementModal } from './components/AchievementModal';
import { TrophyIcon, RocketIcon, StarIcon, ShieldCheckIcon } from './components/icons';
import type { Country } from './countries';
import { getCountriesByLanguage } from './countries';
import { useTranslation, Trans } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import useLocalStorage from './hooks/useLocalStorage';


// --- Components ---

const Auth: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const [view, setView] = useState<'login' | 'signup' | 'verifyPhone' | 'forgotPassword' | 'updatePassword'>('login');
    const [loginLocalPhone, setLoginLocalPhone] = useState('');
    const [localPhoneForReset, setLocalPhoneForReset] = useState('');
    const [phoneForReset, setPhoneForReset] = useState('');

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [height, setHeight] = useState(''); // For cm
    const [heightFt, setHeightFt] = useState(''); // For feet
    const [heightIn, setHeightIn] = useState(''); // For inches
    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
    const [phone, setPhone] = useState(''); // Stores the full phone number for OTP verification
    const [localPhone, setLocalPhone] = useState(''); // Stores just the local part of the number
    const [countries, setCountries] = useState<Country[]>(getCountriesByLanguage(i18n.language));
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.code === 'ES') || countries[0]);
    const [phoneOtp, setPhoneOtp] = useState('');
    
    useEffect(() => {
        setCountries(getCountriesByLanguage(i18n.language));
    }, [i18n.language]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        const fullPhoneNumber = `${selectedCountry.dial_code}${localPhone}`;
        setPhone(fullPhoneNumber);

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

        const { error } = await supabase.auth.signUp({
            phone: fullPhoneNumber,
            password,
            options: {
                data: {
                    name,
                    dob,
                    height: heightInCm,
                    height_unit: heightUnit,
                    weight_unit: 'kg' // Default weight unit
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setMessage(t('auth.otpSuccessMessage'));
        setView('verifyPhone');
        setLoading(false);
    };
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const credentials = { phone: `${selectedCountry.dial_code}${loginLocalPhone}`, password };

        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.verifyOtp({ phone, token: phoneOtp, type: 'sms' });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            const { name, dob, height } = data.user.user_metadata;
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: data.user.id,
                    name,
                    dob,
                    height,
                });

            if (profileError) {
                setError(t('auth.profileCreationError', { message: profileError.message }));
                await supabase.auth.signOut();
                setLoading(false);
                return;
            }
        }
        setLoading(false);
    };

    const handlePasswordResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        const fullPhoneNumber = `${selectedCountry.dial_code}${localPhoneForReset}`;
        setPhoneForReset(fullPhoneNumber);

        const { error } = await supabase.auth.signInWithOtp({
            phone: fullPhoneNumber,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage(t('auth.resetCodeSuccessMessage'));
            setView('updatePassword');
        }
        setLoading(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        const { data, error } = await supabase.auth.verifyOtp({
            phone: phoneForReset,
            token: phoneOtp,
            type: 'sms'
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }
        
        // OTP verification successful, user is now in a session, update password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (updateError) {
            setError(updateError.message);
        } else {
            // Sign out for security after password change
            await supabase.auth.signOut();
            setMessage(t('auth.passwordUpdateSuccess'));
            setView('login');
            // Clear sensitive fields
            setPhoneOtp('');
            setNewPassword('');
            setPhoneForReset('');
            setLocalPhoneForReset('');
        }
        
        setLoading(false);
    };


    const switchView = (newView: 'login' | 'signup' | 'forgotPassword') => {
        setView(newView);
        setError(null);
        setMessage('');
        setPassword('');
        setLoginLocalPhone('');
    }

    const renderContent = () => {
        switch (view) {
             case 'updatePassword':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('auth.updatePasswordTitle')}</h2>
                        <p className="text-text-secondary dark:text-gray-400 mb-6">{t('auth.updatePasswordInstruction', { phone: phoneForReset })}</p>
                        <form noValidate onSubmit={handleUpdatePassword} className="flex flex-col items-center justify-center gap-4">
                            <input type="tel" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder={t('auth.otpPlaceholder')} required maxLength={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-center tracking-[1rem] dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t('auth.newPasswordPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2 disabled:bg-gray-400">
                                {loading ? t('auth.updatingPasswordButton') : t('auth.updatePasswordButton')}
                            </button>
                        </form>
                         <button onClick={() => setView('login')} className="text-sm text-primary hover:underline mt-4">
                            {t('auth.backToLogin')}
                        </button>
                    </>
                );
            case 'forgotPassword':
                return (
                     <>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('auth.forgotPasswordTitle')}</h2>
                        <p className="text-text-secondary dark:text-gray-400 mb-6">{t('auth.forgotPasswordInstruction')}</p>
                        <form noValidate onSubmit={handlePasswordResetRequest} className="flex flex-col items-center justify-center gap-4">
                            <div className="w-full">
                                <div className="flex rtl:flex-row-reverse">
                                     <select
                                        id="country-code-reset"
                                        value={selectedCountry.code}
                                        onChange={(e) => {
                                            const country = countries.find(c => c.code === e.target.value);
                                            if (country) setSelectedCountry(country);
                                        }}
                                        className="bg-gray-100 border border-gray-300 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg border-r-0 rtl:border-r rtl:border-l-0 pl-3 pr-4 rtl:pl-4 rtl:pr-3 py-2 text-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        aria-label="Country code"
                                    >
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} {country.dial_code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        id="phone-input-reset"
                                        type="tel"
                                        value={localPhoneForReset}
                                        onChange={(e) => setLocalPhoneForReset(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder={t('auth.phonePlaceholder')}
                                        required
                                        className="w-full px-4 py-2 text-lg border border-gray-300 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg focus:ring-2 focus:ring-primary focus:border-transparent z-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2 disabled:bg-gray-400">
                                {loading ? t('auth.sendingCodeButton') : t('auth.sendResetCodeButton')}
                            </button>
                        </form>
                         <button onClick={() => switchView('login')} className="text-sm text-primary hover:underline mt-4">
                            {t('auth.backToLogin')}
                        </button>
                    </>
                );
            case 'verifyPhone':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('auth.verifyTitle')}</h2>
                        <p className="text-text-secondary dark:text-gray-400 mb-6">{t('auth.verifyInstruction', { phone })}</p>
                        <form noValidate onSubmit={handleVerifyPhoneOtp} className="flex flex-col items-center justify-center gap-4">
                            <input type="tel" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="123456" required maxLength={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-center tracking-[1rem] dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2 disabled:bg-gray-400">
                                {loading ? t('auth.verifyingButton') : t('auth.verifyButton')}
                            </button>
                        </form>
                         <button onClick={() => setView('signup')} className="text-sm text-primary hover:underline mt-4">
                            {t('auth.backToSignup')}
                        </button>
                    </>
                );
            case 'signup':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('auth.signupTitle')}</h2>
                        <p className="text-text-secondary dark:text-gray-400 mb-6">{t('auth.signupInstruction')}</p>
                        <form noValidate onSubmit={handleSignUp} className="flex flex-col items-center justify-center gap-4">
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

                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.passwordPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            
                            <div className="w-full">
                                <div className="flex rtl:flex-row-reverse">
                                    <select
                                        id="country-code"
                                        value={selectedCountry.code}
                                        onChange={(e) => {
                                            const country = countries.find(c => c.code === e.target.value);
                                            if (country) setSelectedCountry(country);
                                        }}
                                        className="bg-gray-100 border border-gray-300 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg border-r-0 rtl:border-r rtl:border-l-0 pl-3 pr-4 rtl:pl-4 rtl:pr-3 py-2 text-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        aria-label="Country code"
                                    >
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} {country.dial_code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        id="phone-input"
                                        type="tel"
                                        value={localPhone}
                                        onChange={(e) => setLocalPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder={t('auth.phonePlaceholder')}
                                        required
                                        className="w-full px-4 py-2 text-lg border border-gray-300 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg focus:ring-2 focus:ring-primary focus:border-transparent z-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <p className="text-xs text-text-secondary dark:text-gray-400 mt-1 text-left rtl:text-right">{t('auth.phoneVerificationNotice')}</p>
                            </div>

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
                            <div className="w-full">
                                <div className="flex rtl:flex-row-reverse">
                                    <select
                                        id="country-code-login"
                                        value={selectedCountry.code}
                                        onChange={(e) => {
                                            const country = countries.find(c => c.code === e.target.value);
                                            if (country) setSelectedCountry(country);
                                        }}
                                        className="bg-gray-100 border border-gray-300 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg border-r-0 rtl:border-r rtl:border-l-0 pl-3 pr-4 rtl:pl-4 rtl:pr-3 py-2 text-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        aria-label="Country code"
                                    >
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} {country.dial_code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        id="phone-input-login"
                                        type="tel"
                                        value={loginLocalPhone}
                                        onChange={(e) => setLoginLocalPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder={t('auth.loginPhonePlaceholder')}
                                        required
                                        className="w-full px-4 py-2 text-lg border border-gray-300 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg focus:ring-2 focus:ring-primary focus:border-transparent z-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.passwordPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <button onClick={() => switchView('forgotPassword')} type="button" className="text-sm text-text-secondary dark:text-gray-400 hover:text-primary hover:underline self-end">
                                {t('auth.forgotPasswordLink')}
                            </button>
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2 disabled:bg-gray-400">
                                {loading ? t('auth.loggingInButton') : t('auth.loginButton')}
                            </button>
                        </form>
                        <button onClick={() => switchView('signup')} className="text-sm text-primary hover:underline mt-4">
                           {t('auth.switchToSignup')}
                        </button>
                    </>
                );
        }
    }


    return (
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
            <div className="bg-card dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md mx-auto w-full">
                {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 dark:bg-green-900/50 dark:text-green-300">{message}</p>}
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 dark:bg-red-900/50 dark:text-red-300">{error}</p>}
                {renderContent()}
            </div>
        </main>
    );
};

const DarkModeToggle: React.FC<{ theme: 'light' | 'dark'; onToggle: () => void }> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full text-text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

const Header: React.FC<{ name: string; onNameChange: (name: string) => void; onSignOut: () => void; theme: 'light' | 'dark'; onThemeToggle: () => void; }> = ({ name, onNameChange, onSignOut, theme, onThemeToggle }) => {
    const { t } = useTranslation();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(name || '');

    useEffect(() => {
        setNewName(name || '');
    }, [name]);

    const handleNameSave = () => {
        if (newName.trim()) {
            onNameChange(newName.trim());
            setIsEditingName(false);
        }
    };

    return (
        <header className="bg-card dark:bg-gray-800 shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center rtl:flex-row-reverse">
                <div className="flex items-center gap-3 rtl:flex-row-reverse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.59L7.41 14l1.41-1.41L11 15.17l4.59-4.59L17 12l-6 6z"/>
                    </svg>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary">PesoZen</h1>
                    <LanguageSwitcher />
                </div>

                <div className="flex items-center gap-4 rtl:flex-row-reverse">
                    {isEditingName ? (
                        <div className="flex items-center gap-2">
                           <input 
                                type="text" 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)} 
                                className="px-2 py-1 border border-gray-300 rounded-md text-text-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()} 
                                autoFocus 
                            />
                            <button onClick={handleNameSave} className="text-green-500 hover:text-green-700 p-1">✓</button>
                            <button onClick={() => { setIsEditingName(false); setNewName(name || ''); }} className="text-red-500 hover:text-red-700 p-1">×</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-text-secondary dark:text-gray-400 hidden sm:inline">{t('header.greeting', { name })}</span>
                             <button onClick={() => setIsEditingName(true)} className="text-text-secondary dark:text-gray-400 hover:text-primary" aria-label={t('header.editName')}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                            </button>
                        </div>
                    )}
                    <DarkModeToggle theme={theme} onToggle={onThemeToggle} />
                     <button onClick={onSignOut} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors">{t('header.logout')}</button>
                </div>
            </div>
        </header>
    );
};

interface DashboardProps {
    profile: UserProfile;
    weightEntries: WeightEntry[];
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onProfileUpdate: (updates: Partial<UserProfile>) => void;
    onAddWeightEntry: (weight: number, date: string) => void;
    onDeleteWeightEntry: (id: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, weightEntries, theme, onThemeToggle, onProfileUpdate, onAddWeightEntry, onDeleteWeightEntry }) => {
    const { t } = useTranslation();
    const [activeChart, setActiveChart] = useState<'weight' | 'bmi'>('weight');

    const sortedEntries = useMemo(() => {
        return [...weightEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [weightEntries]);

    // --- Achievements Logic ---
    const ALL_ACHIEVEMENTS: Omit<Achievement, 'Icon'>[] = useMemo(() => [
        { id: 'FIRST_STEP', titleKey: 'achievements.firstStep.title', descriptionKey: 'achievements.firstStep.description' },
        { id: 'FIVE_PERCENT', titleKey: 'achievements.fivePercent.title', descriptionKey: 'achievements.fivePercent.description' },
        { id: 'TEN_PERCENT', titleKey: 'achievements.tenPercent.title', descriptionKey: 'achievements.tenPercent.description' },
        { id: 'BMI_IMPROVED', titleKey: 'achievements.bmiImproved.title', descriptionKey: 'achievements.bmiImproved.description' },
        { id: 'GOAL_REACHED', titleKey: 'achievements.goalReached.title', descriptionKey: 'achievements.goalReached.description' },
    ], []);

    const ICONS_MAP: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
        FIRST_STEP: TrophyIcon,
        FIVE_PERCENT: RocketIcon,
        TEN_PERCENT: RocketIcon,
        BMI_IMPROVED: ShieldCheckIcon,
        GOAL_REACHED: StarIcon,
    };

    const getBmiCategoryValue = (bmi: number): number => {
        if (bmi < 18.5) return 0; // Underweight
        if (bmi < 25) return 1;  // Normal
        if (bmi < 30) return 2;  // Overweight
        return 3; // Obesity
    };
    
    const calculateBMI = (weightKg: number, heightCm: number): number | null => {
        if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) return null;
        const heightInMeters = heightCm / 100;
        return weightKg / (heightInMeters * heightInMeters);
    }

    const unlockedAchievementIds = useMemo(() => {
        const unlocked = new Set<string>();
        if (!sortedEntries.length || !profile.height) return unlocked;

        const firstEntry = sortedEntries[0];
        const latestEntry = sortedEntries[sortedEntries.length - 1];

        // 1. First Step
        if (sortedEntries.length >= 1) {
            unlocked.add('FIRST_STEP');
        }

        // 2. Weight Loss Milestones
        const weightLost = firstEntry.weight - latestEntry.weight;
        if (weightLost > 0) {
            if (weightLost >= firstEntry.weight * 0.05) unlocked.add('FIVE_PERCENT');
            if (weightLost >= firstEntry.weight * 0.10) unlocked.add('TEN_PERCENT');
        }

        // 3. BMI Improvement
        const initialBmi = calculateBMI(firstEntry.weight, profile.height);
        const latestBmi = calculateBMI(latestEntry.weight, profile.height);
        if (initialBmi && latestBmi) {
            if (getBmiCategoryValue(latestBmi) < getBmiCategoryValue(initialBmi)) {
                unlocked.add('BMI_IMPROVED');
            }
        }
        
        // 4. Goal Reached
        if (profile.goal_weight && Math.abs(latestEntry.weight - profile.goal_weight) < 0.1) {
            unlocked.add('GOAL_REACHED');
        }

        return unlocked;
    }, [sortedEntries, profile]);

    const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);
    const [seenAchievements, setSeenAchievements] = useLocalStorage<string[]>('seenAchievements', []);

    useEffect(() => {
        const unseenUnlocked = [...unlockedAchievementIds].filter(id => !seenAchievements.includes(id));
        if (unseenUnlocked.length > 0) {
            const achievementToCelebrate = ALL_ACHIEVEMENTS.find(ach => ach.id === unseenUnlocked[0]);
            if(achievementToCelebrate) {
                setNewlyUnlocked({ ...achievementToCelebrate, Icon: ICONS_MAP[achievementToCelebrate.id] });
                setSeenAchievements(prev => [...prev, ...unseenUnlocked]);
            }
        }
    }, [unlockedAchievementIds, seenAchievements, setSeenAchievements, ALL_ACHIEVEMENTS, ICONS_MAP]);
    
    const bmiData = useMemo(() => {
        if (!profile.height || profile.height <= 0) return [];
        const heightInMeters = profile.height / 100;
        return sortedEntries.map(entry => ({
            date: entry.date,
            bmi: parseFloat((entry.weight / (heightInMeters * heightInMeters)).toFixed(1))
        }));
    }, [sortedEntries, profile.height]);

    const weightUnit = profile.weight_unit || 'kg';

    return (
         <>
            <Header 
                name={profile.name} 
                onNameChange={(name) => onProfileUpdate({ name })} 
                onSignOut={() => supabase.auth.signOut()}
                theme={theme}
                onThemeToggle={onThemeToggle}
            />
            <AchievementModal achievement={newlyUnlocked} onClose={() => setNewlyUnlocked(null)} />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
                        <BMICard profile={profile} entries={sortedEntries} onProfileUpdate={onProfileUpdate} />
                        <WeightForm onAddEntry={onAddWeightEntry} weightUnit={weightUnit}/>
                         <Achievements 
                            allAchievements={ALL_ACHIEVEMENTS.map(a => ({...a, Icon: ICONS_MAP[a.id]}))}
                            unlockedIds={unlockedAchievementIds} 
                        />
                    </div>
                    <div className="lg:col-span-2 bg-card dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                           <button
                               onClick={() => setActiveChart('weight')}
                               className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeChart === 'weight' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-gray-200'}`}
                           >
                               {t('dashboard.weightTrend')}
                           </button>
                           <button
                               onClick={() => setActiveChart('bmi')}
                               className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeChart === 'bmi' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-gray-200'}`}
                           >
                               {t('dashboard.bmiTrend')}
                           </button>
                       </div>
                       <div className="mt-4">
                           {activeChart === 'weight' ? (
                               <WeightChart data={sortedEntries} weightUnit={weightUnit} theme={theme} />
                           ) : (
                               <BMIChart data={bmiData} theme={theme} />
                           )}
                       </div>
                    </div>
                    <div className="lg:col-span-3">
                        <WeightHistory entries={sortedEntries} onDeleteEntry={onDeleteWeightEntry} weightUnit={weightUnit} />
                    </div>
                </div>
            </main>
        </>
    )
}


const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [session, setSession] = useState<Session | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [weights, setWeights] = useState<WeightEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

     useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.documentElement.dir = i18n.dir(i18n.language);
    }, [i18n, i18n.language]);

    const fetchData = useCallback(async (currentSession: Session) => {
        setLoading(true);
        setFetchError(null);

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

        if (profileError) {
            console.error(`Error fetching profile:`, profileError.message);
            setFetchError(t('dashboard.profileFetchError'));
            setLoading(false);
            return;
        }

        const fullProfile: UserProfile = {
            ...profileData,
            weight_unit: currentSession.user.user_metadata.weight_unit || 'kg',
            height_unit: currentSession.user.user_metadata.height_unit || 'cm',
            goal_weight: currentSession.user.user_metadata.goal_weight || null,
        };
        setUserProfile(fullProfile);

        const { data: weightsData, error: weightsError } = await supabase
            .from('weights')
            .select('*')
            .eq('user_id', currentSession.user.id);
        
        if (weightsError) {
            console.error('Error fetching weights:', weightsError.message);
            setFetchError(t('dashboard.weightsFetchError'));
        } else {
            setWeights(weightsData || []);
        }
        
        setLoading(false);
    }, [t]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchData(session);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            if (newSession) {
                fetchData(newSession);
            } else {
                setUserProfile(null);
                setWeights([]);
                setFetchError(null);
                setLoading(false);
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [fetchData]);

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!userProfile) return;

        const oldProfile = { ...userProfile };
        const newProfile = { ...userProfile, ...updates };
        setUserProfile(newProfile); // Optimistic UI update

        const profileTableUpdates: { [key: string]: any } = {};
        const userMetadataUpdates: { [key: string]: any } = {};
        const validProfileKeys: (keyof UserProfile)[] = ['name', 'height', 'dob'];

        Object.keys(updates).forEach(key => {
            const typedKey = key as keyof UserProfile;
            if (typedKey === 'weight_unit' || typedKey === 'height_unit' || typedKey === 'goal_weight') {
                userMetadataUpdates[typedKey] = updates[typedKey];
            } else if (validProfileKeys.includes(typedKey)) {
                profileTableUpdates[typedKey] = updates[typedKey];
            }
        });

        let hasError = false;

        if (Object.keys(profileTableUpdates).length > 0) {
            const { error } = await supabase.from('profiles').update(profileTableUpdates).eq('id', userProfile.id);
            if (error) {
                console.error("Error updating profile:", error.message);
                hasError = true;
            }
        }

        if (Object.keys(userMetadataUpdates).length > 0) {
            const { error } = await supabase.auth.updateUser({ data: userMetadataUpdates });
            if (error) {
                console.error("Error updating user metadata:", error.message);
                hasError = true;
            }
        }

        if (hasError) {
            setUserProfile(oldProfile); // Revert on any error
        }
    };

    const addWeightEntry = useCallback(async (weight: number, date: string) => {
        if (!userProfile) return;
        const existingEntry = weights.find(entry => entry.date === date);

        if (existingEntry) {
            const { data, error } = await supabase.from('weights').update({ weight }).eq('id', existingEntry.id).select().single();
            if (error) return console.error(error.message);
            if (data) {
                setWeights(entries => entries.map(e => e.id === existingEntry.id ? data : e));
            }
        } else {
            const { data, error } = await supabase.from('weights').insert({ date: date, weight: weight, user_id: userProfile.id }).select().single();
            if (error) return console.error(error.message);
            if(data) {
                setWeights(prevEntries => [...prevEntries, data]);
            }
        }
    }, [weights, userProfile]);

    const deleteWeightEntry = useCallback(async (id: number) => {
        const oldWeights = [...weights];
        setWeights(prevEntries => prevEntries.filter(entry => entry.id !== id));
        const { error } = await supabase.from('weights').delete().eq('id', id);
        if (error) {
            console.error("Error deleting weight:", error.message);
            setWeights(oldWeights); // Revert on error
        }
    }, [weights]);
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 text-text-secondary dark:text-gray-400">{t('auth.loading')}</div>;
    }

    if (!session) {
        return <Auth />;
    }
    
    if (fetchError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-4 bg-background dark:bg-gray-900">
                <div className="bg-card dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">{t('dashboard.dataErrorTitle')}</h2>
                    <p className="text-text-secondary dark:text-gray-400 mb-4">{fetchError}</p>
                    <div className="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg text-left rtl:text-right">
                        <h3 className="font-bold text-text-primary dark:text-gray-200 mb-2">{t('dashboard.rlsErrorTitle')}</h3>
                        <p className="text-sm text-text-secondary dark:text-gray-400">
                            <Trans i18nKey="dashboard.rlsErrorBody">
                                This error almost always occurs because the <strong>profiles</strong> and <strong>weights</strong> tables do not have the correct Row Level Security (RLS) policies. Without them, your application does not have permission to read the data.
                            </Trans>
                        </p>
                        <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">
                             <Trans i18nKey="dashboard.rlsErrorSolution">
                                <strong>Solution:</strong> Go to the <strong>SQL Editor</strong> in your Supabase dashboard and run the RLS setup script to create the necessary policies.
                            </Trans>
                        </p>
                    </div>
                    <button onClick={() => supabase.auth.signOut()} className="mt-6 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors">
                        {t('dashboard.tryAgainButton')}
                    </button>
                </div>
            </div>
        );
    }
    
    if (!userProfile) {
        return (
             <div className="min-h-screen flex items-center justify-center text-center p-4 bg-background dark:bg-gray-900">
                <div className="bg-card dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">{t('dashboard.syncErrorTitle')}</h2>
                    <p className="text-text-secondary dark:text-gray-400 mb-4">{t('dashboard.syncErrorBody')}</p>
                     <button onClick={() => supabase.auth.signOut()} className="mt-6 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors">
                        {t('dashboard.tryAgainButton')}
                    </button>
                </div>
            </div>
        )
    }

    return <Dashboard 
        profile={userProfile} 
        weightEntries={weights} 
        theme={theme} 
        onThemeToggle={handleThemeToggle} 
        onProfileUpdate={updateProfile}
        onAddWeightEntry={addWeightEntry}
        onDeleteWeightEntry={deleteWeightEntry}
    />;
};

export default App;