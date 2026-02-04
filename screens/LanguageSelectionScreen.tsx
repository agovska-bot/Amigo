
import React, { useState, useEffect, useMemo } from 'react';
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
    const mkLatinPattern = /(zdravo|kako si|sto pravis|fala|blagodaram|dobro)/i;
    if (cyrillicPattern.test(input) || mkLatinPattern.test(input)) return 'mk';
    return 'en';
  };

  const detectedLang = useMemo(() => detectLanguage(nameInput), [nameInput]);
  const isMk = detectedLang === 'mk' || currentLang === 'mk';

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
      setError(isMk ? 'Те молам, напиши го твоето име' : 'Please, tell me your name');
    }
  };

  const handleFinish = () => {
    const ageNum = parseInt(ageInput, 10);
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
      setError(isMk ? 'Внеси ги твоите години' : 'Enter your age');
      return;
    }
    setBirthDate(ageInput);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Soft Cinematic Background Elements */}
      <div className="fixed top-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-teal-500/5 rounded-full filter blur-[150px]"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-orange-400/5 rounded-full filter blur-[120px]"></div>
      
      <div className="w-full max-w-md flex flex-col items-center animate-fadeIn relative z-10">
        
        {/* Support Badge */}
        <div className="mb-4 bg-teal-100 text-teal-800 px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
            {isMk ? 'Твојот пријател за разбирање' : 'Your Partner for Understanding'}
        </div>

        <div className="mb-8">
            <AmigoMascot size={260} />
        </div>
        
        <div className="w-full text-center space-y-8">
            {step === 'name' ? (
                <div className="space-y-8 animate-slideUp">
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
                            ¡Hola!<br/>
                            {isMk ? 'Јас сум Амиго.' : 'I am Amigo.'}
                        </h2>
                        <p className="text-xl font-bold text-slate-500">
                            {isMk ? 'Како се викаш?' : 'What is your name?'}
                        </p>
                    </div>
                    
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="..."
                            autoFocus
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full bg-white border-4 border-slate-100 p-6 text-3xl font-black text-slate-900 focus:outline-none focus:border-teal-400 transition-all text-center rounded-[2.5rem] shadow-xl"
                        />
                    </div>

                    {error && <p className="text-red-500 font-bold animate-shake">{error}</p>}
                    
                    <button 
                        onClick={handleNameConfirm} 
                        className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] text-2xl shadow-2xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {isMk ? 'ПРОДОЛЖИ' : 'CONTINUE'} <span className="text-2xl">🛡️</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-8 animate-slideUp">
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-slate-900 leading-tight">
                            {isMk ? `Мило ми е, ${nameInput}!` : `Nice to meet you, ${nameInput}!`}
                        </h2>
                        <p className="text-xl font-bold text-slate-500">
                            {isMk ? 'Колку години имаш?' : 'How old are you?'}
                        </p>
                    </div>
                    
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="--"
                        autoFocus
                        value={ageInput}
                        onChange={(e) => setAgeInput(e.target.value.replace(/\D/g, ''))}
                        className="w-40 bg-white border-4 border-slate-100 p-6 text-6xl font-black text-slate-900 focus:outline-none focus:border-orange-400 transition-all text-center rounded-[3rem] shadow-xl mx-auto block"
                    />

                    {error && <p className="text-red-500 font-bold animate-shake">{error}</p>}

                    <button 
                        onClick={handleFinish} 
                        className="w-full bg-orange-500 text-white font-black py-6 rounded-[2.5rem] text-2xl shadow-2xl hover:bg-orange-600 active:scale-95 transition-all"
                    >
                        {isMk ? 'ЗАПОЧНИ' : 'START'} <span className="ml-2">🌟</span>
                    </button>
                </div>
            )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake { animation: shake 0.2s ease-in-out 2; }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
