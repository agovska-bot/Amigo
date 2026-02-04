
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Language } from '../types';
import AmigoMascot from '../components/AmigoMascot';

const WelcomeScreen: React.FC = () => {
  const { setLanguage, setUserName, setBirthDate, language: currentLang } = useAppContext();
  
  const [step, setStep] = useState<'name' | 'age'>('name');
  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const detectLanguage = (input: string): Language => {
    const cyrillicPattern = /[\u0400-\u04FF]/;
    // Simple Latin Macedonian heuristics
    const mkLatinPattern = /(zdravo|kako si|sto pravis|fala|blagodaram|dobro)/i;
    if (cyrillicPattern.test(input) || mkLatinPattern.test(input)) return 'mk';
    return 'en';
  };

  useEffect(() => {
    if (nameInput.trim().length > 0) {
      setLanguage(detectLanguage(nameInput));
    }
  }, [nameInput, setLanguage]);

  const handleNameConfirm = () => {
    if (nameInput.trim().length >= 2) {
      setUserName(nameInput.trim());
      setError(null);
      setStep('age');
    } else {
      setError(currentLang === 'mk' ? 'Те молам внеси го името' : 'Please enter your name');
    }
  };

  const handleFinish = () => {
    const ageNum = parseInt(ageInput, 10);
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
      setError(currentLang === 'mk' ? 'Внеси валидни години' : 'Enter a valid age');
      return;
    }
    setBirthDate(ageInput);
  };

  const isMk = currentLang === 'mk';

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="fixed top-[-10%] left-[-20%] w-[50rem] h-[50rem] bg-teal-500/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md flex flex-col items-center animate-fadeIn relative z-10">
        <div className="animate-float mb-4">
            <AmigoMascot size={260} />
        </div>
        
        <div className="w-full text-center space-y-6">
            {step === 'name' ? (
                <div className="space-y-6">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight">
                        ¡Hola!<br/>I am Amigo.<br/>What is your name?
                    </h2>
                    <input
                        type="text"
                        placeholder="..."
                        autoFocus
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-slate-50 border-b-4 border-slate-200 p-5 text-3xl font-black text-slate-900 focus:outline-none focus:border-teal-500 transition-all text-center rounded-2xl shadow-inner"
                    />
                    {error && <p className="text-red-500 font-bold">{error}</p>}
                    <button onClick={handleNameConfirm} className="bg-slate-900 text-white font-black px-12 py-5 rounded-[2rem] text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                        {isMk ? 'Следно' : 'Next'}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 leading-tight">
                            {isMk ? 'Мило ми е што те запознав!' : 'Nice to meet you!'}
                        </h2>
                        <p className="text-xl font-bold text-slate-500">
                            {isMk ? 'Колку години имаш?' : 'How old are you?'}
                        </p>
                    </div>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder={isMk ? 'Години' : 'Age'}
                        value={ageInput}
                        onChange={(e) => setAgeInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border-b-4 border-slate-200 p-5 text-5xl font-black text-slate-900 focus:outline-none focus:border-orange-500 transition-all text-center rounded-2xl shadow-inner"
                    />
                    {error && <p className="text-red-500 font-bold">{error}</p>}
                    <button onClick={handleFinish} className="bg-orange-500 text-white font-black px-12 py-5 rounded-[2rem] text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                        {isMk ? 'Започни' : 'Launch Amigo'}
                    </button>
                </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
