
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

// Делови од одговорот на Амиго
interface Insight {
  label: string;
  text: string;
  icon: string;
}

const SocialDecoderScreen: React.FC = () => {
  const { language, userName, showToast, t } = useAppContext();
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<{insights: Insight[], victory: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Функција која ја анализира ситуацијата
  const decodeSocial = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze for ${userName}: "${description}"`,
        config: {
            systemInstruction: `You are Amigo. Help decode a social situation for a child. Lang: ${language}.`,
            responseMimeType: "application/json",
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
                    victory: { type: Type.STRING }
                },
                required: ["insights", "victory"]
            }
        }
      });
      setResult(JSON.parse(res.text || '{}'));
    } catch (e) { showToast(t('decoder.retry')); }
    finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title={t('decoder.title')}>
      <div className="space-y-6">
        {!result ? (
          <div className="space-y-6 animate-fadeIn">
            <textarea
                className="w-full bg-slate-50 border-2 border-slate-100 p-6 text-xl font-bold outline-none focus:border-teal-400 rounded-3xl h-44 resize-none"
                placeholder={t('decoder.placeholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button 
                onClick={decodeSocial} 
                disabled={isLoading} 
                className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl shadow-lg active:scale-95 disabled:opacity-50 text-xl"
            >
                {isLoading ? t('decoder.analyzing') : t('decoder.analyze')}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {result.insights.map((item, i) => (
                <div key={i} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <span>{item.icon}</span>
                        <h4 className="font-black text-[10px] uppercase text-slate-400">{item.label}</h4>
                    </div>
                    <p className="font-bold text-slate-800">{item.text}</p>
                </div>
            ))}
            <div className="p-6 bg-teal-500 text-white rounded-3xl font-black italic">
                "{result.victory}"
            </div>
            <button onClick={() => setResult(null)} className="w-full text-slate-400 font-bold py-4 underline">
                {t('decoder.back')}
            </button>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default SocialDecoderScreen;
