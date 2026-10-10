import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Compass, Sparkles, Globe } from 'lucide-react';

interface HeaderProps {
  currentTab: 'interviewer' | 'practice' | 'roadmap';
  onSelectTab: (tab: 'interviewer' | 'practice' | 'roadmap') => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <button
            onClick={() => onSelectTab('interviewer')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
              {t.app_title}
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('interviewer')}
            className={`pb-0.5 transition-colors whitespace-nowrap shrink-0 border-b-2 text-sm ${
              currentTab === 'interviewer'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav_interviewer}
          </button>
          <button
            onClick={() => onSelectTab('practice')}
            className={`pb-0.5 transition-colors whitespace-nowrap shrink-0 border-b-2 text-sm ${
              currentTab === 'practice'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav_practice}
          </button>
          <button
            onClick={() => onSelectTab('roadmap')}
            className={`pb-0.5 transition-colors whitespace-nowrap shrink-0 border-b-2 text-sm ${
              currentTab === 'roadmap'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav_roadmap}
          </button>
        </nav>

        {/* Zone 3: Language Toggle Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'tr' ? 'EN' : 'TR'}</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-slate-500 font-normal">{language === 'tr' ? 'English' : 'Türkçe'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50/80 text-xs">
        <button
          onClick={() => onSelectTab('interviewer')}
          className={`px-2 py-1 rounded font-medium ${currentTab === 'interviewer' ? 'text-indigo-600 font-bold bg-white' : 'text-slate-600'}`}
        >
          {t.nav_interviewer}
        </button>
        <button
          onClick={() => onSelectTab('practice')}
          className={`px-2 py-1 rounded font-medium ${currentTab === 'practice' ? 'text-indigo-600 font-bold bg-white' : 'text-slate-600'}`}
        >
          {t.nav_practice}
        </button>
        <button
          onClick={() => onSelectTab('roadmap')}
          className={`px-2 py-1 rounded font-medium ${currentTab === 'roadmap' ? 'text-indigo-600 font-bold bg-white' : 'text-slate-600'}`}
        >
          {t.nav_roadmap}
        </button>
      </div>
    </header>
  );
};
