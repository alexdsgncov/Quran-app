
import React, { useEffect, useState } from 'react';
import { Language, AppTheme } from '../types';
import { IconChevronLeft, IconSun, IconMoon, IconLeaf, IconSync } from './Icons';
import { getSQLiteStats } from '../services/databaseService';

interface SettingsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ language, setLanguage, theme, setTheme, onBack }) => {
  const [ayahCount, setAyahCount] = useState<number>(0);

  useEffect(() => {
    getSQLiteStats().then(stats => setAyahCount(stats.ayahCount));
  }, []);

  const t = {
    language: language === Language.RUSSIAN ? 'Язык приложения' : 'App Language',
    theme: language === Language.RUSSIAN ? 'Тема оформления' : 'Appearance',
    storage: language === Language.RUSSIAN ? 'SQLite Хранилище' : 'SQLite Storage',
    indexed: language === Language.RUSSIAN ? 'Всего аятов' : 'Total Ayahs',
  };

  return (
    <div className="flex flex-col h-full">
      <header className="px-6 py-4 pt-12 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-primary transition-colors">
          <IconChevronLeft />
        </button>
        <h1 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">Settings</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <section className="mb-12">
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">{t.language}</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { id: Language.ENGLISH, label: 'English' },
              { id: Language.RUSSIAN, label: 'Русский' },
              { id: Language.ARABIC, label: 'العربية' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  language === lang.id 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : theme === AppTheme.MIDNIGHT ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'
                }`}
              >
                <span className="font-semibold">{lang.label}</span>
                {language === lang.id && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(25,153,179,1)]"></div>}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">{t.theme}</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: AppTheme.MIDNIGHT, label: 'Midnight', icon: <IconMoon />, bg: 'bg-black', border: 'border-zinc-800' },
              { id: AppTheme.SEPIA, label: 'Sepia', icon: <IconLeaf />, bg: 'bg-[#f4ecd8]', border: 'border-[#e2d6b5]' },
              { id: AppTheme.LIGHT, label: 'Light', icon: <IconSun />, bg: 'bg-white', border: 'border-zinc-200' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                  theme === item.id ? 'border-primary ring-1 ring-primary/20' : 'border-transparent'
                } ${item.bg}`}
              >
                <div className={`${theme === item.id ? 'text-primary' : 'text-zinc-500'}`}>{item.icon}</div>
                <span className={`text-[10px] font-bold uppercase ${theme === item.id ? 'text-primary' : 'text-zinc-500'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={`p-6 rounded-[2rem] border ${theme === AppTheme.MIDNIGHT ? 'bg-zinc-900/40 border-zinc-800' : 'bg-black/5 border-zinc-200'}`}>
           <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
             <IconSync size={12} /> {t.storage}
           </h2>
           <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">{ayahCount}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-medium">{t.indexed}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-primary font-bold uppercase">Format: SQLite (Fast)</p>
                <p className="text-[9px] text-zinc-500">Engine: Expo Native</p>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
