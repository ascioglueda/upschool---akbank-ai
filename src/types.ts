export type Language = 'tr' | 'en';

export interface InterviewQuestion {
  id: string;
  category: 'technical' | 'behavioral' | 'leadership' | 'problem-solving' | 'strategic' | 'culture-fit' | string;
  question: string;
  whyInterviewerAsksThis: string;
  whatTheyAreEvaluating: string;
  potentialTraps: string;
  starAdvice: string;
  difficulty: 'entry' | 'mid' | 'senior' | 'executive';
  sampleOpening: string;
}

export interface InterviewerSession {
  interviewerTitle: string;
  companyContext: string;
  targetRole: string;
  jobDescription?: string;
  interviewerMindsetSummary: string;
  questions: InterviewQuestion[];
  generatedAt: string;
}

export interface PracticeEvaluation {
  overallScore: number;
  clarityScore: number;
  relevanceScore: number;
  starStructureScore: number;
  executivePresenceScore: number;
  executiveSummary: string;
  strengths: string[];
  areasForImprovement: string[];
  improvedModelAnswer: string;
  coachingTip: string;
}

export interface PracticeAttempt {
  id: string;
  questionId: string;
  questionText: string;
  interviewerTitle: string;
  targetRole: string;
  userAnswer: string;
  evaluation?: PracticeEvaluation;
  timestamp: string;
}

export interface SkillMastered {
  name: string;
  evidence: string;
}

export interface SkillPartial {
  name: string;
  gap: string;
}

export interface SkillMissing {
  name: string;
  importance: string;
}

export interface SkillsMatrix {
  masteredSkills: SkillMastered[];
  partialSkills: SkillPartial[];
  missingCriticalSkills: SkillMissing[];
}

export interface RecommendedTraining {
  title: string;
  category: 'technical' | 'leadership' | 'strategy' | 'certification';
  priority: 'immediate' | 'secondary' | 'continuous';
  providerOrFormat: string;
  estimatedDuration: string;
  whyNeeded: string;
  coreModules: string[];
  expectedOutcome: string;
}

export interface ActionMilestone {
  phase: string;
  timeframe: string;
  focusObjective: string;
  milestones: string[];
  deliverableProject: string;
}

export interface CareerRoadmapReport {
  readinessScore: number;
  currentLevelSummary: string;
  targetLevelSummary: string;
  skillsMatrix: SkillsMatrix;
  recommendedTrainings: RecommendedTraining[];
  actionMilestones: ActionMilestone[];
  coachAdvice: string;
  generatedAt: string;
}

export interface CareerInputData {
  currentResume: string;
  completedCourses: string;
  targetNextRole: string;
}

export interface PresetProfile {
  id: string;
  titleKey: string;
  interviewerTitle: string;
  companyContext: string;
  targetRole: string;
  jobDescription: string;
  currentResume: string;
  completedCourses: string;
  targetNextRole: string;
}
