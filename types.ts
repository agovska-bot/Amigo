
export enum Screen {
  Home = 'HomeScreen',
  SocialDecoder = 'SocialDecoderScreen',
  PracticeRoom = 'PracticeRoomScreen',
  CalmZone = 'CalmZoneScreen',
  Move = 'MoveScreen'
}

// Added Mood type for tracking emotions
export type Mood = 'Happy' | 'Sad' | 'Angry' | 'Worried' | 'Tired';

// Added MoodEntry interface for mood history
export interface MoodEntry {
  moods: Mood[];
  note: string;
  date: string;
}

// Added ReflectionEntry interface for journaling
export interface ReflectionEntry {
  prompt: string;
  text: string;
  date: string;
  category: 'general' | 'social';
}

// Added StoryEntry interface for saved stories
export interface StoryEntry {
  title: string;
  content: string[];
  date: string;
}

export type AgeGroup = '10-12' | '12+';
// Added 'tr' to Language to fix comparison errors in StoryCreator
export type Language = 'en' | 'mk' | 'tr';

export interface ActiveTasks {
  move: string | null;
  // Added kindness task tracking
  kindness: string | null;
}