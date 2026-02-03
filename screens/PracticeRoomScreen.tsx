
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

declare const __API_KEY__: string;

const PracticeRoomScreen: React.FC = () => {
  const { age, language, addPoints, userName, ageGroup, showToast } = useAppContext();
  const [scenarios, setScenarios] = useState<{title: string, prompt: string, icon: string}[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
            contents: `Generate exactly 2 unique social scenarios (A and B) for a ${age}yo named ${userName}. Return in ${language === 'mk' ? 'Macedonian' : 'English'}.`,
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
    const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
    try {
        const ai = new GoogleGenAI({ apiKey });
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `You are a peer in: "${scenario.prompt}". Act like a ${age}yo. 
                After 3 user messages, finish with: "Great session! Virtual High-Five! ✋. Social Tip: [Provide 1 short tip].". 
                Respond in ${language === 'mk' ? 'Macedonian' : 'English'}.`,
            }
        });
        setCurrentChat(chat);
        const res = await chat.sendMessage({ message: "Start simulation." });
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
        setMessages(prev => [...prev, { role: 'ai', text: res.text || '' }]);
        setTurns(prev => prev + 1);
        if (turns >= 2) {
            addPoints('social', 20);
            showToast("Social Win! +20 Courage Stars 🌟");
        }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title="Practice Room">
      <div className={`h-full ${isPro ? 'text-white' : 'text-slate-900'}`}>
        {!currentChat ? (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-center font-black opacity-60">{language === 'mk' ? 'Избери сценарио:' : 'Pick a scenario:'}</p>
            {scenarios.map((s, i) => (
              <button key={i} onClick={() => startPractice(s)} className={`w-full p-6 rounded-3xl text-left border-l-8 ${isPro ? 'bg-slate-800 border-orange-500' : 'bg-white border-orange-400 shadow-md'}`}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.icon}</span>
                    <p className="font-black">{s.title}</p>
                </div>
              </button>
            ))}
            {isLoading && <p className="text-center animate-pulse">...</p>}
          </div>
        ) : (
          <div className="flex flex-col h-[65vh]">
            <div className="flex-grow overflow-y-auto space-y-4 pb-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl font-bold ${m.role === 'ai' ? (isPro ? 'bg-slate-800' : 'bg-white border shadow-sm') : 'bg-orange-500 text-white'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            {turns < 3 ? (
              <div className="flex gap-2">
                <input className={`flex-grow p-4 rounded-2xl ${isPro ? 'bg-slate-800' : 'bg-slate-100'}`} value={userInput} onChange={e => setUserInput(e.target.value)} />
                <button onClick={sendMessage} className="bg-teal-500 text-white p-4 rounded-2xl font-black">Send</button>
              </div>
            ) : (
              <button onClick={() => setCurrentChat(null)} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black">Exit Simulation</button>
            )}
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default PracticeRoomScreen;
