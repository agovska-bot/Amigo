
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
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
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
    if (/\p{Emoji}/u.test(icon) && icon.length <= 4) return icon;
    return iconMap[clean] || '🌟';
  };

  const startPractice = async (scenario: {title: string, prompt: string}) => {
    setIsLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Significantly improved prompt for high-value conversation
    const systemInstruction = `Roleplay Scenario: ${scenario.prompt}.
    You are Amigo, a friendly, slightly older peer who is very understanding and supportive. 
    The user is ${userName}.
    
    GUIDELINES:
    1. Act as the character in the scenario naturally.
    2. Use short, relatable, teen-friendly language.
    3. IMPORTANT: If the user says something awkward or struggles, don't be mean. Gently guide them or offer a helpful way to continue the talk.
    4. Help the user feel more confident in social skills.
    5. Max 2 short sentences per response.
    
    Language: ${language === 'mk' ? 'Macedonian' : 'English'}.`;

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
        const res = await chat.sendMessage({ message: `Hi, I am ${userName}. Let's start the scene.` });
        setMessages([{ role: 'ai', text: res.text || '' }]);
    } catch (e) { 
        console.error(e); 
        setMessages([{ role: 'ai', text: language === 'mk' ? `Еј ${userName}, мило ми е што се гледаме! Што има ново?` : `Hey ${userName}, good to see you! What's new?` }]);
    } finally { setIsLoading(false); }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !currentChat || isLoading) return;
    
    const userText = userInput.trim();
    setUserInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    
    try {
      const res = await currentChat.sendMessage({ message: userText });
      setMessages(prev => [...prev, { role: 'ai', text: res.text || '' }]);
    } catch (e) { 
      setMessages(prev => [...prev, { role: 'ai', text: language === 'mk' ? "Ме збуни малку, можеш ли да кажеш на друг начин?" : "I'm a bit confused, could you say that another way?" }]);
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <ScreenWrapper title={t('practice.title')}>
      <div className="h-full flex flex-col">
        {!currentChat ? (
          <div className="space-y-6 animate-fadeIn pb-8">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-[2.5rem] relative overflow-hidden border-2 border-indigo-100 shadow-xl shadow-indigo-900/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full"></div>
                <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em] mb-2">{t('practice.insight_label')}</p>
                <p className="text-indigo-900 font-black text-base leading-tight">
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
                    <div className="w-14 h-14 min-w-[56px] bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner border border-slate-100">
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
            <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    {language === 'mk' ? 'Безбедна зона за вежбање' : 'Safe Training Zone'}
                  </p>
                </div>
                <button onClick={() => {setCurrentChat(null); setMessages([]);}} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">
                    {t('practice.end_sim')}
                </button>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-6 pb-6 px-1 no-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-slideUp`}>
                        <div className={`max-w-[85%] p-5 rounded-[2rem] font-bold text-[16px] leading-snug shadow-sm ${m.role === 'ai' ? 'bg-white text-slate-800 border-2 border-slate-50 rounded-bl-none shadow-slate-200/50' : 'bg-slate-900 text-white rounded-br-none shadow-slate-900/20'}`}>
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

            <div className="mt-4 flex gap-2 bg-white p-3 rounded-[3rem] shadow-2xl shadow-slate-200 border-2 border-slate-50">
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
                className="bg-indigo-500 text-white w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl active:scale-90 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all"
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
