
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0FDFA] flex flex-col items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-teal-200/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-orange-200/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Card Frame (The "Ramka") */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/10 flex flex-col min-h-[85vh] sm:min-h-[80vh] relative z-10 overflow-hidden border border-white p-8">
        
        {/* Top Tagline Pill */}
        <div className="mb-8 bg-slate-50 text-teal-700 px-6 py-3 rounded-full border border-teal-100/50 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed block">
                {isMk ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
            </span>
        </div>
        
        <div className="w-full text-center flex-grow flex flex-col justify-center space-y-8">
            {step === 1 ? (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tight">
                        ¡Hola!<br/>
                        {isMk ? 'Јас сум Амиго.' : 'I am Amigo.'}
                    </h2>
                    <p className="text-[11px] font-black text-slate-300 px-4 italic leading-tight">
                        {isMk ? 'Наменета за возраст 10-16 години, но Амиго е сечиј пријател.' : 'Intended for ages 10-16, but Amigo is everyone\'s friend.'}
                    </p>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="space-y-1">
                        <p className="text-slate-300 font-bold uppercase tracking-widest text-[9px] text-left ml-4">
                            {isMk ? 'Име' : 'Name'}
                        </p>
                        <input 
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-[2rem] text-xl font-black text-slate-900 outline-none focus:border-teal-400 shadow-inner transition-all text-center"
                            placeholder={isMk ? 'Твоето име...' : 'Your name...'}
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs font-bold animate-shake">{error}</p>}
                    <button 
                        onClick={handleNextStep}
                        className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-slate-900/20 active:scale-95 text-lg mt-4 transition-transform uppercase tracking-widest"
                    >
                        {isMk ? 'Продолжи' : 'Continue'}
                    </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn flex flex-col items-center">
                <div className="space-y-3">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
                        {isMk ? `Мило ми е!` : `Nice to meet you!`}
                    </h2>
                    <p className="text-lg font-bold text-slate-400 italic">
                        {isMk ? nameInput : nameInput}
                    </p>
                    <p className="text-sm font-black uppercase tracking-widest text-slate-300 pt-4">
                        {isMk ? 'Колку години имаш?' : 'How old are you?'}
                    </p>
                </div>

                {/* The Custom Age Input Pill */}
                <div className="relative group animate-slideUp">
                    <div className="w-48 h-32 bg-white border-[6px] border-orange-400 rounded-[3rem] shadow-xl shadow-orange-200 flex items-center justify-center overflow-hidden">
                        <input 
                            type="number"
                            value={ageInput}
                            onChange={(e) => setAgeInput(e.target.value)}
                            className="w-full h-full text-center text-5xl font-black text-slate-700 outline-none bg-transparent appearance-none"
                            style={{ MozAppearance: 'textfield' }}
                            autoFocus
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                {/* The Orange START Button */}
                <div className="w-full pt-4">
                    <button 
                        onClick={handleFinish}
                        className="w-full bg-orange-500 text-white font-black py-6 rounded-[2rem] shadow-[0_8px_0_0_#ea580c] active:shadow-none active:translate-y-2 text-xl transition-all tracking-widest uppercase"
                    >
                        {isMk ? 'ЗАПОЧНИ' : 'START'}
                    </button>
                    
                    <button 
                      onClick={() => setStep(1)}
                      className="mt-6 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] py-2 hover:text-slate-400"
                    >
                      {isMk ? '‹ Назад' : '‹ Back'}
                    </button>
                </div>
              </div>
            )}
        </div>
        
        {/* Footer info inside frame */}
        <div className="mt-8 text-center opacity-20">
             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">
               ASEF 2026
             </p>
        </div>
      </div>
      
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
