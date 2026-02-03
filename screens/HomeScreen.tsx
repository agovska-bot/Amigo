
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';

const PuzzlePiece: React.FC<{ title: string; icon: string; color: string; onClick: () => void }> = ({ title, icon, color, onClick }) => (
    <button 
        onClick={onClick}
        className={`aspect-square w-full p-4 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-90 border-4 border-white ${color}`}
    >
        <span className="text-4xl filter drop-shadow-md">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-white text-center leading-tight">{title}</span>
    </button>
);

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, courageStars, resetApp, userName, language, ageGroup } = useAppContext();
  const isPro = ageGroup === '12+';

  const handleReset = () => {
    const msg = language === 'mk' ? "Дали си сигурен дека сакаш да го избришеш профилот?" : "Are you sure you want to reset your profile?";
    if (window.confirm(msg)) resetApp();
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 ${isPro ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <ScreenWrapper title="" showBackButton={false}>
        
        {/* Logo Hero Section - Focus on Mariachi Mascot */}
        <div className="flex flex-col items-center justify-center pt-2 mb-8 relative">
            <div className="relative group">
                {/* Soft glow behind the mascot */}
                <div className="absolute inset-0 bg-teal-500/10 blur-[60px] rounded-full group-hover:bg-teal-500/20 transition-all"></div>
                
                {/* The Amigo Mariachi Mascot holding the guitar */}
                <img 
                    src="/amigo-logo.png" 
                    alt="Amigo Mariachi" 
                    className="w-64 h-64 object-contain relative z-10 transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl" 
                />
            </div>
            
            <div className="text-center mt-[-15px] z-20">
                <h1 className={`text-6xl font-black tracking-tighter ${isPro ? 'text-white' : 'text-slate-900'}`}>
                    Amigo
                </h1>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-600 opacity-90">
                    {language === 'mk' ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
                </p>
            </div>
        </div>

        {/* Puzzle Grid - 2x2 Layout */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[320px] mx-auto">
            <PuzzlePiece 
                title={language === 'mk' ? "Decoder" : "Decoder"}
                icon="🔍"
                color="bg-teal-500"
                onClick={() => setCurrentScreen(Screen.SocialDecoder)}
            />
            <PuzzlePiece 
                title={language === 'mk' ? "Practice" : "Practice"}
                icon="⚔️"
                color="bg-orange-500"
                onClick={() => setCurrentScreen(Screen.PracticeRoom)}
            />
            <PuzzlePiece 
                title={language === 'mk' ? "Chill" : "Chill"}
                icon="🌬️"
                color="bg-indigo-500"
                onClick={() => setCurrentScreen(Screen.CalmZone)}
            />
            <PuzzlePiece 
                title={language === 'mk' ? "Missions" : "Missions"}
                icon="🛡️"
                color="bg-blue-600"
                onClick={() => setCurrentScreen(Screen.Move)}
            />
        </div>

        {/* User Stats and Tools */}
        <div className="mt-10 flex flex-col items-center gap-6 pb-6">
            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border-2 border-white flex items-center gap-3">
                <span className="text-2xl">🌟</span>
                <span className="text-xl font-black text-slate-800">{courageStars}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Courage Stars</span>
            </div>

            <div className="flex flex-col items-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Active Agent: {userName}
                </p>
                <button 
                    onClick={handleReset}
                    className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 hover:text-red-500 transition-colors py-2 px-4 underline decoration-slate-200"
                >
                    {language === 'mk' ? 'Ресетирај профил' : 'Reset Profile'}
                </button>
            </div>
        </div>

      </ScreenWrapper>
    </div>
  );
};

export default HomeScreen;
