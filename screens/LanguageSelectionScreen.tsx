
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Language } from '../types';
import Logo from '../components/Logo';

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
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-72 h-72 bg-teal-200/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Card Frame */}
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(20,184,166,0.1)] flex flex-col min-h-[85vh] sm:min-h-[80vh] relative z-10 overflow-hidden border-4 border-white/50 p-8 sm:p-10 animate-slideUp">
        
        {/* Top Tagline Pill */}
        <div className="mb-6 bg-teal-50/50 text-teal-600 px-6 py-3 rounded-full border border-teal-100/30 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] leading-relaxed block">
                {isMk ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
            </span>
        </div>
        
        <div className="w-full text-center flex-grow flex flex-col justify-center space-y-8">
            {step === 1 ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-4 flex flex-col items-center">
                    {/* Robot Logo to the left of Hola */}
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <Logo size={65} />
                        <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tight drop-shadow-sm text-left">
                            ¡Hola!<br/>
                            <span className="text-teal-500">{isMk ? 'Јас сум Амиго.' : 'I am Amigo.'}</span>
                        </h2>
                    </div>
                    <p className="text-[12px] font-bold text-slate-400 px-6 italic leading-relaxed text-center">
                        {isMk ? 'Наменета за возраст 10-16 години, но Амиго е сечиј пријател.' : "Intended for ages 10-16, but Amigo is everyone's friend."}
                    </p>
                </div>

                <div className="space-y-4">
                  <input 
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={isMk ? "Твоето име..." : "Your name..."}
                    className="w-full bg-slate-50 border-4 border-slate-100 p-6 rounded-[2rem] text-2xl font-black text-slate-800 outline-none focus:border-teal-400 transition-all text-center shadow-inner"
                    autoFocus
                  />
                  {error && <p className="text-red-500 font-bold text-xs">{error}</p>}
                </div>

                <button 
                  onClick={handleNextStep}
                  className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-xl active:scale-95 transition-all text-xl uppercase tracking-widest"
                >
                  {isMk ? "ПРОДОЛЖИ" : "CONTINUE"}
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn flex flex-col items-center">
                <div className="space-y-4 flex flex-col items-center">
                  <Logo size={70} className="mb-2" />
                  <h2 className="text-4xl font-black text-slate-900 leading-tight text-center">
                    {isMk ? `Мило ми е, ${nameInput}!` : `Nice to meet you, ${nameInput}!`}
                  </h2>
                  <p className="text-[12px] font-bold text-slate-400 px-6 italic leading-relaxed text-center">
                    {isMk ? 'Колку години имаш?' : 'How old are you?'}
                  </p>
                </div>

                <div className="space-y-4 w-full">
                  <div className="w-52 h-32 bg-white border-[8px] border-orange-400 rounded-[3rem] shadow-xl flex items-center justify-center overflow-hidden mx-auto">
                      <input 
                        type="number"
                        min="3"
                        max="99"
                        value={ageInput}
                        onChange={(e) => setAgeInput(e.target.value)}
                        className="w-full h-full text-center text-5xl font-black text-slate-700 outline-none bg-transparent"
                        autoFocus
                      />
                  </div>
                  {error && <p className="text-red-500 font-bold text-xs text-center">{error}</p>}
                </div>

                <div className="flex flex-col gap-4 w-full">
                  <button 
                    onClick={handleFinish}
                    className="w-full bg-orange-500 text-white font-black py-6 rounded-[2rem] shadow-[0_10px_0_0_#ea580c] active:translate-y-2 active:shadow-none transition-all text-xl uppercase tracking-widest"
                  >
                    {isMk ? "ЗАПОЧНИ" : "START"}
                  </button>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-slate-300 font-black uppercase text-[10px] tracking-widest py-2"
                  >
                    {isMk ? '‹ Назад' : '‹ Back'}
                  </button>
                </div>
              </div>
            )}
        </div>
        
        {/* Author Footer */}
        <div className="mt-8 text-center border-t border-slate-50 pt-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
              by Damjan Agovski & Daijan Selmani
            </p>
            <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em] mt-1">
              ASEF 2026
            </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
