import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, WeightEntry, Achievement, Country, MeasurementEntry } from './types';
import { supabase, supabaseUrl } from './supabaseClient';
import { BMICard } from './components/BMICard';
import { WeightChart } from './components/WeightChart';
import { BMIChart } from './components/BMIChart';
import { WeightForm } from './components/WeightForm';
import { WeightHistory } from './components/WeightHistory';
import { Achievements } from './components/Achievements';
import { AchievementModal } from './components/AchievementModal';
import { TrophyIcon, RocketIcon, StarIcon, ShieldCheckIcon } from './components/icons';
import { useTranslation, Trans } from 'react-i18next';
import useLocalStorage from './hooks/useLocalStorage';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { getCountriesByLanguage } from './countries';
import { MeasurementForm } from './components/MeasurementForm';
import { MeasurementHistory } from './components/MeasurementHistory';
import { MeasurementChart } from './components/MeasurementChart';
import { AICoach } from './components/AICoach';
import { AvatarCard } from './components/AvatarCard';


// --- Components ---

interface PhoneInputProps {
    phone: string;
    setPhone: (value: string) => void;
    selectedCountry: Country | null;
    setSelectedCountry: (country: Country) => void;
    countries: Country[];
    countrySearch: string;
    setCountrySearch: (value: string) => void;
    isCountryDropdownOpen: boolean;
    setIsCountryDropdownOpen: (isOpen: boolean) => void;
    countryDropdownRef: React.RefObject<HTMLDivElement>;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    phone, setPhone,
    selectedCountry, setSelectedCountry,
    countries,
    countrySearch, setCountrySearch,
    isCountryDropdownOpen, setIsCountryDropdownOpen,
    countryDropdownRef
}) => {
    const { t } = useTranslation();

    const filteredCountries = countries.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dial_code.includes(countrySearch)
    );

    return (
        <div className="flex w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary dark:border-gray-600">
            <div ref={countryDropdownRef} className="relative">
                 <button type="button" onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-l-lg">
                    <span>{selectedCountry?.flag}</span>
                    <span className="text-sm text-text-secondary dark:text-gray-400">{selectedCountry?.dial_code}</span>
                 </button>
                 {isCountryDropdownOpen && (
                     <div className="absolute bottom-full mb-2 w-72 bg-card dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 z-10">
                         <div className="p-2">
                            <input type="text" value={countrySearch} onChange={e => setCountrySearch(e.target.value)} placeholder={t('auth.searchCountryPlaceholder')} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"/>
                         </div>
                         <ul className="max-h-60 overflow-y-auto">
                             {filteredCountries.map(country => (
                                 <li key={country.code}>
                                     <button type="button" onClick={() => { setSelectedCountry(country); setIsCountryDropdownOpen(false); setCountrySearch(''); }} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <span className="text-xl">{country.flag}</span>
                                        <span className="flex-grow text-text-primary dark:text-gray-200">{country.name}</span>
                                        <span className="text-text-secondary dark:text-gray-400">{country.dial_code}</span>
                                     </button>
                                 </li>
                             ))}
                         </ul>
                     </div>
                 )}
            </div>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('auth.phonePlaceholder')} required className="w-full px-4 py-2 border-0 bg-transparent focus:ring-0 dark:text-white" />
        </div>
    );
};

