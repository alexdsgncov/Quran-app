
import { Language } from '../types';
// В нативной среде Expo: import * as SQLite from 'expo-sqlite';

let dbInstance: any = null;

export const getDB = async (): Promise<any> => {
  if (dbInstance) return dbInstance;
  
  try {
    // Пытаемся динамически импортировать нативный SQLite для Expo
    const SQLite = await import('expo-sqlite');
    dbInstance = await SQLite.openDatabaseAsync('quran.db');
  } catch (e) {
    console.warn("Native SQLite not available, using web mock.");
    // Мок-объект для среды разработки/веба
    dbInstance = {
      execAsync: async (sql: string) => console.log('Mock Exec:', sql),
      runAsync: async (sql: string, params: any[]) => {
        console.log('Mock Run:', sql, params);
        return { lastInsertRowId: 1, changes: 1 };
      },
      getAllAsync: async (sql: string, params?: any[]) => {
        console.log('Mock GetAll:', sql, params);
        return [];
      },
      getFirstAsync: async (sql: string, params?: any[]) => {
        console.log('Mock GetFirst:', sql, params);
        return null;
      },
    };
  }
  return dbInstance;
};

export const initSQLite = async () => {
  const db = await getDB();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS surahs (
      number INTEGER PRIMARY KEY,
      name TEXT,
      englishName TEXT,
      russianName TEXT,
      numberOfAyahs INTEGER,
      revelationType TEXT
    );
    CREATE TABLE IF NOT EXISTS ayahs (
      id TEXT PRIMARY KEY,
      surah_number INTEGER,
      ayah_number INTEGER,
      text_ar TEXT,
      text_ru TEXT,
      text_en TEXT,
      FOREIGN KEY(surah_number) REFERENCES surahs(number)
    );
    CREATE INDEX IF NOT EXISTS idx_ayahs_surah ON ayahs(surah_number);
  `);
};

export const seedFullQuran = async (
  surahs: any[], 
  arabicData: Record<number, string[]>, 
  translations: Record<string, Record<number, string[]>>
) => {
  const db = await getDB();
  const count = await db.getFirstAsync('SELECT COUNT(*) as c FROM ayahs');
  if (count && count.c > 100) return;

  // Используем транзакцию для быстрой вставки (нативно в expo-sqlite)
  // В моке просто перебираем
  for (const s of surahs) {
    await db.runAsync(
      'INSERT OR REPLACE INTO surahs VALUES (?, ?, ?, ?, ?, ?)',
      [s.number, s.name, s.englishName, s.russianName, s.numberOfAyahs, s.revelationType]
    );
  }

  for (const [sNum, lines] of Object.entries(arabicData)) {
    const surahNumber = Number(sNum);
    for (let i = 0; i < lines.length; i++) {
      const ayahNumber = i + 1;
      const text_ar = lines[i];
      const text_ru = translations[Language.RUSSIAN]?.[surahNumber]?.[i] || "";
      const text_en = translations[Language.ENGLISH]?.[surahNumber]?.[i] || "";
      
      await db.runAsync(
        'INSERT OR REPLACE INTO ayahs VALUES (?, ?, ?, ?, ?, ?)',
        [`${surahNumber}_${ayahNumber}`, surahNumber, ayahNumber, text_ar, text_ru, text_en]
      );
    }
  }
};

export const getAyahsBySurah = async (surahNumber: number): Promise<any[]> => {
  const db = await getDB();
  return db.getAllAsync(
    'SELECT * FROM ayahs WHERE surah_number = ? ORDER BY ayah_number ASC',
    [surahNumber]
  );
};

export const searchInQuran = async (query: string, lang: Language): Promise<any[]> => {
  const db = await getDB();
  const column = lang === Language.RUSSIAN ? 'text_ru' : lang === Language.ENGLISH ? 'text_en' : 'text_ar';
  return db.getAllAsync(
    `SELECT a.*, s.englishName as surahName 
     FROM ayahs a 
     JOIN surahs s ON a.surah_number = s.number 
     WHERE a.${column} LIKE ? LIMIT 50`,
    [`%${query}%`]
  );
};

export const getSQLiteStats = async () => {
  const db = await getDB();
  const ayahCount = await db.getFirstAsync('SELECT COUNT(*) as c FROM ayahs');
  return { ayahCount: ayahCount?.c || 0 };
};
