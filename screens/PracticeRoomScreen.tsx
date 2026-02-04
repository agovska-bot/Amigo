
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

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
        // Correct SDK initialization using process.env.API_KEY directly
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate 2 unique social scenarios for ${userName} (${age}yo) to practice inclusion. 
            Language: If user is Macedonian (even Latin), use Macedonian Cyrillic.
            Return in JSON array format.`,
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
    
    const persona = isPro 
      ? "You are Amigo, a mature, minimalist Social Sidekick for teens. Treat the user with respect." 
      : "You are Amigo, a playful and encouraging Social Sidekick for kids. Use simple words.";

    try {
        // Correct SDK initialization using process.env.API_KEY directly
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `${persona}
                Roleplay as the person in: "${scenario.prompt}".
                User: ${userName} (${age}yo).
                
                Rules:
                - Detect language. If Macedonian (even Latin), respond in CYRILLIC.
                - Validation: Always start with "It's okay to feel this way" (in the detected language/script).
                - Safety: If bullying/self-harm mentioned, stop and advise talking to a trusted adult.
                - Style: Clear, literal, non-sarcastic.`,
            }
        });
        setCurrentChat(chat);
        const res = await chat.sendMessage({ message: "Start simulation: First line in character." });
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
        
        // Safety heuristics
        if (aiResponse.includes("trusted adult") || aiResponse.includes("со возрасен") || aiResponse.includes("vozrasen")) {
            setSafetyAlert(aiResponse);
        }

        setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
        setTurns(prev => prev + 1);
        if (turns >= 2 && !safetyAlert) {
            addCourageStars(20);
            showToast(language === 'mk' ? "+20 Ѕвезди! 🌟" : "+20 Stars! 🌟");
        }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title={language === 'mk' ? 'Вежбалница' : 'Practice Room'}>
      <div className="h-full">
        {!currentChat ? (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-center font-black opacity-40 uppercase tracking-widest text-[10px]">
                {language === 'mk' ? 'Избери сценарио:' : 'Pick a scenario:'}
            </p>
            {scenarios.map((s, i) => (
              <button key={i} onClick={() => startPractice(s)} className={`w-full p-6 rounded-3xl text-left border-l-8 transition-all hover:translate-x-1 active:scale-95 shadow-sm border ${themes.card}`}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.icon}</span>
                    <p className="font-black text-slate-800">{s.title}</p>
                </div>
              </button>
            ))}
            {isLoading && !scenarios.length && <p className="text-center animate-pulse font-black text-orange-400">Loading...</p>}
          </div>
        ) : (
          <div className="flex flex-col h-[65vh]">
            <div className="flex-grow overflow-y-auto space-y-4 pb-4 px-2 custom-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl font-bold shadow-sm ${m.role === 'ai' ? `border ${themes.aiBubble}` : themes.userBubble}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4">
              {turns < 3 && !safetyAlert ? (
                <div className="flex gap-2 bg-slate-50 p-2 rounded-3xl border border-slate-200">
                  <input 
                    className="flex-grow p-4 bg-transparent outline-none font-bold text-slate-900" 
                    placeholder={language === 'mk' ? 'Одговори тука...' : 'Your reply...'}
                    value={userInput} 
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage} disabled={isLoading || !userInput.trim()} className={`${themes.accent} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30`}>
                    <span className="text-xl">➔</span>
                  </button>
                </div>
              ) : (
                <button onClick={() => {setCurrentChat(null); setSafetyAlert(null);}} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl active:scale-95">
                  {language === 'mk' ? 'Заврши' : 'Finish Session'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default PracticeRoomScreen;
