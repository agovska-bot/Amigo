
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

type PracticeCategory = 'school' | 'friends' | 'digital' | 'custom';

const PracticeRoomScreen: React.FC = () => {
  const { language, dailyPracticeTip, userName, age, ageGroup, t } = useAppContext();
  
  const [activeSession, setActiveSession] = useState<{chat: Chat, title: string} | null>(null);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customDescription, setCustomDescription] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPro = ageGroup === '12+';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const startPractice = async (category: PracticeCategory, userDescription?: string) => {
    setIsLoading(true);
    const categoryName = t(`practice.categories.${category}`);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Persona logic based on age
        const personaDescription = isPro 
            ? `You are Amigo, a cool and relatable peer mentor for ${userName}. Speak like a 16-year-old friend - empathetic, slightly informal but mature.`
            : `You are Amigo, a friendly and warm older sibling figure for ${userName}. Use simple, clear, and very encouraging language.`;

        const scenarioInstruction = userDescription 
            ? `The user wants to practice: "${userDescription}".`
            : `Generate a random, realistic social scenario for a ${age}yo in the context of "${categoryName}".`;

        const systemInstruction = `${personaDescription}
        Current context: ${categoryName}.
        ${scenarioInstruction}
        YOUR MISSION: Roleplay as the other person in the situation.
        START BY: Setting the scene in 1 sentence and then saying the first thing to ${userName}.
        Keep responses to 1-2 short sentences. Use emojis naturally.
        Language: ${language === 'mk' ? 'Macedonian' : 'English'}.`;

        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: { systemInstruction, temperature: 0.9 }
        });
        
        setActiveSession({ chat, title: categoryName });
        
        // Initial "Hello" to kick off the AI's scene setting
        const res = await chat.sendMessage({ message: `Hi Amigo, I'm ready to practice ${categoryName}.` });
        setMessages([{ role: 'ai', text: res.text || '' }]);
        setShowCustomInput(false);
    } catch (e) { 
        console.error(e);
        const errorMsg = language === 'mk' 
            ? "Амиго се сопна малку... ајде да пробаме пак!" 
            : "Amigo tripped a bit... let's try again!";
        setMessages([{ role: 'ai', text: errorMsg }]);
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
      setMessages(prev => [...prev, { role: 'ai', text: language === 'mk' ? "Се изгуби врската, но тука сум!" : "Connection flicker, but I'm back!" }]);
    } finally { setIsLoading(false); }
  };

  const categories: {id: PracticeCategory, icon: string, color: string}[] = [
    { id: 'school', icon: '🏫', color: 'bg-orange-500' },
    { id: 'friends', icon: '👫', color: 'bg-teal-500' },
    { id: 'digital', icon: '📱', color: 'bg-indigo-600' },
    { id: 'custom', icon: '✨', color: 'bg-slate-800' }
  ];

  return (
    <ScreenWrapper title={t('practice.title')}>
      <div className="h-full flex flex-col">
        {!activeSession && !showCustomInput ? (
          <div className="space-y-6 animate-fadeIn pb-8">
            <div className="bg-white p-8 rounded-[2.5rem] border-4 border-slate-50 relative overflow-hidden shadow-2xl shadow-slate-100 mb-2">
                <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] mb-2">{t('practice.insight_label')}</p>
                <p className="text-slate-800 font-black text-lg leading-tight italic">
                    "{dailyPracticeTip || (language === 'mk' ? 'Твојата автентичност е твојата супермоќ.' : 'Your authenticity is your superpower.')}"
                </p>
            </div>

            <div className="px-2 pt-2 text-center">
                <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">
                    {t('practice.select_situation')}
                </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {categories.map((cat, i) => (
                <button 
                    key={cat.id} 
                    onClick={() => cat.id === 'custom' ? setShowCustomInput(true) : startPractice(cat.id)} 
                    className="aspect-square w-full p-4 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200/50 bg-white border-4 border-slate-50 hover:border-teal-200 group animate-slideUp"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${cat.color} text-white group-hover:scale-110 transition-transform`}>
                        {cat.icon}
                    </div>
                    <p className="font-black text-slate-800 text-[12px] uppercase tracking-wider text-center leading-tight">
                        {t(`practice.categories.${cat.id}`)}
                    </p>
                </button>
                ))}
            </div>
          </div>
        ) : showCustomInput ? (
          <div className="flex flex-col space-y-6 animate-fadeIn justify-center flex-grow">
            <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 text-center">
                    {t('practice.categories.custom')}
                </h3>
                <textarea 
                    className="w-full bg-slate-50 border-4 border-slate-100 p-6 rounded-[2.5rem] text-lg font-bold text-slate-800 outline-none focus:border-teal-400 focus:bg-white transition-all h-40 resize-none shadow-inner"
                    placeholder={t('practice.custom_placeholder')}
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    autoFocus
                />
            </div>
            <button 
                onClick={() => startPractice('custom', customDescription)}
                disabled={!customDescription.trim() || isLoading}
                className="w-full bg-orange-500 text-white font-black py-6 rounded-[2.5rem] shadow-[0_10px_0_0_#ea580c] active:translate-y-2 active:shadow-none transition-all text-xl uppercase tracking-widest disabled:opacity-50"
            >
                {isLoading ? '...' : t('practice.start')}
            </button>
            <button 
                onClick={() => setShowCustomInput(false)}
                className="text-slate-300 font-black uppercase text-[10px] tracking-widest py-4"
            >
                {language === 'mk' ? '‹ Назад' : '‹ Back'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-[75vh] animate-fadeIn">
            <div className="flex items-center justify-between mb-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {activeSession?.title}
                  </p>
                </div>
                <button 
                  onClick={() => {setActiveSession(null); setMessages([]); setCustomDescription('');}} 
                  className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                    {t('practice.end_sim')}
                </button>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-4 pb-6 px-1 no-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-slideUp`}>
                        <div className={`max-w-[85%] p-5 rounded-[2rem] font-bold text-[16px] leading-snug shadow-sm ${m.role === 'ai' ? 'bg-white text-slate-800 border-2 border-slate-50 rounded-bl-none' : 'bg-slate-900 text-white rounded-br-none'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border-2 border-slate-50 p-5 rounded-[2rem] rounded-bl-none flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                )}
            </div>

            <div className="mt-4 flex gap-2 bg-white p-2 rounded-[3rem] shadow-2xl shadow-slate-200 border-4 border-slate-50">
              <input 
                className="flex-grow px-5 bg-transparent outline-none font-bold text-slate-800 placeholder-slate-200 text-lg" 
                placeholder={t('practice.say_something')} 
                value={userInput} 
                onChange={e => setUserInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-teal-500 text-white w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl active:scale-90 disabled:opacity-50 shadow-lg shadow-teal-200 transition-all"
              >
                ➔
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ScreenWrapper>
  );
};

export default PracticeRoomScreen;
