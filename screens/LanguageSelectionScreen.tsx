
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Language } from '../types';

const WelcomeScreen: React.FC = () => {
  const { setLanguage, setUserName, setBirthDate, language: currentLang } = useAppContext();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('12');
  const [error, setError] = useState<string | null>(null);

  const detectLanguage = (input: string): Language => {
    const cyrillicPattern = /[\u0400-\u04FF]/;
    if (cyrillicPattern.test(input)) return 'mk';
    return 'en';
  };

  const isMk = useMemo(() => detectLanguage(nameInput) === 'mk' || currentLang === 'mk', [nameInput, currentLang]);

  const handleNextStep = () => {
    if (nameInput.trim().length < 2) {
      setError(isMk ? 'Те молам, напиши го твоето име' : 'Please, tell me your name');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleFinish = () => {
    const ageNum = parseInt(ageInput, 10);
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
      setError(isMk ? 'Внеси колку години имаш' : 'Enter your age');
      return;
    }

    setUserName(nameInput.trim());
    setLanguage(detectLanguage(nameInput));
    setBirthDate(ageInput);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-start pt-12 p-6 font-sans overflow-hidden">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* Top Tagline Pill */}
        <div className="mb-12 bg-teal-50/50 text-teal-700 px-6 py-3 rounded-full border border-teal-100/50 shadow-sm text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed block">
                {isMk ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
            </span>
        </div>
        
        <div className="w-full text-center space-y-8">
            {step === 1 ? (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                    <h2 className="text-6xl font-black text-slate-900 leading-tight tracking-tight">
                        ¡Hola!<br/>
                        {isMk ? 'Јас сум Амиго.' : 'I am Amigo.'}
                    </h2>
                    <p className="text-[12px] font-black text-slate-500 px-4 italic leading-tight">
                        {isMk ? 'Наменета за возраст 10-16 години, но Амиго е сечиј пријател.' : 'Intended for ages 10-16, but Amigo is everyone\'s friend.'}
                    </p>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] text-left ml-4">
                            {isMk ? 'Име' : 'Name'}
                        </p>
                        <input 
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full bg-white border-2 border-slate-100 p-5 rounded-[2rem] text-xl font-black text-slate-900 outline-none focus:border-teal-400 shadow-sm transition-all"
                            placeholder={isMk ? 'Твоето име...' : 'Your name...'}
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs font-bold animate-shake">{error}</p>}
                    <button 
                        onClick={handleNextStep}
                        className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-lg active:scale-95 text-xl mt-4 transition-transform"
                    >
                        {isMk ? 'Продолжи' : 'Continue'}
                    </button>
                </div>
              </div>
            ) : (
              <div className="space-y-10 animate-fadeIn flex flex-col items-center">
                <div className="space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tight">
                        {isMk ? `Мило ми е, ${nameInput}!` : `Nice to meet you, ${nameInput}!`}
                    </h2>
                    <p className="text-xl font-bold text-slate-500">
                        {isMk ? 'Колку години имаш?' : 'How old are you?'}
                    </p>
                </div>

                {/* The Custom Age Input Pill from Screenshot */}
                <div className="relative group animate-slideUp">
                    <div className="w-56 h-40 bg-white border-[6px] border-orange-400 rounded-[3.5rem] shadow-2xl shadow-orange-200/50 flex items-center justify-center overflow-hidden">
                        <input 
                            type="number"
                            value={ageInput}
                            onChange={(e) => setAgeInput(e.target.value)}
                            className="w-full h-full text-center text-5xl font-black text-slate-600 outline-none bg-transparent appearance-none"
                            style={{ MozAppearance: 'textfield' }}
                            autoFocus
                        />
                        {/* Fake arrows to match visual style */}
                        <div className="absolute right-8 flex flex-col gap-4 text-slate-400 pointer-events-none">
                            <span className="text-xs">▲</span>
                            <span className="text-xs">▼</span>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                {/* The Orange START Button from Screenshot */}
                <div className="w-full pt-4">
                    <button 
                        onClick={handleFinish}
                        className="w-full bg-orange-500 text-white font-black py-7 rounded-[2.5rem] shadow-[0_10px_0_0_#ea580c] active:shadow-none active:translate-y-2 text-2xl transition-all tracking-widest"
                    >
                        {isMk ? 'ЗАПОЧНИ' : 'START'}
                    </button>
                    
                    <button 
                      onClick={() => setStep(1)}
                      className="mt-8 text-slate-300 text-xs font-bold uppercase tracking-[0.2em] py-2 hover:text-slate-400"
                    >
                      {isMk ? '‹ Назад' : '‹ Back'}
                    </button>
                </div>
              </div>
            )}
        </div>
      </div>
      
      {/* Small design styles for the 3D-ish button effect and animations */}
      <style>{`
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
