
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

  const currentAgeKey = ageGroup || '10-12';
  const isPro = ageGroup === '12+';
  const screenTitle = language === 'mk' ? "Daily Hero Missions" : "Daily Hero Missions";

  const getNewTask = useCallback(async (forceRefresh: boolean = false) => {
      if (!forceRefresh && activeTasks.move) {
        setTask(activeTasks.move);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
      
      const toneInstruction = isPro 
        ? "Use a mature, minimalist, and supportive tone. Avoid any childish or 'gamey' language. Respect the user as a young adult." 
        : "Use simple, playful words and high levels of encouragement suited for a 10-12 year old.";

      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are Amigo, the AI Social Sidekick for ${userName} (${age}yo). 
        Your mission is to help ${userName} feel like they belong through small, safe, positive social tasks.
        
        TASK: Generate ONE unique, safe, and positive social mission for today.
        
        RULES:
        - The task must be very low risk and safe (e.g., saying hi, holding a door, a small compliment).
        - Tone: ${toneInstruction}
        - Language: Respond in ${language === 'mk' ? 'Macedonian' : 'English'}.
        - Style: Clear, literal, and non-sarcastic.
        - Variety: No two missions should ever be the same. 
        - Safety: Never suggest anything unsafe or illegal.
        - Length: Max 1 short sentence.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { 
              temperature: 1.0,
              thinkingConfig: { thinkingBudget: 0 }
          }
        });
        const generatedTask = response.text?.trim() || (language === 'mk' ? "Поздрави некого денес со насмевка!" : "Say hi to someone with a smile today!");
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
    showToast("+15 Courage Stars! 🛡️");
    setActiveTask('move', null);
  };

  const theme = {
    '10-12': { blob1: 'bg-blue-50', blob2: 'bg-blue-100', text: 'text-blue-800', button: 'bg-blue-500 hover:bg-blue-600', button2: 'bg-blue-100 text-blue-800' },
    '12+': { blob1: 'bg-slate-100', blob2: 'bg-indigo-50', text: 'text-slate-800', button: 'bg-slate-900 hover:bg-black', button2: 'bg-slate-100 text-slate-800' }
  }[currentAgeKey as '10-12' | '12+'];

  return (
    <ScreenWrapper title={screenTitle}>
      <div className="relative flex flex-col items-center justify-start pt-8 text-center space-y-8 flex-grow overflow-hidden">
        <div className={`absolute top-20 -left-16 w-72 h-72 ${theme.blob1} rounded-full opacity-50 filter blur-xl animate-blob`}></div>
        <div className={`absolute top-40 -right-16 w-72 h-72 ${theme.blob2} rounded-full opacity-50 filter blur-xl animate-blob animation-delay-2000`}></div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] border-2 border-white shadow-xl min-h-[160px] flex flex-col items-center justify-center w-full max-w-sm z-10 mx-4">
           {isLoading ? (
             <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 border-4 border-t-teal-500 rounded-full animate-spin`}></div>
                <p className={`text-xl font-black text-teal-600 animate-pulse mt-2`}>
                    {language === 'mk' ? 'Смислувам мисија...' : 'Preparing Mission...'}
                </p>
             </div>
           ) : (
             <>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-600 mb-4 opacity-70">Daily Challenge</p>
                <p className={`text-2xl font-black ${theme.text} leading-tight`}>{task}</p>
             </>
           )}
        </div>
        <div className="w-full pt-4 z-10 space-y-4 max-w-sm mx-4">
            <button onClick={handleComplete} disabled={isLoading} className={`w-full ${theme.button} text-white font-black py-5 px-4 rounded-2xl transition-all disabled:opacity-50 shadow-xl active:scale-95`}>
              {language === 'mk' ? "Готово! 🛡️" : "Done! 🛡️"}
            </button>
            <button onClick={() => getNewTask(true)} disabled={isLoading} className={`w-full ${theme.button2} font-black py-3 px-4 rounded-2xl transition-all disabled:opacity-50 text-xs uppercase tracking-widest`}>
              {language === 'mk' ? "Друга мисија" : "Another mission"}
            </button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default MoveScreen;
