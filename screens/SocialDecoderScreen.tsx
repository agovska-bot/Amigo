
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

const SocialDecoderScreen: React.FC = () => {
  const { age, language, ageGroup, userName, showToast, t } = useAppContext();
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
      ? "You are Amigo, a mature, minimalist, and respectful Social Sidekick for teens." 
      : "You are Amigo, a playful, encouraging, and kind Social Sidekick for kids.";

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Persona: ${toneInstruction}
      User Name: ${userName}
      Input Context: "${description}"
      Task: Provide 3 non-scary alternative reasons for this social behavior and a positive validation.
      Language: ${language === 'mk' ? 'Macedonian (Cyrillic)' : 'English'}.`;

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
      } else {
        setBubbles(json.bubbles || []);
        setVictoryMessage(json.victory || '');
      }
      setShowResult(true);
    } catch (e) { 
      console.error(e);
      showToast(t('decoder.retry'));
    } finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title={t('decoder.title')}>
      <div className="space-y-6">
        {!showResult ? (
          <div className="space-y-6 animate-fadeIn">
            <div className={`p-6 rounded-[2.5rem] border-2 shadow-sm bg-white ${themes.border}`}>
                <p className={`font-black mb-4 text-center ${themes.text}`}>
                    {t('decoder.prompt')}
                </p>
                <textarea
                    className={`w-full p-5 rounded-3xl h-40 font-bold outline-none transition-all border ${themes.input} focus:border-slate-300`}
                    placeholder={t('decoder.placeholder')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button onClick={decodeSocial} disabled={isLoading} className={`w-full ${themes.accent} text-white font-black py-5 rounded-3xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50`}>
                {isLoading ? t('decoder.analyzing') : t('decoder.analyze')}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {safetyAlert ? (
                <div className="p-8 rounded-[2.5rem] bg-red-50 border-2 border-red-200 text-red-900 shadow-xl">
                    <p className="font-black text-lg leading-relaxed">{safetyAlert}</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {bubbles.map((b, i) => (
                            <div key={i} className={`p-5 rounded-[1.8rem] border-l-8 bg-white shadow-sm ${isPro ? 'border-slate-400' : 'border-teal-300'}`}>
                                <p className="font-bold text-slate-700">{b}</p>
                            </div>
                        ))}
                    </div>
                    <div className={`p-6 rounded-[2.5rem] border-2 ${isPro ? 'bg-slate-50 border-slate-200' : 'bg-teal-50 border-teal-100'}`}>
                        <p className="font-black italic text-slate-800">"{victoryMessage}"</p>
                    </div>
                </>
            )}
            <button onClick={() => {setShowResult(false); setDescription(''); setSafetyAlert(null);}} className="w-full bg-slate-200 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-300 transition-all">
                {t('decoder.back')}
            </button>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default SocialDecoderScreen;
