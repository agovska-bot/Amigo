
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Language } from '../types';

const WelcomeScreen: React.FC = () => {
  const { setLanguage, setUserName, setBirthDate, language: currentLang } = useAppContext();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('');
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
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center animate-fadeIn">
        
        <div className="mb-8 bg-teal-50 text-teal-700 px-6 py-2 rounded-full border border-teal-100 shadow-sm text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed block">
                {isMk ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
            </span>
        </div>
        
        <div className="w-full text-center space-y-8">
            <div className="space-y-4">
                <div className="space-y-2 mb-6">
                    <h2 className="text-6xl font-black text-slate-900 leading-tight tracking-tight">
                        ¡Hola!<br/>
                        {isMk ? 'Јас сум Амиго.' : 'I am Amigo.'}
                    </h2>
                    {step === 1 && (
                      <p className="text-[12px] font-black text-slate-500 mt-2 px-4 italic leading-tight animate-fadeIn">
                          {isMk ? 'Наменета за возраст 10-16 години, но Амиго е сечиј пријател.' : 'Intended for ages 10-16, but Amigo is everyone\'s friend.'}
                      </p>
                    )}
                </div>

                <div className="space-y-4 pt-4">
                    {step === 1 ? (
                      <div className="space-y-4 animate-slideUp">
                        <div className="space-y-1">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] text-left ml-4">
                                {isMk ? 'Име' : 'Name'}
                            </p>
                            <input 
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                className="w-full bg-white border-2 border-slate-100 p-5 rounded-3xl text-xl font-black text-slate-900 outline-none focus:border-teal-400 shadow-sm"
                                placeholder={isMk ? 'Твоето име...' : 'Your name...'}
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                        <button 
                            onClick={handleNextStep}
                            className="w-full bg-teal-600 text-white font-black py-6 rounded-3xl shadow-lg active:scale-95 text-xl mt-4 transition-transform"
                        >
                            {isMk ? 'Продолжи' : 'Continue'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-slideUp">
                        <div className="space-y-1">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] text-left ml-4">
                                {isMk ? 'Години' : 'Age'}
                            </p>
                            <input 
                                type="number"
                                value={ageInput}
                                onChange={(e) => setAgeInput(e.target.value)}
                                className="w-full bg-white border-2 border-orange-400 p-5 rounded-3xl text-xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-orange-200 shadow-sm"
                                placeholder="12"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                        <button 
                            onClick={handleFinish}
                            className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl shadow-lg active:scale-95 text-xl mt-4 transition-transform"
                        >
                            {isMk ? 'Започни авантура' : 'Start Adventure'}
                        </button>
                        <button 
                          onClick={() => setStep(1)}
                          className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest py-2"
                        >
                          {isMk ? 'Назад' : 'Back'}
                        </button>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
