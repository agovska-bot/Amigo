
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

const iconMap: Record<string, string> = {
  'heart': '💖', 'broken_heart': '💔', 'school': '🏫', 'friend': '👫', 'friendship': '👫', 
  'help': '🤝', 'helping': '🤝', 'smile': '😊', 'wave': '👋', 'ball': '⚽', 'phone': '📱', 
  'game': '🎮', 'books': '📚', 'club': '🎭', 'party': '🎉', 'sad': '😢', 'happy': '😄', 
  'confused': '🤔', 'team': '👥', 'chat': '💬', 'family': '🏠', 'conflict': '⚡', 'digital': '💻'
};

const PracticeRoomScreen: React.FC = () => {
  const { language, practiceScenarios, dailyPracticeTip, userName, t } = useAppContext();
  const [activeSession, setActiveSession] = useState<{chat: Chat, title: string} | null>(null);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const getIcon = (icon: string) => {
    if (!icon) return '🌟';
    const clean = icon.toLowerCase().trim();
    return iconMap[clean] || '🌟';
  };

  const startPractice = async (scenario: {title: string, prompt: string}) => {
    setIsLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `You are Amigo, a friendly and cool peer mentor for ${userName}. 
        Scenario: ${scenario.prompt}.
        Act naturally as a character in this situation. 
        If ${userName} struggles, gently encourage them or give a tip on what to say.
        Keep responses to 1-2 short, relatable sentences.
        Language: ${language === 'mk' ? 'Macedonian' : 'English'}.`;

        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: { systemInstruction, temperature: 0.8 }
        });
        
        setActiveSession({ chat, title: scenario.title });
        const res = await chat.sendMessage({ message: `Hi, I'm ${userName}. Let's start.` });
        setMessages([{ role: 'ai', text: res.text || '' }]);
    } catch (e) { 
        console.error(e);
        setMessages([{ role: 'ai', text: language === 'mk' ? "Еј! Ајде да вежбаме. Како би ја почнал оваа ситуација?" : "Hey! Let's practice. How would you start this conversation?" }]);
    } finally { setIsLoading(false); }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !activeSession || isLoading) return;
    
    const textToSend = userInput.trim();
    setUserInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);
    
    try {
      const response = await activeSession.chat.sendMessage({ message: textToSend });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || '' }]);
    } catch (e) { 
      console.error(e);
      setMessages(prev => [...prev, { role: 'ai', text: language === 'mk' ? "Ме збуни малку врската, ајде да продолжиме?" : "My connection flickered, let's keep going!" }]);
    } finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title={t('practice.title')}>
      <div className="h-full flex flex-col">
        {!activeSession ? (
          <div className="space-y-6 animate-fadeIn pb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
                <p className="text-white/60 font-black uppercase text-[10px] tracking-[0.4em] mb-2">{t('practice.insight_label')}</p>
                <p className="text-white font-black text-lg leading-tight">
                    "{dailyPracticeTip || (language === 'mk' ? 'Твојата автентичност е твојата супермоќ.' : 'Your authenticity is your superpower.')}"
                </p>
            </div>

            <div className="flex items-center justify-between px-2 pt-2">
                <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">
                    {t('practice.select_situation')}
                </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {practiceScenarios.map((s, i) => (
                <button 
                    key={i} 
                    onClick={() => startPractice(s)} 
                    className="w-full p-6 rounded-[2.5rem] text-left border-2 bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-900/10 transition-all group flex items-center gap-5 border-slate-100 shadow-sm active:scale-95 animate-slideUp"
                    style={{ animationDelay: `${i * 70}ms` }}
                >
                    <div className="w-14 h-14 min-w-[56px] bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner border border-indigo-100">
                        {getIcon(s.icon)}
                    </div>
                    <div>
                        <p className="font-black text-slate-800 text-base leading-none mb-2">{s.title}</p>
                        <p className="text-[11px] text-slate-400 font-bold leading-tight opacity-90">{s.prompt}</p>
                    </div>
                </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[75vh] animate-fadeIn">
            <div className="flex items-center justify-between mb-4 p-4 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase text-indigo-900/60 tracking-widest">
                    {language === 'mk' ? 'Безбедна зона' : 'Safe Zone'} • {activeSession.title}
                  </p>
                </div>
                <button onClick={() => {setActiveSession(null); setMessages([]);}} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-red-500 transition-colors">
                    {t('practice.end_sim')}
                </button>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-6 pb-6 px-1 no-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-slideUp`}>
                        <div className={`max-w-[85%] p-5 rounded-[2rem] font-bold text-[16px] leading-snug shadow-sm ${m.role === 'ai' ? 'bg-white text-slate-800 border-2 border-slate-50 rounded-bl-none shadow-slate-200/50' : 'bg-indigo-600 text-white rounded-br-none shadow-indigo-900/20'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-white border-2 border-slate-50 p-5 rounded-[2rem] rounded-bl-none text-slate-300 font-black tracking-widest">
                      ...
                    </div>
                  </div>
                )}
            </div>

            <div className="mt-4 flex gap-2 bg-white p-3 rounded-[3rem] shadow-2xl shadow-slate-200 border-2 border-indigo-50">
              <input 
                className="flex-grow px-5 bg-transparent outline-none font-bold text-slate-800 placeholder-slate-300 text-lg" 
                placeholder={t('practice.say_something')} 
                value={userInput} 
                onChange={e => setUserInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl active:scale-90 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all"
              >
                ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default PracticeRoomScreen;
