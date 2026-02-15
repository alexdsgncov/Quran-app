
import { Ayah, Language } from '../types';
import { getAyahsBySurah } from './databaseService';

/**
 * Получение аятов из SQLite
 */
export const fetchSurahAyahs = async (surahNumber: number, lang: Language): Promise<Ayah[]> => {
  try {
    const rows: any[] = await getAyahsBySurah(surahNumber);
    
    if (rows.length === 0) {
      // Fallback на старые данные если БД пуста (для безопасности)
      return [];
    }

    return rows.map(row => ({
      number: row.ayah_number,
      text: row.text_ar,
      numberInSurah: row.ayah_number,
      juz: 1, 
      manzil: 1,
      page: 1,
      ruku: 1,
      hizbQuarter: 1,
      sajda: false,
      translation: lang === Language.RUSSIAN ? row.text_ru : row.text_en
    }));
  } catch (e) {
    console.error("SQLite error:", e);
    return [];
  }
};
