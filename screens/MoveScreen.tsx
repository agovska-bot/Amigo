
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTranslation } from '../hooks/useTranslation';
import { Screen } from '../types';

const MoveScreen: React.FC = () => {
  const { ageGroup, age, userName, setCurrentScreen } = useAppContext();
  const { language } = useTranslation();
  const [task, setTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const isPro = ageGroup === '12+';
  const screenTitle = language === 'mk' ? "Херојски Мисии" : "Hero Missions";

  const themes = {
    '10-12': { 
      blob1: 'bg-blue-50', 
      blob2: 'bg-teal-50', 
      card: 'bg-white/90 border-teal-100',
      text: 'text-blue-800', 
      button: 'bg-slate-800 hover:bg-slate-900'
    },
    '12+': { 
      blob1: 'bg-slate-100', 
      blob2: 'bg-indigo-50/50', 
      card: 'bg-white border-slate-200',
      text: 'text-slate-800', 
      button: 'bg-slate-800 hover:bg-slate-900'
    }
  }[isPro ? '12+' : '10-12'];

  const getNewTask = useCallback(async () => {
      setIsLoading(true);
      
      const persona = isPro 
        ? "You are Amigo, a mature Social Sidekick." 
        : "You are Amigo, a playful Social Sidekick.";

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `${persona}
        User: ${userName} (${age}yo).
        ONE safe social mission for the user RIGHT NOW.
        CRITICAL: Max 1 short sentence. Instant.
        Language: ${language === 'mk' ? 'Macedonian' : 'English'}.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { 
              temperature: 1.0,
              // INSTANT RESPONSE
              thinkingConfig: { thinkingBudget: 0 }
          }
        });
        const generatedTask = response.text?.trim() || (language === 'mk' ? "Поздрави некого со насмевка денес!" : "Say hi to someone with a smile today!");
        setTask(generatedTask);
      } catch (error) {
        console.error("Mission Error:", error);
        setTask(language === 'mk' ? "Насмевни се на некого денес!" : "Smile at someone today!");
      } finally {
        setIsLoading(false);
      }
    }, [age, language, isPro, userName]);

  useEffect(() => {
    getNewTask();
  }, [getNewTask]);

  return (
    <ScreenWrapper title={screenTitle}>
      <div className="relative flex flex-col items-center justify-start pt-12 text-center space-y-12 flex-grow overflow-hidden">
        <div className={`absolute top-20 -left-16 w-72 h-72 ${themes.blob1} rounded-full opacity-50 filter blur-xl animate-blob`}></div>
        <div className={`absolute top-40 -right-16 w-72 h-72 ${themes.blob2} rounded-full opacity-50 filter blur-xl animate-blob animation-delay-2000`}></div>

        <div className={`p-10 rounded-[3rem] border-2 shadow-xl min-h-[200px] flex flex-col items-center justify-center w-full max-w-sm z-10 mx-4 ${themes.card}`}>
           {isLoading ? (
             <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 border-4 border-t-teal-500 rounded-full animate-spin`}></div>
                <p className="text-sm font-black text-teal-600 animate-pulse mt-4">
                    {language === 'mk' ? 'Амиго смислува мисија...' : 'Amigo is thinking...'}
                </p>
             </div>
           ) : (
             <p className={`text-2xl font-black ${themes.text} leading-tight`}>{task}</p>
           )}
        </div>

        <div className="w-full pt-4 z-10 max-w-sm mx-4">
            <button 
                onClick={() => setCurrentScreen(Screen.Home)} 
                className={`w-full ${themes.button} text-white font-black py-6 px-4 rounded-[2rem] text-xl transition-all shadow-2xl active:scale-95`}
            >
              {language === 'mk' ? "ГО ПРИФАЌАМ! 🛡️" : "I ACCEPT! 🛡️"}
            </button>
            <p className="mt-6 text-[11px] font-black uppercase tracking-widest text-slate-400">
                {language === 'mk' ? 'Самодовербата е твојата вистинска награда' : 'Confidence is your true reward'}
            </p>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default MoveScreen;
