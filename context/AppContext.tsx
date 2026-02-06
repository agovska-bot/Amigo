
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, Dispatch, SetStateAction, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Screen, AgeGroup, Language, ActiveTasks } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

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

const translations: Record<string, any> = {
  en: {
    home: { 
      tagline: "Turning Confusion into Understanding", 
      age_note: "Intended for ages 10-16, but Amigo is everyone's friend.",
      decoder: "Decoder", 
      practice: "Practice", 
      chill: "Chill", 
      missions: "Missions", 
      delete_profile: "Delete Profile" 
    },
    decoder: { title: "Social Decoder", placeholder: "What happened?", analyze: "Analyze", analyzing: "Thinking...", back: "Back", retry: "Try again." },
    practice: { 
      title: "Practice", 
      ai_thinking: "Amigo is thinking...",
      active_status: "Simulation is active",
      end_sim: "End Simulation",
      say_something: "Say something...",
      select_situation: "What do you want to practice?",
      insight_label: "Amigo Insight",
      custom_placeholder: "Tell me what you want to do...",
      start: "Start",
      categories: {
        school: "School",
        friends: "Friendship",
        digital: "Digital World",
        custom: "My Situation"
      }
    },
    chill: { 
      title: "Chill Zone",
      calibration_label: "Mental Calibration",
      grounding_technique: "5-4-3-2-1 Technique",
      grounding_desc: "Slowly go through these steps to return to the present moment.",
      request_new: "Request New Frequency",
      deep_calib: "Deep Calibration",
      calib_desc: "Focus on rhythm and thoughts",
      better: "I feel better",
      done: "Done",
      step_label: "Step"
    },
    missions: { 
      title: "Hero Missions", 
      accept: "I ACCEPT!",
      thinking: "Amigo is thinking...",
      footer: "Confidence is your true reward",
      default_task: "Say hi to someone today!"
    }
  },
  mk: {
    home: { 
      tagline: "Од збунетост до разбирање", 
      age_note: "Наменета за возраст 10-16 години, но Амиго е сечиј пријател.",
      decoder: "Декодер", 
      practice: "Вежбање", 
      chill: "Опуштање", 
      missions: "Мисии", 
      delete_profile: "Избриши профил" 
    },
    decoder: { title: "Социјален Декодер", placeholder: "Што се случи?", analyze: "Анализирај", analyzing: "Размислувам...", back: "Назад", retry: "Пробај пак." },
    practice: { 
      title: "Вежбање", 
      ai_thinking: "Амиго размислува...",
      active_status: "Симулацијата е активна",
      end_sim: "Заврши",
      say_something: "Кажи нешто...",
      select_situation: "Што сакаш да вежбаме?",
      insight_label: "Амиго Совет",
      custom_placeholder: "Напиши ми што сакаш да направиш...",
      start: "Започни",
      categories: {
        school: "Училиште",
        friends: "Другарство",
        digital: "Дигитален свет",
        custom: "Моја ситуација"
      }
    },
    chill: { 
      title: "Опуштање",
      calibration_label: "Ментална Калибрација",
      grounding_technique: "Техника 5-4-3-2-1",
      grounding_desc: "Полека помини низ овие чекори за да се вратиш во сегашноста.",
      request_new: "Нова фреквенција",
      deep_calib: "Длабока Калибрација",
      calib_desc: "Фокус на ритам и мисли",
      better: "Се чувствувам подобро",
      done: "Заврши",
      step_label: "Чекор"
    },
    missions: { 
      title: "Мисии", 
      accept: "ПРИФАЌАМ!",
      thinking: "Амиго смислува мисија...",
      footer: "Самодовербата е твојата вистинска награда",
      default_task: "Поздрави некого денес!"
    }
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language | null>('language', null);
  const [userName, setUserName] = useLocalStorage<string | null>('userName', null);
  const [birthDate, setBirthDate] = useLocalStorage<string | null>('birthDate', null);
  const [activeTasks, setActiveTasks] = useLocalStorage<ActiveTasks>('activeTasks', { move: null });
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [practiceScenarios, setPracticeScenarios] = useLocalStorage<PracticeScenario[]>('practiceScenarios', []);
  const [dailyPracticeTip, setDailyPracticeTip] = useLocalStorage<string>('dailyPracticeTip', '');
  const [isPracticeSyncing, setIsPracticeSyncing] = useState(false);

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

  const t = useCallback((key: string, fallback?: string) => {
    const keys = key.split('.');
    let value = translations[language || 'en'];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    return value;
  }, [language]);

  const resetApp = useCallback(() => {
    window.localStorage.clear();
    window.location.reload();
  }, []);

  const setActiveTask = useCallback((task: keyof ActiveTasks, value: string | null) => {
    setActiveTasks(prev => ({ ...prev, [task]: value }));
  }, [setActiveTasks]);

  const refreshPracticeData = useCallback(async () => {
    if (!userName || !age || !language) return;
    setIsPracticeSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate 1 short social tip for ${userName} (${age}yo). Lang: ${language === 'mk' ? 'Macedonian' : 'English'}. JSON only.`;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { 
              tip: { type: Type.STRING }
            },
            required: ["tip"]
          }
        }
      });
      
      const text = res.text?.trim() || '{}';
      const data = JSON.parse(text);
      if (data.tip) setDailyPracticeTip(data.tip);
    } catch (error) {
      console.error("Failed to refresh tip:", error);
    } finally {
      setIsPracticeSyncing(false);
    }
  }, [userName, age, language, setDailyPracticeTip]);

  const value = useMemo(() => ({
    currentScreen,
    setCurrentScreen,
    userName,
    setUserName,
    toastMessage,
    showToast,
    birthDate,
    setBirthDate,
    age,
    ageGroup,
    language,
    setLanguage,
    activeTasks,
    setActiveTask,
    practiceScenarios: [], // Not used as predefined list anymore
    dailyPracticeTip,
    isPracticeSyncing,
    refreshPracticeData,
    t,
    resetApp
  }), [
    currentScreen, userName, setUserName, toastMessage, showToast, birthDate, setBirthDate, 
    age, ageGroup, language, setLanguage, activeTasks, setActiveTask, 
    dailyPracticeTip, isPracticeSyncing, refreshPracticeData, t, resetApp
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
