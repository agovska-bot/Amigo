
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

const CalmZoneScreen: React.FC = () => {
  const { ageGroup, language } = useAppContext();
  const [task, setTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<'menu' | 'breathe' | 'grounding'>('menu');

  const getNewTask = useCallback(async () => {
    setIsLoading(true);
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const prompt = `One minimalist calming sentence for ${ageGroup}yo in ${language === 'mk' ? 'Macedonian' : 'English'}. No fluff.`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } }
        });
        setTask(response.text?.trim() || "Take a deep breath.");
    } catch (e) { setTask("Focus on the present moment."); }
    finally { setIsLoading(false); }
  }, [ageGroup, language]);

  useEffect(() => {
    if (mode === 'menu') getNewTask();
  }, [mode, getNewTask]);

  if (mode !== 'menu') {
      return (
          <ScreenWrapper title={mode === 'breathe' ? "Calibration" : "Grounding"}>
              <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
                  <div className="w-64 h-64 rounded-full border-8 border-teal-500/20 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-teal-500/10 rounded-full animate-ping"></div>
                      <p className="text-slate-800 font-black text-2xl px-6">{mode === 'breathe' ? "Breathe..." : "Focus..."}</p>
                  </div>
                  <button onClick={() => setMode('menu')} className="bg-slate-900 text-teal-400 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                      I'm Ready 🛡️
                  </button>
              </div>
          </ScreenWrapper>
      );
  }

  return (
    <ScreenWrapper title="Chill Zone">
      <div className="flex flex-col items-center h-full space-y-10 pt-4">
        {/* LIGHT CALIBRATION CARD - REPLACED DARK THEME */}
        <div className="w-full bg-emerald-50 p-10 rounded-[2.5rem] border-2 border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full"></div>
            <p className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Mental Calibration</p>
            {isLoading ? (
                <div className="h-20 flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                </div>
            ) : (
                <p className="text-2xl font-black text-emerald-900 leading-tight italic">"{task}"</p>
            )}
        </div>
        
        <div className="grid grid-cols-1 gap-6 w-full">
            <button onClick={() => setMode('breathe')} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl blur opacity-10 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative flex items-center justify-between bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="text-left">
                        <p className="text-xl font-black text-slate-800">Deep Calibration</p>
                        <p className="text-xs text-slate-400 font-bold">Guided rhythm focus</p>
                    </div>
                    <span className="text-4xl">💎</span>
                </div>
            </button>

            <button onClick={() => setMode('grounding')} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl blur opacity-10 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative flex items-center justify-between bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="text-left">
                        <p className="text-xl font-black text-slate-800">5-4-3-2-1 Sensory</p>
                        <p className="text-xs text-slate-400 font-bold">Anchor to the now</p>
                    </div>
                    <span className="text-4xl">🌐</span>
                </div>
            </button>

            <button 
                onClick={getNewTask} 
                className="w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] bg-slate-50 text-slate-400 hover:text-emerald-600 transition-all border border-slate-100"
            >
                Request New Frequency
            </button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default CalmZoneScreen;
