
import React from 'react';
import { AppView, AppTheme } from '../types';
import { IconBook, IconSettings } from './Icons';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  theme: AppTheme;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, theme }) => {
  const tabs: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: 'Quran', icon: <IconBook /> },
    { id: 'SETTINGS', label: 'Settings', icon: <IconSettings /> }
  ];

  return (
    <nav className={`absolute bottom-0 w-full z-50 backdrop-blur-xl border-t pb-8 pt-3 transition-colors duration-500 ${
      theme === AppTheme.MIDNIGHT ? 'bg-black/80 border-zinc-900/50' : 
      theme === AppTheme.SEPIA ? 'bg-[#f4ecd8]/90 border-[#e2d6b5]' : 'bg-white/90 border-zinc-200'
    }`}>
      <div className="flex justify-around items-center px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${
              currentView === tab.id ? 'text-primary scale-110' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${currentView === tab.id ? 'bg-primary/10' : ''}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            {currentView === tab.id && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_10px_rgba(25,153,179,1)]"></span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
