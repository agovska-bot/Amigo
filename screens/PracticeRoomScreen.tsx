
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

declare const __API_KEY__: string;

const PracticeRoomScreen: React.FC = () => {
  const { age, language, addCourageStars, userName, ageGroup, showToast } = useAppContext();
  const [scenarios, setScenarios] = useState<{title: string, prompt: string, icon: string}[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
  const [turns, setTurns] = useState(0);

  const isPro = ageGroup === '12+';

  useEffect(() => {
    generateScenarios();
  }, []);

  const generateScenarios = async () => {
    setIsLoading(true);
    const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
    try {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate exactly 2 unique social scenarios for ${userName} (${age}yo) to practice social inclusion. 
            Return in ${language === 'mk' ? 'Macedonian' : 'English'}.
            Scenarios should be safe, relevant to daily life (school, park, online), and realistic.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { title: { type: Type.STRING }, prompt: { type: Type.STRING }, icon: { type: Type.STRING } },
                        required: ["title", "prompt", "icon"]
                    }
                }
            }
        });
        setScenarios(JSON.parse(res.text || '[]').slice(0, 2));
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const startPractice = async (scenario: {title: string, prompt: string}) => {
    setIsLoading(true);
    setSafetyAlert(null);
    const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
    
    const toneInstruction = isPro 
      ? "Use a mature, minimalist, and respectful tone. Do not use childish language. Treat the user as an equal." 
      : "Use simple words, a playful tone, and high encouragement suited for 10-12 year olds.";

    try {
        const ai = new GoogleGenAI({ apiKey });
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `You are Amigo, the AI Social Sidekick. You are acting as a peer or the person involved in: "${scenario.prompt}".
                User: ${userName} (${age}yo).
                
                MISSION: Turn social confusion into understanding. Help ${userName} feel like they belong.
                
                SAFETY TRIGGER: If self-harm, serious bullying, or illegal acts are mentioned, immediately stop the simulation and provide a firm, respectful bridge to a trusted adult.
                
                STYLE RULES:
                - Language: Respond in ${language === 'mk' ? 'Macedonian' : 'English'}.
                - Tone: ${toneInstruction}
                - Validation: Use phrases like "It's okay to feel this way."
                - Style: Clear, literal, non-sarcastic.
                - Ending: After 3 turns, provide a helpful 'Social Insight' and end the chat.`,
            }
        });
        setCurrentChat(chat);
        const res = await chat.sendMessage({ message: "Start simulation: Introduce yourself as the other person in this scenario." });
        setMessages([{ role: 'ai', text: res.text || '' }]);
        setTurns(0);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !currentChat) return;
    setIsLoading(true);
    const text = userInput;
    setUserInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    try {
        const res = await currentChat.sendMessage({ message: text });
        const aiResponse = res.text || '';
        
        // Check for safety keywords in AI response if the model triggered safety (heuristic)
        if (aiResponse.includes("trusted adult") || aiResponse.includes("со возрасен")) {
             setSafetyAlert(aiResponse);
        }

        setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
        const newTurns = turns + 1;
        setTurns(newTurns);
        if (newTurns >= 3 && !safetyAlert) {
            addCourageStars(20);
            showToast("Skill Unlocked! +20 Courage Stars 🌟");
        }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title="Practice Room">
      <div className={`h-full ${isPro ? 'text-slate-800' : 'text-slate-900'}`}>
        {!currentChat ? (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-center font-black opacity-60 uppercase tracking-widest text-[10px] text-teal-600">
                {language === 'mk' ? 'Избери сценарио:' : 'Pick a scenario:'}
            </p>
            {scenarios.map((s, i) => (
              <button key={i} onClick={() => startPractice(s)} className={`w-full p-6 rounded-3xl text-left border-l-8 transition-all hover:translate-x-1 active:scale-95 ${isPro ? 'bg-white border-slate-300 shadow-sm' : 'bg-white border-orange-400 shadow-md'}`}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.icon}</span>
                    <p className="font-black text-slate-800">{s.title}</p>
                </div>
              </button>
            ))}
            {isLoading && !scenarios.length && <p className="text-center animate-pulse font-black text-orange-500">Preparing...</p>}
          </div>
        ) : (
          <div className="flex flex-col h-[65vh]">
            <div className="flex-grow overflow-y-auto space-y-4 pb-4 px-2 custom-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl font-bold shadow-sm transition-all ${m.role === 'ai' ? (isPro ? 'bg-slate-50 text-slate-800 border-l-4 border-indigo-500' : 'bg-teal-50 text-teal-900 border-l-4 border-teal-400') : 'bg-slate-900 text-white shadow-lg'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4">
              {turns < 3 && !safetyAlert ? (
                <div className="flex gap-2 bg-slate-100 p-2 rounded-3xl border border-white shadow-inner">
                  <input 
                    className="flex-grow p-4 bg-transparent outline-none font-bold text-slate-900" 
                    placeholder={language === 'mk' ? 'Твојот одговор...' : 'Your reply...'}
                    value={userInput} 
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage} disabled={isLoading || !userInput.trim()} className="bg-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30">
                    <span className="text-xl">➔</span>
                  </button>
                </div>
              ) : (
                <button onClick={() => {setCurrentChat(null); setSafetyAlert(null);}} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl hover:bg-black transition-all active:scale-95">
                  {language === 'mk' ? 'Заврши' : 'Finish Session'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </ScreenWrapper>
  );
};

export default PracticeRoomScreen;
