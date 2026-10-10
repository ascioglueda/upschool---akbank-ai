import React, { useState } from 'react';
import { InterviewQuestion, InterviewerSession, Language } from '../types';
import { translations } from '../i18n/translations';
import { UserCheck, Sparkles, AlertTriangle, Target, CheckCircle2, Play, Search, Filter } from 'lucide-react';

interface InterviewerPersonaViewProps {
  language: Language;
  session: InterviewerSession | null;
  onGenerateQuestions: (params: {
    interviewerTitle: string;
    companyContext: string;
    targetRole: string;
    jobDescription: string;
  }) => Promise<void>;
  isLoading: boolean;
  onSelectForPractice: (question: InterviewQuestion, interviewerTitle: string, targetRole: string) => void;
}

export const InterviewerPersonaView: React.FC<InterviewerPersonaViewProps> = ({
  language,
  session,
  onGenerateQuestions,
  isLoading,
  onSelectForPractice,
}) => {
  const t = translations[language];

  const [interviewerTitle, setInterviewerTitle] = useState(session?.interviewerTitle || '');
  const [targetRole, setTargetRole] = useState(session?.targetRole || '');
  const [companyContext, setCompanyContext] = useState(session?.companyContext || '');
  const [jobDescription, setJobDescription] = useState(session?.jobDescription || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Update input fields if session changes externally (e.g., from preset)
  React.useEffect(() => {
    if (session) {
      setInterviewerTitle(session.interviewerTitle);
      setTargetRole(session.targetRole);
      setCompanyContext(session.companyContext || '');
      setJobDescription(session.jobDescription || '');
    }
  }, [session]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewerTitle.trim() || !targetRole.trim() || isLoading) return;
    onGenerateQuestions({
      interviewerTitle,
      companyContext,
      targetRole,
      jobDescription,
    });
  };

  const categories = session?.questions
    ? ['all', ...Array.from(new Set(session.questions.map((q) => q.category)))]
    : ['all'];

  const filteredQuestions = (session?.questions || []).filter((q) => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.whatTheyAreEvaluating.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Title & Instructions */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t.interviewer_heading}</h2>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">{t.interviewer_desc}</p>
      </div>

      {/* Input Configuration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.label_interviewer_title} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={interviewerTitle}
              onChange={(e) => setInterviewerTitle(e.target.value)}
              placeholder={t.placeholder_interviewer_title}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.label_target_role} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder={t.placeholder_target_role}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.label_company_context}
            </label>
            <input
              type="text"
              value={companyContext}
              onChange={(e) => setCompanyContext(e.target.value)}
              placeholder={t.placeholder_company_context}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.label_job_desc}
            </label>
            <input
              type="text"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t.placeholder_job_desc}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading || !interviewerTitle.trim() || !targetRole.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{isLoading ? t.btn_generating_questions : t.btn_generate_questions}</span>
          </button>
        </div>
      </form>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3 shadow-2xs">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{t.btn_generating_questions}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'tr'
              ? 'Mülakatçının organizasyonel rolü, değerlendirme psikolojisi ve en kritik sınav soruları modelleniyor...'
              : 'Modeling interviewer KPIs, psychological triggers, and role-critical evaluation rubrics...'}
          </p>
        </div>
      )}

      {/* Generated Questions Dossier */}
      {session && !isLoading && (
        <div className="space-y-6">
          {/* Mindset Overview Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-300 font-medium">
                  <span>{session.interviewerTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{session.targetRole}</span>
                  {session.companyContext && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{session.companyContext}</span>
                    </>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{t.mindset_title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">
                  {session.interviewerMindsetSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? t.filter_all : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Soru veya yetkinlik ara..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredQuestions.map((q, index) => (
              <div
                key={q.id || index}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Header row with unboxed clean metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[11px]">
                      {q.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{q.difficulty} level</span>
                    <span aria-hidden="true">·</span>
                    <span>Soru #{index + 1}</span>
                  </div>

                  <button
                    onClick={() => onSelectForPractice(q, session.interviewerTitle, session.targetRole)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-indigo-700" />
                    <span>{t.btn_practice_this}</span>
                  </button>
                </div>

                {/* Question title */}
                <h4 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {q.question}
                </h4>

                {/* Analysis Grid */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Why asked */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                      <Target className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{t.why_asked}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{q.whyInterviewerAsksThis}</p>
                  </div>

                  {/* Evaluation criteria */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.eval_criteria}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{q.whatTheyAreEvaluating}</p>
                  </div>

                  {/* Traps */}
                  <div className="bg-amber-50/60 rounded-lg p-3.5 border border-amber-200/80">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.potential_traps}</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed">{q.potentialTraps}</p>
                  </div>

                  {/* STAR Advice */}
                  <div className="bg-indigo-50/60 rounded-lg p-3.5 border border-indigo-200/80">
                    <div className="flex items-center gap-1.5 font-semibold text-indigo-900 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{t.star_advice}</span>
                    </div>
                    <p className="text-indigo-900/90 leading-relaxed">{q.starAdvice}</p>
                  </div>
                </div>

                {/* Sample Opening Hook */}
                {q.sampleOpening && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs">
                    <span className="font-semibold text-slate-700 shrink-0">{t.sample_opening}</span>
                    <p className="italic text-slate-600">"{q.sampleOpening}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!session && !isLoading && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <UserCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">{t.empty_interviewer_prompt}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {language === 'tr'
              ? 'Yukarıdaki hazır örnek senaryolardan birini seçebilir ya da gireceğiniz gerçek mülakatçı unvanını yazarak soruları oluşturabilirsiniz.'
              : 'You can pick one of the quick scenario presets above or enter your actual interviewer persona to generate tailored questions.'}
          </p>
        </div>
      )}
    </div>
  );
};
