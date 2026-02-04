
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';

const PuzzleButton: React.FC<{ title: string; icon: string; color: string; onClick: () => void; rounded: string }> = ({ title, icon, color, onClick, rounded }) => (
    <button 
        onClick={onClick}
        className={`aspect-square w-full p-4 flex flex-col items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-90 shadow-[0_10px_20px_rgba(0,0,0,0.1)] ${color} ${rounded} border-2 border-white/30`}
    >
        <span className="text-4xl filter drop-shadow-md">{icon}</span>
        <span className="text-[11px] font-black uppercase tracking-widest text-white text-center leading-none">{title}</span>
    </button>
);

const MariachiLogo: React.FC<{ size?: string }> = ({ size = "w-48 h-48" }) => (
    <div className={`relative flex flex-col items-center justify-center ${size} group`}>
        {/* Glow behind */}
        <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl group-hover:bg-yellow-400/40 transition-all duration-700"></div>
        
        {/* Sombrero Hat (SVG) */}
        <div className="relative z-20 -mb-8 transform group-hover:-translate-y-2 transition-transform duration-500">
            <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                <path d="M10 55 C10 45 30 35 70 35 C110 35 130 45 130 55 L130 65 C130 68 110 70 70 70 C30 70 10 68 10 65 Z" fill="#FACC15" stroke="#854D0E" strokeWidth="2"/>
                <path d="M45 40 C45 10 95 10 95 40" fill="#FACC15" stroke="#854D0E" strokeWidth="2"/>
                {/* Red decorative band */}
                <path d="M48 38 C55 28 85 28 92 38" fill="none" stroke="#DC2626" strokeWidth="3" strokeLinecap="round"/>
            </svg>
        </div>
        
        {/* Friendly Emoticon Face */}
        <span className="text-8xl relative z-10 filter drop-shadow-xl select-none animate-gentlePulse">😊</span>
        
        {/* Musical Sparkles */}
        <div className="absolute top-2 right-2 animate-bounce delay-150 text-xl">🎸</div>
        <div className="absolute bottom-6 left-2 animate-bounce text-xl">🎺</div>

        <style>{`
          @keyframes gentlePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-gentlePulse { animation: gentlePulse 4s ease-in-out infinite; }
        `}</style>
    </div>
);

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, t, ageGroup, resetApp } = useAppContext();
  const isPro = ageGroup === '12+';

  const themes = {
    '10-12': {
      bg: 'bg-slate-50',
      decoder: 'bg-teal-500',
      practice: 'bg-emerald-600',
      chill: 'bg-indigo-600',
      missions: 'bg-slate-900',
      label: 'text-teal-600'
    },
    '12+': {
      bg: 'bg-slate-900',
      decoder: 'bg-slate-800',
      practice: 'bg-teal-600',
      chill: 'bg-emerald-700',
      missions: 'bg-indigo-900',
      label: 'text-slate-400'
    }
  }[isPro ? '12+' : '10-12'];

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 ${isPro ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <ScreenWrapper title="" showBackButton={false}>
        
        <div className="flex flex-col items-center justify-center pt-2 mb-8 relative">
            <MariachiLogo />
            
            <div className="text-center mt-2 animate-slideUp">
                <h1 className={`text-6xl font-black tracking-tighter ${isPro ? 'text-white' : 'text-slate-900'}`}>
                    Amigo
                </h1>
                <div className="h-1 w-12 bg-teal-500 mx-auto mt-2 rounded-full"></div>
                <p className={`text-[10px] font-black uppercase tracking-[0.5em] mt-4 ${themes.label}`}>
                    {t('home.subtitle')}
                </p>
            </div>
        </div>

        <div className={`grid grid-cols-2 gap-4 w-full max-w-[320px] mx-auto p-4 ${isPro ? 'bg-white/5' : 'bg-white/40'} rounded-[3rem] backdrop-blur-md border border-white/20 shadow-2xl`}>
            <PuzzleButton 
                title={t('home.decoder')}
                icon="🔍"
                color={themes.decoder}
                rounded="rounded-tl-[3.5rem] rounded-br-[1rem]"
                onClick={() => setCurrentScreen(Screen.SocialDecoder)}
            />
            <PuzzleButton 
                title={t('home.practice')}
                icon="🛡️"
                color={themes.practice}
                rounded="rounded-tr-[3.5rem] rounded-bl-[1rem]"
                onClick={() => setCurrentScreen(Screen.PracticeRoom)}
            />
            <PuzzleButton 
                title={t('home.chill')}
                icon="💎"
                color={themes.chill}
                rounded="rounded-bl-[3.5rem] rounded-tr-[1rem]"
                onClick={() => setCurrentScreen(Screen.CalmZone)}
            />
            <PuzzleButton 
                title={t('home.missions')}
                icon="⚡"
                color={themes.missions}
                rounded="rounded-br-[3.5rem] rounded-tl-[1rem]"
                onClick={() => setCurrentScreen(Screen.Move)}
            />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 pb-6">
            <button 
                onClick={resetApp}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors py-1 px-4 underline"
            >
                {t('home.delete_profile')}
            </button>
            <p className="text-[11px] font-black text-slate-400 opacity-50">ASEF 2026</p>
        </div>

      </ScreenWrapper>
    </div>
  );
};

export default HomeScreen;
