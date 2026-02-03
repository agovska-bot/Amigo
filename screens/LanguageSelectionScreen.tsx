
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Language, Screen } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import ScreenWrapper from '../components/ScreenWrapper';

const AmigoLogoHeader: React.FC = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4 animate-fadeIn relative z-20 py-8 w-full">
        <div className="relative flex items-center justify-center h-32 w-32 sm:h-40 sm:w-40">
          <svg viewBox="0 0 85 55" className="w-full h-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
            <style>{`
              @keyframes blink-header { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
              .buddy-eye-header { animation: blink-header 5s infinite ease-in-out; transform-origin: center center; }
            `}</style>
            <path d="M45.7,21.9c0-12.1-9.8-21.9-21.9-21.9S2,9.8,2,21.9c0,9.1,5.6,16.9,13.6,20.2l-0.7,5.7c-0.1,0.8,0.5,1.5,1.3,1.5c0.1,0,0.2,0,0.3-0.1l7.3-5.2c1.3,0.2,2.6,0.2,4,0.2C35.9,43.8,45.7,34,45.7,21.9z" fill="#14B8A6" stroke="#0f172a" strokeWidth="2.5" />
            <circle className="buddy-eye-header" cx="15.8" cy="20.5" r="3" fill="#0f172a" />
            <circle className="buddy-eye-header" cx="32.8" cy="20.5" r="3" fill="#0f172a" />
            <path d="M18.8,29.5c0,0,3,4,8,0" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            
            <g transform="translate(42, 26) scale(0.85)">
                <path d="M15,2v26 M2,15h26" fill="none" stroke="#0f172a" strokeWidth="17" strokeLinecap="round"/>
                <path d="M15,2v26" fill="none" stroke="#F97316" strokeWidth="11" strokeLinecap="round"/>
                <path d="M2,15h26" fill="none" stroke="#F97316" strokeWidth="11" strokeLinecap="round"/>
            </g>
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tighter">Amigo</h1>
      </div>
    );
};

const WelcomeScreen: React.FC = () => {
  const { setLanguage, setUserName, setBirthDate, language: currentLang } = useAppContext();
  const { t } = useTranslation();
  
  const [step, setStep] = useState<'name' | 'age'>('name');
  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const detectLanguage = (input: string): Language => {
    const cyrillicPattern = /[\u0400-\u04FF]/;
    const mkLatinWords = /\b(zdravo|fala|kako|si|e|vo|na|da|ne|jas|ti)\b/i;
    if (cyrillicPattern.test(input) || mkLatinWords.test(input)) return 'mk';
    return 'en';
  };

  useEffect(() => {
    if (nameInput.trim().length > 0) {
      const detected = detectLanguage(nameInput);
      setLanguage(detected);
    }
  }, [nameInput, setLanguage]);

  const handleNameConfirm = () => {
    const trimmedName = nameInput.trim();
    if (trimmedName.length >= 2) {
      setUserName(trimmedName);
      setError(null);
      setStep('age');
    } else {
      setError(currentLang === 'mk' ? 'Те молам внеси го твоето име' : 'Please enter your name');
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setAgeInput(val);
    if (error) setError(null);
  };

  const handleFinish = () => {
    const ageNum = parseInt(ageInput, 10);
    if (isNaN(ageNum) || ageNum < 3) {
      setError(t('age_selection.too_young', 'You must be at least 3 years old'));
      return;
    }
    if (ageNum > 120) {
      setError(t('age_selection.too_old', 'Verify age input.'));
      return;
    }
    setBirthDate(ageInput);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col">
      <div className="fixed top-[-10%] left-[-20%] w-[50rem] h-[50rem] bg-[#14B8A6]/10 rounded-full filter blur-[120px] z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-20%] w-[50rem] h-[50rem] bg-[#F97316]/10 rounded-full filter blur-[120px] z-0 pointer-events-none"></div>
      
      <div className="flex-grow p-6 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-lg flex flex-col items-center">
            <AmigoLogoHeader />

            <div className="w-full mt-12">
                {step === 'name' && (
                    <div className="animate-fadeIn space-y-10">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] text-center leading-tight px-4">
                            ¡Hola! I am Amigo, your social sidekick. What is your name?<br/>
                            <span className="text-lg sm:text-xl font-bold opacity-60 block mt-4">Јас сум Amigo. Како се викаш?</span>
                        </h2>
                        
                        <div className="relative w-full max-w-sm mx-auto">
                          <input
                              type="text"
                              autoFocus
                              placeholder="..."
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              className="w-full bg-slate-50 border-b-4 border-slate-200 p-6 text-2xl sm:text-3xl font-black text-[#0f172a] focus:outline-none focus:border-[#14B8A6] transition-all text-center rounded-2xl shadow-sm"
                          />
                        </div>

                        {error && <p className="text-red-500 text-center font-bold animate-pulse">{error}</p>}
                        
                        <div className="flex justify-center pt-4">
                          <button 
                              onClick={handleNameConfirm} 
                              className="bg-[#0f172a] text-white font-black px-12 py-5 rounded-2xl text-xl shadow-2xl hover:bg-[#14B8A6] hover:scale-105 active:scale-95 transition-all"
                          >
                              {currentLang === 'mk' ? 'Следно' : 'Next'}
                          </button>
                        </div>
                    </div>
                )}

                {step === 'age' && (
                    <div className="animate-fadeIn space-y-10">
                        <div className="text-center px-4 space-y-2">
                          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] leading-tight">
                              {currentLang === 'mk' ? `Мило ми е, ${nameInput}!` : `Nice to meet you, ${nameInput}!`}
                          </h2>
                          <p className="text-3xl sm:text-4xl font-black text-[#0f172a]">
                              {t('age_selection.birthdate_prompt')}
                          </p>
                          <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto italic mt-2">
                             {t('age_selection.disclaimer')}
                          </p>
                        </div>
                        
                        <div className="relative w-full max-w-sm mx-auto">
                          <input
                              type="text"
                              inputMode="numeric"
                              placeholder={t('age_selection.placeholder')}
                              value={ageInput}
                              onChange={handleAgeChange}
                              className="w-full bg-slate-50 border-b-4 border-slate-200 p-6 text-3xl sm:text-4xl font-black text-[#0f172a] focus:outline-none focus:border-[#F97316] transition-all text-center rounded-2xl shadow-sm"
                          />
                        </div>

                        {error && <p className="text-red-500 text-center font-bold animate-pulse">{error}</p>}
                        
                        <div className="flex justify-center pt-4">
                          <button 
                              onClick={handleFinish} 
                              className="bg-[#F97316] text-white font-black px-12 py-5 rounded-2xl text-xl shadow-2xl hover:bg-[#14B8A6] hover:scale-105 active:scale-95 transition-all"
                          >
                              {currentLang === 'mk' ? "Започни!" : "Let's go!"}
                          </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
