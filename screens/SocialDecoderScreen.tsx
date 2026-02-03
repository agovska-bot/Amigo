
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTranslation } from '../hooks/useTranslation';
import { Screen } from '../types';

declare const __API_KEY__: string;

const SocialDecoderScreen: React.FC = () => {
  const { age, language, addReflection, addPoints, ageGroup, userName, setCurrentScreen } = useAppContext();
  const [description, setDescription] = useState('');
  const [bubbles, setBubbles] = useState<string[]>([]);
  const [victoryMessage, setVictoryMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const isPro = ageGroup === '12+';

  const decodeSocial = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Amigo, the Social Translator. ${userName} (${age}yo) describes: "${description}".
      1. Exactly 3 logical "Signal Bubbles" (reasons).
      2. A "Social Victory" message celebrating their bravery in reflecting.
      Respond in ${language === 'mk' ? 'Macedonian' : 'English'}. Bubbles < 12 words. Victory < 30 words.`;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    bubbles: { type: Type.ARRAY, items: { type: Type.STRING } },
                    victory: { type: Type.STRING }
                },
                required: ["bubbles", "victory"]
            }
        }
      });

      const json = JSON.parse(res.text || '{}');
      setBubbles(json.bubbles || []);
      setVictoryMessage(json.victory || '');
      setShowResult(true);
      addPoints('social', 10);
      addReflection({ prompt: "Decoder Log", text: `${description}\nVictory: ${json.victory}`, date: new Date().toISOString(), category: 'social' });
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title="Social Decoder">
      <div className={`space-y-6 ${isPro ? 'text-white' : 'text-slate-900'}`}>
        {!showResult ? (
          <div className="space-y-6 animate-fadeIn">
            <div className={`p-6 rounded-[2.5rem] border-2 shadow-sm ${isPro ? 'bg-slate-800 border-teal-500/20' : 'bg-white border-teal-50'}`}>
                <p className="font-black mb-4 text-center">{language === 'mk' ? 'Што се случи?' : 'What happened?'}</p>
                <textarea
                    className={`w-full p-5 rounded-3xl h-40 font-bold ${isPro ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-teal-100'}`}
                    placeholder="..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button onClick={decodeSocial} disabled={isLoading} className="w-full bg-teal-500 text-white font-black py-5 rounded-3xl shadow-xl active:scale-95 transition-all">
                {isLoading ? '...' : (language === 'mk' ? 'Анализирај Сигнали' : 'Analyze Signals')}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
                {bubbles.map((b, i) => (
                    <div key={i} className={`p-5 rounded-[1.8rem] border-l-8 ${isPro ? 'bg-slate-800 border-teal-500' : 'bg-white border-teal-400 shadow-md'}`}>
                        <p className="font-bold">{b}</p>
                    </div>
                ))}
            </div>
            <div className={`p-6 rounded-[2.5rem] border-2 ${isPro ? 'bg-teal-500/10 border-teal-500/30' : 'bg-teal-50 border-teal-200 text-teal-800'}`}>
                <h4 className="font-black uppercase tracking-widest text-xs mb-2">🏆 {language === 'mk' ? 'Социјална Победа' : 'Social Victory'}</h4>
                <p className="font-black italic">"{victoryMessage}"</p>
            </div>
            <div className="space-y-4 text-center pt-4">
                <p className="font-black text-sm opacity-60 italic">{language === 'mk' ? 'Дали ова ја исчисти маглата?' : 'Does this help clear the fog?'}</p>
                <div className="flex gap-3">
                    <button onClick={() => setCurrentScreen(Screen.PracticeRoom)} className="flex-grow bg-orange-500 text-white font-black py-4 rounded-2xl shadow-lg">
                        {language === 'mk' ? 'Вежбај во Practice Room' : 'Try Practice Room'}
                    </button>
                    <button onClick={() => {setShowResult(false); setDescription('');}} className="bg-slate-200 text-slate-600 font-black px-6 rounded-2xl">
                        {language === 'mk' ? 'Ново' : 'New'}
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default SocialDecoderScreen;
