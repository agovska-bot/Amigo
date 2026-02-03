
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
  toastMessage: string | null;
  showToast: (message: string) => void;
  birthDate: string | null; 
  setBirthDate: (age: string) => void;
  age: number | null;
  ageGroup: AgeGroup | null;
  language: Language | null;
  setLanguage: (language: Language) => void;
  resetApp: () => void;
  activeTasks: ActiveTasks;
  setActiveTask: (task: keyof ActiveTasks, value: string | null) => void;
  t: (key: string, fallback?: string) => string;
  // Missing properties added to fix compilation errors
  moodHistory: MoodEntry[];
  addMood: (entry: MoodEntry) => void;
  reflections: ReflectionEntry[];
  addReflection: (entry: ReflectionEntry) => void;
  stories: StoryEntry[];
  addPoints: (category: string, amount: number) => void;
  storyInProgress: string[];
  chatSession: Chat | null;
  startNewStory: (chat: Chat, firstSentence: string) => void;
  continueStory: (userSentence: string, aiSentence: string) => void;
  finishStory: (ending: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language | null>('language', null);
  const [userName, setUserName] = useLocalStorage<string | null>('userName', null);
  const [birthDate, setBirthDate] = useLocalStorage<string | null>('birthDate', null);
  const [courageStars, setCourageStars] = useLocalStorage<number>('courageStars', 0);
  const [activeTasks, setActiveTasks] = useLocalStorage<ActiveTasks>('activeTasks', { 
    move: null, 
    gratitude: null, 
    kindness: null 
  });

  // Additional history and session states
  const [moodHistory, setMoodHistory] = useLocalStorage<MoodEntry[]>('moodHistory', []);
  const [reflections, setReflections] = useLocalStorage<ReflectionEntry[]>('reflections', []);
  const [stories, setStories] = useLocalStorage<StoryEntry[]>('stories', []);
  const [storyInProgress, setStoryInProgress] = useState<string[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const age = useMemo(() => birthDate ? (isNaN(parseInt(birthDate, 10)) ? null : parseInt(birthDate, 10)) : null, [birthDate]);
  const ageGroup = useMemo((): AgeGroup | null => age !== null ? (age < 13 ? '10-12' : '12+') : null, [age]);

  const resetApp = useCallback(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.replace('/'); 
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const addCourageStars = useCallback((amount: number) => {
    setCourageStars(p => p + amount);
  }, [setCourageStars]);

  const addPoints = useCallback((category: string, amount: number) => {
    addCourageStars(amount);
  }, [addCourageStars]);

  const addMood = useCallback((entry: MoodEntry) => {
    setMoodHistory(prev => [entry, ...prev]);
  }, [setMoodHistory]);

  const addReflection = useCallback((entry: ReflectionEntry) => {
    setReflections(prev => [entry, ...prev]);
  }, [setReflections]);

  const setActiveTask = (task: keyof ActiveTasks, value: string | null) => 
    setActiveTasks(prev => ({ ...prev, [task]: value }));

  const startNewStory = useCallback((chat: Chat, firstSentence: string) => {
    setChatSession(chat);
    setStoryInProgress([firstSentence]);
  }, []);

  const continueStory = useCallback((userSentence: string, aiSentence: string) => {
    setStoryInProgress(prev => [...prev, userSentence, aiSentence]);
  }, []);

  const finishStory = useCallback((ending: string) => {
    const finalContent = [...storyInProgress, ending];
    const newStory: StoryEntry = {
      title: `Adventure with Buddy - ${new Date().toLocaleDateString()}`,
      content: finalContent,
      date: new Date().toISOString()
    };
    setStories(prev => [newStory, ...prev]);
    setStoryInProgress([]);
    setChatSession(null);
  }, [storyInProgress, setStories]);

  return (
    <AppContext.Provider value={{
      currentScreen, setCurrentScreen,
      userName, setUserName,
      courageStars, addCourageStars,
      toastMessage, showToast,
      birthDate, setBirthDate,
      age, ageGroup,
      language, setLanguage,
      resetApp,
      activeTasks, setActiveTask,
      t: (k: string, fallback?: string) => fallback || k,
      moodHistory, addMood,
      reflections, addReflection,
      stories, addPoints,
      storyInProgress, chatSession,
      startNewStory, continueStory, finishStory
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
