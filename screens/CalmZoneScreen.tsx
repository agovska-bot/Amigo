
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
        const prompt = `One minimalist calming sentence for ${ageGroup}yo in ${language === 'mk' ? 'Macedonian' : 'English'}.`;
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

  if (mode === 'breathe') {
      return (
          <ScreenWrapper title={language === 'mk' ? "Калибрација" : "Calibration"}>
              <div className="flex flex-col items-center justify-center h-full text-center space-y-12 py-10">
                  <div className="space-y-8 animate-fadeIn">
                      <div className="text-5xl mb-4">🧘</div>
                      <h2 className="text-2xl font-black text-slate-800 px-6">
                        {language === 'mk' ? "Фокусирај се на ритамот на твоите мисли" : "Focus on the rhythm of your thoughts"}
                      </h2>
                      <div className="p-8 bg-teal-50 rounded-[2rem] border-2 border-teal-100 italic font-bold text-teal-900 leading-relaxed">
                        {language === 'mk' 
                          ? "Замисли како секоја мисла е само облак што поминува низ небото. Не ги запирај, само гледај ги како заминуваат..." 
                          : "Imagine every thought is just a cloud passing through the sky. Don't stop them, just watch them float away..."}
                      </div>
                  </div>
                  <button onClick={() => setMode('menu')} className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-transform">
                      {language === 'mk' ? "Заврши" : "Done"}
                  </button>
              </div>
          </ScreenWrapper>
      );
  }

  if (mode === 'grounding') {
    return (
        <ScreenWrapper title={language === 'mk' ? "Приземјување" : "Grounding"}>
            <div className="flex flex-col items-start h-full space-y-6 py-4 overflow-y-auto no-scrollbar">
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 w-full mb-2">
                  <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">Техника 5-4-3-2-1</p>
                  <p className="text-[10px] font-bold text-orange-800 opacity-80">Полека помини низ овие чекори за да се вратиш во сегашниот момент.</p>
                </div>
                
                <div className="space-y-3 w-full">
                    {[
                        { n: 5, mk: "Работи што ги гледаш околу тебе", en: "Things you see around you", icon: "👀" },
                        { n: 4, mk: "Работи што можеш да ги допреш", en: "Things you can touch right now", icon: "🖐️" },
                        { n: 3, mk: "Звуци што ги слушаш во далечина", en: "Sounds you hear in the distance", icon: "👂" },
                        { n: 2, mk: "Мириси што ги чувствуваш", en: "Smells you notice nearby", icon: "👃" },
                        { n: 1, mk: "Вкус што го чувствуваш во устата", en: "Thing you can taste", icon: "👅" }
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm w-full animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="w-10 h-10 min-w-[40px] bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm">{step.n}</div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{step.icon} {language === 'mk' ? 'Чекор' : 'Step'}</p>
                                <p className="font-bold text-slate-800 text-sm leading-tight">{language === 'mk' ? step.mk : step.en}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setMode('menu')} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 mt-4 transition-transform">
                    {language === 'mk' ? "Се чувствувам подобро" : "I feel better"}
                </button>
            </div>
        </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="Chill Zone">
      <div className="flex flex-col items-center h-full space-y-10 pt-4">
        <div className="w-full bg-emerald-50 p-10 rounded-[2.5rem] border-2 border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🍃</div>
            <p className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Mental Calibration</p>
            {isLoading ? (
                <div className="h-20 flex items-center justify-center">
                    <p className="text-emerald-400 animate-pulse font-black text-2xl">...</p>
                </div>
            ) : (
                <p className="text-2xl font-black text-emerald-900 leading-tight italic">"{task}"</p>
            )}
        </div>
        
        <div className="grid grid-cols-1 gap-6 w-full pb-6">
            <button onClick={() => setMode('breathe')} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left hover:border-teal-400 transition-all active:scale-95 flex justify-between items-center group">
                <div>
                  <p className="text-xl font-black text-slate-800">{language === 'mk' ? 'Длабока Калибрација' : 'Deep Calibration'}</p>
                  <p className="text-xs text-slate-400 font-bold">{language === 'mk' ? 'Фокус на ритам и мисли' : 'Guided rhythm focus'}</p>
                </div>
                <span className="text-2xl group-hover:rotate-12 transition-transform">🧘</span>
            </button>

            <button onClick={() => setMode('grounding')} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left hover:border-teal-400 transition-all active:scale-95 flex justify-between items-center group">
                <div>
                  <p className="text-xl font-black text-slate-800">5-4-3-2-1 Sensory</p>
                  <p className="text-xs text-slate-400 font-bold">{language === 'mk' ? 'Приземји се во сегашноста' : 'Anchor to the now'}</p>
                </div>
                <span className="text-2xl group-hover:scale-110 transition-transform">⚓</span>
            </button>

            <button 
                onClick={getNewTask} 
                className="w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] bg-slate-50 text-slate-400 border border-slate-100 active:bg-slate-100 transition-colors"
            >
                {language === 'mk' ? 'Нова фреквенција' : 'Request New Frequency'}
            </button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default CalmZoneScreen;
