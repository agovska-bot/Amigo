
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { AgeGroup } from '../types';
import { useTranslation } from '../hooks/useTranslation';

const GroundingExercise: React.FC<{ onFinish: () => void; isPro: boolean }> = ({ onFinish, isPro }) => {
    const steps = [
        "Focus: 5 things you can see right now.",
        "Focus: 4 things you can touch.",
        "Focus: 3 things you can hear.",
        "Focus: 2 things you can smell.",
        "Focus: 1 thing you can taste (or your favorite flavor)."
    ];
    const [step, setStep] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fadeIn">
            <h2 className="text-4xl font-black text-teal-500">5-4-3-2-1</h2>
            <div className={`p-8 rounded-[3rem] border-2 shadow-xl ${isPro ? 'bg-slate-800 border-teal-500/30 text-white' : 'bg-white border-teal-100 text-slate-900'}`}>
                <p className="text-2xl font-bold leading-relaxed">{steps[step]}</p>
            </div>
            <div className="flex gap-4 w-full px-4">
                {step < steps.length - 1 ? (
                    <button onClick={() => setStep(s => s + 1)} className="w-full bg-teal-500 text-white py-4 rounded-2xl font-black text-lg">Next Step</button>
                ) : (
                    <button onClick={onFinish} className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-black text-lg">I Feel Grounded 🌬️</button>
                )}
            </div>
        </div>
    );
};

const BreathingExercise: React.FC<{ onFinish: () => void; isPro: boolean }> = ({ onFinish, isPro }) => {
    const [phase, setPhase] = useState(-1); // -1: Ready, 0: In, 1: Hold, 2: Out, 3: Hold
    const [cycle, setCycle] = useState(0);
    const { t } = useTranslation();

    const PHASE_DURATION = 4000;
    const phases = ["Breathe In", "Hold", "Breathe Out", "Hold"];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (phase === -1) { setPhase(0); return; }
            const nextPhase = (phase + 1) % 4;
            if (nextPhase === 0) {
                if (cycle + 1 >= 3) { onFinish(); return; }
                setCycle(c => c + 1);
            }
            setPhase(nextPhase);
        }, phase === -1 ? 2000 : PHASE_DURATION);
        return () => clearTimeout(timer);
    }, [phase, cycle, onFinish]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className={`absolute inset-0 bg-teal-500 rounded-full transition-all duration-[4000ms] ease-in-out opacity-20 ${phase === 0 || phase === 1 ? 'scale-125' : 'scale-75'}`}></div>
                <div className={`absolute w-40 h-40 bg-teal-500 rounded-full transition-all duration-[4000ms] ease-in-out ${phase === 0 || phase === 1 ? 'scale-110' : 'scale-90'}`}></div>
                <h2 className="text-2xl font-black text-white z-10">{phase === -1 ? "Get Ready" : phases[phase]}</h2>
            </div>
            <p className="mt-12 font-black text-teal-500 uppercase tracking-widest">Cycle {cycle + 1} of 3</p>
        </div>
    );
};

const CalmZoneScreen: React.FC = () => {
  const { ageGroup } = useAppContext();
  const { language } = useTranslation();
  const [task, setTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<'menu' | 'breathe' | 'grounding'>('menu');

  const isPro = ageGroup === '12+';

  const getNewTask = useCallback(async () => {
    setIsLoading(true);
    try {
        // Correct SDK initialization using process.env.API_KEY directly
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const prompt = `Short mental calming exercise for ${ageGroup} year old. Return in ${language === 'mk' ? 'Macedonian' : 'English'}. Max 1 sentence.`;
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt,
            config: { temperature: 1.0 }
        });
        setTask(response.text?.trim() || "Take a deep breath.");
    } catch (e) { setTask("Observe your breathing for a moment."); }
    finally { setIsLoading(false); }
  }, [ageGroup, language]);

  useEffect(() => {
    if (mode === 'menu') getNewTask();
  }, [mode, getNewTask]);

  if (mode === 'breathe') return <ScreenWrapper title="Deep Breathing"><BreathingExercise onFinish={() => setMode('menu')} isPro={isPro} /></ScreenWrapper>;
  if (mode === 'grounding') return <ScreenWrapper title="Grounding"><GroundingExercise onFinish={() => setMode('menu')} isPro={isPro} /></ScreenWrapper>;

  return (
    <ScreenWrapper title="Chill Zone">
      <div className={`flex flex-col items-center h-full space-y-8 pt-8 ${isPro ? 'text-white' : 'text-slate-900'}`}>
        <div className={`w-full p-8 rounded-[3rem] border-2 shadow-lg text-center ${isPro ? 'bg-slate-800 border-teal-500/20' : 'bg-white border-teal-50'}`}>
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-4">Quick Recharge</p>
            {isLoading ? <p className="animate-pulse font-bold">Amigo is selecting a calm thought...</p> : <p className="text-xl font-bold italic">"{task}"</p>}
        </div>
        
        <div className="grid grid-cols-1 gap-4 w-full">
            <button onClick={() => setMode('breathe')} className="flex items-center justify-between bg-teal-500 text-white p-6 rounded-3xl shadow-xl active:scale-95 transition-all">
                <div className="text-left">
                    <p className="text-xl font-black">Deep Breathing</p>
                    <p className="text-xs opacity-80">Guided focus session</p>
                </div>
                <span className="text-4xl">🌬️</span>
            </button>
            <button onClick={() => setMode('grounding')} className="flex items-center justify-between bg-[#f97316] text-white p-6 rounded-3xl shadow-xl active:scale-95 transition-all">
                <div className="text-left">
                    <p className="text-xl font-black">5-4-3-2-1 Grounding</p>
                    <p className="text-xs opacity-80">Stop social overwhelm</p>
                </div>
                <span className="text-4xl">⚓</span>
            </button>
            <button onClick={getNewTask} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${isPro ? 'bg-slate-800' : 'bg-slate-200 text-slate-600'}`}>
                New Calm Thought
            </button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default CalmZoneScreen;
