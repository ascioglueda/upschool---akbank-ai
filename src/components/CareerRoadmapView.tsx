import React, { useState } from 'react';
import { CareerRoadmapReport, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  Calendar,
  Layers,
  Copy,
  Check,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface CareerRoadmapViewProps {
  language: Language;
  report: CareerRoadmapReport | null;
  onAnalyzeRoadmap: (params: {
    currentResume: string;
    completedCourses: string;
    targetNextRole: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({
  language,
  report,
  onAnalyzeRoadmap,
  isLoading,
}) => {
  const t = translations[language];

  const [currentResume, setCurrentResume] = useState('');
  const [completedCourses, setCompletedCourses] = useState('');
  const [targetNextRole, setTargetNextRole] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetNextRole.trim() || (!currentResume.trim() && !completedCourses.trim()) || isLoading) {
      return;
    }
    onAnalyzeRoadmap({
      currentResume,
      completedCourses,
      targetNextRole,
    });
  };

  const handleCopyPlan = () => {
    if (!report) return;
    const textToCopy = `
=== ${t.roadmap_output_title} ===
Hedef Rol: ${targetNextRole}
Hazırlık Puanı: %${report.readinessScore}

--- ${t.current_baseline} ---
${report.currentLevelSummary}

--- ${t.target_expectation} ---
${report.targetLevelSummary}

--- ${t.recommended_trainings_title} ---
${report.recommendedTrainings
  .map(
    (c, i) =>
      `${i + 1}. ${c.title} (${c.providerOrFormat} - ${c.estimatedDuration})\nÖncelik: ${c.priority}\nNeden: ${c.whyNeeded}\nÇıktı: ${c.expectedOutcome}`
  )
  .join('\n\n')}

--- ${t.timeline_title} ---
${report.actionMilestones
  .map(
    (m) =>
      `[${m.phase} - ${m.timeframe}]\nHedef: ${m.focusObjective}\nAdımlar: ${m.milestones.join(
        ', '
      )}\nBitirme Projesi: ${m.deliverableProject}`
  )
  .join('\n\n')}

--- ${t.coach_closing_advice} ---
${report.coachAdvice}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Title & Instructions */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t.roadmap_heading}</h2>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">{t.roadmap_desc}</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t.label_target_next_role} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={targetNextRole}
            onChange={(e) => setTargetNextRole(e.target.value)}
            placeholder={t.placeholder_target_next_role}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.label_current_cv} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              value={currentResume}
              onChange={(e) => setCurrentResume(e.target.value)}
              placeholder={t.placeholder_current_cv}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.label_completed_courses} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              value={completedCourses}
              onChange={(e) => setCompletedCourses(e.target.value)}
              placeholder={t.placeholder_completed_courses}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading || !targetNextRole.trim() || (!currentResume.trim() && !completedCourses.trim())}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{isLoading ? t.btn_analyzing_roadmap : t.btn_analyze_roadmap}</span>
          </button>
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3 shadow-2xs">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 animate-spin">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{t.btn_analyzing_roadmap}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'tr'
              ? 'CV ve tamamlanan eğitimler karşılaştırılıyor, kritik yetkinlik açıkları ve bir sonraki seviye için somut kurs programları modelleniyor...'
              : 'Benchmarking CV and completed curriculum against next-level expectations to pinpoint skill deficits and curated courses...'}
          </p>
        </div>
      )}

      {/* Analysis & Roadmap Report */}
      {report && !isLoading && (
        <div className="space-y-8">
          {/* Readiness & Executive Overview Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>{t.roadmap_output_title}</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {targetNextRole}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <span>{t.readiness_label}:</span>
                  <span className="text-indigo-400 font-mono font-bold text-sm tabular-nums">
                    %{report.readinessScore}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyPlan}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer self-start md:self-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copied_success : t.btn_copy_plan}</span>
              </button>
            </div>

            {/* Baseline vs Target expectations */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/80">
                <span className="font-semibold text-slate-300 block mb-1.5">{t.current_baseline}</span>
                <p className="text-slate-300 leading-relaxed">{report.currentLevelSummary}</p>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/80">
                <span className="font-semibold text-indigo-300 block mb-1.5">{t.target_expectation}</span>
                <p className="text-slate-300 leading-relaxed">{report.targetLevelSummary}</p>
              </div>
            </div>
          </div>

          {/* Skills Matrix (Mastered, Partial, Missing) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>{t.skills_matrix_title}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Mastered */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 uppercase tracking-wider mb-3 pb-2 border-b border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.skills_mastered}</span>
                </div>
                <div className="space-y-3">
                  {report.skillsMatrix.masteredSkills.map((s, idx) => (
                    <div key={idx} className="text-xs bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                      <div className="font-semibold text-emerald-950">{s.name}</div>
                      <div className="text-[11px] text-emerald-800/90 mt-0.5 leading-snug">{s.evidence}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partial */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-800 uppercase tracking-wider mb-3 pb-2 border-b border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.skills_partial}</span>
                </div>
                <div className="space-y-3">
                  {report.skillsMatrix.partialSkills.map((s, idx) => (
                    <div key={idx} className="text-xs bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                      <div className="font-semibold text-amber-950">{s.name}</div>
                      <div className="text-[11px] text-amber-800/90 mt-0.5 leading-snug">{s.gap}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Critical */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-800 uppercase tracking-wider mb-3 pb-2 border-b border-rose-100">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>{t.skills_missing}</span>
                </div>
                <div className="space-y-3">
                  {report.skillsMatrix.missingCriticalSkills.map((s, idx) => (
                    <div key={idx} className="text-xs bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                      <div className="font-semibold text-rose-950">{s.name}</div>
                      <div className="text-[11px] text-rose-800/90 mt-0.5 leading-snug">{s.importance}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Next-Step Education Courses */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>{t.recommended_trainings_title}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {report.recommendedTrainings.map((training, index) => {
                const priorityBadge =
                  training.priority === 'immediate'
                    ? { text: t.priority_immediate, color: 'text-rose-700 bg-rose-50 border-rose-200' }
                    : training.priority === 'secondary'
                    ? { text: t.priority_secondary, color: 'text-amber-700 bg-amber-50 border-amber-200' }
                    : { text: t.priority_continuous, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs pb-1">
                        <span className="font-semibold text-slate-500 uppercase text-[11px]">
                          {training.category}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${priorityBadge.color}`}>
                          {priorityBadge.text}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        {training.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                        <span>{training.providerOrFormat}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{training.estimatedDuration}</span>
                      </div>

                      <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <strong className="text-slate-800">Neden Gerekli: </strong>
                        {training.whyNeeded}
                      </p>

                      {/* Core Modules */}
                      <div className="mt-3 text-xs space-y-1">
                        <span className="font-semibold text-slate-700">{t.modules_label}:</span>
                        <ul className="space-y-1 text-slate-600 pl-3">
                          {training.coreModules.map((m, mIdx) => (
                            <li key={mIdx} className="list-disc leading-snug">
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                      <span className="font-semibold text-indigo-700">{t.outcome_label}: </span>
                      <span className="text-slate-700">{training.expectedOutcome}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phased Milestone Learning Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>{t.timeline_title}</span>
            </h3>

            <div className="space-y-4">
              {report.actionMilestones.map((phase, pIdx) => (
                <div
                  key={pIdx}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {phase.phase}
                    </h4>
                    <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {phase.timeframe}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-indigo-700">
                    Hedef: {phase.focusObjective}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="font-semibold text-slate-700 block mb-1">Haftalık Eylemler:</span>
                      <ul className="space-y-1.5 text-slate-600 pl-3">
                        {phase.milestones.map((item, iIdx) => (
                          <li key={iIdx} className="list-disc leading-snug">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex flex-col justify-center">
                      <span className="font-semibold text-slate-800 mb-1">{t.deliverable_label}:</span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {phase.deliverableProject}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Advice */}
          <div className="bg-gradient-to-r from-indigo-50 to-slate-50 rounded-xl border border-indigo-200 p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
              {t.coach_closing_advice}
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              "{report.coachAdvice}"
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!report && !isLoading && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">{t.empty_roadmap_prompt}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {language === 'tr'
              ? 'Sayfanın üstündeki hazır senaryolardan birini seçerek anında örnek bir kariyer ve eğitim yol haritası analizi görebilirsiniz.'
              : 'You can choose one of the scenario presets at the top to see an instant career roadmap and education analysis.'}
          </p>
        </div>
      )}
    </div>
  );
};
