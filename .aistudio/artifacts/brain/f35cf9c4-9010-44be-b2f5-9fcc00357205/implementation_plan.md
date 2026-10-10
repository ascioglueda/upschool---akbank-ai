# CareerCraft AI: Interview & Career Coach Agent

CareerCraft AI is a dual-engine career intelligence workspace that generates targeted interview questions tailored to any interviewer persona or leadership title, provides an interactive mock interview practice simulator with instant coaching feedback, and performs deep skill-gap analysis on candidate CVs and course history to build a personalized next-step learning roadmap.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been synthesized directly from your responses:

- **Confirmed Decision 1 (Language Support)**: Full bilingual UI and coaching engine supporting seamless toggle between **Türkçe** and **English** for both the application workspace and AI-generated outputs.
- **Confirmed Decision 2 (Interviewer Question Generation & Practice Flow)**: Integrated dual-mode workflow combining **comprehensive role-specific question banks** (categorized by technical, behavioral, and leadership criteria with STAR-framework sample response tips) and a **live interactive practice simulator** with real-time AI critique, strengths/growth points, and benchmark sample answers.
- **Confirmed Decision 3 (Career Development & Next-Step Education)**: Deep comparative engine that takes the user's current CV/resume, target next-level role, and current course/training materials, detects the exact skill and knowledge gaps, and recommends actionable next-step educational courses, certifications, and a structured milestone-based learning roadmap.

---

## 1. Overview & Core Concept

- **What It Does**: CareerCraft AI acts as a personal senior talent partner and interview coach. Users can input any interviewer title (e.g., *Engineering Manager, VP of Product, Head of HR, Lead Data Scientist, Senior System Architect*), company context, and target job description to instantly obtain potential interview questions mapped to that interviewer's psychological mindset and evaluation rubric. Users can then enter the interactive simulation mode to practice answering questions, receiving instant coaching scores and actionable critiques. Concurrently, in the Career Roadmap module, candidates can provide their CV and records of attended courses/content to receive a gap analysis and a prioritized curriculum of courses and certifications required to reach the next tier.
- **Target Audience / Persona**: Professionals, job seekers, career switchers, and rising leaders preparing for high-stakes interviews who need to anticipate different interviewer perspectives and systematically bridge skill deficits.
- **Key Value**: Eliminates the guesswork of interview preparation by anticipating what specific stakeholders care about, and turns past learning history into a concrete, actionable career upskilling plan.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Dashboard & Strategy Hub**:
   - Welcome banner with fast-action shortcuts: *1. Mülakatçı Simülasyonu (Interviewer Prep)*, *2. İnteraktif Pratik (Mock Practice)*, *3. Kariyer & Eğitim Yol Haritası (Career & Learning Roadmap)*.
   - Quick-switch language control (TR / EN) and profile presets for fast demonstration (e.g., Tech Lead to VP, Mid-Level Product Manager to Senior PM, Data Analyst to ML Engineer).

2. **Interviewer Persona & Question Intelligence**:
   - Inputs: Interviewer Title (e.g. *VP of Engineering*, *Head of Talent*, *Staff Architect*), Company Type/Industry, Target Role, and Optional Job Description.
   - Output: Categorized question dossier highlighting *Why this interviewer asks this*, *What they are evaluating*, *Key traps/pitfalls to avoid*, and *STAR framework answer blueprints*.
   - One-click transition to `"Bu Soruyu Pratik Et / Practice This Question"`.

3. **Interactive Simulation & Coaching Lab**:
   - Live interview card showing the active question with interviewer persona avatar and difficulty tag.
   - Speech-to-text / Audio recording input and structured text response box.
   - Real-time AI evaluation breakdown: Clarity & Tone, Relevance & Depth, STAR structure adherence, Identified Strengths, and Specific Suggested Refinements.

4. **Career Content & Education Roadmap Engine**:
   - Inputs: Current Resume/Skills summary, Attended Trainings/Courses/Certifications history, and Desired Next Step Role.
   - Output:
     - **Skill Gap Radar / Matrix**: Acquired Competencies vs. Required Competencies for target role.
     - **Curated Educational Recommendations**: Specific courses, hands-on project topics, and industry certifications categorized by priority (Immediate Need, Mid-Term Upskilling, Long-Term Mastery).
     - **Step-by-Step Learning Timeline**: Weekly/monthly milestone plan with learning outcomes and practical portfolio artifacts.

### Visual Identity & Theme

