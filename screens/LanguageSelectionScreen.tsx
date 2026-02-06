
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F8FAFC] via-white to-[#FFF7ED] flex flex-col items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      
      {/* Decorative Warm Background Blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-72 h-72 bg-teal-200/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-32 h-32 bg-purple-200/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Main Card Frame (The "Ramka") */}
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(20,184,166,0.1)] flex flex-col min-h-[85vh] sm:min-h-[80vh] relative z-10 overflow-hidden border-4 border-white/50 p-8 sm:p-10 animate-slideUp">
        
        {/* Top Tagline Pill */}
        <div className="mb-10 bg-teal-50/50 text-teal-600 px-6 py-3 rounded-full border border-teal-100/30 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] leading-relaxed block">
                {isMk ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
            </span>
        </div>
        
        <div className="w-full text-center flex-grow flex flex-col justify-center space-y-10">
            {step === 1 ? (
              <div className="space-y-10 animate-fadeIn">
                <div className="space-y-4">
                    <h2 className="text-6xl font-black text-slate-900 leading-tight tracking-tight drop-shadow-sm">
                        ¡Hola!<br/>
                        <span className="text-teal-500">{isMk ? 'Јас сум Амиго.' : 'I am Amigo.'}</span>
                    </h2>
                    <p className="text-[12px] font-bold text-slate-400 px-6 italic leading-relaxed">
                        {isMk ? 'Наменета за возраст 10-16 години, но Амиго е сечиј пријател.' : 'Intended for ages 10-16, but Amigo is everyone\'s friend.'}
                    </p>
                </div>

                <div className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <p className="text-slate-300 font-black uppercase tracking-widest text-[10px] text-left ml-6">
                            {isMk ? 'Твоето име' : 'Your name'}
                        </p>
                        <input 
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full bg-slate-50 border-4 border-slate-100 p-6 rounded-[2.5rem] text-2xl font-black text-slate-800 outline-none focus:border-teal-400 focus:bg-white shadow-inner transition-all text-center placeholder:text-slate-200"
                            placeholder={isMk ? 'Напиши тука...' : 'Type here...'}
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs font-black animate-shake">{error}</p>}
                    <button 
                        onClick={handleNextStep}
                        className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] shadow-xl shadow-slate-900/20 active:scale-95 text-xl mt-4 transition-transform uppercase tracking-[0.2em]"
                    >
                        {isMk ? 'Продолжи' : 'Continue'}
                    </button>
                </div>
              </div>
            ) : (
              <div className="space-y-10 animate-fadeIn flex flex-col items-center">
                <div className="space-y-4">
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                        {isMk ? `Мило ми е,` : `Nice to meet you,`} <br/>
                        <span className="text-teal-500">{nameInput}!</span>
                    </h2>
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-300 pt-6">
                        {isMk ? 'Колку години имаш?' : 'How old are you?'}
                    </p>
                </div>

                {/* The Custom Age Input Pill */}
                <div className="relative group animate-slideUp">
                    <div className="w-52 h-36 bg-white border-[8px] border-orange-400 rounded-[3.5rem] shadow-2xl shadow-orange-200 flex items-center justify-center overflow-hidden">
                        <input 
                            type="number"
                            value={ageInput}
                            onChange={(e) => setAgeInput(e.target.value)}
                            className="w-full h-full text-center text-6xl font-black text-slate-700 outline-none bg-transparent appearance-none"
                            style={{ MozAppearance: 'textfield' }}
                            autoFocus
                        />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">
                      🎂
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs font-black animate-shake">{error}</p>}

                {/* The Orange START Button */}
                <div className="w-full pt-4">
                    <button 
                        onClick={handleFinish}
                        className="w-full bg-orange-500 text-white font-black py-7 rounded-[2.5rem] shadow-[0_12px_0_0_#ea580c] active:shadow-none active:translate-y-2 text-2xl transition-all tracking-[0.2em] uppercase"
                    >
                        {isMk ? 'ЗАПОЧНИ' : 'START'}
                    </button>
                    
                    <button 
                      onClick={() => setStep(1)}
                      className="mt-10 text-slate-300 text-[11px] font-black uppercase tracking-[0.25em] py-2 hover:text-slate-400 transition-colors"
                    >
                      {isMk ? '‹ Назад' : '‹ Back'}
                    </button>
                </div>
              </div>
            )}
        </div>
        
        {/* Footer info inside frame */}
        <div className="mt-10 text-center opacity-30">
             <div className="h-[2px] w-8 bg-slate-100 mx-auto mb-4 rounded-full"></div>
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
               ASEF 2026
             </p>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
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
