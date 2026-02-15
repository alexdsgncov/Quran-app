
export type AppView = 'HOME' | 'READER' | 'SETTINGS';

export enum Language {
  ENGLISH = 'en',
  ARABIC = 'ar',
  RUSSIAN = 'ru'
}

/**
 * AppTheme enum defines the visual modes for the application.
 */
export enum AppTheme {
  MIDNIGHT = 'MIDNIGHT',
  SEPIA = 'SEPIA',
  LIGHT = 'LIGHT'
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  russianName: string;
  englishNameTranslation: string;
  russianNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  translation?: string;
}

export interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  surahEnglishName: string;
}
