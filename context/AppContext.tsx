
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Screen, AgeGroup, Language, ActiveTasks } from '../types';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  userName: string | null;
  setUserName: (name: string) => void;
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
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: Record<string, any> = {
  en: {
    onboarding: { welcome: "¡Hola!", intro: "I am Amigo.", name_prompt: "What is your name?", age_prompt: "How old are you?", start_button: "Launch Amigo", continue: "CONTINUE", start: "START", error_name: "Please, tell me your name", error_age: "Enter your age", nice_to_meet: "Nice to meet you" },
    home: { subtitle: "Turning Confusion into Understanding", decoder: "Decoder", practice: "Practice", chill: "Chill", missions: "Missions", delete_profile: "Delete Profile", by: "by Damjan Agovski & Daijan Selmani" },
    decoder: { title: "Social Decoder", prompt: "What is on your mind?", placeholder: "Describe what happened...", analyze: "Analyze Signals", analyzing: "Analyzing...", back: "Back", retry: "Please try again in a moment." },
    practice: { title: "Practice Room", finish: "Finish", ai_thinking: "Amigo is thinking..." },
    chill: { title: "Chill Zone", breathing: "Deep Breathing", grounding: "5-4-3-2-1 Grounding", new_thought: "New Calm Thought" },
    missions: { title: "Hero Missions", accept: "I ACCEPT! 🛡️", thinking: "Amigo is thinking...", reward: "Confidence is your true reward" }
  },
  mk: {
    onboarding: { welcome: "¡Hola!", intro: "Јас сум Амиго.", name_prompt: "Како се викаш?", age_prompt: "Колку години имаш?", start_button: "Започни", continue: "ПРОДОЛЖИ", start: "ЗАПОЧНИ", error_name: "Те молам, напиши го твоето име", error_age: "Внеси ги твоите години", nice_to_meet: "Мило ми е" },
    home: { subtitle: "Од збунетост до разбирање", decoder: "Декодер", practice: "Вежбалница", chill: "Опуштање", missions: "Мисии", delete_profile: "Избриши профил", by: "од Дамјан Аговски и Даијан Селмани" },
    decoder: { title: "Социјален Декодер", prompt: "Што те замисли?", placeholder: "Опиши ја ситуацијата...", analyze: "Анализирај Сигнали", analyzing: "Анализирам...", back: "Назад", retry: "Пробај пак за момент." },
    practice: { title: "Вежбалница", finish: "Заврши", ai_thinking: "Амиго размислува..." },
    chill: { title: "Опуштање", breathing: "Длабоко дишење", grounding: "5-4-3-2-1 Вежба", new_thought: "Нова мисла" },
    missions: { title: "Херојски Мисии", accept: "ПРИФАЌАМ! 🛡️", thinking: "Амиго смислува мисија...", reward: "Самодовербата е твојата вистинска награда" }
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language | null>('language', null);
  const [userName, setUserName] = useLocalStorage<string | null>('userName', null);
  const [birthDate, setBirthDate] = useLocalStorage<string | null>('birthDate', null);
  const [activeTasks, setActiveTasks] = useLocalStorage<ActiveTasks>('activeTasks', { move: null });
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

  const setActiveTask = (task: keyof ActiveTasks, value: string | null) => 
    setActiveTasks(prev => ({ ...prev, [task]: value }));

  const resetApp = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

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
      toastMessage, showToast,
      birthDate, setBirthDate,
      age, ageGroup,
      language, setLanguage,
      activeTasks, setActiveTask,
      t,
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
