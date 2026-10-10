import React from 'react';
import { PRESET_PROFILES } from '../data/presets';
import { PresetProfile, Language } from '../types';
import { translations } from '../i18n/translations';
import { Briefcase, ArrowRight } from 'lucide-react';

interface PresetSelectorProps {
  language: Language;
  onSelectPreset: (preset: PresetProfile) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ language, onSelectPreset }) => {
  const t = translations[language];

  return (
    <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span>{t.quick_presets}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {PRESET_PROFILES.map((preset) => {
          const title = (t as any)[preset.titleKey] || preset.targetRole;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="text-left px-3.5 py-2.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700 line-clamp-1">
                  {title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span>{preset.interviewerTitle}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{preset.targetRole}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
