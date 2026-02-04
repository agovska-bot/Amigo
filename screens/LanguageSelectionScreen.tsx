
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Language } from '../types';

const WelcomeScreen: React.FC = () => {
  const { setLanguage, setUserName, setBirthDate, language: currentLang } = useAppContext();
  
  // step ни кажува дали го прашуваме името или годините
  const [step, setStep] = useState<'name' | 'age'>('name');
  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Оваа функција сама открива дали корисникот пишува на македонски
  const detectLanguage = (input: string): Language => {
    const cyrillicPattern = /[\u0400-\u04FF]/;
    if (cyrillicPattern.test(input)) return 'mk';
    return 'en';
  };

  const isMk = useMemo(() => detectLanguage(nameInput) === 'mk' || currentLang === 'mk', [nameInput, currentLang]);

  // Се извршува кога ќе го напишеш името и ќе продолжиш
  const handleNameConfirm = () => {
    if (nameInput.trim().length >= 2) {
      setUserName(nameInput.trim());
      setLanguage(detectLanguage(nameInput));
      setError(null);
      setStep('age');
    } else {
      setError(isMk ? 'Те молам, напиши го твоето име' : 'Please, tell me your name');
    }
  };

  // Се извршува кога ќе ги внесеш годините за да почнат мисиите
  const handleFinish = () => {
    const ageNum = parseInt(ageInput, 10);
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
      setError(isMk ? 'Внеси колку години имаш' : 'Enter your age');
      return;
    }
    setBirthDate(ageInput);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center animate-fadeIn">
        
        {/* Горниот слоган на апликацијата */}
        <div className="mb-10 bg-teal-50 text-teal-700 px-6 py-2 rounded-full border border-teal-100 shadow-sm text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed block">
                {isMk ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
            </span>
        </div>
        
        <div className="w-full text-center space-y-10">
            {step === 'name' ? (
                <div className="space-y-8 animate-slideUp">
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black text-slate-900 leading-tight tracking-tight">
                            ¡Hola!<br/>
                            {isMk ? 'Јас сум Амиго.' : 'I am Amigo.'}
                        </h2>
                        <p className="text-xl font-bold text-slate-500 pt-4">
                            {isMk ? 'Како се викаш?' : 'What is your name?'}
                        </p>
                    </div>
                    
                    <input
                        type="text"
                        placeholder="..."
                        autoFocus
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-white border-4 border-slate-100 p-6 text-3xl font-black text-slate-900 focus:outline-none focus:border-teal-400 transition-all text-center rounded-[2rem] shadow-xl"
                    />

                    {error && <p className="text-red-500 font-bold">{error}</p>}
                    
                    <button 
                        onClick={handleNameConfirm} 
                        className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] text-xl shadow-lg active:scale-95 transition-all"
                    >
                        {isMk ? 'ПРОДОЛЖИ' : 'CONTINUE'}
                    </button>
                </div>
            ) : (
                <div className="space-y-8 animate-slideUp">
                    <div className="space-y-2">
                        <h2 className="text-5xl font-black text-slate-900 leading-tight">
                            {isMk ? `Мило ми е, ${nameInput}!` : `Nice to meet you, ${nameInput}!`}
                        </h2>
                        <p className="text-xl font-bold text-slate-500 pt-4">
                            {isMk ? 'Колку години имаш?' : 'How old are you?'}
                        </p>
                    </div>
                    
                    <input
                        type="number"
                        placeholder="--"
                        autoFocus
                        value={ageInput}
                        onChange={(e) => setAgeInput(e.target.value)}
                        className="w-40 bg-white border-4 border-slate-100 p-6 text-5xl font-black text-slate-900 focus:outline-none focus:border-orange-400 transition-all text-center rounded-[2.5rem] shadow-xl mx-auto block"
                    />

                    {error && <p className="text-red-500 font-bold">{error}</p>}

                    <button 
                        onClick={handleFinish} 
                        className="w-full bg-orange-500 text-white font-black py-6 rounded-[2rem] text-xl shadow-lg active:scale-95 transition-all"
                    >
                        {isMk ? 'ЗАПОЧНИ' : 'START'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
