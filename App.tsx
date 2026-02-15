
import React, { useState, useEffect } from 'react';
import { AppView, Language, Surah, LastRead, AppTheme } from './types';
import SurahList from './components/SurahList';
import SurahReader from './components/SurahReader';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import { SURAHS } from './data/surahs';
import { ARABIC_TEXT } from './data/quran_ar';
import { TRANSLATIONS } from './data/quran_translations';
import { initSQLite, seedFullQuran } from './services/databaseService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('HOME');
  const [isInitializing, setIsInitializing] = useState(true);
  const [initProgress, setInitProgress] = useState('');

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('quran_lang');
      return (saved as Language) || Language.ENGLISH;
    } catch { return Language.ENGLISH; }
  });
  
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('quran_theme');
      return (saved as AppTheme) || AppTheme.MIDNIGHT;
    } catch { return AppTheme.MIDNIGHT; }
  });

  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    try {
      const saved = localStorage.getItem('quran_last_read');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  useEffect(() => {
    const setup = async () => {
      try {
        setInitProgress('Waking up engine...');
        await initSQLite();
        
        setInitProgress('Pre-indexing Quran...');
        // В реальной сборке мы бы проверяли наличие готового файла .db
        await seedFullQuran(SURAHS, ARABIC_TEXT, TRANSLATIONS);
        
        setInitProgress('Ready');
        setIsInitializing(false);
      } catch (e) {
        console.error("Initialization failed", e);
        setIsInitializing(false);
      }
    };
    setup();
  }, []);

  useEffect(() => {
    try { localStorage.setItem('quran_lang', language); } catch {}
  }, [language]);

  useEffect(() => {
    try { localStorage.setItem('quran_theme', theme); } catch {}
    const bgColors = {
      [AppTheme.MIDNIGHT]: '#000000',
      [AppTheme.SEPIA]: '#f4ecd8',
      [AppTheme.LIGHT]: '#ffffff'
    };
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = bgColors[theme];
    }
  }, [theme]);

  const handleSurahClick = (surah: Surah) => {
    setSelectedSurah(surah);
    setView('READER');
  };

  const updateLastRead = (surah: Surah, ayahNumber: number) => {
    const newLastRead = {
      surahNumber: surah.number,
      ayahNumber,
      surahName: surah.name,
      surahEnglishName: surah.englishName
    };
    setLastRead(newLastRead);
    try { localStorage.setItem('quran_last_read', JSON.stringify(newLastRead)); } catch {}
  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-t-2 border-primary rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <h2 className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-3">Noble Quran Engine</h2>
          <p className="text-zinc-500 text-[9px] uppercase tracking-widest animate-pulse">{initProgress}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto border-x relative shadow-2xl overflow-hidden transition-colors duration-500 ${
      theme === AppTheme.MIDNIGHT ? 'bg-black text-zinc-100 border-zinc-900' : 
      theme === AppTheme.SEPIA ? 'bg-[#f4ecd8] text-[#433422] border-[#e2d6b5]' : 
      'bg-white text-zinc-900 border-zinc-200'
    }`}>
      <div className="flex-1 relative h-full">
        {view === 'HOME' && (
          <SurahList 
            onSurahClick={handleSurahClick} 
            lastRead={lastRead} 
            language={language}
            theme={theme}
          />
        )}
        
        {view === 'READER' && selectedSurah && (
          <SurahReader 
            surah={selectedSurah} 
            language={language} 
            theme={theme}
            onBack={() => setView('HOME')}
            onAyahVisible={(num) => updateLastRead(selectedSurah, num)}
          />
        )}

        {view === 'SETTINGS' && (
          <Settings 
            language={language} 
            setLanguage={setLanguage} 
            theme={theme}
            setTheme={setTheme}
            onBack={() => setView('HOME')}
          />
        )}
      </div>

      {view !== 'READER' && (
        <Navbar currentView={view} setView={setView} theme={theme} />
      )}
    </div>
  );
};

export default App;
