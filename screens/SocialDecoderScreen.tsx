
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

interface Insight {
  label: string;
  text: string;
  icon: string;
}

interface DecodingResult {
  insights: Insight[];
  victory: string;
  safetyWarning?: string;
}

const SocialDecoderScreen: React.FC = () => {
  const { language, userName, showToast, t } = useAppContext();
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<DecodingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const decodeSocial = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `You are Amigo, a Social Sidekick for teens (10-16y). 
      Your job is to translate confusing social signals into clear logic.
      
      TONE: Empathetic, logical, and "cool older friend." Do not sound like a clinical doctor.
      
      CRITICAL RULES FOR SAFETY:
      - ONLY use "safetyWarning" if there is explicit mention of physical bullying, self-harm, or serious threats.
      - If it's just a normal social argument, being ignored, or "ghosted," DO NOT trigger the safety warning. Social confusion is normal!
      - Vocabulary for safety: "It's important to involve a trusted adult for this specific situation."
      
      TRIPLE PRISM METHOD:
      1. LOGIC: What's likely happening in the other person's head?
      2. STRATEGY: One cool, safe way to react.
      3. VALIDATION: Remind ${userName} that they are okay.
      
      Language: ${language === 'mk' ? 'Macedonian' : 'English'}.
      User Name: ${userName}.`;

      const prompt = `Translate this social signal: "${description}".`;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 },
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    insights: { 
                      type: Type.ARRAY, 
                      items: { 
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING },
                          text: { type: Type.STRING },
                          icon: { type: Type.STRING }
                        },
                        required: ["label", "text", "icon"]
                      } 
                    },
                    victory: { type: Type.STRING },
                    safetyWarning: { type: Type.STRING }
                },
                required: ["insights", "victory"]
            }
        }
      });

      const json = JSON.parse(res.text || '{}') as DecodingResult;
      setResult(json);
      setShowResult(true);
    } catch (e) { 
      console.error(e);
      showToast(t('decoder.retry'));
    } finally { setIsLoading(false); }
  };

  const handleReset = () => {
    setShowResult(false);
    setDescription('');
    setResult(null);
  };

  return (
    <ScreenWrapper title={t('decoder.title')}>
      <div className="space-y-6 flex flex-col h-full">
        {!showResult ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-teal-50 p-8 rounded-[2.5rem] border-2 border-teal-100 shadow-sm relative overflow-hidden transition-all focus-within:border-teal-400 focus-within:bg-white">
                <p className="text-teal-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Input Social Signal</p>
                <textarea
                    className="w-full bg-transparent text-slate-900 p-0 text-xl font-bold outline-none placeholder-slate-300 transition-all resize-none h-44"
                    placeholder={t('decoder.placeholder')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button 
                onClick={decodeSocial} 
                disabled={isLoading} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-6 rounded-[2rem] shadow-xl active:scale-95 transition-all disabled:opacity-50 text-xl flex items-center justify-center gap-3"
            >
                {isLoading ? (
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                ) : (
                    <>{t('decoder.analyze')} ➔</>
                )}
            </button>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeIn pb-10">
            {result?.safetyWarning && (
              <div className="bg-orange-50 border-2 border-orange-200 p-5 rounded-[2rem] flex items-start gap-4 animate-shake">
                <span className="text-3xl">🛡️</span>
                <div>
                  <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest mb-1">Amigo's Safety Shield</p>
                  <p className="text-orange-900 font-bold text-sm leading-tight">{result.safetyWarning}</p>
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-6 rounded-[2rem] border-l-4 border-teal-500 shadow-sm">
                <p className="text-[10px] font-black uppercase text-teal-600 tracking-[0.3em] mb-2">The Signal</p>
                <p className="text-slate-700 font-bold leading-tight italic">"{description}"</p>
            </div>

            <div className="grid gap-4">
                {result?.insights.map((item, i) => (
                    <div key={i} className="animate-slideUp" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-500">{item.label}</h4>
                            </div>
                            <p className="font-bold text-slate-800 text-[15px] leading-relaxed">
                                {item.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 rounded-[2.5rem] bg-teal-500 text-slate-900 shadow-xl">
                <p className="font-black leading-tight text-lg italic">"{result?.victory}"</p>
            </div>

            <button 
                onClick={handleReset} 
                className="w-full bg-slate-100 text-slate-400 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-[0.3em] text-[10px]"
            >
                {t('decoder.back')}
            </button>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default SocialDecoderScreen;
