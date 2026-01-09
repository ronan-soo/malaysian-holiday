
import { PublicHoliday, MalaysianState } from './types';

export const MALAYSIAN_STATES: MalaysianState[] = [
  'All', 'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 
  'Labuan', 'Melaka', 'Negeri Sembilan', 'Pahang', 
  'Perak', 'Perlis', 'Pulau Pinang', 'Putrajaya', 
  'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
];

export const HOLIDAYS_2026: PublicHoliday[] = [
  { id: 1, name: "New Year's Day", date: "2026-01-01", year: 2026, state: null, isNational: true },
  { id: 2, name: "Thaipusam", date: "2026-01-25", year: 2026, state: "Kuala Lumpur", isNational: false },
  { id: 3, name: "Federal Territory Day", date: "2026-02-01", year: 2026, state: "Kuala Lumpur", isNational: false },
  { id: 4, name: "Chinese New Year", date: "2026-02-17", year: 2026, state: null, isNational: true },
  { id: 5, name: "Chinese New Year Day 2", date: "2026-02-18", year: 2026, state: null, isNational: true },
  { id: 6, name: "Nuzul Al-Quran", date: "2026-03-05", year: 2026, state: "Selangor", isNational: false },
  { id: 7, name: "Hari Raya Aidilfitri", date: "2026-03-20", year: 2026, state: null, isNational: true },
  { id: 8, name: "Hari Raya Aidilfitri Day 2", date: "2026-03-21", year: 2026, state: null, isNational: true },
  { id: 9, name: "Labour Day", date: "2026-05-01", year: 2026, state: null, isNational: true },
  { id: 10, name: "Vesak Day", date: "2026-05-15", year: 2026, state: null, isNational: true },
  { id: 11, name: "Agong's Birthday", date: "2026-06-03", year: 2026, state: null, isNational: true },
  { id: 12, name: "Hari Raya Aidiladha", date: "2026-05-27", year: 2026, state: null, isNational: true },
  { id: 13, name: "Awal Muharram", date: "2026-06-16", year: 2026, state: null, isNational: true },
  { id: 14, name: "National Day", date: "2026-08-31", year: 2026, state: null, isNational: true },
  { id: 15, name: "Prophet Muhammad's Birthday", date: "2026-08-26", year: 2026, state: null, isNational: true },
  { id: 16, name: "Malaysia Day", date: "2026-09-16", year: 2026, state: null, isNational: true },
  { id: 17, name: "Deepavali", date: "2026-10-24", year: 2026, state: null, isNational: true },
  { id: 18, name: "Christmas Day", date: "2026-12-25", year: 2026, state: null, isNational: true },
  { id: 19, name: "Melaka Historic City Day", date: "2026-04-15", year: 2026, state: "Melaka", isNational: false },
  { id: 20, name: "Sabah Harvest Festival", date: "2026-05-30", year: 2026, state: "Sabah", isNational: false },
  { id: 21, name: "Gawai Dayak", date: "2026-06-01", year: 2026, state: "Sarawak", isNational: false },
  { id: 22, name: "Sultan of Selangor's Birthday", date: "2026-12-11", year: 2026, state: "Selangor", isNational: false },
];
