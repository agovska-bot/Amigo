
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, Dispatch, SetStateAction, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Screen, AgeGroup, Language, ActiveTasks } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// Ова го дефинира изгледот на сценаријата за вежбање
interface PracticeScenario {
  title: string;
  prompt: string;
  icon: string;
  category?: string;
}

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  userName: string | null;
  setUserName: Dispatch<SetStateAction<string | null>>;
  toastMessage: string | null;
  showToast: (message: string) => void;
  birthDate: string | null; 
  setBirthDate: Dispatch<SetStateAction<string | null>>;
  age: number | null;
  ageGroup: AgeGroup | null;
  language: Language | null;
  setLanguage: (language: Language) => void;
  activeTasks: ActiveTasks;
  setActiveTask: (task: keyof ActiveTasks, value: string | null) => void;
  practiceScenarios: PracticeScenario[];
  dailyPracticeTip: string;
  isPracticeSyncing: boolean;
  refreshPracticeData: () => Promise<void>;
  t: (key: string, fallback?: string) => any;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Основни задачи ако вештачката интелигенција не работи во моментот
const defaultScenarios: Record<Language, PracticeScenario[]> = {
  mk: [
    { title: "Нов пријател", prompt: "Запознај се со некој нов во училиште.", icon: "👫" },
    { title: "Барање помош", prompt: "Побарај помош од наставник.", icon: "🤝" },
    { title: "Вклучување во игра", prompt: "Прашај дали можеш да играш.", icon: "⚽" }
  ],
  en: [
    { title: "New Friend", prompt: "Introduce yourself to someone new.", icon: "👫" },
    { title: "Asking Help", prompt: "Ask a teacher for help.", icon: "🤝" },
    { title: "Joining a Game", prompt: "Ask to join a game.", icon: "⚽" }
  ]
};

// Преводи за апликацијата
const translations: Record<string, any> = {
  en: {
    home: { tagline: "Your Partner for Understanding", decoder: "Decoder", practice: "Practice", chill: "Chill", missions: "Missions", delete_profile: "Delete Profile" },
    decoder: { title: "Social Decoder", placeholder: "What happened?", analyze: "Analyze", analyzing: "Thinking...", back: "Back", retry: "Try again." },
    practice: { title: "Practice Room", ai_thinking: "Amigo is thinking..." },
    chill: { title: "Chill Zone" },
    missions: { title: "Hero Missions", accept: "I ACCEPT!" }
  },
  mk: {
    home: { tagline: "Твој партнер за разбирање", decoder: "Декодер", practice: "Вежбалница", chill: "Опуштање", missions: "Мисии", delete_profile: "Избриши профил" },
    decoder: { title: "Социјален Декодер", placeholder: "Што се случи?", analyze: "Анализирај", analyzing: "Размислувам...", back: "Назад", retry: "Пробај пак." },
    practice: { title: "Вежбалница", ai_thinking: "Амиго размислува..." },
    chill: { title: "Опуштање" },
    missions: { title: "Мисии", accept: "ПРИФАЌАМ!" }
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language | null>('language', null);
  const [userName, setUserName] = useLocalStorage<string | null>('userName', null);
  const [birthDate, setBirthDate] = useLocalStorage<string | null>('birthDate', null);
  const [activeTasks, setActiveTasks] = useLocalStorage<ActiveTasks>('activeTasks', { move: null });
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [practiceScenarios, setPracticeScenarios] = useState<PracticeScenario[]>(defaultScenarios[language || 'en']);
  const [dailyPracticeTip, setDailyPracticeTip] = useState<string>('');
  const [isPracticeSyncing, setIsPracticeSyncing] = useState(false);

  // Пресметување на години
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

  // Оваа функција ги зема сценаријата од вештачката интелигенција
  const refreshPracticeData = useCallback(async () => {
    if (!userName || !age) return;
    setIsPracticeSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate 6 social scenarios and 1 short tip for ${userName} (${age}yo). 
      Lang: ${language === 'mk' ? 'Macedonian' : 'English'}. JSON only.`;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { 
              tip: { type: Type.STRING },
              scenarios: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    icon: { type: Type.STRING }
                  },
                  required: ["title", "prompt", "icon"]
                }
              }
            },
            required: ["tip", "scenarios"]
          }
        }
      });
      
      const data = JSON.parse(res.text || '{}');
      if (data.tip) setDailyPracticeTip(data.tip);
      if (data.scenarios?.length > 0) setPracticeScenarios(data.scenarios);
    } catch (e) { console.error(e); }
    finally { setIsPracticeSyncing(false); }
  }, [userName, age, language]);

  useEffect(() => {
    if (userName && age && language) refreshPracticeData();
  }, [userName, age, language, refreshPracticeData]);

  const setActiveTask = (task: keyof ActiveTasks, value: string | null) => 
    setActiveTasks(prev => ({ ...prev, [task]: value }));

  // Целосно ресетирање на апликацијата
  const resetApp = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  // Функција за превод
  const t = useCallback((key: string, fallback?: string) => {
    const dict = translations[language || 'en'] || translations.en;
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
      practiceScenarios, dailyPracticeTip, isPracticeSyncing, refreshPracticeData,
      t, resetApp
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
