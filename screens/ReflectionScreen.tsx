
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import PointsSummary from '../components/PointsSummary';
import { MOOD_EMOJIS, MOOD_COLORS } from '../constants';
import { MoodEntry, ReflectionEntry, StoryEntry, Mood } from '../types';
import { useTranslation } from '../hooks/useTranslation';

const MOOD_HEX_COLORS: Record<Mood, string> = {
  Happy: '#FACC15',
  Sad: '#60A5FA',
  Angry: '#F87171',
  Worried: '#C084FC',
  Tired: '#9CA3AF',
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};

const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const MoodChart: React.FC<{ history: MoodEntry[], isAdult: boolean, isOlderTeen: boolean }> = ({ history, isAdult, isOlderTeen }) => {
    const { t } = useTranslation();
    const data = useMemo(() => {
        if (history.length === 0) return [];
        const counts: Record<string, number> = {};
        let totalCounted = 0;
        
        history.forEach(entry => {
            const entryMoods = entry.moods || [(entry as any).mood];
            entryMoods.forEach((mood: Mood) => {
                if (mood) {
                    counts[mood] = (counts[mood] || 0) + 1;
                    totalCounted++;
                }
            });
        });

        if (totalCounted === 0) return [];

        let accumulatedPercent = 0;
        return Object.keys(counts).map(mood => {
            const count = counts[mood];
            const percent = count / totalCounted;
            const startPercent = accumulatedPercent;
            accumulatedPercent += percent;
            return { mood: mood as Mood, count, percent, startPercent };
        });
    }, [history]);

    if (history.length === 0 || data.length === 0) return null;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const containerClasses = (isAdult || isOlderTeen)
        ? "bg-white border border-slate-200 shadow-sm mx-0 mb-6 pt-6 rounded-2xl"
        : "bg-white shadow-md mx-1 mb-6 transform rotate-1 pt-6 rounded-xl border border-gray-100";
    
    const badgeClasses = (isAdult || isOlderTeen)
        ? "bg-teal-50 text-teal-700 border border-teal-100"
        : "bg-teal-100 text-teal-800 shadow-sm transform -rotate-2 border border-teal-200";

    return (
        <div className={`flex flex-col items-center justify-center py-4 relative ${containerClasses}`}>
             <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-black uppercase tracking-widest z-30 whitespace-nowrap rounded-full ${badgeClasses}`}>
                {t('reflections_screen.mood_chart_title')}
            </div>
            <div className="flex flex-row items-center justify-center gap-6 p-2 w-full">
                <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full" style={{ overflow: 'visible' }}>
                        {data.map((slice, index) => {
                            const [startX, startY] = getCoordinatesForPercent(slice.startPercent);
                            const [endX, endY] = getCoordinatesForPercent(slice.startPercent + slice.percent);
                            if (slice.percent === 1) return <circle cx="0" cy="0" r="1" fill={MOOD_HEX_COLORS[slice.mood]} key={index} />;
                            const largeArcFlag = slice.percent > 0.5 ? 1 : 0;
                            const pathData = [`M 0 0`, `L ${startX} ${startY}`, `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, `Z`].join(' ');
                            return <path d={pathData} fill={MOOD_HEX_COLORS[slice.mood]} key={index} stroke="white" strokeWidth="0.05" />;
                        })}
                        <circle cx="0" cy="0" r="0.75" fill="white" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-xl font-black text-slate-800 leading-none mb-0.5">{history.length}</span>
                        <span className="text-[0.6rem] uppercase text-slate-400 font-bold leading-none tracking-tighter">Logs</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-grow">
                    {data.sort((a,b) => b.count - a.count).map((slice) => (
                        <div key={slice.mood} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: MOOD_HEX_COLORS[slice.mood] }}></div>
                            <span className="text-xs font-bold text-slate-600 leading-tight">{t(`moods.${slice.mood}`)}</span>
                            <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-auto">{Math.round(slice.percent * 100)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ReflectionScreen: React.FC = () => {
  const { moodHistory, reflections, stories, addReflection, ageGroup, language } = useAppContext();
  const { t } = useTranslation();
  const [newReflection, setNewReflection] = useState('');
  const [expandedStoryDate, setExpandedStoryDate] = useState<string | null>(null);

  const isAdult = ageGroup === '12+';
  const isOlderTeen = ageGroup === '10-12';

  const prompt = useMemo(() => {
    const promptsArray = t('reflections_screen.prompts');
    if (Array.isArray(promptsArray) && promptsArray.length > 0) {
        return promptsArray[Math.floor(Math.random() * promptsArray.length)];
    }
    return "What was the best part of your day?";
  }, [t]);

  const handleAddReflection = () => {
    if (newReflection.trim()) {
      addReflection({ 
        prompt, 
        text: newReflection, 
        date: new Date().toISOString(),
        category: 'general'
      });
      setNewReflection('');
    }
  };

  const combinedEntries = useMemo(() => {
    return [...moodHistory, ...reflections, ...stories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [moodHistory, reflections, stories]);

  const mainContainerClass = isAdult 
    ? 'bg-white rounded-3xl shadow-sm border border-slate-100 p-2' 
    : (isOlderTeen ? 'bg-slate-50/50 rounded-2xl shadow-sm border border-slate-100' : 'bg-[#fdfbf7] rounded-r-lg rounded-l-md shadow-2xl border-l-8 border-teal-800/80');
  
  const renderEntry = (entry: MoodEntry | ReflectionEntry | StoryEntry, index: number) => {
    const rotation = (!isAdult && !isOlderTeen && index % 2 === 0) ? '-rotate-1' : (!isAdult && !isOlderTeen ? 'rotate-1' : '');
    const headerDateStyle = "text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2";
    const entryTitleStyle = (isAdult || isOlderTeen) ? "text-lg font-black text-slate-800 leading-tight mb-2" : "text-xl font-bold text-[#064e3b] leading-tight mb-1";
    const entryBodyStyle = (isAdult || isOlderTeen) 
        ? "text-[15px] text-slate-600 leading-relaxed font-black whitespace-pre-wrap break-words" 
        : "text-[15px] text-slate-600 leading-relaxed italic opacity-90 whitespace-pre-wrap break-words font-black";

    const entryContainerClass = (isAdult || isOlderTeen) 
        ? "mb-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-50 transition-all hover:shadow-md"
        : `mb-6 relative pl-4 pr-4 transform ${rotation} hover:rotate-0 transition-transform`;

    if ('moods' in entry || 'mood' in entry) {
        const moods = (entry as any).moods || [(entry as any).mood];
        const moodNames = moods.map((m: Mood) => t(`moods.${m}`)).join(', ');

        return (
            <div className={entryContainerClass}>
                <p className={headerDateStyle}>
                    {formatDate(entry.date)} • {formatTime(entry.date)}
                </p>
                <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 flex-shrink-0 mt-1">
                        {moods.slice(0, 3).map((m: Mood) => (
                             <span key={m} className="text-xl leading-none">{MOOD_EMOJIS[m]}</span>
                        ))}
                    </div>
                    <div className="flex-grow min-w-0">
                        <h3 className={entryTitleStyle}>
                            {t('reflections_screen.feeling_mood').replace('{mood}', moodNames)}
                        </h3>
                        {(entry as any).note && <p className={entryBodyStyle}>"{(entry as any).note}"</p>}
                    </div>
                </div>
            </div>
        );
    }

    // FIX: Explicitly handle StoryEntry to prevent property access errors on generic type
    if ('content' in entry) {
        return (
            <div className={entryContainerClass}>
                <p className={headerDateStyle}>
                    {formatDate(entry.date)} • {formatTime(entry.date)}
                </p>
                <div className="flex items-start gap-4">
                    <span className="text-xl mt-1">📖</span>
                    <div className="flex-grow min-w-0">
                        <h3 className={entryTitleStyle}>{entry.title}</h3>
                        <p className={entryBodyStyle}>{entry.content.join(' ')}</p>
                    </div>
                </div>
            </div>
        );
    }

    if ('category' in entry && entry.category === 'social') {
        return (
            <div className={`${entryContainerClass} border-2 border-teal-100 bg-teal-50/30`}>
                 <p className={headerDateStyle}>
                    {formatDate(entry.date)} • {formatTime(entry.date)}
                </p>
                <div className="flex items-start gap-4">
                    <span className="text-2xl mt-1">🛡️</span>
                    <div className="flex-grow min-w-0">
                        <h3 className={`${entryTitleStyle} text-teal-800`}>
                            {language === 'mk' ? "Социјална Победа" : "Social Victory"}
                        </h3>
                        <p className={`${entryBodyStyle} text-teal-700 font-black`}>{entry.text}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Default reflection
    // FIX: Refine the type to ReflectionEntry to avoid property 'prompt' and 'text' not existing on union members
    const reflection = entry as ReflectionEntry;
    return (
        <div className={entryContainerClass}>
            <p className={headerDateStyle}>
                {formatDate(reflection.date)} • {formatTime(reflection.date)}
            </p>
            <div className="flex items-start gap-4">
                <span className="text-xl mt-1">📝</span>
                <div className="flex-grow min-w-0">
                    <h3 className={entryTitleStyle}>{reflection.prompt || t('reflections_screen.reflection_title')}</h3>
                    <p className={entryBodyStyle}>{reflection.text}</p>
                </div>
            </div>
        </div>
    );
  }

  const themeColors = {
    '7-9': { blob1: 'bg-teal-50', blob2: 'bg-amber-50' },
    '10-12': { blob1: 'bg-indigo-50', blob2: 'bg-cyan-50' },
    '12+': { blob1: 'bg-slate-100', blob2: 'bg-indigo-50' }
  }[ageGroup || '7-9'];

  return (
    <ScreenWrapper title={language === 'mk' ? "Social Archives" : "Social Archives"}>
      <div className="flex flex-col flex-grow h-full relative">
        <div className={`absolute top-20 -left-16 w-72 h-72 ${themeColors.blob1} rounded-full opacity-60 filter blur-3xl animate-blob pointer-events-none`}></div>
        <div className={`absolute bottom-20 -right-16 w-72 h-72 ${themeColors.blob2} rounded-full opacity-60 filter blur-3xl animate-blob animation-delay-4000 pointer-events-none`}></div>

        <div className="mb-4 z-10"> <PointsSummary /> </div>
        <div className={`flex-grow overflow-hidden flex flex-col relative z-10 ${mainContainerClass}`}>
            <div className={`flex-grow overflow-y-auto p-6 relative`}>
                <MoodChart history={moodHistory} isAdult={isAdult} isOlderTeen={isOlderTeen} />
                <h2 className={`text-center text-teal-800 mb-8 text-xs font-black uppercase tracking-[0.3em] opacity-50`}>
                    {t('reflections_screen.journal_title')}
                </h2>
                <div className="space-y-4">
                {combinedEntries.length > 0 ? (
                    combinedEntries.map((entry, index) => <div key={entry.date}>{renderEntry(entry, index)}</div>)
                ) : (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">{t('reflections_screen.journal_empty')}</p>
                    </div>
                )}
                </div>
            </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default ReflectionScreen;
