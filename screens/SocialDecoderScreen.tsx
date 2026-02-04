
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { Screen } from '../types';

const SocialDecoderScreen: React.FC = () => {
  const { age, language, addCourageStars, ageGroup, userName, setCurrentScreen, showToast } = useAppContext();
  const [description, setDescription] = useState('');
  const [bubbles, setBubbles] = useState<string[]>([]);
  const [victoryMessage, setVictoryMessage] = useState<string>('');
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const isPro = ageGroup === '12+';

  const themes = {
    '10-12': {
      accent: 'bg-teal-300',
      border: 'border-teal-100',
      text: 'text-teal-800',
      input: 'bg-teal-50/50'
    },
    '12+': {
      accent: 'bg-slate-700',
      border: 'border-slate-200',
      text: 'text-slate-800',
      input: 'bg-slate-50'
    }
  }[isPro ? '12+' : '10-12'];

  const decodeSocial = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    setSafetyAlert(null);
    
    const toneInstruction = isPro 
      ? "You are Amigo, a mature, minimalist, and respectful Social Sidekick for teens. Treat the user as a young adult. Avoid childish language." 
      : "You are Amigo, a playful, encouraging, and kind Social Sidekick for kids. Use simple words and lots of encouragement.";

    try {
      // Correct SDK initialization using process.env.API_KEY directly
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Persona: ${toneInstruction}
      User Name: ${userName}
      User Age: ${age}
      Input Context: "${description}"

      Your Mission: Turn social confusion into understanding and help ${userName} feel they belong.

      1. LANGUAGE DETECTION:
         - If the input is in Macedonian (even if written in Latin script like 'zdravo' or 'kako si'), you MUST respond in Macedonian using the CYRILLIC script.
         - If the input is in English, respond in English.

      2. SAFETY TRIGGER:
         - If the input mentions serious bullying, threats, or self-harm, stop the normal response. Instead, provide a firm, kind, and supportive message advising the user to talk to a trusted adult (parent, teacher, counselor).

      3. VALIDATION:
         - Always start by validating the user's feelings. Use phrases like "It's okay to feel this way" (or the Macedonian equivalent in Cyrillic).

      4. DECODE:
         - Provide exactly 3 unique, logical, and non-scary alternative reasons for the person's behavior (e.g., they were tired, distracted, feeling shy).

      5. VICTORY:
         - Provide a supportive message celebrating the user's courage to ask for help.

      Return JSON with:
      "safety_trigger": boolean,
      "safety_message": string or null,
      "bubbles": array of 3 strings,
      "victory": string.`;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    safety_trigger: { type: Type.BOOLEAN },
                    safety_message: { type: Type.STRING },
                    bubbles: { type: Type.ARRAY, items: { type: Type.STRING } },
                    victory: { type: Type.STRING }
                },
                required: ["safety_trigger", "bubbles", "victory"]
            }
        }
      });

      const json = JSON.parse(res.text || '{}');
      
      if (json.safety_trigger) {
        setSafetyAlert(json.safety_message);
        setShowResult(true);
      } else {
        setBubbles(json.bubbles || []);
        setVictoryMessage(json.victory || '');
        setShowResult(true);
        addCourageStars(10);
        showToast(language === 'mk' ? "+10 Ѕвезди! 🌟" : "+10 Stars! 🌟");
      }
    } catch (e) { 
      console.error(e);
      showToast(language === 'mk' ? "Амиго размислува, пробај пак." : "Amigo is thinking, try again.");
    } finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title={language === 'mk' ? 'Социјален Декодер' : 'Social Decoder'}>
      <div className="space-y-6">
        {!showResult ? (
          <div className="space-y-6 animate-fadeIn">
            <div className={`p-6 rounded-[2.5rem] border-2 shadow-sm bg-white ${themes.border}`}>
                <p className={`font-black mb-4 text-center ${themes.text}`}>
                    {language === 'mk' ? 'Што те замисли?' : 'What is on your mind?'}
                </p>
                <textarea
                    className={`w-full p-5 rounded-3xl h-40 font-bold outline-none transition-all border ${themes.input} focus:border-slate-300`}
                    placeholder={language === 'mk' ? 'Опиши ја ситуацијата...' : 'Describe what happened...'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button onClick={decodeSocial} disabled={isLoading} className={`w-full ${themes.accent} text-white font-black py-5 rounded-3xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50`}>
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {language === 'mk' ? 'Анализирам...' : 'Analyzing...'}
                    </span>
                ) : (language === 'mk' ? 'Анализирај Сигнали' : 'Analyze Signals')}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {safetyAlert ? (
                <div className="p-8 rounded-[2.5rem] bg-red-50 border-2 border-red-200 text-red-900 shadow-xl">
                    <p className="text-3xl mb-4">🛡️</p>
                    <p className="font-black text-lg leading-relaxed">{safetyAlert}</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {bubbles.map((b, i) => (
                            <div key={i} className={`p-5 rounded-[1.8rem] border-l-8 transition-transform hover:scale-[1.01] bg-white shadow-sm ${isPro ? 'border-slate-400' : 'border-teal-300'}`}>
                                <p className="font-bold text-slate-700">{b}</p>
                            </div>
                        ))}
                    </div>
                    <div className={`p-6 rounded-[2.5rem] border-2 ${isPro ? 'bg-slate-50 border-slate-200' : 'bg-teal-50 border-teal-100'}`}>
                        <h4 className="font-black uppercase tracking-widest text-[10px] mb-2 opacity-60">🏆 {language === 'mk' ? 'Социјална Победа' : 'Social Victory'}</h4>
                        <p className="font-black italic text-slate-800">"{victoryMessage}"</p>
                    </div>
                </>
            )}
            <div className="space-y-4 text-center pt-4">
                <button onClick={() => {setShowResult(false); setDescription(''); setSafetyAlert(null);}} className="w-full bg-slate-200 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-300 transition-all">
                    {language === 'mk' ? 'Назад' : 'Back'}
                </button>
            </div>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default SocialDecoderScreen;
