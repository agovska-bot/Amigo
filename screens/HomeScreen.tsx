
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';
import AmigoMascot from '../components/AmigoMascot';

const PuzzleButton: React.FC<{ title: string; icon: string; color: string; onClick: () => void; rounded: string }> = ({ title, icon, color, onClick, rounded }) => (
    <button 
        onClick={onClick}
        className={`aspect-square w-full p-2 flex flex-col items-center justify-center gap-1 transition-all hover:brightness-105 active:scale-90 shadow-lg ${color} ${rounded} border-4 border-white/20`}
    >
        <span className="text-3xl filter drop-shadow-md">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-tight text-white text-center leading-none">{title}</span>
    </button>
);

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, courageStars, language, ageGroup, resetApp } = useAppContext();

  const isPro = ageGroup === '12+';

  const themes = {
    '10-12': {
      bg: 'bg-teal-50/20',
      decoder: 'bg-teal-300',
      practice: 'bg-orange-300',
      chill: 'bg-indigo-300',
      missions: 'bg-blue-300',
      label: 'text-teal-600',
      starBg: 'bg-white'
    },
    '12+': {
      bg: 'bg-slate-50',
      decoder: 'bg-slate-600',
      practice: 'bg-zinc-600',
      chill: 'bg-slate-800',
      missions: 'bg-indigo-700',
      label: 'text-slate-500',
      starBg: 'bg-slate-100'
    }
  }[isPro ? '12+' : '10-12'];

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 ${themes.bg}`}>
      <ScreenWrapper title="" showBackButton={false}>
        
        {/* Brand Section */}
        <div className="flex flex-col items-center justify-center pt-2 mb-4 relative">
            <div>
                <AmigoMascot size={220} />
            </div>
            
            <div className="text-center mt-[-10px] z-20">
                <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                    Amigo
                </h1>
                <p className={`text-[9px] font-black uppercase tracking-[0.4em] mt-2 ${themes.label}`}>
                    {language === 'mk' ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
                </p>
            </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-[280px] mx-auto p-3 bg-white/40 rounded-[2.5rem] backdrop-blur-sm border border-white/60">
            <PuzzleButton 
                title={language === 'mk' ? "Декодер" : "Decoder"}
                icon="🔍"
                color={themes.decoder}
                rounded="rounded-tl-[3rem] rounded-br-[1.5rem]"
                onClick={() => setCurrentScreen(Screen.SocialDecoder)}
            />
            <PuzzleButton 
                title={language === 'mk' ? "Вежбалница" : "Practice"}
                icon="⚔️"
                color={themes.practice}
                rounded="rounded-tr-[3rem] rounded-bl-[1.5rem]"
                onClick={() => setCurrentScreen(Screen.PracticeRoom)}
            />
            <PuzzleButton 
                title={language === 'mk' ? "Опуштање" : "Chill"}
                icon="🌬️"
                color={themes.chill}
                rounded="rounded-bl-[3rem] rounded-tr-[1.5rem]"
                onClick={() => setCurrentScreen(Screen.CalmZone)}
            />
            <PuzzleButton 
                title={language === 'mk' ? "Мисии" : "Missions"}
                icon="🛡️"
                color={themes.missions}
                rounded="rounded-br-[3rem] rounded-tl-[1.5rem]"
                onClick={() => setCurrentScreen(Screen.Move)}
            />
        </div>

        {/* Stats Section & Reset */}
        <div className="mt-8 flex flex-col items-center gap-3 pb-4">
            <div className={`${themes.starBg} px-5 py-2 rounded-full shadow-md border-2 border-white flex items-center gap-2`}>
                <span className="text-lg">🌟</span>
                <span className="text-md font-black text-slate-800">{courageStars}</span>
            </div>

            <button 
                onClick={resetApp}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors py-1 px-4 underline mt-4"
            >
                {language === 'mk' ? 'Избриши профил' : 'Delete Profile'}
            </button>

            <div className="text-center mt-6">
                <p className={`text-[10px] font-black ${themes.label}`}>
                  by Damjan Agovski & Daijan Selmani
                </p>
                <p className="text-[11px] font-black text-slate-400 mt-0.5">
                  ASEF 2026
                </p>
            </div>
        </div>

      </ScreenWrapper>
    </div>
  );
};

export default HomeScreen;
