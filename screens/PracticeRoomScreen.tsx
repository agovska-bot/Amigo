
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

const PracticeRoomScreen: React.FC = () => {
  const { age, language, userName, ageGroup, showToast } = useAppContext();
  const [scenarios, setScenarios] = useState<{title: string, prompt: string, icon: string}[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
  const [turns, setTurns] = useState(0);

  const isPro = ageGroup === '12+';

  const themes = {
    '10-12': {
      card: 'border-orange-200 bg-white hover:bg-orange-50/30',
      aiBubble: 'bg-orange-50 text-orange-900 border-orange-200',
      userBubble: 'bg-slate-800 text-white',
      accent: 'bg-orange-400'
    },
    '12+': {
      card: 'border-slate-300 bg-white hover:bg-slate-50',
      aiBubble: 'bg-slate-100 text-slate-800 border-slate-200',
      userBubble: 'bg-slate-700 text-white',
      accent: 'bg-slate-900'
    }
  }[isPro ? '12+' : '10-12'];

  useEffect(() => {
    generateScenarios();
  }, []);

  const generateScenarios = async () => {
    setIsLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate 2 social scenarios for ${userName} (${age}yo) to practice social inclusion. Language: ${language === 'mk' ? 'Macedonian' : 'English'}.`,
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: `You are Amigo, a ${isPro ? 'mature' : 'playful'} Social Sidekick. Roleplay as the person in: "${scenario.prompt}".`,
        }
    });
    setCurrentChat(chat);
    try {
        const res = await chat.sendMessage({ message: "Start simulation: First line." });
        setMessages([{ role: 'ai', text: res.text || '' }]);
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
        setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
        setTurns(prev => prev + 1);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title={language === 'mk' ? 'Вежбалница' : 'Practice Room'}>
      <div className="h-full">
        {!currentChat ? (
          <div className="space-y-4">
            {scenarios.map((s, i) => (
              <button key={i} onClick={() => startPractice(s)} className={`w-full p-6 rounded-3xl text-left border-l-8 shadow-sm border ${themes.card}`}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.icon}</span>
                    <p className="font-black text-slate-800">{s.title}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-[65vh]">
            <div className="flex-grow overflow-y-auto space-y-4 pb-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl font-bold ${m.role === 'ai' ? `border ${themes.aiBubble}` : themes.userBubble}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex gap-2 bg-slate-50 p-2 rounded-3xl">
              <input className="flex-grow p-4 bg-transparent outline-none font-bold" placeholder="..." value={userInput} onChange={e => setUserInput(e.target.value)} />
              <button onClick={sendMessage} className={`${themes.accent} text-white w-12 h-12 rounded-full`}>➔</button>
            </div>
            <button onClick={() => setCurrentChat(null)} className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{language === 'mk' ? 'Заврши' : 'Finish'}</button>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default PracticeRoomScreen;
