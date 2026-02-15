
import React, { useState, useMemo } from 'react';
import { SURAHS } from '../data/surahs';
import { Surah, Language, LastRead, AppTheme } from '../types';
import { IconFilter, IconSearch, IconPlay, IconBook, IconStar } from './Icons';

interface SurahListProps {
  onSurahClick: (surah: Surah) => void;
  lastRead: LastRead | null;
  language: Language;
  theme: AppTheme;
}

const SurahList: React.FC<SurahListProps> = ({ onSurahClick, lastRead, language, theme }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = useMemo(() => {
    return SURAHS.filter(s => 
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString().includes(searchQuery) ||
      s.russianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery)
    );
  }, [searchQuery]);

  const getLocalizedName = (s: Surah) => language === Language.RUSSIAN ? s.russianName : s.englishName;
  const getLocalizedTranslation = (s: Surah) => language === Language.RUSSIAN ? s.russianNameTranslation : s.englishNameTranslation;

  const t = {
    title: language === Language.RUSSIAN ? 'Коран Керем' : 'The Noble Quran',
    searchPlaceholder: language === Language.RUSSIAN ? 'Поиск суры...' : 'Search Surah...',
    continueReading: language === Language.RUSSIAN ? 'Последнее чтение' : 'LAST READ',
    ayahLabel: language === Language.RUSSIAN ? 'Аят' : 'Ayah',
    verses: language === Language.RUSSIAN ? 'аятов' : 'verses'
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors duration-500 ${
      theme === AppTheme.MIDNIGHT ? 'bg-black' : 
      theme === AppTheme.SEPIA ? 'bg-[#f4ecd8]' : 'bg-white'
    }`}>
      <header className="glass-header px-6 pt-12 pb-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-semibold tracking-tight ${theme === AppTheme.MIDNIGHT ? 'text-white' : 'text-current'}`}>{t.title}</h1>
          <div className="flex gap-2">
            <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              theme === AppTheme.MIDNIGHT ? 'bg-zinc-900/50 text-gray-400 hover:text-primary' : 'bg-black/5 text-zinc-500'
            }`}>
              <IconFilter />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
            <IconSearch />
          </span>
          <input 
            className={`block w-full border rounded-2xl py-3 pl-12 pr-4 text-sm transition-all shadow-inner focus:outline-none focus:ring-1 focus:ring-primary/20 ${
              theme === AppTheme.MIDNIGHT 
                ? 'bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-primary/50' 
                : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-primary'
            }`}
            placeholder={t.searchPlaceholder}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {lastRead && !searchQuery && (
          <div className="px-6 py-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div 
              onClick={() => {
                const s = SURAHS.find(sr => sr.number === lastRead.surahNumber);
                if(s) onSurahClick(s);
              }}
              className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-5 flex items-center justify-between hover:border-primary/40 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="z-10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2 font-bold opacity-80">{t.continueReading}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className={`text-xl font-semibold group-hover:text-primary transition-colors ${
                    theme === AppTheme.MIDNIGHT ? 'text-white' : 'text-zinc-900'
                  }`}>{lastRead.surahEnglishName}</h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1 font-medium">
                  {t.ayahLabel} {lastRead.ayahNumber} • {SURAHS.find(s => s.number === lastRead.surahNumber)?.revelationType}
                </p>
              </div>
              <div className="z-10 bg-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 text-white">
                <IconPlay size={20} />
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 text-white select-none">
                 <IconBook />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col px-2">
          {filteredSurahs.map((surah) => (
            <button 
              key={surah.number}
              onClick={() => onSurahClick(surah)}
              className={`group w-full px-4 py-4 flex items-center gap-4 rounded-2xl transition-all text-left active:scale-[0.99] ${
                theme === AppTheme.MIDNIGHT ? 'hover:bg-zinc-900/40 active:bg-zinc-900' : 'hover:bg-black/5 active:bg-black/10'
              }`}
            >
              <div className="relative flex items-center justify-center w-12 h-12">
                <IconStar className="text-primary/20 absolute scale-[1.8] rotate-45 select-none" />
                <span className="text-xs font-bold text-zinc-400 z-10 group-hover:text-primary transition-colors">
                  {surah.number}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className={`text-[15px] font-semibold group-hover:text-primary transition-colors ${
                    theme === AppTheme.MIDNIGHT ? 'text-zinc-200' : 'text-zinc-800'
                  }`}>
                    {getLocalizedName(surah)}
                  </h4>
                  <span className="font-arabic text-xl text-primary/80 group-hover:text-primary transition-all">
                    {surah.name}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                  {surah.revelationType} • {surah.numberOfAyahs} {t.verses}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurahList;
