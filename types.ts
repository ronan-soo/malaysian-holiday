
export interface PublicHoliday {
  id: number;
  name: string;
  date: string; // ISO 8601: "2026-01-01"
  year: number;
  state: string | null; // null for federal
  isNational: boolean;
  description?: string;
}

export interface LongHolidayProposal {
  id: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  leaveDaysRequired: number;
  breakdown: {
    publicHolidays: PublicHoliday[];
    weekends: string[];
    leaveDays: string[];
  };
  description: string;
  score: number;
}

export enum DayType {
  WORK = 'WORK',
  WEEKEND = 'WEEKEND',
  HOLIDAY = 'HOLIDAY',
  LEAVE = 'LEAVE'
}

export type MalaysianState = 
  | 'All' | 'Johor' | 'Kedah' | 'Kelantan' | 'Kuala Lumpur' 
  | 'Labuan' | 'Melaka' | 'Negeri Sembilan' | 'Pahang' 
  | 'Perak' | 'Perlis' | 'Pulau Pinang' | 'Putrajaya' 
  | 'Sabah' | 'Sarawak' | 'Selangor' | 'Terengganu';
