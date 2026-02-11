
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';
import Logo from '../components/Logo';

const MenuButton: React.FC<{ title: string; color: string; onClick: () => void; rounded: string; className?: string }> = ({ title, color, onClick, rounded, className = "" }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center transition-all active:scale-90 shadow-xl shadow-black/5 ${color} ${rounded} border-4 border-white group overflow-hidden ${className}`}
    >
        <span className="text-[14px] xs:text-lg sm:text-2xl font-black uppercase tracking-widest text-white text-center leading-tight group-hover:scale-110 transition-transform px-4">
            {title}
        </span>
    </button>
);

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, t, ageGroup, resetApp, language, installPrompt, triggerInstall } = useAppContext();
  const isPro = ageGroup === '12+';

  const themes = {
    '10-12': {
      bg: 'bg-[#F8FAFC]',
      decoder: 'bg-[#4FD1C5]', // Soft Teal
      practice: 'bg-[#9F7AEA]', // Soft Lavender
      chill: 'bg-yellow-400',  // Vibrant Yellow
    },
    '12+': {
      bg: 'bg-slate-900',
      decoder: 'bg-slate-800',
      practice: 'bg-teal-600',
      chill: 'bg-amber-500',   // Richer Yellow for Pro
    }
  }[isPro ? '12+' : '10-12'];

  const tagline = language === 'mk' ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding';

  return (
    <div className={`min-h-screen w-full ${themes.bg} transition-colors duration-700`}>
      <ScreenWrapper title="" showBackButton={false}>
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center pt-2 mb-4 text-center animate-fadeIn">
            {/* New Amigo Robot Logo */}
            <Logo size={80} className="mb-2" />

            <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                Amigo
            </h1>
            <div className="h-1 w-12 bg-teal-400 rounded-full mt-1 mb-2"></div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-4">
                {tagline}
            </p>
            <p className="text-[9px] font-bold text-slate-300 mt-2 px-8 italic leading-tight max-w-[280px]">
                {t('home.age_note')}
            </p>
        </div>

        {/* Smiley Face Layout Composition */}
        <div className="flex flex-col items-center gap-6 w-full max-w-[340px] mx-auto animate-slideUp">
            
            {/* The "Eyes" */}
            <div className="flex gap-4 w-full justify-center">
                <MenuButton 
                    title={t('home.decoder')}
                    color={themes.decoder}
                    rounded="rounded-full"
                    onClick={() => setCurrentScreen(Screen.SocialDecoder)}
                    className="w-28 h-28 sm:w-32 sm:h-32"
                />
                <MenuButton 
                    title={t('home.practice')}
                    color={themes.practice}
                    rounded="rounded-full"
                    onClick={() => setCurrentScreen(Screen.PracticeRoom)}
                    className="w-28 h-28 sm:w-32 sm:h-32"
                />
            </div>

            {/* The "Mouth" (Smile) */}
            <MenuButton 
                title={t('home.chill')}
                color={themes.chill}
                rounded="rounded-t-[2rem] rounded-b-[5rem]"
                onClick={() => setCurrentScreen(Screen.CalmZone)}
                className="w-full py-8 sm:py-10 shadow-yellow-200/20"
            />
        </div>

        {/* Bottom Section - Pushed to end of container */}
        <div className="mt-auto pt-8 flex flex-col items-center w-full">
            {/* Install Button Section - Now placed immediately above footer text */}
            {installPrompt && (
              <div className="mb-6 px-4 w-full flex justify-center animate-fadeIn">
                <button 
                  onClick={triggerInstall}
                  className="bg-slate-900 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-2 border border-white/10"
                >
                  <span className="text-base">📥</span>
                  {t('home.install')}
                </button>
              </div>
            )}

            {/* Footer with Author Names and Year */}
            <div className="flex flex-col items-center gap-1 pb-2 text-center border-t border-slate-50/10 w-full pt-4">
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
                  by Damjan Agovski & Daijan Selmani
                </p>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-200 uppercase tracking-[0.15em]">
                  ASEF 2026
                </p>
                <button 
                    onClick={resetApp}
                    className="mt-4 text-[9px] font-bold uppercase tracking-widest text-slate-300 hover:text-red-400 transition-colors"
                >
                    {t('home.delete_profile')}
                </button>
            </div>
        </div>
      </ScreenWrapper>
      <style>{`
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;
