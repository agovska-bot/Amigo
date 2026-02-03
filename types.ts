
export enum Screen {
  Home = 'HomeScreen',
  SocialDecoder = 'SocialDecoderScreen',
  PracticeRoom = 'PracticeRoomScreen',
  CalmZone = 'CalmZoneScreen',
  Move = 'MoveScreen'
}

export type AgeGroup = '10-12' | '12+';
export type Language = 'en' | 'mk' | 'tr';

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
  category: 'general' | 'gratitude' | 'kindness' | 'social';
}

export interface StoryEntry {
  title: string;
  content: string[];
  date: string;
}

export interface ActiveTasks {
  move: string | null;
  gratitude: string | null;
  kindness: string | null;
}
