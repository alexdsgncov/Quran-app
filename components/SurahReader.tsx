
import React, { useState, useEffect, useRef } from 'react';
import { Surah, Language, Ayah, AppTheme } from '../types';
import { fetchSurahAyahs } from '../services/quranService';
import AyahShareModal from './AyahShareModal';
import { IconArrowBack, IconLeaf } from './Icons';

interface SurahReaderProps {
  surah: Surah;
  language: Language;
  theme: AppTheme;
  onBack: () => void;
  onAyahVisible: (ayahNumber: number) => void;
}

const AyahItem = React.memo(({ ayah, fontSize, onLongPress, theme }: { ayah: Ayah, fontSize: number, onLongPress: (a: Ayah) => void, theme: AppTheme }) => {
  const pressTimer = useRef<number | null>(null);

  const handleStart = () => {
    pressTimer.current = window.setTimeout(() => {
      onLongPress(ayah);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 750);
  };

  const handleEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <div 
      className={`mb-14 group transition-all duration-300 rounded-3xl p-6 -m-6 select-none ${
        theme === AppTheme.MIDNIGHT ? 'active:bg-zinc-900/40' : 'active:bg-black/5'
      }`}
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
    >
      <div className="flex flex-col gap-8">
        <div className="relative">
          <p 
            className={`font-arabic text-right quran-text leading-[2.6] antialiased ${
              theme === AppTheme.MIDNIGHT ? 'text-white' : 'text-zinc-900'
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {ayah.text}
            <span className="inline-flex items-center justify-center w-11 h-11 mr-5 align-middle text-[12px] font-bold text-primary border-2 border-primary/30 rounded-full bg-primary/10 shadow-[0_0_20px_rgba(25,153,179,0.2)]">
              {ayah.numberInSurah}
            </span>
          </p>
        </div>
        {ayah.translation && (
          <div className="mt-2 pl-6 border-l-[3px] border-primary/20">
            <p className={`text-[16px] font-light leading-relaxed ${
              theme === AppTheme.MIDNIGHT ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              {ayah.translation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

const SurahReader: React.FC<SurahReaderProps> = ({ surah, language, theme, onBack, onAyahVisible }) => {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(28);
  const [sharingAyah, setSharingAyah] = useState<Ayah | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const touchStartX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchSurahAyahs(surah.number, language);
      setAyahs(data);
      setLoading(false);
    };
    load();
  }, [surah.number, language]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches[0].clientX < 60) {
      touchStartX.current = e.targetTouches[0].clientX;
      isDragging.current = true;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = e.targetTouches[0].clientX - touchStartX.current;
    if (diff > 0 && scrollRef.current) {
      scrollRef.current.style.transform = `translateX(${diff / 2.5}px)`;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 140) {
      onBack();
    } else if (scrollRef.current) {
      scrollRef.current.style.transform = 'translateX(0)';
    }
    isDragging.current = false;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (ayahs.length === 0) return;
    
    const idx = Math.floor((target.scrollTop / (target.scrollHeight - target.clientHeight)) * (ayahs.length - 1));
    if (ayahs[idx]) onAyahVisible(ayahs[idx].numberInSurah);
  };

  const getLocalizedTitle = () => language === Language.RUSSIAN ? surah.russianName : surah.englishName;

  return (
    <div 
      className={`flex flex-col h-full relative overflow-hidden transition-colors duration-500 ${
        theme === AppTheme.MIDNIGHT ? 'bg-black' : 
        theme === AppTheme.SEPIA ? 'bg-[#f4ecd8]' : 'bg-white'
      }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <header className="absolute top-0 left-0 right-0 z-40 pt-14 pb-4 px-6 glass-header flex items-center justify-between">
        <button onClick={onBack} className={`p-3 -ml-3 rounded-full transition-all active:scale-90 text-primary ${
          theme === AppTheme.MIDNIGHT ? 'hover:bg-zinc-900' : 'hover:bg-black/5'
        }`}>
          <IconArrowBack />
        </button>
        <div className="flex flex-col items-center">
          <h1 className={`text-lg font-semibold tracking-wide ${theme === AppTheme.MIDNIGHT ? 'text-white' : 'text-zinc-900'}`}>{getLocalizedTitle()}</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(25,153,179,0.8)]"></span>
            <span className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">Fully Offline</span>
          </div>
        </div>
        <button 
          onClick={() => setFontSize(prev => prev >= 40 ? 24 : prev + 4)}
          className={`w-10 h-10 flex items-center justify-center text-[11px] font-bold rounded-xl transition-all ${
            theme === AppTheme.MIDNIGHT ? 'text-zinc-400 border-zinc-800 active:bg-zinc-800' : 'text-zinc-600 border-zinc-200 active:bg-black/5'
          } border`}
        >
          Aa
        </button>
      </header>

      <main 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar pt-40 pb-24 px-6 transition-transform duration-300 ease-out"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(25,153,179,0.2)]"></div>
            <p className="text-[11px] text-zinc-500 font-bold tracking-[0.4em] uppercase">Loading Surah...</p>
          </div>
        ) : ayahs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-center px-10">
            <div className="mb-8 opacity-10 scale-[2.5]"><IconLeaf /></div>
            <p className="text-sm leading-relaxed opacity-60 font-medium">Text indexing in progress for Surah {surah.number}.<br/>Common Surahs and Juz Amma are ready.</p>
          </div>
        ) : (
          <>
            {surah.number !== 1 && surah.number !== 9 && (
              <div className="text-center mb-24 mt-4 animate-in fade-in duration-1000">
                <p className="font-arabic text-4xl text-primary drop-shadow-[0_0_15px_rgba(25,153,179,0.4)]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
              </div>
            )}

            {ayahs.map((ayah) => (
              <AyahItem 
                key={ayah.number} 
                ayah={ayah} 
                fontSize={fontSize} 
                theme={theme}
                onLongPress={setSharingAyah} 
              />
            ))}
            
            <div className="h-48 flex flex-col items-center justify-center opacity-20 gap-8 mt-12">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <IconLeaf />
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <p className="text-[10px] uppercase tracking-widest font-bold">End of Surah</p>
            </div>
          </>
        )}
      </main>

      {sharingAyah && (
        <AyahShareModal 
          ayah={sharingAyah} 
          surah={surah} 
          language={language} 
          onClose={() => setSharingAyah(null)} 
        />
      )}
    </div>
  );
};

export default SurahReader;
