
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';

const MenuButton: React.FC<{ title: string; icon: string; color: string; onClick: () => void; rounded: string }> = ({ title, icon, color, onClick, rounded }) => (
    <button 
        onClick={onClick}
        className={`aspect-square w-full p-4 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-md ${color} ${rounded} border-2 border-white/20`}
    >
        <span className="text-4xl">{icon}</span>
        <span className="text-[12px] font-black uppercase tracking-widest text-white text-center leading-none">{title}</span>
    </button>
);

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, t, ageGroup, resetApp, language } = useAppContext();
  const isPro = ageGroup === '12+';

  const themes = {
    '10-12': {
      bg: 'bg-slate-50',
      decoder: 'bg-teal-500',
      practice: 'bg-emerald-600',
      chill: 'bg-indigo-600',
      missions: 'bg-slate-900',
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
    <div className={`min-h-screen w-full ${isPro ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <ScreenWrapper title="" showBackButton={false}>
        
        {/* Главниот наслов */}
        <div className="flex flex-col items-center justify-center pt-10 mb-8 text-center">
            <h1 className="text-6xl font-black tracking-tighter text-slate-900">
                Amigo
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-4 text-slate-500 px-4">
                {tagline}
            </p>
            <p className="text-[9px] font-bold text-slate-400 mt-2 px-6 italic leading-tight">
                {t('home.age_note')}
            </p>
        </div>

        {/* Четирите главни коцки */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[320px] mx-auto p-4 bg-white/50 rounded-[2.5rem] shadow-xl border border-white">
            <MenuButton 
                title={t('home.decoder')}
                icon="🔍"
                color={themes.decoder}
                rounded="rounded-tl-[2.5rem] rounded-br-lg"
                onClick={() => setCurrentScreen(Screen.SocialDecoder)}
            />
            <MenuButton 
                title={t('home.practice')}
                icon="⚔️"
                color={themes.practice}
                rounded="rounded-tr-[2.5rem] rounded-bl-lg"
                onClick={() => setCurrentScreen(Screen.PracticeRoom)}
            />
            <MenuButton 
                title={t('home.chill')}
                icon="🌈" 
                color={themes.chill}
                rounded="rounded-bl-[2.5rem] rounded-tr-lg"
                onClick={() => setCurrentScreen(Screen.CalmZone)}
            />
            <MenuButton 
                title={t('home.missions')}
                icon="⚡"
                color={themes.missions}
                rounded="rounded-br-[2.5rem] rounded-tl-lg"
                onClick={() => setCurrentScreen(Screen.Move)}
            />
        </div>

        {/* Дното на екранот со авторите */}
        <div className="mt-auto flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              by Damjan Agovski & Daijan Selmani
            </p>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              ASEF 2026.
            </p>
            <button 
                onClick={resetApp}
                className="mt-4 text-[9px] font-bold uppercase tracking-widest text-slate-300 hover:text-red-400 underline"
            >
                {t('home.delete_profile')}
            </button>
        </div>

      </ScreenWrapper>
    </div>
  );
};

export default HomeScreen;
