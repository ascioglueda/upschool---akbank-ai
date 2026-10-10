import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PresetSelector } from './components/PresetSelector';
import { InterviewerPersonaView } from './components/InterviewerPersonaView';
import { PracticeLabView } from './components/PracticeLabView';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import {
  Language,
  InterviewerSession,
  InterviewQuestion,
  PracticeEvaluation,
  CareerRoadmapReport,
  PresetProfile,
} from './types';
import { translations } from './i18n/translations';
import { Sparkles, Compass } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('tr');
  const [currentTab, setCurrentTab] = useState<'interviewer' | 'practice' | 'roadmap'>('interviewer');

  // Interviewer persona state
  const [session, setSession] = useState<InterviewerSession | null>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Practice lab state
  const [activeQuestion, setActiveQuestion] = useState('');
  const [practiceInterviewerTitle, setPracticeInterviewerTitle] = useState('');
  const [practiceTargetRole, setPracticeTargetRole] = useState('');
  const [evaluation, setEvaluation] = useState<PracticeEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Career Roadmap state
  const [careerReport, setCareerReport] = useState<CareerRoadmapReport | null>(null);
  const [isAnalyzingRoadmap, setIsAnalyzingRoadmap] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[language];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  // 1. Generate Interview Questions
  const handleGenerateQuestions = async (params: {
    interviewerTitle: string;
    companyContext: string;
    targetRole: string;
    jobDescription: string;
  }) => {
    setIsGeneratingQuestions(true);
    try {
      const response = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      const newSession: InterviewerSession = {
        ...params,
        interviewerMindsetSummary: data.interviewerMindsetSummary,
        questions: data.questions || [],
        generatedAt: new Date().toISOString(),
      };

      setSession(newSession);
      showToast(language === 'tr' ? 'Mülakatçı soruları başarıyla üretildi!' : 'Questions generated successfully!');
    } catch (err: any) {
      console.error(err);
      showToast(`${t.error_prefix}${err.message}`);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // 2. Transition from question bank to Practice Lab
  const handleSelectForPractice = (
    question: InterviewQuestion,
    interviewerTitle: string,
    targetRole: string
  ) => {
    setActiveQuestion(question.question);
    setPracticeInterviewerTitle(interviewerTitle);
    setPracticeTargetRole(targetRole);
    setEvaluation(null);
    setCurrentTab('practice');
    showToast(language === 'tr' ? 'Soru pratik laboratuvarına aktarıldı!' : 'Question loaded into Practice Lab!');
  };

  // 3. Evaluate candidate answer in mock simulator
  const handleEvaluateAnswer = async (params: {
    question: string;
    interviewerTitle: string;
    targetRole: string;
    userAnswer: string;
  }): Promise<PracticeEvaluation | null> => {
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Evaluation failed');
      }

      const evalData: PracticeEvaluation = await response.json();
      setEvaluation(evalData);
      showToast(language === 'tr' ? 'Koçluk değerlendirmesi tamamlandı!' : 'Evaluation generated successfully!');
      return evalData;
    } catch (err: any) {
      console.error(err);
      showToast(`${t.error_prefix}${err.message}`);
      return null;
    } finally {
      setIsEvaluating(false);
    }
  };

  // 4. Analyze skills gap and build education roadmap
  const handleAnalyzeRoadmap = async (params: {
    currentResume: string;
    completedCourses: string;
    targetNextRole: string;
  }) => {
    setIsAnalyzingRoadmap(true);
    try {
      const response = await fetch('/api/career/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to build roadmap');
      }

      const reportData: CareerRoadmapReport = {
        ...(await response.json()),
        generatedAt: new Date().toISOString(),
      };

      setCareerReport(reportData);
      showToast(language === 'tr' ? 'Eğitim yol haritası hazırlandı!' : 'Roadmap generated successfully!');
    } catch (err: any) {
      console.error(err);
      showToast(`${t.error_prefix}${err.message}`);
    } finally {
      setIsAnalyzingRoadmap(false);
    }
  };

  // 5. Preset loader
  const handleSelectPreset = (preset: PresetProfile) => {
    // Populate session config
    handleGenerateQuestions({
      interviewerTitle: preset.interviewerTitle,
      companyContext: preset.companyContext,
      targetRole: preset.targetRole,
      jobDescription: preset.jobDescription,
    });

    // Also populate career analysis for testing
    handleAnalyzeRoadmap({
      currentResume: preset.currentResume,
      completedCourses: preset.completedCourses,
      targetNextRole: preset.targetNextRole,
    });

    setPracticeInterviewerTitle(preset.interviewerTitle);
    setPracticeTargetRole(preset.targetRole);
    showToast(t.toast_loaded_preset);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 3-Zone Clean Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{t.badge_dual_engine}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {t.hero_title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {t.hero_subtitle}
          </p>
        </div>

        {/* Quick Scenario Selector */}
        <PresetSelector language={language} onSelectPreset={handleSelectPreset} />

        {/* Tab Views */}
        {currentTab === 'interviewer' && (
          <InterviewerPersonaView
            language={language}
            session={session}
            onGenerateQuestions={handleGenerateQuestions}
            isLoading={isGeneratingQuestions}
            onSelectForPractice={handleSelectForPractice}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeLabView
            language={language}
            activeQuestion={activeQuestion}
            interviewerTitle={practiceInterviewerTitle}
            targetRole={practiceTargetRole}
            onSetQuestion={setActiveQuestion}
            onEvaluateAnswer={handleEvaluateAnswer}
            isEvaluating={isEvaluating}
            evaluation={evaluation}
            onClearEvaluation={() => setEvaluation(null)}
          />
        )}

        {currentTab === 'roadmap' && (
          <CareerRoadmapView
            language={language}
            report={careerReport}
            onAnalyzeRoadmap={handleAnalyzeRoadmap}
            isLoading={isAnalyzingRoadmap}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-lg border border-slate-700 animate-fade-in flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>{t.app_title} · {t.app_tagline}</span>
          <span>Powered by Gemini 3.8 Flash</span>
        </div>
      </footer>
    </div>
  );
}
