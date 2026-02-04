
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Screen, AgeGroup, Language, ActiveTasks, MoodEntry, ReflectionEntry, StoryEntry } from '../types';
import { Chat } from '@google/genai';

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
  birthDate: string | null; 
  setBirthDate: (age: string) => void;
  age: number | null;
  ageGroup: AgeGroup | null;
  language: Language | null;
  setLanguage: (language: Language) => void;
  activeTasks: ActiveTasks;
  setActiveTask: (task: keyof ActiveTasks, value: string | null) => void;
  t: (key: string, fallback?: string) => any;
  moodHistory: MoodEntry[];
  addMood: (entry: MoodEntry) => void;
  reflections: ReflectionEntry[];
  addReflection: (entry: ReflectionEntry) => void;
  stories: StoryEntry[];
  storyInProgress: string[];
  chatSession: Chat | null;
  startNewStory: (chat: Chat, firstSentence: string) => void;
  continueStory: (userSentence: string, aiSentence: string) => void;
  finishStory: (ending: string) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: Record<string, any> = {
  en: {
    onboarding: { welcome: "¡Hola!", intro: "I am Amigo.", name_prompt: "What is your name?", age_prompt: "How old are you?", start_button: "Launch Amigo" },
    home: { subtitle: "Turning Confusion into Understanding", decoder: "Decoder", practice: "Practice", chill: "Chill", missions: "Missions" },
    decoder: { prompt: "What happened?", analyze: "Analyze Signals", victory: "Social Victory", help_text: "Does this help clear the fog?" },
    practice: { scenario_pick: "Pick a scenario:", finish: "Finish Practice", skill_up: "Social Skill Up!" },
    points_summary: { points: "Courage Stars" }
  },
  mk: {
    onboarding: { welcome: "¡Hola!", intro: "Јас сум Амиго.", name_prompt: "Како се викаш?", age_prompt: "Колку години имаш?", start_button: "Започни" },
    home: { subtitle: "Од збунетост до разбирање", decoder: "Декодер", practice: "Вежбалница", chill: "Опуштање", missions: "Мисии" },
    decoder: { prompt: "Што се случи?", analyze: "Анализирај Сигнали", victory: "Социјална Победа", help_text: "Дали ова ја исчисти маглата?" },
    practice: { scenario_pick: "Избери сценарио:", finish: "Заврши вежба", skill_up: "Социјална вештина подобрена!" },
    points_summary: { points: "Ѕвезди" }
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language | null>('language', null);
  const [userName, setUserName] = useLocalStorage<string | null>('userName', null);
  const [birthDate, setBirthDate] = useLocalStorage<string | null>('birthDate', null);
  const [courageStars, setCourageStars] = useLocalStorage<number>('courageStars', 0);
  const [activeTasks, setActiveTasks] = useLocalStorage<ActiveTasks>('activeTasks', { move: null, kindness: null });
  const [moodHistory, setMoodHistory] = useLocalStorage<MoodEntry[]>('moodHistory', []);
  const [reflections, setReflections] = useLocalStorage<ReflectionEntry[]>('reflections', []);
  const [stories, setStories] = useLocalStorage<StoryEntry[]>('stories', []);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [storyInProgress, setStoryInProgress] = useState<string[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const age = useMemo(() => {
    if (!birthDate) return null;
    const ageNum = parseInt(birthDate, 10);
    return isNaN(ageNum) ? null : ageNum;
  }, [birthDate]);

  const ageGroup = useMemo((): AgeGroup | null => {
    if (age === null) return null;
    return age < 13 ? '10-12' : '12+';
  }, [age]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const addCourageStars = useCallback((amount: number) => {
    setCourageStars(p => p + amount);
  }, [setCourageStars]);

  const addPoints = useCallback((_category: string, amount: number) => {
    addCourageStars(amount);
  }, [addCourageStars]);

  const setActiveTask = (task: keyof ActiveTasks, value: string | null) => 
    setActiveTasks(prev => ({ ...prev, [task]: value }));

  const addMood = useCallback((entry: MoodEntry) => {
    setMoodHistory(prev => [entry, ...prev]);
  }, [setMoodHistory]);

  const addReflection = useCallback((entry: ReflectionEntry) => {
    setReflections(prev => [entry, ...prev]);
  }, [setReflections]);

  const startNewStory = useCallback((chat: Chat, firstSentence: string) => {
    setChatSession(chat);
    setStoryInProgress([firstSentence]);
  }, []);

  const continueStory = useCallback((userSentence: string, aiSentence: string) => {
    setStoryInProgress(prev => [...prev, userSentence, aiSentence]);
  }, []);

  const finishStory = useCallback((ending: string) => {
    const fullStory = [...storyInProgress, ending];
    const newStory: StoryEntry = {
        title: `Adventure on ${new Date().toLocaleDateString()}`,
        content: fullStory,
        date: new Date().toISOString()
    };
    setStories(prev => [newStory, ...prev]);
    setStoryInProgress([]);
    setChatSession(null);
  }, [storyInProgress, setStories]);

  const resetApp = useCallback(() => {
    setUserName(null as any);
    setBirthDate(null as any);
    setLanguage(null as any);
    setCourageStars(0);
    setCurrentScreen(Screen.Home);
    localStorage.clear();
    window.location.reload();
  }, [setUserName, setBirthDate, setLanguage, setCourageStars]);

  const t = useCallback((key: string, fallback?: string) => {
    const lang = language || 'en';
    const dict = translations[lang] || translations.en;
    const keys = key.split('.');
    let result = dict;
    for (const k of keys) {
      if (result && result[k]) result = result[k];
      else return fallback || key;
    }
    return result;
  }, [language]);

  return (
    <AppContext.Provider value={{
      currentScreen, setCurrentScreen,
      userName, setUserName,
      courageStars, addCourageStars, addPoints,
      toastMessage, showToast,
      birthDate, setBirthDate,
      age, ageGroup,
      language, setLanguage,
      activeTasks, setActiveTask,
      t,
      moodHistory, addMood,
      reflections, addReflection,
      stories, storyInProgress, chatSession,
      startNewStory, continueStory, finishStory,
      resetApp
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
