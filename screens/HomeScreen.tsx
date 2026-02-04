
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';
import AmigoMascot from '../components/AmigoMascot';

const PuzzleButton: React.FC<{ title: string; icon: string; color: string; onClick: () => void; rounded: string }> = ({ title, icon, color, onClick, rounded }) => (
    <button 
        onClick={onClick}
        className={`aspect-square w-full p-2 flex flex-col items-center justify-center gap-1 transition-all hover:brightness-110 active:scale-90 shadow-lg ${color} ${rounded} border-4 border-white/20`}
    >
        <span className="text-3xl filter drop-shadow-md">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-tight text-white text-center leading-none">{title}</span>
    </button>
);

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, courageStars, resetApp, language } = useAppContext();

  const handleReset = () => {
    const msg = language === 'mk' ? "Дали сте сигурни дека сакате да го ресетирате профилот?" : "Are you sure you want to reset your profile?";
    if (window.confirm(msg)) resetApp();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 transition-colors duration-1000">
      <ScreenWrapper title="" showBackButton={false}>
        
        {/* Brand Section */}
        <div className="flex flex-col items-center justify-center pt-2 mb-4 relative">
            <div className="animate-float">
                <AmigoMascot size={220} />
            </div>
            
            <div className="text-center mt-[-10px] z-20">
                <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                    Amigo
                </h1>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-600">
                    {language === 'mk' ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
                </p>
            </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-[260px] mx-auto p-2 bg-white/50 rounded-[2.5rem] backdrop-blur-sm border border-white">
            <PuzzleButton 
                title={language === 'mk' ? "Декодер" : "Decoder"}
                icon="🔍"
                color="bg-teal-500"
                rounded="rounded-tl-[3rem] rounded-br-[1rem]"
                onClick={() => setCurrentScreen(Screen.SocialDecoder)}
            />
            <PuzzleButton 
                title={language === 'mk' ? "Вежбалница" : "Practice"}
                icon="⚔️"
                color="bg-orange-500"
                rounded="rounded-tr-[3rem] rounded-bl-[1rem]"
                onClick={() => setCurrentScreen(Screen.PracticeRoom)}
            />
            <PuzzleButton 
                title={language === 'mk' ? "Опуштање" : "Chill"}
                icon="🌬️"
                color="bg-indigo-500"
                rounded="rounded-bl-[3rem] rounded-tr-[1rem]"
                onClick={() => setCurrentScreen(Screen.CalmZone)}
            />
            <PuzzleButton 
                title={language === 'mk' ? "Мисии" : "Missions"}
                icon="🛡️"
                color="bg-blue-600"
                rounded="rounded-br-[3rem] rounded-tl-[1rem]"
                onClick={() => setCurrentScreen(Screen.Move)}
            />
        </div>

        {/* Stats Section & Credits */}
        <div className="mt-6 flex flex-col items-center gap-3 pb-4">
            <div className="bg-white/90 px-5 py-2 rounded-full shadow-md border-2 border-white flex items-center gap-2">
                <span className="text-lg">🌟</span>
                <span className="text-md font-black text-slate-800">{courageStars}</span>
            </div>

            <button 
                onClick={handleReset}
                className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors py-1 px-4 underline"
            >
                {language === 'mk' ? 'Избриши профил' : 'Reset Profile'}
            </button>

            <div className="text-center mt-4">
                <p className="text-[10px] font-bold text-slate-400">
                  by Damjan Agovski & Daijan Selmani
                </p>
                <p className="text-[11px] font-black text-teal-600">
                  ASEF 2026
                </p>
            </div>
        </div>

      </ScreenWrapper>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default HomeScreen;
