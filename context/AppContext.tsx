
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Screen, AgeGroup, Language, MoodEntry, ReflectionEntry, StoryEntry } from '../types';
import { Chat } from '@google/genai';

// FIX: Updated AppContextType to include all required fields for mood, points, reflections, and story creation.
interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  userName: string | null;
  setUserName: (name: string) => void;
  courageStars: number;
  addCourageStars: (amount: number) => void;
  addPoints: (category: string, amount: number) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  birthDate: string | null; // Stores age as string for compatibility
  setBirthDate: (age: string) => void;
  age: number | null;
  ageGroup: AgeGroup | null;
  language: Language | null;
  setLanguage: (language: Language) => void;
  resetApp: () => void;
  t: (key: string, fallback?: string) => any;
  activeTasks: Record<string, string | null>;
  setActiveTask: (category: string, task: string | null) => void;
  moodHistory: MoodEntry[];
  addMood: (entry: MoodEntry) => void;
  reflections: ReflectionEntry[];
  addReflection: (entry: ReflectionEntry) => void;
  stories: StoryEntry[];
  storyInProgress: string[];
  chatSession: Chat | null;
  startNewStory: (session: Chat, firstSentence: string) => void;
  continueStory: (userSentence: string, buddySentence: string) => void;
  finishStory: (ending: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageStorage] = useLocalStorage<Language | null>('language', null);
  const [userName, setUserNameStorage] = useLocalStorage<string | null>('userName', null);
  const [birthDate, setBirthDateStorage] = useLocalStorage<string | null>('birthDate', null);
  const [courageStars, setCourageStars] = useLocalStorage<number>('courageStars', 0);
  const [translationsData, setTranslationsData] = useState<Record<string, any> | null>(null);
  
  // FIX: Added local storage persistence for user history to resolve missing property errors in ReflectionScreen.
  const [moodHistory, setMoodHistory] = useLocalStorage<MoodEntry[]>('moodHistory', []);
  const [reflections, setReflections] = useLocalStorage<ReflectionEntry[]>('reflections', []);
  const [stories, setStories] = useLocalStorage<StoryEntry[]>('stories', []);
  
  // FIX: Added session state for Story Creator screen.
  const [storyInProgress, setStoryInProgress] = useState<string[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTasks, setActiveTasks] = useLocalStorage<Record<string, string | null>>('activeTasks', { social: null, move: null, calm: null, gratitude: null, kindness: null });

  const age = useMemo(() => {
    if (!birthDate) return null;
    return parseInt(birthDate, 10);
  }, [birthDate]);

  // FIX: Updated ageGroup logic to produce '7-9' for younger users.
  const ageGroup = useMemo((): AgeGroup | null => {
    if (age === null) return null;
    if (age < 10) return '7-9';
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

  // FIX: Implemented logic for updating user data and handling the story collaborative session.
  const addMood = useCallback((entry: MoodEntry) => {
    setMoodHistory(prev => [entry, ...prev]);
  }, [setMoodHistory]);

  const addReflection = useCallback((entry: ReflectionEntry) => {
    setReflections(prev => [entry, ...prev]);
  }, [setReflections]);

  const addPoints = useCallback((category: string, amount: number) => {
    setCourageStars(prev => prev + amount);
  }, [setCourageStars]);

  const startNewStory = useCallback((session: Chat, firstSentence: string) => {
    setChatSession(session);
    setStoryInProgress([firstSentence]);
  }, []);

  const continueStory = useCallback((userSentence: string, buddySentence: string) => {
    setStoryInProgress(prev => [...prev, userSentence, buddySentence]);
  }, []);

  const finishStory = useCallback((ending: string) => {
    const fullContent = [...storyInProgress, ending];
    const newStory: StoryEntry = {
      title: "Collaborative Adventure",
      content: fullContent,
      date: new Date().toISOString()
    };
    setStories(prev => [newStory, ...prev]);
    setStoryInProgress([]);
    setChatSession(null);
  }, [storyInProgress, setStories]);

  const resetApp = useCallback(() => {
    // Hard clear and immediate redirect to root to force WelcomeScreen state
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.replace(window.location.origin);
  }, []);

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      userName,
      setUserName: setUserNameStorage,
      courageStars,
      addCourageStars: (amount) => setCourageStars(prev => prev + amount),
      addPoints,
      toastMessage,
      showToast: (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); },
      birthDate,
      setBirthDate: setBirthDateStorage,
      age,
      ageGroup,
      language,
      setLanguage: setLanguageStorage,
      resetApp,
      t,
      activeTasks,
      setActiveTask: (cat, task) => setActiveTasks(prev => ({ ...prev, [cat]: task })),
      moodHistory,
      addMood,
      reflections,
      addReflection,
      stories,
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
