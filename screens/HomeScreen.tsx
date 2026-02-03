
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';
import PointsSummary from '../components/PointsSummary';
import { useTranslation } from '../hooks/useTranslation';
import AnimatedTaskCard from '../components/AnimatedTaskCard';

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, ageGroup, resetApp, userName, language } = useAppContext();
  const { t } = useTranslation();

  const handleReset = () => {
    const msg = language === 'mk' 
      ? "Дали си сигурен дека сакаш да го избришеш профилот? Сите поени ќе бидат изгубени." 
      : "Are you sure you want to reset your profile? All data will be permanently deleted.";
    if (window.confirm(msg)) {
        resetApp();
    }
  };

  const isPro = ageGroup === '12+';
  const theme = {
    bg: isPro ? 'bg-[#0f172a]' : 'bg-slate-50',
    textColor: isPro ? 'text-white' : 'text-slate-900',
  };

  const footerContent = (
    <div className="pb-4">
      <button 
        onClick={handleReset}
        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors p-2 block mx-auto underline active:scale-95"
      >
        {language === 'mk' ? 'Ресетирај профил' : 'Reset Profile'}
      </button>
    </div>
  );

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${theme.bg}`}>
      {/* Background decoration */}
      <div className="fixed top-[-10%] left-[-20%] w-[50rem] h-[50rem] bg-teal-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      
      <ScreenWrapper title="" showBackButton={false} footerContent={footerContent}>
        <div className="flex flex-col items-center text-center pt-2 mb-8">
            <div className="flex flex-row items-center justify-center gap-3">
              <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white font-black">A</span>
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-3xl font-black tracking-tighter leading-none ${isPro ? 'text-white' : 'text-slate-900'}`}>Amigo</span>
                <span className="text-[9px] font-black uppercase tracking-wider text-teal-500 mt-1 opacity-80">
                    {language === 'mk' ? 'Од збунетост до разбирање' : 'Turning Confusion into Understanding'}
                </span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 opacity-40">Agent: {userName}</p>
        </div>

        <div className="mb-8">
            <PointsSummary />
        </div>

        <div className="grid grid-cols-1 gap-4">
            <AnimatedTaskCard 
                title={language === 'mk' ? "Social Decoder" : "Social Decoder"}
                description={language === 'mk' ? "Декодирај ги скриените значења." : "Decode hidden social meanings."}
                icon="🔍"
                color={isPro ? "bg-slate-800 border-slate-700" : "bg-teal-500 text-white"}
                animationType="pulse-glow"
                variant={isPro ? 'serious' : 'modern'}
                onClick={() => setCurrentScreen(Screen.SocialDecoder)}
            />
            
            <AnimatedTaskCard 
                title={language === 'mk' ? "Practice Room" : "Practice Room"}
                description={language === 'mk' ? "Симулирај социјални разговори." : "Simulate social conversations."}
                icon="⚔️"
                color={isPro ? "bg-slate-800 border-slate-700" : "bg-orange-500 text-white"}
                animationType="none"
                variant={isPro ? 'serious' : 'modern'}
                onClick={() => setCurrentScreen(Screen.PracticeRoom)}
            />

            <AnimatedTaskCard 
                title={language === 'mk' ? "Chill Zone" : "Chill Zone"}
                description={language === 'mk' ? "Наполни ја социјалната батерија." : "Recharge your social energy."}
                icon="🌬️"
                color={isPro ? "bg-slate-800 border-slate-700" : "bg-[#0f172a] text-white"}
                animationType="floating-cloud"
                variant={isPro ? 'serious' : 'modern'}
                onClick={() => setCurrentScreen(Screen.CalmZone)}
            />

            <AnimatedTaskCard 
                title={language === 'mk' ? "Daily Hero Missions" : "Daily Hero Missions"}
                description={language === 'mk' ? "Предизвици за социјална храброст." : "Challenges for social courage."}
                icon="🛡️"
                color={isPro ? "bg-slate-800 border-slate-700" : "bg-blue-600 text-white"}
                animationType="rising-stars"
                variant={isPro ? 'serious' : 'modern'}
                onClick={() => setCurrentScreen(Screen.Move)}
            />
        </div>
      </ScreenWrapper>
    </div>
  );
};

export default HomeScreen;
