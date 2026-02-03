
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTranslation } from '../hooks/useTranslation';

declare const __API_KEY__: string;

const MoveScreen: React.FC = () => {
  const { addCourageStars, showToast, ageGroup, activeTasks, setActiveTask, age } = useAppContext();
  const { language } = useTranslation();
  const [task, setTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const currentAgeKey = ageGroup || '10-12';
  const screenTitle = language === 'mk' ? "Daily Hero Missions" : "Daily Hero Missions";

  const getNewTask = useCallback(async (forceRefresh: boolean = false) => {
      if (!forceRefresh && activeTasks.move) {
        setTask(activeTasks.move);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
      
      try {
        const ai = new GoogleGenAI({ apiKey });
        const themes = ["greeting someone", "eye contact", "helping", "sharing a smile", "joining a group", "giving a compliment"];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        let langInstruction = language === 'mk' ? "Одговори на македонски." : "Respond in English.";
        const prompt = `Generate ONE small, safe, and positive social mission for a ${age}-year-old about ${randomTheme}. 
        Example: "Say hi to someone new today" or "Hold the door for a classmate". 
        Keep it to 1 short sentence. ${langInstruction}`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { 
              temperature: 1.0,
              thinkingConfig: { thinkingBudget: 0 }
          }
        });
        const generatedTask = response.text?.trim() || (language === 'mk' ? "Поздрави некого денес!" : "Say hi to someone today!");
        setTask(generatedTask);
        setActiveTask('move', generatedTask);
      } catch (error) {
        console.error("Mission Error:", error);
        const fallback = language === 'mk' ? "Насмевни се на некого денес!" : "Give someone a high-five today!";
        setTask(fallback);
        setActiveTask('move', fallback);
      } finally {
        setIsLoading(false);
      }
    }, [age, language, activeTasks.move, setActiveTask]);

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
    '12+': { blob1: 'bg-blue-100', blob2: 'bg-blue-200', text: 'text-blue-800', button: 'bg-blue-600 hover:bg-blue-700', button2: 'bg-blue-100 text-blue-800' }
  }[currentAgeKey as '10-12' | '12+'];

  return (
    <ScreenWrapper title={screenTitle}>
      <div className="relative flex flex-col items-center justify-start pt-8 text-center space-y-8 flex-grow overflow-hidden">
        <div className={`absolute top-20 -left-16 w-72 h-72 ${theme.blob1} rounded-full opacity-50 filter blur-xl animate-blob`}></div>
        <div className={`absolute top-40 -right-16 w-72 h-72 ${theme.blob2} rounded-full opacity-50 filter blur-xl animate-blob animation-delay-2000`}></div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border-2 border-white shadow-xl min-h-[160px] flex flex-col items-center justify-center w-full max-w-sm z-10 mx-4">
           {isLoading ? (
             <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 border-4 border-t-blue-500 rounded-full animate-spin`}></div>
                <p className={`text-xl font-black ${theme.text} animate-pulse mt-2`}>
                    {language === 'mk' ? 'Подготвувам мисија...' : 'Briefing Mission...'}
                </p>
             </div>
           ) : (
             <>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-4">Active Hero Mission</p>
                <p className={`text-2xl font-black ${theme.text} leading-tight`}>{task}</p>
             </>
           )}
        </div>
        <div className="w-full pt-4 z-10 space-y-4 max-w-sm mx-4">
            <button onClick={handleComplete} disabled={isLoading} className={`w-full ${theme.button} text-white font-black py-5 px-4 rounded-2xl transition disabled:bg-gray-400 shadow-xl active:scale-95`}>
              {language === 'mk' ? "Мисијата е завршена! 🛡️" : "Mission Complete! 🛡️"}
            </button>
            <button onClick={() => getNewTask(true)} disabled={isLoading} className={`w-full ${theme.button2} font-black py-3 px-4 rounded-2xl transition disabled:bg-gray-200 text-xs uppercase tracking-widest`}>
              {language === 'mk' ? "Нова Мисија" : "New Mission"}
            </button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default MoveScreen;
