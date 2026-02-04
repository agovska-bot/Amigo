
export enum Screen {
  Home = 'HomeScreen',
  SocialDecoder = 'SocialDecoderScreen',
  PracticeRoom = 'PracticeRoomScreen',
  CalmZone = 'CalmZoneScreen',
  Move = 'MoveScreen'
}

export type AgeGroup = '10-12' | '12+';
export type Language = 'en' | 'mk';

export interface ActiveTasks {
  move: string | null;
}
