import React, { useState, useEffect, useRef } from 'react';
import { PracticeEvaluation, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Clock,
  Send,
} from 'lucide-react';

interface PracticeLabViewProps {
  language: Language;
  activeQuestion: string;
  interviewerTitle: string;
  targetRole: string;
  onSetQuestion: (q: string) => void;
  onEvaluateAnswer: (params: {
    question: string;
    interviewerTitle: string;
    targetRole: string;
    userAnswer: string;
  }) => Promise<PracticeEvaluation | null>;
  isEvaluating: boolean;
  evaluation: PracticeEvaluation | null;
  onClearEvaluation: () => void;
}

export const PracticeLabView: React.FC<PracticeLabViewProps> = ({
  language,
  activeQuestion,
  interviewerTitle,
  targetRole,
  onSetQuestion,
  onEvaluateAnswer,
  isEvaluating,
  evaluation,
  onClearEvaluation,
}) => {
  const t = translations[language];

  const [questionInput, setQuestionInput] = useState(activeQuestion);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setQuestionInput(activeQuestion);
  }, [activeQuestion]);

  // Timer counter
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Speech Recognition setup (Web Speech API)
  const toggleRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t.voice_unsupported);
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsTimerRunning(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'tr' ? 'tr-TR' : 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsRecording(true);
          setIsTimerRunning(true);
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            setUserAnswer((prev) => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
          }
        };

        recognition.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setIsRecording(false);
          setIsTimerRunning(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsRecording(false);
      }
    }
  };

  // Text-to-speech for the question
  const handleSpeakQuestion = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(questionInput || activeQuestion);
    utterance.lang = language === 'tr' ? 'tr-TR' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleEvaluate = async () => {
    const q = questionInput.trim() || activeQuestion.trim();
    if (!q || !userAnswer.trim() || isEvaluating) return;
    setIsTimerRunning(false);
    await onEvaluateAnswer({
      question: q,
      interviewerTitle: interviewerTitle || 'Senior Interviewer',
      targetRole: targetRole || 'Candidate Role',
      userAnswer: userAnswer.trim(),
    });
  };

  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;
  const formattedTime = `${Math.floor(timerSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(timerSeconds % 60).toString().padStart(2, '0')}`;

  const handleResetAnswer = () => {
    setUserAnswer('');
    setTimerSeconds(0);
    setIsTimerRunning(false);
    onClearEvaluation();
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t.practice_heading}</h2>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">{t.practice_desc}</p>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[11px]">
              {t.label_active_question}
            </span>
            {interviewerTitle && (
              <>
                <span aria-hidden="true">·</span>
                <span>Mülakatçı: <strong className="text-slate-800">{interviewerTitle}</strong></span>
              </>
            )}
            {targetRole && (
              <>
                <span aria-hidden="true">·</span>
                <span>Hedef: <strong className="text-slate-800">{targetRole}</strong></span>
              </>
            )}
          </div>

          <button
            onClick={handleSpeakQuestion}
            disabled={!questionInput.trim()}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded border border-slate-200 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t.btn_read_question}</span>
          </button>
        </div>

        <div>
          <textarea
            rows={2}
            value={questionInput}
            onChange={(e) => {
              setQuestionInput(e.target.value);
              onSetQuestion(e.target.value);
            }}
            placeholder={t.placeholder_no_question_selected}
            className="w-full text-base font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
          />
        </div>
      </div>

      {/* Answer Input Workspace */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {t.label_user_answer}
          </label>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="tabular-nums font-semibold">{formattedTime}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span>{t.word_count}: </span>
              <strong className="text-slate-700 tabular-nums">{wordCount}</strong>
            </div>
          </div>
        </div>

        <textarea
          rows={7}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={t.placeholder_user_answer}
          className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all leading-relaxed"
        />

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-600" />}
              <span>{isRecording ? t.btn_stop_voice : t.btn_start_voice}</span>
            </button>

            {isRecording && (
              <span className="text-xs text-rose-600 font-medium animate-pulse">
                {t.voice_listening}
              </span>
            )}

            {userAnswer && (
              <button
                onClick={handleResetAnswer}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.btn_clear_answer}</span>
              </button>
            )}
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !userAnswer.trim() || !questionInput.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{isEvaluating ? t.btn_evaluating : t.btn_evaluate_answer}</span>
          </button>
        </div>
      </div>

      {/* Evaluating Skeleton */}
      {isEvaluating && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3 shadow-2xs">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{t.btn_evaluating}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'tr'
              ? 'STAR yöntemi, argüman derinliği, ifade netliği ve yönetici duruşu kriterleri inceleniyor...'
              : 'Assessing STAR framework compliance, argument depth, executive presence, and clarity...'}
          </p>
        </div>
      )}

      {/* Instant Coaching Report */}
      {evaluation && !isEvaluating && (
        <div className="space-y-6">
          {/* Score Header Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>{t.eval_report_title}</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {t.overall_score}: <span className="text-indigo-400 font-mono tabular-nums">{evaluation.overallScore}/100</span>
                </h3>
                <p className="text-sm text-slate-300 max-w-2xl pt-1">
                  {evaluation.executiveSummary}
                </p>
              </div>

              {/* Score Radar / Metrics */}
              <div className="grid grid-cols-2 gap-3 min-w-[260px] text-xs">
                <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
                  <div className="text-slate-400">{t.score_clarity}</div>
                  <div className="text-base font-bold font-mono tabular-nums text-white mt-0.5">
                    %{evaluation.clarityScore}
                  </div>
                </div>
                <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
                  <div className="text-slate-400">{t.score_relevance}</div>
                  <div className="text-base font-bold font-mono tabular-nums text-white mt-0.5">
                    %{evaluation.relevanceScore}
                  </div>
                </div>
                <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
                  <div className="text-slate-400">{t.score_star}</div>
                  <div className="text-base font-bold font-mono tabular-nums text-white mt-0.5">
                    %{evaluation.starStructureScore}
                  </div>
                </div>
                <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
                  <div className="text-slate-400">{t.score_presence}</div>
                  <div className="text-base font-bold font-mono tabular-nums text-white mt-0.5">
                    %{evaluation.executivePresenceScore}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 mb-4 pb-2 border-b border-emerald-100">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{t.strengths_title}</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800 mb-4 pb-2 border-b border-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>{t.improvements_title}</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {evaluation.areasForImprovement.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Exemplar Model Answer */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-900 mb-3 pb-2 border-b border-slate-100">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>{t.model_answer_title}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-200 font-normal">
              {evaluation.improvedModelAnswer}
            </p>
          </div>

          {/* Coaching Tip */}
          <div className="bg-indigo-50/70 rounded-xl border border-indigo-200 p-5 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                {t.coaching_tip_title}
              </h4>
              <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                {evaluation.coachingTip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
