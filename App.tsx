import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { WeightEntry, User } from './types';
import { BMICard } from './components/BMICard';
import { WeightChart } from './components/WeightChart';
import { WeightForm } from './components/WeightForm';
import { WeightHistory } from './components/WeightHistory';
import { countries } from './countries';

// Header Component with Name Personalization
const Header: React.FC<{ name: string; onNameChange: (name: string) => void }> = ({ name, onNameChange }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(name || '');

    const handleNameSave = () => {
        if (newName.trim()) {
            onNameChange(newName.trim());
            setIsEditingName(false);
        }
    };

    return (
        <header className="bg-card shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.59L7.41 14l1.41-1.41L11 15.17l4.59-4.59L17 12l-6 6z"/>
                    </svg>
                    {isEditingName ? (
                        <div className="flex items-center gap-2">
                           <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded-md text-2xl font-bold text-primary"
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                autoFocus
                            />
                            <button onClick={handleNameSave} className="text-green-500 hover:text-green-700 p-1">✓</button>
                            <button onClick={() => { setIsEditingName(false); setNewName(name || ''); }} className="text-red-500 hover:text-red-700 p-1">×</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-primary">
                                {`${name}'s Tracker`}
                            </h1>
                             <button onClick={() => setIsEditingName(true)} className="text-text-secondary hover:text-primary mt-1" aria-label="Edit name">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <p className="text-text-secondary mt-1">Monitor your progress towards a healthier you.</p>
            </div>
        </header>
    );
};


const VerificationScreen: React.FC<{
    pendingUser: User;
    onVerify: (user: User) => void;
    onBack: () => void;
}> = ({ pendingUser, onVerify, onBack }) => {
    const [codesSent, setCodesSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        let timerId: number;
        if (resendTimer > 0) {
            timerId = window.setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => clearTimeout(timerId);
    }, [resendTimer]);

    const handleSendCodes = () => {
        setIsSending(true);
        setError('');
        // Simulate API call to send codes
        setTimeout(() => {
            setIsSending(false);
            setCodesSent(true);
            setResendTimer(30); // Start 30-second timer
        }, 1500);
    };
    
    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const emailCode = (form.elements.namedItem('emailCode') as HTMLInputElement).value;
        const phoneCode = (form.elements.namedItem('phoneCode') as HTMLInputElement).value;

        // For demo: correct code is "123456". In a real app, this is checked on the backend.
        if (emailCode === '123456' && phoneCode === '123456') {
            onVerify(pendingUser);
        } else {
            setError('Los códigos no son válidos. Inténtalo de nuevo.');
        }
    };

    return (
         <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
            <div className="bg-card p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto w-full">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Verifica tu Identidad</h2>
                
                {!codesSent ? (
                    <>
                        <p className="text-text-secondary mb-6">Presiona el botón para enviar códigos de verificación a {pendingUser.email} y {pendingUser.phone}.</p>
                        <div className="flex flex-col items-center justify-center gap-4">
                            <button 
                                onClick={handleSendCodes}
                                disabled={isSending}
                                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400"
                            >
                                {isSending && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                {isSending ? 'Enviando...' : 'Enviar Códigos de Verificación'}
                            </button>
                            <button type="button" onClick={onBack} className="w-full bg-gray-200 text-text-secondary font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                                Volver
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                         <p className="text-text-secondary mb-6">
                            Ingresa los códigos que enviamos a tu correo y teléfono. (Pista: es 123456)
                        </p>
                        <form onSubmit={handleVerify} className="flex flex-col items-center justify-center gap-4">
                            <input
                                type="text" name="emailCode" placeholder="Código de correo electrónico" required
                                className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition`} />
                            <input
                                type="text" name="phoneCode" placeholder="Código de teléfono" required
                                className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition`} />
                            
                            {error && <p className="text-red-500 text-sm mt-1 text-left w-full">{error}</p>}

                            <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2">
                                Verificar y Continuar
                            </button>
                             <button 
                                type="button" 
                                onClick={handleSendCodes}
                                disabled={resendTimer > 0 || isSending}
                                className="w-full text-sm text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
                            >
                                {resendTimer > 0 ? `Reenviar en ${resendTimer}s` : 'Reenviar códigos'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </main>
    );
};


const App: React.FC = () => {
    const [user, setUser] = useLocalStorage<User | null>('userProfile', null);
    const [weightEntries, setWeightEntries] = useLocalStorage<WeightEntry[]>('weightEntries', []);
    const [pendingUser, setPendingUser] = useState<User | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [countryCode, setCountryCode] = useState(countries[0].dial_code);

    const sortedEntries = useMemo(() => {
        return [...weightEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [weightEntries]);

    const latestWeight = useMemo(() => {
        return sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1].weight : null;
    }, [sortedEntries]);
    
    const addWeightEntry = useCallback((weight: number) => {
        const today = new Date().toISOString().split('T')[0];
        const newEntry: WeightEntry = { date: today, weight: weight, id: Date.now() };

        const existingEntryIndex = weightEntries.findIndex(entry => entry.date === today);
        if (existingEntryIndex !== -1) {
            const updatedEntries = [...weightEntries];
            updatedEntries[existingEntryIndex] = newEntry;
            setWeightEntries(updatedEntries);
        } else {
            setWeightEntries(prevEntries => [...prevEntries, newEntry]);
        }
    }, [weightEntries, setWeightEntries]);

    const deleteWeightEntry = useCallback((id: number) => {
        setWeightEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    }, [setWeightEntries]);

    const validateRegistrationForm = (data: { name: string; email: string; phone: string; dob: string; height: number }): boolean => {
        const errors: { [key: string]: string } = {};
        
        if (!data.name) errors.name = "El nombre es obligatorio.";
        if (!data.email) {
            errors.email = "El correo electrónico es obligatorio.";
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            errors.email = "Por favor, ingresa un correo electrónico válido.";
        }
        if (!data.phone) {
            errors.phone = "El teléfono es obligatorio.";
        } else if (!/^\d{7,}$/.test(data.phone)) { // Simple validation: at least 7 digits
            errors.phone = "Por favor, ingresa un número de teléfono válido.";
        }
        if (!data.dob) errors.dob = "La fecha de nacimiento es obligatoria.";
        if (isNaN(data.height) || data.height <= 0) {
            errors.height = "Por favor, ingresa una altura válida en cm.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    // RENDER LOGIC
    if (user) {
        // LOGGED IN VIEW (DASHBOARD)
        return (
            <>
                <Header name={user.name} onNameChange={(name) => setUser(prev => prev ? { ...prev, name } : null)} />
                <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
                            <BMICard height={user.height} weight={latestWeight} onHeightChange={(height) => setUser(prev => prev ? { ...prev, height } : null)} />
                            <WeightForm onAddEntry={addWeightEntry} latestWeight={latestWeight}/>
                        </div>
                        <div className="lg:col-span-2 bg-card p-4 sm:p-6 rounded-lg shadow-lg">
                           <h2 className="text-xl font-bold text-text-primary mb-4">Tendencia de Peso</h2>
                           <WeightChart data={sortedEntries} />
                        </div>
                        <div className="lg:col-span-3">
                            <WeightHistory entries={sortedEntries} onDeleteEntry={deleteWeightEntry} />
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (pendingUser) {
        // VERIFICATION VIEW
        return <VerificationScreen 
                    pendingUser={pendingUser} 
                    onVerify={(userToVerify) => {
                        setUser(userToVerify);
                        setPendingUser(null);
                    }}
                    onBack={() => setPendingUser(null)}
                />;
    }

    // WELCOME VIEW
    return (
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
            <div className="bg-card p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto w-full">
                <h2 className="text-2xl font-bold text-text-primary mb-4">¡Bienvenido! Empecemos.</h2>
                <p className="text-text-secondary mb-6">Por favor, completa tu perfil para personalizar tu experiencia y calcular tu IMC.</p>
                <form noValidate onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
                    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                    const phoneInput = form.elements.namedItem('phone') as HTMLInputElement;
                    const dobInput = form.elements.namedItem('dob') as HTMLInputElement;
                    const heightInput = form.elements.namedItem('height') as HTMLInputElement;
                    
                    const formData = {
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        phone: phoneInput.value.trim(),
                        dob: dobInput.value,
                        height: parseFloat(heightInput.value),
                    };

                    if (validateRegistrationForm(formData)) {
                        const newUser: User = {
                           ...formData,
                           phone: `${countryCode}${formData.phone}`,
                        };
                        setPendingUser(newUser);
                    }
                }} className="flex flex-col items-center justify-center gap-4">
                    <div className="w-full">
                        <input
                            type="text" name="name" placeholder="Tu nombre" required
                            className={`w-full px-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition`} />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1 text-left">{formErrors.name}</p>}
                    </div>
                     <div className="w-full">
                        <input
                            type="email" name="email" placeholder="Tu correo electrónico" required
                            className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition`} />
                        {formErrors.email && <p className="text-red-500 text-sm mt-1 text-left">{formErrors.email}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="phone" className="sr-only">Número de teléfono</label>
                        <div className="flex">
                            <select
                                name="countryCode"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className={`bg-gray-50 border border-r-0 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                aria-label="Country code"
                            >
                                {countries.map((country) => (
                                    <option key={country.code} value={country.dial_code}>
                                        {country.flag} {country.dial_code}
                                    </option>
                                ))}
                            </select>
                            <input
                                id="phone"
                                type="tel" name="phone" placeholder="Número de teléfono" required
                                className={`w-full px-4 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent transition`} />
                        </div>
                        {formErrors.phone && <p className="text-red-500 text-sm mt-1 text-left">{formErrors.phone}</p>}
                    </div>
                     <div className="w-full">
                         <input
                            type="date" name="dob" placeholder="Fecha de nacimiento" required
                            className={`w-full px-4 py-2 border ${formErrors.dob ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition`} />
                        {formErrors.dob && <p className="text-red-500 text-sm mt-1 text-left">{formErrors.dob}</p>}
                    </div>
                    <div className="w-full">
                        <input
                            type="number" name="height" placeholder="Tu altura en cm (ej: 175)" required
                            className={`w-full px-4 py-2 border ${formErrors.height ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition`} />
                        {formErrors.height && <p className="text-red-500 text-sm mt-1 text-left">{formErrors.height}</p>}
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors duration-300 mt-2">
                        Guardar y Continuar
                    </button>
                </form>
            </div>
        </main>
    );
};

export default App;