const Auth: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const [view, setView] = useState<'login' | 'signup' | 'otp' | 'forgotPassword' | 'updatePassword'>('login');
    
    // Form fields
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    // Country picker
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const countryDropdownRef = useRef<HTMLDivElement>(null);

    // Profile data for signup
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [height, setHeight] = useState('');
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');
    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');

    // To hold data between steps
    const [pendingAuthData, setPendingAuthData] = useState<{
        fullPhone: string;
        profileData?: Partial<UserProfile>;
        flow: 'login' | 'signup' | 'reset';
    } | null>(null);

    useEffect(() => {
        const loadedCountries = getCountriesByLanguage(i18n.language.split('-')[0]);
        setCountries(loadedCountries);
        // Default to a common country or auto-detect later
        setSelectedCountry(loadedCountries.find(c => c.code === 'US') || loadedCountries[0]);
    }, [i18n.language]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
                setIsCountryDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePhoneAuth = async (e: React.FormEvent, flow: 'login' | 'signup' | 'reset') => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        if (!selectedCountry || !phone) {
            setError(t('auth.invalidPhoneError'));
            setLoading(false);
            return;
        }

        const fullPhone = selectedCountry.dial_code + phone.replace(/\D/g, '');

        let profileData: Partial<UserProfile> | undefined;
        if (flow === 'signup') {
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
            profileData = { name: name.trim(), dob, height: heightInCm, height_unit: heightUnit, weight_unit: 'kg' };
        }

        const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });

        if (error) {
            setError(error.message);
        } else {
            setPendingAuthData({ fullPhone, profileData, flow });
            if (flow === 'reset') {
                setMessage(t('auth.resetCodeSuccessMessage'));
                setView('updatePassword');
            } else {
                 setMessage(t('auth.otpSuccessMessage'));
                 setView('otp');
            }
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pendingAuthData || !otp) return;

        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.verifyOtp({
            phone: pendingAuthData.fullPhone,
            token: otp,
            type: 'sms'
        });

        if (error) {
            setError(error.message);
        } else if (data.session && pendingAuthData.flow === 'signup' && pendingAuthData.profileData) {
            // A trigger in Supabase (`handle_new_user`) creates a profile row automatically.
            // Here, we just UPDATE it with the details from the form.
            const { error: profileError } = await supabase
                .from('profiles')
                .update(pendingAuthData.profileData)
                .eq('id', data.session.user.id);

            if (profileError) {
                setError(t('auth.profileCreationError', { message: profileError.message }));
                // If profile update fails, sign out to prevent inconsistent state
                await supabase.auth.signOut();
            }
        }
        // on success, the onAuthStateChange listener in App will handle the state change.
        setLoading(false);
    };
    
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pendingAuthData || !otp || !password) return;

        setLoading(true);
        setError(null);
        
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            phone: pendingAuthData.fullPhone,
            token: otp,
            type: 'sms'
        });

        if (verifyError) {
            setError(verifyError.message);
            setLoading(false);
            return;
        }

        if (verifyData.session) {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) {
                setError(updateError.message);
            } else {
                setMessage(t('auth.passwordUpdateSuccess'));
                setView('login');
                setPassword('');
                setOtp('');
            }
        }
        setLoading(false);
    };


    const switchView = (newView: 'login' | 'signup' | 'forgotPassword') => {
        setView(newView);
        setError(null);
        setMessage('');
        setPassword('');
        setPhone('');
        setOtp('');
    };

    const renderOtpScreen = (onSubmit: (e: React.FormEvent) => void, titleKey: string, instructionKey: string, buttonKey: string, verifyingKey: string) => (
        <>
            <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">{t(titleKey)}</h2>
            <p className="text-text-secondary dark:text-gray-400 mb-6">{t(instructionKey, { phone: pendingAuthData?.fullPhone })}</p>
            <form noValidate onSubmit={onSubmit} className="flex flex-col items-center justify-center gap-4">
                <input type="text" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t('auth.otpPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center tracking-[0.5em]" maxLength={6} />
                {view === 'updatePassword' && (
                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.newPasswordPlaceholder')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                )}
                <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2 disabled:bg-gray-400">
                    {loading ? t(verifyingKey) : t(buttonKey)}
                </button>
            </form>
             <button onClick={() => switchView('login')} className="text-sm text-primary hover:underline mt-4">
                {t('auth.backToLogin')}
            </button>
        </>
    );

    const renderContent = () => {
        switch (view) {
            case 'otp':
                return renderOtpScreen(handleVerifyOtp, 'auth.verifyTitle', 'auth.verifyInstruction', 'auth.verifyButton', 'auth.verifyingButton');
            case 'updatePassword':
                return renderOtpScreen(handleUpdatePassword, 'auth.updatePasswordTitle', 'auth.updatePasswordInstruction', 'auth.updatePasswordButton', 'auth.updatingPasswordButton');
            case 'forgotPassword':
                return (
                     <>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('auth.forgotPasswordTitle')}</h2>
                        <p className="text-text-secondary dark:text-gray-400 mb-6">{t('auth.forgotPasswordInstruction')}</p>
                        <form noValidate onSubmit={(e) => handlePhoneAuth(e, 'reset')} className="flex flex-col items-center justify-center gap-4">
                            <PhoneInput
                                phone={phone}
                                setPhone={setPhone}
                                selectedCountry={selectedCountry}
                                setSelectedCountry={setSelectedCountry}
                                countries={countries}
                                countrySearch={countrySearch}
                                setCountrySearch={setCountrySearch}
                                isCountryDropdownOpen={isCountryDropdownOpen}
                                setIsCountryDropdownOpen={setIsCountryDropdownOpen}
                                countryDropdownRef={countryDropdownRef}
                            />
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2 disabled:bg-gray-400">
                                {loading ? t('auth.sendingCodeButton') : t('auth.sendResetCodeButton')}
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
                        <form noValidate onSubmit={(e) => handlePhoneAuth(e, 'signup')} className="flex flex-col items-center justify-center gap-4">
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

                           <PhoneInput
                                phone={phone}
                                setPhone={setPhone}
                                selectedCountry={selectedCountry}
                                setSelectedCountry={setSelectedCountry}
                                countries={countries}
                                countrySearch={countrySearch}
                                setCountrySearch={setCountrySearch}
                                isCountryDropdownOpen={isCountryDropdownOpen}
                                setIsCountryDropdownOpen={setIsCountryDropdownOpen}
                                countryDropdownRef={countryDropdownRef}
                           />
                            
                            <p className="text-xs text-text-secondary dark:text-gray-400 mt-1 text-left rtl:text-right">{t('auth.phoneVerificationNotice')}</p>

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
                        <form noValidate onSubmit={(e) => handlePhoneAuth(e, 'login')} className="flex flex-col items-center justify-center gap-4">
                             <PhoneInput
                                phone={phone}
                                setPhone={setPhone}
                                selectedCountry={selectedCountry}
                                setSelectedCountry={setSelectedCountry}
                                countries={countries}
                                countrySearch={countrySearch}
                                setCountrySearch={setCountrySearch}
                                isCountryDropdownOpen={isCountryDropdownOpen}
                                setIsCountryDropdownOpen={setIsCountryDropdownOpen}
                                countryDropdownRef={countryDropdownRef}
                            />
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
            <div className="relative bg-card dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md mx-auto w-full">
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
                    <LanguageSwitcher />
                </div>
                {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 dark:bg-green-900/50 dark:text-green-300">{message}</p>}
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 dark:bg-red-900/50 dark:text-red-300">{error}</p>}
                {renderContent()}
            </div>
        </main>
    );
};

const RLSSetupGuide: React.FC<{ projectRef?: string }> = ({ projectRef }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const sqlEditorLink = projectRef 
        ? `https://app.supabase.com/project/${projectRef}/sql/new` 
        : `https://app.supabase.com/dashboard/project/${t('dashboard.rlsSolution.yourProjectRef')}/sql/new`;

    const fullSQLScript = t('dashboard.rlsSolution.fullSQLScript');

    const handleCopy = () => {
        navigator.clipboard.writeText(fullSQLScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="text-left rtl:text-right space-y-4">
            <p className="font-bold text-lg">{t('dashboard.rlsErrorTitle')}</p>
            <p className="text-sm">{t('dashboard.rlsErrorBody')}</p>
            
            <div className="space-y-2">
                <p className="font-semibold"><Trans i18nKey="dashboard.rlsSolution.step1" components={{ 1: <strong/> }} /></p>
                <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
                    <button onClick={handleCopy} className="absolute top-2 right-2 rtl:right-auto rtl:left-2 bg-gray-200 dark:bg-gray-700 text-xs font-semibold px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                        {copied ? t('dashboard.rlsSolution.copied') : t('dashboard.rlsSolution.copy')}
                    </button>
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all overflow-x-auto">
                        <code>{fullSQLScript}</code>
                    </pre>
                </div>
            </div>

            <p><Trans i18nKey="dashboard.rlsSolution.step2" components={{ 1: <a href={sqlEditorLink} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline"/> }} /></p>
            <p className="text-sm">{t('dashboard.rlsSolution.step3')}</p>
            <p className="text-sm">{t('dashboard.rlsSolution.step4')}</p>
        </div>
    );
}

const SchemaFixGuide: React.FC<{ projectRef?: string }> = ({ projectRef }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const sqlEditorLink = projectRef 
        ? `https://app.supabase.com/project/${projectRef}/sql/new` 
        : `https://app.supabase.com/dashboard/project/${t('dashboard.rlsSolution.yourProjectRef')}/sql/new`;

    const fullSQLScript = t('dashboard.schemaError.script');

    const handleCopy = () => {
        navigator.clipboard.writeText(fullSQLScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="text-left rtl:text-right space-y-4">
            <p className="font-bold text-lg">{t('dashboard.schemaError.title')}</p>
            <p className="text-sm">{t('dashboard.schemaError.body')}</p>
            
            <div className="space-y-2">
                <p className="font-semibold"><Trans i18nKey="dashboard.rlsSolution.step1" components={{ 1: <strong/> }} /></p>
                <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
                    <button onClick={handleCopy} className="absolute top-2 right-2 rtl:right-auto rtl:left-2 bg-gray-200 dark:bg-gray-700 text-xs font-semibold px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                        {copied ? t('dashboard.rlsSolution.copied') : t('dashboard.rlsSolution.copy')}
                    </button>
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all overflow-x-auto">
                        <code>{fullSQLScript}</code>
                    </pre>
                </div>
            </div>

            <p><Trans i18nKey="dashboard.rlsSolution.step2" components={{ 1: <a href={sqlEditorLink} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline"/> }} /></p>
            <p className="text-sm">{t('dashboard.rlsSolution.step3')}</p>
            <p className="text-sm">{t('dashboard.rlsSolution.step4')}</p>
        </div>
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z" />
        </svg>
      )}
    </button>
  );
};


const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [appError, setAppError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{title: string, body: React.ReactNode} | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<string[]>('unlocked_achievements', []);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [schemaNeedsFix, setSchemaNeedsFix] = useState(false);
  const { t } = useTranslation();

  const unlockedAchievementIds = useMemo(() => new Set(unlockedAchievements), [unlockedAchievements]);
  const projectRef = useMemo(() => supabaseUrl.match(/https:\/\/(\w+)\.supabase\.co/)?.[1], []);

  const allAchievements: Achievement[] = useMemo(() => [
    { id: 'first_step', titleKey: 'achievements.firstStep.title', descriptionKey: 'achievements.firstStep.description', Icon: RocketIcon },
    { id: 'five_percent_loss', titleKey: 'achievements.fivePercent.title', descriptionKey: 'achievements.fivePercent.description', Icon: StarIcon },
    { id: 'ten_percent_loss', titleKey: 'achievements.tenPercent.title', descriptionKey: 'achievements.tenPercent.description', Icon: StarIcon },
    { id: 'bmi_improved', titleKey: 'achievements.bmiImproved.title', descriptionKey: 'achievements.bmiImproved.description', Icon: ShieldCheckIcon },
    { id: 'goal_reached', titleKey: 'achievements.goalReached.title', descriptionKey: 'achievements.goalReached.description', Icon: TrophyIcon },
  ], []);
  
  const handleDatabaseError = useCallback((error: { message: string }) => {
    // RLS (permissions) error
    if (error.message.includes("security policy") || error.message.includes("violates row-level security")) {
         setErrorDetails({
            title: t('dashboard.dataErrorTitle'),
            body: <RLSSetupGuide projectRef={projectRef} />
        });
        return true;
    }
    // Schema error (missing column/table) - this is now a fallback for unexpected schema errors
    if (error.message.includes("column") && (error.message.includes("does not exist") || error.message.includes("Could not find"))) {
         setErrorDetails({
            title: t('dashboard.dataErrorTitle'),
            body: <SchemaFixGuide projectRef={projectRef} />
        });
        return true;
    }
    
    return false;
  }, [t, projectRef]);


  const fetchData = useCallback(async (currentUser: User) => {
    setErrorDetails(null);
    setLoading(true);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (profileError) {
      if (!handleDatabaseError(profileError)) {
        setAppError(t('dashboard.profileFetchError'));
      }
      setProfile(null);
    } else if (profileData) {
      if (profileData.goal_weight_final === undefined) {
        console.warn('Schema needs fix: goal_weight_final property is missing from profile data.');
        setSchemaNeedsFix(true);
      } else {
        setSchemaNeedsFix(false);
      }
      setProfile(profileData as UserProfile);
    }
    
    const { data: weightsData, error: weightsError } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('date', { ascending: true });

    if (weightsError) {
      console.error('Error fetching weights:', weightsError);
    } else {
      setEntries(weightsData || []);
    }
    
    const { data: measurementsData, error: measurementsError } = await supabase
      .from('measurements')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('date', { ascending: true });
    
    if (measurementsError) {
        console.error('Error fetching measurements:', measurementsError)
    } else {
        setMeasurements(measurementsData || []);
    }

    setLoading(false);
  }, [t, handleDatabaseError]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchData(currentUser);
      } else {
        setProfile(null);
        setEntries([]);
        setMeasurements([]);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchData]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user || !profile) return false;
    setAppError(null);
    setErrorDetails(null);

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating profile:', error);
       const isSchemaError = error.message.includes("column") && (error.message.includes("does not exist") || error.message.includes("Could not find"));
       if (isSchemaError) {
           setSchemaNeedsFix(true);
           setAppError(t('dashboard.profileUpdateError'));
       } else if (!handleDatabaseError(error)) {
        setAppError(`${t('dashboard.profileUpdateError')} ${t('dashboard.errorDetails', { details: error.message })}`);
      }
      return false;
    } else if (data) {
      setProfile(data as UserProfile);
       if (data.goal_weight_final !== undefined) {
           setSchemaNeedsFix(false);
       }
      return true;
    }
    return false;
  }, [user, profile, t, handleDatabaseError]);

  const addWeightEntry = useCallback(async (weightInKg: number, date: string) => {
    if (!user) return;
    setAppError(null);
    setErrorDetails(null);
    const { data, error } = await supabase
      .from('weights')
      .insert([{ weight: weightInKg, date, user_id: user.id }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding weight entry:', error);
      if (!handleDatabaseError(error)) {
        setAppError(`${t('dashboard.weightAddError')} ${t('dashboard.errorDetails', { details: error.message })}`);
      }
    } else if (data) {
      setEntries(prev => [...prev, data].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }
  }, [user, t, handleDatabaseError]);

  const deleteWeightEntry = useCallback(async (id: number) => {
    setAppError(null);
    setErrorDetails(null);
    const { error } = await supabase.from('weights').delete().eq('id', id);
    if (error) {
      console.error('Error deleting weight entry:', error);
      if (!handleDatabaseError(error)) {
         setAppError(`${t('dashboard.weightDeleteError')} ${t('dashboard.errorDetails', { details: error.message })}`);
      }
    } else {
      setEntries(prev => prev.filter(entry => entry.id !== id));
    }
  }, [t, handleDatabaseError]);

  const addMeasurement = useCallback(async (entry: Omit<MeasurementEntry, 'id' | 'user_id'>) => {
      if (!user) return;
      setAppError(null);
      const { data, error } = await supabase
        .from('measurements')
        .insert([{ ...entry, user_id: user.id }])
        .select()
        .single();
      
      if (error) {
          console.error('Error adding measurement entry:', error);
          setAppError(t('dashboard.measurementAddError'));
      } else if (data) {
          setMeasurements(prev => [...prev, data].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      }
  }, [user, t]);

  const deleteMeasurement = useCallback(async (id: number) => {
      const { error } = await supabase.from('measurements').delete().eq('id', id);
      if (error) {
          console.error('Error deleting measurement entry:', error);
          setAppError(t('dashboard.measurementDeleteError'));
      } else {
          setMeasurements(prev => prev.filter(entry => entry.id !== id));
      }
  }, [t]);

  const checkAchievements = useCallback(() => {
    if (entries.length === 0 || !profile) return;
    
    const newUnlocks: string[] = [];
    const startWeight = entries[0]?.weight;
    const latestWeight = entries[entries.length - 1]?.weight;

    // 1. First Step
    if (entries.length > 0 && !unlockedAchievementIds.has('first_step')) {
        newUnlocks.push('first_step');
    }

    // Weight loss achievements
    if (startWeight && latestWeight && latestWeight < startWeight) {
        const percentageLost = ((startWeight - latestWeight) / startWeight) * 100;
        // 2. 5% loss
        if (percentageLost >= 5 && !unlockedAchievementIds.has('five_percent_loss')) {
            newUnlocks.push('five_percent_loss');
        }
        // 3. 10% loss
        if (percentageLost >= 10 && !unlockedAchievementIds.has('ten_percent_loss')) {
            newUnlocks.push('ten_percent_loss');
        }
    }
    
    // 4. BMI Improved
    const calculateBMI = (weightKg: number, heightCm: number) => {
        if (!heightCm || heightCm <= 0) return null;
        const heightM = heightCm / 100;
        return weightKg / (heightM * heightM);
    };
    const getBmiCategory = (bmi: number) => {
        if (bmi < 18.5) return 0; // Underweight
        if (bmi < 25) return 1; // Normal
        if (bmi < 30) return 2; // Overweight
        if (bmi < 35) return 3; // Obesity I
        if (bmi < 40) return 4; // Obesity II
        return 5; // Obesity III
    };

    if (profile.height && startWeight && latestWeight) {
        const startBmi = calculateBMI(startWeight, profile.height);
        const latestBmi = calculateBMI(latestWeight, profile.height);
        if (startBmi && latestBmi && getBmiCategory(latestBmi) < getBmiCategory(startBmi) && !unlockedAchievementIds.has('bmi_improved')) {
             newUnlocks.push('bmi_improved');
        }
    }

    // 5. Goal Reached
    if (profile.goal_weight_final && latestWeight && latestWeight <= profile.goal_weight_final && !unlockedAchievementIds.has('goal_reached')) {
      newUnlocks.push('goal_reached');
    }

    if (newUnlocks.length > 0) {
      const achievementToShow = allAchievements.find(ach => ach.id === newUnlocks[0]);
      setNewAchievement(achievementToShow || null);
      setUnlockedAchievements(prev => [...prev, ...newUnlocks]);
    }

  }, [entries, profile, unlockedAchievementIds, setUnlockedAchievements, allAchievements]);

  useEffect(() => {
    checkAchievements();
  }, [entries, checkAchievements]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const bmiChartData = useMemo(() => {
    if (!profile?.height) return [];
    return entries.map(entry => ({
      date: entry.date,
      bmi: (entry.weight / Math.pow(profile.height / 100, 2)),
    }));
  }, [entries, profile?.height]);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.name || '');

  useEffect(() => {
    setNewName(profile?.name || '');
  }, [profile?.name]);
  
  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newName.trim()){
      const success = await updateProfile({ name: newName.trim() });
      if (success) {
        setEditingName(false);
      }
    }
  }

  if (!session || !user) {
    return <Auth />;
  }
  
  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl font-semibold text-text-secondary dark:text-gray-400">{t('auth.loading')}</div>
        </div>
    );
  }
  
  if (errorDetails) {
     return (
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
            <div className="bg-card dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto w-full">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">{errorDetails.title}</h2>
                <div className="text-text-secondary dark:text-gray-300 space-y-4">{errorDetails.body}</div>
                <button 
                    onClick={() => supabase.auth.signOut()} 
                    className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300"
                >
                    {t('dashboard.tryAgainButton')}
                </button>
            </div>
        </main>
     );
  }

  if (!profile) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="bg-card dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{t('dashboard.profileFetchError')}</h2>
          <p className="text-text-secondary dark:text-gray-300">{t('dashboard.syncErrorBody')}</p>
          <button 
              onClick={() => supabase.auth.signOut()} 
              className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300"
          >
              {t('dashboard.tryAgainButton')}
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <header className="bg-card dark:bg-gray-800 shadow-md relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
               {editingName ? (
                <form onSubmit={handleNameUpdate} className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    className="px-2 py-1 border-b-2 border-primary bg-transparent focus:outline-none dark:text-white"
                    autoFocus
                  />
                  <button type="submit" className="text-green-500 hover:text-green-700">✓</button>
                  <button type="button" onClick={() => setEditingName(false)} className="text-red-500 hover:text-red-700">×</button>
                </form>
               ) : (
                <>
                  <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">{t('header.greeting', { name: profile.name })}</h1>
                   <button onClick={() => setEditingName(true)} aria-label={t('header.editName')} className="text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                      </svg>
                   </button>
                </>
               )}
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher/>
              <DarkModeToggle theme={theme} onToggle={toggleTheme} />
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm font-semibold text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                {t('header.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>
       {appError && (
            <div className="fixed top-20 start-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-start dark:bg-red-900/80 dark:text-red-200 dark:border-red-600 max-w-md w-full">
                <div className="flex-grow">
                  <p>{appError}</p>
                </div>
                <button onClick={() => setAppError(null)} className="ml-4 -mt-1 -mr-2 text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-100">
                   <span className="text-2xl">&times;</span>
                </button>
            </div>
        )}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <BMICard profile={profile} entries={entries} onProfileUpdate={updateProfile} schemaNeedsFix={schemaNeedsFix} projectRef={projectRef} />
            <Achievements allAchievements={allAchievements} unlockedIds={unlockedAchievementIds} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeightForm onAddEntry={addWeightEntry} weightUnit={profile.weight_unit || 'kg'} />
                <MeasurementForm onAddEntry={addMeasurement} measurementUnit={profile.measurement_unit || 'cm'} />
            </div>
            <AvatarCard profile={profile} measurements={measurements} />
            <AICoach profile={profile} weightEntries={entries} measurementEntries={measurements} />
            <div className="bg-card dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('dashboard.weightTrend')}</h2>
                <WeightChart data={entries} weightUnit={profile.weight_unit || 'kg'} theme={theme}/>
            </div>
             <div className="bg-card dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                 <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4">{t('dashboard.bmiTrend')}</h2>
                <BMIChart data={bmiChartData} theme={theme} />
            </div>
             <div className="bg-card dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                <MeasurementChart data={measurements} measurementUnit={profile.measurement_unit || 'cm'} theme={theme} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeightHistory entries={entries} onDeleteEntry={deleteWeightEntry} weightUnit={profile.weight_unit || 'kg'} />
                <MeasurementHistory entries={measurements} onDeleteEntry={deleteMeasurement} measurementUnit={profile.measurement_unit || 'cm'} />
            </div>
          </div>
        </div>
      </main>
      <AchievementModal achievement={newAchievement} onClose={() => setNewAchievement(null)} />
    </>
  );
};

export default App;