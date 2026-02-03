
export enum Screen {
  Home = 'HomeScreen',
  MoodCheck = 'MoodCheckScreen',
  Gratitude = 'GratitudeScreen',
  Move = 'MoveScreen',
  CalmZone = 'CalmZoneScreen',
  Kindness = 'KindnessScreen',
  Reflection = 'ReflectionScreen',
  StoryCreator = 'StoryCreatorScreen',
  RapBattle = 'RapBattleScreen',
  SocialDecoder = 'SocialDecoderScreen',
  PracticeRoom = 'PracticeRoomScreen',
  AgeSelection = 'AgeSelectionScreen',
  LanguageSelection = 'LanguageSelectionScreen',
}

// FIX: Added '7-9' to AgeGroup to support all intended age categories and resolve type mismatch in App.tsx.
export type AgeGroup = '7-9' | '10-12' | '12+';

export type Language = 'en' | 'mk' | 'tr';

// FIX: Defined Mood type and Entry interfaces to resolve property and import errors across the application.
export type Mood = 'Happy' | 'Sad' | 'Angry' | 'Worried' | 'Tired';

export interface MoodEntry {
  moods: Mood[];
  note: string;
  date: string;
}

export interface ReflectionEntry {
  prompt: string;
  text: string;
  date: string;
  category: string;
}

export interface StoryEntry {
  title: string;
  content: string[];
  date: string;
}

export interface AppState {
  userName: string | null;
  age: number | null;
  language: Language | null;
  courageStars: number;
}
