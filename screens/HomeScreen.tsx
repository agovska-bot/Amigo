
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';

const MenuButton: React.FC<{ title: string; color: string; onClick: () => void; rounded: string }> = ({ title, color, onClick, rounded }) => (
    <button 
        onClick={onClick}
        className={`aspect-square w-full p-2 sm:p-4 flex flex-col items-center justify-center transition-all active:scale-95 shadow-lg shadow-black/5 ${color} ${rounded} border-4 border-white/40 group overflow-hidden`}
    >
        <span className="text-[14px] xs:text-lg sm:text-2xl font-black uppercase tracking-widest text-white text-center leading-tight group-hover:scale-105 transition-transform break-words px-1">
            {title}
        </span>
    </button>
);

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, t, ageGroup, resetApp, language } = useAppContext();
  const isPro = ageGroup === '12+';

  const themes = {
    '10-12': {
      bg: 'bg-[#F8FAFC]',
      decoder: 'bg-[#4FD1C5]', // Soft Teal
      practice: 'bg-[#9F7AEA]', // Soft Lavender
      chill: 'bg-[#F6AD55]', // Soft Orange/Peach
      missions: 'bg-[#63B3ED]', // Sky Blue
    },
    '12+': {
      bg: 'bg-slate-900',
      decoder: 'bg-slate-800',
      practice: 'bg-teal-600',
      chill: 'bg-emerald-700',
      missions: 'bg-indigo-900',
    }
  }[isPro ? '12+' : '10-12'];

  const tagline = language === 'mk' ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding';

  return (
    <div className={`min-h-screen w-full ${themes.bg} transition-colors duration-700`}>
      <ScreenWrapper title="" showBackButton={false}>
        
        <div className="flex flex-col items-center justify-center pt-8 mb-10 text-center animate-fadeIn">
            <h1 className="text-7xl font-black tracking-tighter text-slate-900 drop-shadow-sm">
                Amigo
            </h1>
            <div className="h-1 w-12 bg-teal-400 rounded-full mt-2 mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-4">
                {tagline}
            </p>
            <p className="text-[10px] font-bold text-slate-300 mt-2 px-8 italic leading-tight max-w-[280px]">
                {t('home.age_note')}
            </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-[340px] sm:max-w-[480px] mx-auto p-4 sm:p-8 bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50 animate-slideUp">
            <MenuButton 
                title={t('home.decoder')}
                color={themes.decoder}
                rounded="rounded-tl-[2.5rem] rounded-br-2xl"
                onClick={() => setCurrentScreen(Screen.SocialDecoder)}
            />
            <MenuButton 
                title={t('home.practice')}
                color={themes.practice}
                rounded="rounded-tr-[2.5rem] rounded-bl-2xl"
                onClick={() => setCurrentScreen(Screen.PracticeRoom)}
            />
            <MenuButton 
                title={t('home.chill')}
                color={themes.chill}
                rounded="rounded-bl-[2.5rem] rounded-tr-2xl"
                onClick={() => setCurrentScreen(Screen.CalmZone)}
            />
            <MenuButton 
                title={t('home.missions')}
                color={themes.missions}
                rounded="rounded-br-[2.5rem] rounded-tl-2xl"
                onClick={() => setCurrentScreen(Screen.Move)}
            />
        </div>

        <div className="mt-auto flex flex-col items-center gap-2 py-10 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
              by Damjan Agovski & Daijan Selmani
            </p>
            <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em]">
              ASEF 2026.
            </p>
            <button 
                onClick={resetApp}
                className="mt-6 text-[9px] font-bold uppercase tracking-widest text-slate-300 hover:text-red-400 transition-colors"
            >
                {t('home.delete_profile')}
            </button>
        </div>

      </ScreenWrapper>
    </div>
  );
};

export default HomeScreen;
