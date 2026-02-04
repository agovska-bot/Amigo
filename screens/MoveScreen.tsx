
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTranslation } from '../hooks/useTranslation';

declare const __API_KEY__: string;

const MoveScreen: React.FC = () => {
  const { addCourageStars, showToast, ageGroup, activeTasks, setActiveTask, age, userName } = useAppContext();
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
      button: 'bg-blue-400 hover:bg-blue-500', 
      button2: 'bg-blue-50 text-blue-800' 
    },
    '12+': { 
      blob1: 'bg-slate-100', 
      blob2: 'bg-indigo-50/50', 
      card: 'bg-white border-slate-200',
      text: 'text-slate-800', 
      button: 'bg-slate-800 hover:bg-slate-900', 
      button2: 'bg-slate-100 text-slate-800' 
    }
  }[isPro ? '12+' : '10-12'];

  const getNewTask = useCallback(async (forceRefresh: boolean = false) => {
      if (!forceRefresh && activeTasks.move) {
        setTask(activeTasks.move);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
      
      const persona = isPro 
        ? "You are Amigo, a mature and minimalist Social Sidekick for teens." 
        : "You are Amigo, a playful and encouraging Social Sidekick for kids.";

      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `${persona}
        User: ${userName} (${age}yo).
        
        Task: Generate ONE unique, safe, and positive social mission for today.
        
        Rules:
        - Language: Detect user language (${language}). If Macedonian (even Latin), respond in MACEDONIAN CYRILLIC.
        - Tone: ${isPro ? "Mature, respectful, minimalist" : "Simple, playful, high encouragement"}.
        - Mission: Must be low-risk (saying hi, a small compliment, holding a door).
        - Format: Max 1 short sentence.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { 
              temperature: 1.0,
              thinkingConfig: { thinkingBudget: 0 }
          }
        });
        const generatedTask = response.text?.trim() || (language === 'mk' ? "Поздрави некого со насмевка денес!" : "Say hi to someone with a smile today!");
        setTask(generatedTask);
        setActiveTask('move', generatedTask);
      } catch (error) {
        console.error("Mission Error:", error);
        const fallback = language === 'mk' ? "Насмевни се на некого денес!" : "Smile at someone today!";
        setTask(fallback);
        setActiveTask('move', fallback);
      } finally {
        setIsLoading(false);
      }
    }, [age, language, activeTasks.move, setActiveTask, isPro, userName]);

  useEffect(() => {
    getNewTask();
  }, [getNewTask]);

  const handleComplete = () => {
    addCourageStars(15);
    showToast(language === 'mk' ? "+15 Ѕвезди! 🛡️" : "+15 Stars! 🛡️");
    setActiveTask('move', null);
  };

  return (
    <ScreenWrapper title={screenTitle}>
      <div className="relative flex flex-col items-center justify-start pt-8 text-center space-y-8 flex-grow overflow-hidden">
        <div className={`absolute top-20 -left-16 w-72 h-72 ${themes.blob1} rounded-full opacity-50 filter blur-xl animate-blob`}></div>
        <div className={`absolute top-40 -right-16 w-72 h-72 ${themes.blob2} rounded-full opacity-50 filter blur-xl animate-blob animation-delay-2000`}></div>

        <div className={`p-8 rounded-[2.5rem] border-2 shadow-xl min-h-[160px] flex flex-col items-center justify-center w-full max-w-sm z-10 mx-4 ${themes.card}`}>
           {isLoading ? (
             <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 border-4 border-t-teal-500 rounded-full animate-spin`}></div>
                <p className="text-sm font-black text-teal-600 animate-pulse mt-2">
                    {language === 'mk' ? 'Подготвувам...' : 'Preparing...'}
                </p>
             </div>
           ) : (
             <>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-4">Daily Challenge</p>
                <p className={`text-2xl font-black ${themes.text} leading-tight`}>{task}</p>
             </>
           )}
        </div>
        <div className="w-full pt-4 z-10 space-y-4 max-w-sm mx-4">
            <button onClick={handleComplete} disabled={isLoading} className={`w-full ${themes.button} text-white font-black py-5 px-4 rounded-2xl transition-all disabled:opacity-50 shadow-xl active:scale-95`}>
              {language === 'mk' ? "Готово! 🛡️" : "Done! 🛡️"}
            </button>
            <button onClick={() => getNewTask(true)} disabled={isLoading} className={`w-full ${themes.button2} font-black py-3 px-4 rounded-2xl transition-all disabled:opacity-50 text-xs uppercase tracking-widest`}>
              {language === 'mk' ? "Друга мисија" : "Another mission"}
            </button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default MoveScreen;
