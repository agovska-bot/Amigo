import { Mood } from './types';

export const POINTS_PER_ACTIVITY = 10;
export const MISSION_POINTS = 15;
export const PRACTICE_POINTS = 20;

// Added exported constants for mood configuration
export const MOOD_OPTIONS: Mood[] = ['Happy', 'Sad', 'Angry', 'Worried', 'Tired'];

export const MOOD_EMOJIS: Record<Mood, string> = {
  Happy: '😊',
  Sad: '😢',
  Angry: '😠',
  Worried: '😟',
  Tired: '😴'
};

export const MOOD_COLORS: Record<Mood, string> = {
  Happy: 'bg-yellow-100',
  Sad: 'bg-blue-100',
  Angry: 'bg-red-100',
  Worried: 'bg-purple-100',
  Tired: 'bg-gray-100'
};
