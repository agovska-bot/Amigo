
import React, { useState } from 'react';
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
  const { language, practiceScenarios, dailyPracticeTip, userName } = useAppContext();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getIcon = (icon: string) => {
    if (!icon) return '🌟';
    const clean = icon.toLowerCase().trim();
    if (/\p{Emoji}/u.test(icon) && icon.length <= 4) return icon;
    return iconMap[clean] || '🌟';
  };

  const startPractice = async (scenario: {title: string, prompt: string}) => {
    setIsLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `Roleplay: ${scenario.prompt}. User is ${userName}.
    Act as the other person. Max 2 sentences. Relatable teen lang. 
    Instant mode. Language: ${language === 'mk' ? 'Macedonian' : 'English'}.`;

    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction,
            temperature: 0.8,
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    
    setCurrentChat(chat);
    try {
        const res = await chat.sendMessage({ message: `Hi, I am ${userName}. Start convo.` });
        setMessages([{ role: 'ai', text: res.text || '' }]);
    } catch (e) { 
        console.error(e); 
        setMessages([{ role: 'ai', text: language === 'mk' ? `Еј ${userName}, што правиш?` : `Hey ${userName}, what's up?` }]);
    } finally { setIsLoading(false); }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !currentChat || isLoading) return;
    const text = userInput;
    setUserInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsLoading(true);
    try {
      const res = await currentChat.sendMessage({ message: text });
      setMessages(prev => [...prev, { role: 'ai', text: res.text || '' }]);
    } catch (e) { console.error(e); } 
    finally { setIsLoading(false); }
  };

  return (
    <ScreenWrapper title={language === 'mk' ? 'Вежбалница' : 'Practice Room'}>
      <div className="h-full flex flex-col">
        {!currentChat ? (
          <div className="space-y-6 animate-fadeIn pb-8">
            <div className="bg-indigo-50 p-6 rounded-[2.5rem] relative overflow-hidden border-2 border-indigo-100 shadow-sm transition-all">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/10 blur-2xl rounded-full"></div>
                <p className="text-indigo-400 font-black uppercase text-[9px] tracking-[0.4em] mb-2">Amigo Insight</p>
                <p className="text-indigo-900 font-bold text-sm leading-tight italic">
                    "{dailyPracticeTip || (language === 'mk' ? 'Твојата автентичност е твојата супермоќ.' : 'Your authenticity is your superpower.')}"
                </p>
            </div>

            <div className="flex items-center justify-between px-2">
                <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">
                    {language === 'mk' ? 'ИЗБЕРИ СИТУАЦИЈА' : 'SELECT SITUATION'}
                </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {practiceScenarios.map((s, i) => (
                <button 
                    key={i} 
                    onClick={() => startPractice(s)} 
                    className="w-full p-5 rounded-[2rem] text-left border-2 bg-white hover:border-teal-400 hover:shadow-lg transition-all group flex flex-col gap-3 border-slate-100 shadow-sm active:scale-95 animate-slideUp"
                    style={{ animationDelay: `${i * 50}ms` }}
                >
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                            {getIcon(s.icon || s.category)}
                        </div>
                        {s.category && (
                            <span className="text-[8px] font-black uppercase tracking-tighter text-slate-300 bg-slate-50 px-2 py-1 rounded-full">{s.category}</span>
                        )}
                    </div>
                    <div>
                        <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.title}</p>
                        <p className="text-[9px] text-slate-400 font-bold line-clamp-1 opacity-80">{s.prompt}</p>
                    </div>
                </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[70vh]">
            <div className="flex items-center gap-3 mb-4 p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Симулацијата е активна</p>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pb-4 px-1 scroll-smooth no-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-slideUp`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl font-bold text-[15px] shadow-sm ${m.role === 'ai' ? 'bg-white text-slate-800 border border-slate-100 rounded-bl-none' : 'bg-slate-900 text-white rounded-br-none'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-bl-none text-slate-400 font-bold text-xs">...</div>
                  </div>
                )}
            </div>

            <div className="mt-4 flex gap-2 bg-slate-100 p-2 rounded-[2.5rem] shadow-inner border border-slate-200">
              <input 
                className="flex-grow p-4 bg-transparent outline-none font-bold text-slate-800 placeholder-slate-400" 
                placeholder={language === 'mk' ? 'Кажи нешто...' : 'Say something...'} 
                value={userInput} 
                onChange={e => setUserInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl active:scale-90 disabled:opacity-50"
              >
                ➔
              </button>
            </div>
            <button onClick={() => {setCurrentChat(null); setMessages([]);}} className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center py-2 underline decoration-dotted">
                {language === 'mk' ? 'Заврши симулација' : 'End Simulation'}
            </button>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default PracticeRoomScreen;