- **Aesthetic Direction**: Contemporary executive workspace inspired by modern productivity suites (Linear, Notion, Raycast). Clean, distraction-free, professional, with strict anti-slop typography and zero decorative clutter.
- **Color Palette & Discipline (60-30-10)**:
  - *60% Neutral Canvas*: Crisp off-white (`#F8FAFC` slate-50 / light) and deep obsidian canvas (`#090D16` / dark).
  - *30% Structural Surfaces*: Subtle cards and borders (`#FFFFFF` with `#E2E8F0` hairline borders in light mode; `#111827` with `#1F2937` borders in dark mode).
  - *10% Action Accent*: Deep Indigo & Electric Cobalt (`#4F46E5` / `#3B82F6`) for primary interactive controls; Emerald (`#10B981`) for mastered competencies; Amber (`#F59E0B`) for skill gaps.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` (semibold 600, bold 700) with balanced line wraps (`text-wrap: balance`).
  - Body & UI Controls: `Plus Jakarta Sans` / `DM Sans` (14px–16px, 1.5 line height).
  - Metrics & Timers: Monospace tabular numerals (`font-mono tabular-nums`).
  - Strict Zero-Pill rule: No bubble badges or pseudo tags; metadata presented with quiet typographic separators (`·`, `/`).
- **Interactive Feedback**:
  - Smooth tab switching with spring physics.
  - Generative loading states with contextual educational quotes and phase indicators.
  - Clean exportable action plan (copy roadmap, download markdown/text report).

---

## 3. Key Product Decisions & Trade-Offs

- **Server-Side Gemini Integration**:
  - *Chosen Approach*: All Gemini API requests run strictly through backend Express/Vite middleware (`/api/interview/questions`, `/api/interview/evaluate`, `/api/career/roadmap`) using the modern `@google/genai` SDK and `gemini-3.8-flash`.
  - *Why*: Strict security (protecting `GEMINI_API_KEY`), robust schema-validated JSON outputs, and compliance with the server-side Gemini guidelines.
- **Interactive Simulation Modality**:
  - *Chosen Approach*: Support both direct typing and Web Speech API audio transcription for practice, paired with browser Web Speech Synthesis / voice prompts for interviewer questions.
  - *Why*: Gives users a zero-friction experience without requiring complex microphone hardware configuration while allowing realistic spoken interview practice.
- **Curated Preset Profiles & Flexible Custom Input**:
  - *Chosen Approach*: Provide 3 rich default industry scenarios (Engineering Leadership, Product Strategy, Data & AI) that can be loaded in one click, alongside complete custom inputs for resume, interviewers, and target jobs.
  - *Why*: Allows immediate exploratory usage without forcing the user to type lengthy CVs on first glance.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CareerCraft Frontend (React 19)                 │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark · Mode Links · Language & Theme)       │
├──────────────────┬──────────────────────┬──────────────────────────────┤
│  Interviewer     │  Interactive         │  Career & Education          │
│  Persona Engine  │  Coaching Lab        │  Roadmap Generator           │
│  (Title, Domain, │  (Live Question,     │  (CV + Course Content        │
│   Question Bank) │   Voice/Text Answer, │   -> Skill Gap & Training    │
│                  │   Coaching Feedback) │   Action Plan)               │
└────────┬─────────┴──────────┬───────────┴──────────────┬───────────────┘
         │                    │                          │
         ▼                    ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│              Server API Routes (Vite Dev Server / Express)             │
│               - POST /api/interview/questions                          │
│               - POST /api/interview/evaluate                           │
│               - POST /api/career/roadmap                               │
├────────────────────────────────────────────────────────────────────────┤
│               @google/genai SDK (gemini-3.8-flash)                     │
│               Configured with responseSchema & Server User-Agent       │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **`InterviewerSession`**:
  - `interviewerTitle`: string (e.g. "Engineering Director")
  - `companyContext`: string
  - `targetRole`: string
  - `jobDescription`: string
  - `questions`: Array of `{ id, category, question, rationale, evaluationCriteria, starAdvice, difficulty }`
- **`PracticeAttempt`**:
  - `questionId`: string
  - `userAnswer`: string
  - `feedback`: `{ scoreOutOf100, clarityScore, starAlignmentScore, strengths: string[], improvementPoints: string[], sampleModelAnswer: string }`
- **`CareerRoadmapState`**:
  - `userResume`: string
  - `completedTrainings`: string (courses, certifications, workshop details)
  - `targetNextRole`: string
  - `skillsMatrix`: `{ mastered: string[], partial: string[], missing: string[] }`
  - `recommendedTrainings`: Array of `{ title, providerOrFormat, rationale, priority, estimatedHours, syllabusHighlights }`
  - `milestonePlan`: Array of `{ phase: string, timeframe: string, goals: string[], concreteDeliverables: string[] }`
- **`Language`**: `'tr' | 'en'` (with comprehensive dictionary for all labels and prompts).

### Step-by-Step Execution Plan

1. **Server Setup**: Add server endpoints in `vite.config.ts` (or backend server middleware) connecting `@google/genai` with `gemini-3.8-flash` to handle:
   - Question generation tailored to interviewer persona.
   - Answer evaluation with detailed coaching rubric.
   - Skill-gap analysis and training roadmap generation.
2. **Metadata & Entry Point**: Update `metadata.json` and `index.html` with title "CareerCraft AI — Mülakat & Kariyer Koçu".
3. **Core Services & Bilingual Localization**: Implement `src/i18n.ts` supporting Turkish and English, plus type definitions in `src/types.ts`.
4. **Interviewer Question Generator**: Build input form (with quick sample presets) and structured question explorer with STAR methodology cards.
5. **Interactive Practice Lab**: Build question-by-question mock simulator with speech-to-text recording, text editor, timer, and AI evaluation report.
6. **Career & Learning Roadmap Engine**: Build CV & course material analyzer that generates skill gap breakdown and next-step training curriculum.
7. **Refinement & Testing**: Run `lint_applet` and `compile_applet` to verify TypeScript compliance and flawless compilation.
