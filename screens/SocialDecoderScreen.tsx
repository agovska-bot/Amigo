
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { Screen } from '../types';

declare const __API_KEY__: string;

const SocialDecoderScreen: React.FC = () => {
  const { age, language, addCourageStars, ageGroup, userName, setCurrentScreen, showToast } = useAppContext();
  const [description, setDescription] = useState('');
  const [bubbles, setBubbles] = useState<string[]>([]);
  const [victoryMessage, setVictoryMessage] = useState<string>('');
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const isPro = ageGroup === '12+';

  const decodeSocial = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    setSafetyAlert(null);
    const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
    
    const toneInstruction = isPro 
      ? "Use a mature, minimalist, and supportive tone. Focus on respect and logic. Avoid all 'childish' elements or overly bright emojis." 
      : "Use very simple words, a playful tone, and high levels of encouragement suited for a 10-12 year old.";

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Amigo, an advanced AI 'Social Sidekick' and 'Social Translator'. Your mission is to turn social confusion into understanding for ${userName} (${age} years old).
      User Input: "${description}"

      CORE TASKS:
      1. ANALYZE SAFETY: If the input involves serious bullying, threats, or self-harm, stop the normal response and provide a firm, kind instruction to talk to a trusted adult (parent, teacher, or counselor).
      2. DECODE: If safe, provide exactly 3 unique, logical, and non-scary alternative reasons for why the behavior happened.
      3. VALIDATE: Start by validating the user's feelings with phrases like "It's okay to feel this way."
      4. SOCIAL VICTORY: Provide a message that celebrates their courage to seek clarity.

      RULES:
      - Tone: ${toneInstruction}
      - Language: Respond in ${language === 'mk' ? 'Macedonian' : 'English'}.
      - Style: Clear, literal, and non-sarcastic. 
      - Identity: You are a social bridge, not a doctor.
      - Return JSON with: "safety_trigger" (boolean), "safety_message" (string or null), "bubbles" (array of 3 strings), "victory" (string).`;

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
        showToast("+10 Courage Stars! 🌟");
      }
    } catch (e) { 
      console.error(e);
      showToast("Amigo is thinking deeply, please try again.");
    } finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title="Social Decoder">
      <div className={`space-y-6 ${isPro ? 'text-slate-800' : 'text-slate-900'}`}>
        {!showResult ? (
          <div className="space-y-6 animate-fadeIn">
            <div className={`p-6 rounded-[2.5rem] border-2 shadow-sm ${isPro ? 'bg-white border-slate-200' : 'bg-white border-teal-50'}`}>
                <p className={`font-black mb-4 text-center ${isPro ? 'text-slate-600' : 'text-teal-700'}`}>
                    {language === 'mk' ? 'Што те замисли?' : 'What is on your mind?'}
                </p>
                <textarea
                    className={`w-full p-5 rounded-3xl h-40 font-bold outline-none transition-all ${isPro ? 'bg-slate-50 border-slate-100 focus:border-slate-300' : 'bg-slate-50 border-teal-100 focus:border-teal-300'}`}
                    placeholder={language === 'mk' ? 'Опиши ја ситуацијата...' : 'Describe what happened...'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button onClick={decodeSocial} disabled={isLoading} className={`w-full ${isPro ? 'bg-slate-900' : 'bg-teal-500'} text-white font-black py-5 rounded-3xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50`}>
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {language === 'mk' ? 'Преведувам...' : 'Translating...'}
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
                            <div key={i} className={`p-5 rounded-[1.8rem] border-l-8 transition-transform hover:scale-[1.02] ${isPro ? 'bg-white border-slate-300 shadow-sm' : 'bg-white border-teal-400 shadow-md'}`}>
                                <p className="font-bold text-slate-700">{b}</p>
                            </div>
                        ))}
                    </div>
                    <div className={`p-6 rounded-[2.5rem] border-2 ${isPro ? 'bg-slate-50 border-slate-100' : 'bg-teal-50 border-teal-200 text-teal-800'}`}>
                        <h4 className="font-black uppercase tracking-widest text-xs mb-2 text-teal-600">🏆 {language === 'mk' ? 'Социјална Победа' : 'Social Victory'}</h4>
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
