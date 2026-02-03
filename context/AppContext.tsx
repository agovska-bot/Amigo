
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Screen, MoodEntry, Points, ReflectionEntry, AgeGroup, StoryEntry, Language } from '../types';
import { Chat } from '@google/genai';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  userName: string | null;
  setUserName: (name: string) => void;
  moodHistory: MoodEntry[];
  addMood: (mood: MoodEntry) => void;
  reflections: ReflectionEntry[];
  addReflection: (reflection: ReflectionEntry) => void;
  stories: StoryEntry[];
  addStory: (story: StoryEntry) => void;
  points: Points;
  addPoints: (category: keyof Points, amount: number) => void;
  totalPoints: number;
  toastMessage: string | null;
  showToast: (message: string) => void;
  streakDays: number;
  birthDate: string | null;
  setBirthDate: (date: string) => void;
  age: number | null;
  ageGroup: AgeGroup | null;
  isBirthdayToday: boolean;
  language: Language | null;
  setLanguage: (language: Language) => void;
  resetApp: () => void;
  t: (key: string, fallback?: string) => any;
  isInstallable: boolean;
  installApp: () => void;
  activeTasks: Record<string, string | null>;
  setActiveTask: (category: string, task: string | null) => void;
  storyInProgress: string[];
  chatSession: Chat | null;
  startNewStory: (chat: Chat, firstSentence: string) => void;
  continueStory: (userSentence: string, aiSentence: string) => void;
  finishStory: (finalSentence: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageStorage] = useLocalStorage<Language | null>('language', null);
  const [userName, setUserNameStorage] = useLocalStorage<string | null>('userName', null);
  const [birthDate, setBirthDateStorage] = useLocalStorage<string | null>('birthDate', null);
  const [translationsData, setTranslationsData] = useState<Record<string, any> | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [storyInProgress, setStoryInProgress] = useState<string[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  const age = useMemo(() => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, [birthDate]);

  const ageGroup = useMemo((): AgeGroup | null => {
    if (age === null) return null;
    if (age < 13) return '10-12';
    return '12+';
  }, [age]);

  useEffect(() => {
    const fetchTranslations = async () => {
        try {
            const [en, mk, tr] = await Promise.all([
                fetch('/locales/en.json').then(res => res.json()),
                fetch('/locales/mk.json').then(res => res.json()),
                fetch('/locales/tr.json').then(res => res.json())
            ]);
            setTranslationsData({ en, mk, tr });
        } catch (error) {
            console.error("Error loading translations:", error);
            setTranslationsData({ en: {}, mk: {}, tr: {} }); 
        }
    };
    fetchTranslations();
  }, []);

  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
  const [moodHistory, setMoodHistory] = useLocalStorage<MoodEntry[]>('moodHistory', []);
  const [reflections, setReflections] = useLocalStorage<ReflectionEntry[]>('reflections', []);
  const [stories, setStories] = useLocalStorage<StoryEntry[]>('stories', []);
  const [points, setPoints] = useLocalStorage<Points>('points', { gratitude: 0, physical: 0, kindness: 0, creativity: 0, social: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTasks, setActiveTasks] = useLocalStorage<Record<string, string | null>>('activeTasks', { gratitude: null, move: null, kindness: null, calm: null });

  const t = useCallback((key: string, fallback?: string): any => {
    if (!translationsData) return fallback || key;
    const currentTranslations = language ? translationsData[language] : translationsData.en;
    if (!key || !currentTranslations) return fallback || key;
    const keys = key.split('.');
    let result: any = currentTranslations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) return fallback || key;
    }
    return result;
  }, [language, translationsData]);

  const resetApp = useCallback(() => {
    // 1. Избриши го целиот локален склад (LocalStorage)
    window.localStorage.clear();
    // 2. Избриши го складот на сесијата (SessionStorage)
    window.sessionStorage.clear();
    // 3. Форсирај целосно релоадирање на страницата за да се исчистат сите React состојби и да се врати WelcomeScreen
    window.location.reload();
  }, []);

  const startNewStory = useCallback((chat: Chat, firstSentence: string) => {
    setChatSession(chat);
    setStoryInProgress([firstSentence]);
  }, []);

  const continueStory = useCallback((userSentence: string, aiSentence: string) => {
    setStoryInProgress(prev => [...prev, userSentence, aiSentence]);
  }, []);

  const finishStory = useCallback((finalSentence: string) => {
    setStoryInProgress(prev => {
        const fullContent = [...prev, finalSentence];
        const newStory: StoryEntry = {
            title: fullContent[0].length > 30 ? fullContent[0].substring(0, 30) + "..." : fullContent[0],
            content: fullContent,
            date: new Date().toISOString()
        };
        setStories(prevStories => [...prevStories, newStory]);
        return fullContent;
    });
  }, [setStories]);

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      userName,
      setUserName: setUserNameStorage,
      moodHistory,
      addMood: (m) => setMoodHistory(prev => [...prev, m]),
      reflections,
      addReflection: (r) => setReflections(prev => [...prev, r]),
      stories,
      addStory: (s) => setStories(prev => [...prev, s]),
      points,
      addPoints: (category, amount) => setPoints(prev => ({ ...prev, [category]: prev[category] + amount })),
      totalPoints: points.gratitude + points.physical + points.kindness + points.creativity + points.social,
      toastMessage,
      showToast: (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); },
      streakDays: 0, 
      birthDate,
      setBirthDate: setBirthDateStorage,
      age,
      ageGroup,
      isBirthdayToday: false,
      language,
      setLanguage: setLanguageStorage,
      resetApp,
      t,
      isInstallable: !!deferredPrompt,
      installApp: () => deferredPrompt?.prompt(),
      activeTasks,
      setActiveTask: (cat, task) => setActiveTasks(prev => ({ ...prev, [cat]: task })),
      storyInProgress,
      chatSession,
      startNewStory,
      continueStory,
      finishStory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
