import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    interviewerMindsetSummary: {
      type: Type.STRING,
      description: "Coaching insight explaining how this interviewer title thinks, what their key concerns/KPIs are, and what makes a candidate stand out.",
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: {
            type: Type.STRING,
            description: "One of: technical, behavioral, leadership, problem-solving, strategic, culture-fit",
          },
          question: {
            type: Type.STRING,
            description: "The interview question",
          },
          whyInterviewerAsksThis: {
            type: Type.STRING,
            description: "Psychological reason why this specific interviewer title asks this question",
          },
          whatTheyAreEvaluating: {
            type: Type.STRING,
            description: "Core competencies and subconscious criteria being tested",
          },
          potentialTraps: {
            type: Type.STRING,
            description: "Pitfalls, red flags, and cliché answers to strictly avoid",
          },
          starAdvice: {
            type: Type.STRING,
            description: "Concrete guidance on structuring the response using Situation, Task, Action, Result",
          },
          difficulty: {
            type: Type.STRING,
            description: "entry, mid, senior, or executive",
          },
          sampleOpening: {
            type: Type.STRING,
            description: "A high-impact opening sentence to begin the answer",
          },
        },
        required: [
          "id",
          "category",
          "question",
          "whyInterviewerAsksThis",
          "whatTheyAreEvaluating",
          "potentialTraps",
          "starAdvice",
          "difficulty",
          "sampleOpening",
        ],
      },
    },
  },
  required: ["interviewerMindsetSummary", "questions"],
};

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: "Score out of 100" },
    clarityScore: { type: Type.INTEGER, description: "Communication clarity score out of 100" },
    relevanceScore: { type: Type.INTEGER, description: "Target role & interviewer relevance score out of 100" },
    starStructureScore: { type: Type.INTEGER, description: "STAR method adherence score out of 100" },
    executivePresenceScore: { type: Type.INTEGER, description: "Confidence and impact score out of 100" },
    executiveSummary: { type: Type.STRING, description: "Brief executive evaluation of the answer" },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key strengths identified in the answer",
    },
    areasForImprovement: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific shortcomings, missed opportunities, and constructive critiques",
    },
    improvedModelAnswer: {
      type: Type.STRING,
      description: "An exceptional, comprehensive model answer applying STAR framework and executive delivery",
    },
    coachingTip: {
      type: Type.STRING,
      description: "One memorable, high-value tactical tip for this question",
    },
  },
  required: [
    "overallScore",
    "clarityScore",
    "relevanceScore",
    "starStructureScore",
    "executivePresenceScore",
    "executiveSummary",
    "strengths",
    "areasForImprovement",
    "improvedModelAnswer",
    "coachingTip",
  ],
};

const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    readinessScore: { type: Type.INTEGER, description: "Readiness percentage for the target next role (0-100)" },
    currentLevelSummary: { type: Type.STRING, description: "Summary of candidate's current baseline" },
    targetLevelSummary: { type: Type.STRING, description: "Key requirements and standard for target role" },
    skillsMatrix: {
      type: Type.OBJECT,
      properties: {
        masteredSkills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              evidence: { type: Type.STRING, description: "How CV/courses prove this skill" },
            },
            required: ["name", "evidence"],
          },
        },
        partialSkills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              gap: { type: Type.STRING, description: "What is missing to reach the target tier" },
            },
            required: ["name", "gap"],
          },
        },
        missingCriticalSkills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              importance: { type: Type.STRING, description: "Why this is critical for the target role" },
            },
            required: ["name", "importance"],
          },
        },
      },
      required: ["masteredSkills", "partialSkills", "missingCriticalSkills"],
    },
    recommendedTrainings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Course or training program title" },
          category: { type: Type.STRING, description: "technical, leadership, strategy, or certification" },
          priority: { type: Type.STRING, description: "immediate, secondary, or continuous" },
          providerOrFormat: { type: Type.STRING, description: "e.g., Coursera, AWS, Udacity, Stanford, Hands-on project" },
          estimatedDuration: { type: Type.STRING, description: "e.g., 4-6 weeks (6 hrs/wk)" },
          whyNeeded: { type: Type.STRING, description: "Direct rationale addressing the skill gap" },
          coreModules: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-4 essential learning modules/topics"
          },
          expectedOutcome: { type: Type.STRING, description: "Deliverable, certificate or portfolio milestone" },
        },
        required: [
          "title",
          "category",
          "priority",
          "providerOrFormat",
          "estimatedDuration",
          "whyNeeded",
          "coreModules",
          "expectedOutcome",
        ],
      },
    },
    actionMilestones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING, description: "Phase title" },
          timeframe: { type: Type.STRING, description: "e.g., Month 1, Weeks 1-4" },
          focusObjective: { type: Type.STRING },
          milestones: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Concrete step-by-step actions"
          },
          deliverableProject: { type: Type.STRING, description: "Capstone project or portfolio proof" },
        },
        required: ["phase", "timeframe", "focusObjective", "milestones", "deliverableProject"],
      },
    },
    coachAdvice: { type: Type.STRING, description: "Strategic career encouragement and advice" },
  },
  required: [
    "readinessScore",
    "currentLevelSummary",
    "targetLevelSummary",
    "skillsMatrix",
    "recommendedTrainings",
    "actionMilestones",
    "coachAdvice",
  ],
};

// Route: Generate Interview Questions tailored to interviewer persona
app.post('/api/interview/questions', async (req, res) => {
  try {
    const { interviewerTitle, companyContext, targetRole, jobDescription, language = 'tr' } = req.body;

    if (!interviewerTitle || !targetRole) {
      return res.status(400).json({ error: 'Interviewer title and target role are required.' });
    }

    const isTr = language === 'tr';

    const systemInstruction = isTr
      ? `Sen dünyanın en iyi mülakat koçu ve üst düzey yetenek danışmanısın.
Kullanıcı sana mülakata katılacak kişinin unvanını (${interviewerTitle}) ve adayın hedeflediği pozisyonu (${targetRole}) veriyor.
Görevin: Bu unvandaki bir mülakatçının (örneğin Engineering Director, HR Head, Lead Architect, VP of Product vb.) psikolojisini, önceliklerini, kırmızı çizgilerini ve KPI'larını derinlemesine analiz etmek.
Bu mülakatçının adaya soracağı en kritik 5-7 potansiyel soruyu üret.
Her soru için:
1. Mülakatçının bu soruyu neden sorduğunu (arka plandaki niyet),
2. Neyi değerlendirdiğini (gizli yetkinlik kriterleri),
3. Adayların en sık düştüğü tuzakları / klişeleri,
4. STAR metodu (Durum, Görev, Eylem, Sonuç) ile nasıl cevap verilmesi gerektiğini,
5. Güçlü bir başlangıç cümlesi önerisini (sampleOpening) sun.
Tüm içeriği akıcı, profesyonel Türkçe ile hazırla. Belirlenen JSON şemasına tam uy.`
      : `You are an elite executive interview coach and talent advisory expert.
The candidate provides the title of their interviewer (${interviewerTitle}) and their target role (${targetRole}).
Your task: Deeply analyze the mindset, priorities, red lines, and KPIs of someone with this specific title.
Generate 5-7 high-probability, high-impact interview questions that this specific interviewer title would ask.
For each question:
1. Explain the underlying motive (why this interviewer asks it),
2. Specific evaluation criteria,
3. Pitfalls and clichés candidates often fall into,
4. Actionable STAR (Situation, Task, Action, Result) blueprint guidance,
5. A powerful sample opening line.
Prepare all content in articulate, professional English matching the JSON schema.`;

    const userPrompt = `
Interviewer Title: ${interviewerTitle}
Target Role: ${targetRole}
Company Context / Industry: ${companyContext || 'Not specified'}
Job Description / Additional Notes: ${jobDescription || 'None'}
Language: ${language}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: questionSchema,
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate interview questions' });
  }
});

// Route: Evaluate Candidate Answer in Mock Simulator
app.post('/api/interview/evaluate', async (req, res) => {
  try {
    const { question, interviewerTitle, targetRole, userAnswer, language = 'tr' } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Question and candidate answer are required.' });
    }

    const isTr = language === 'tr';

    const systemInstruction = isTr
      ? `Sen mülakat simülasyonunda adaya anlık koçluk sağlayan üst düzey bir değerlendiricisin.
Aday "${question}" sorusuna bir cevap verdi.
Mülakatı yapan kişi: "${interviewerTitle || 'Mülakatçı'}", Hedef Rol: "${targetRole || 'Hedef Pozisyon'}".
Adayın cevabını şu kriterlere göre acımasızca adil ve yapıcı şekilde puanla (0-100):
- Netlik & İletişim (Clarity)
- Mülakatçı beklentisine ve hedeflenen role uygunluk (Relevance)
- STAR tekniğine uyum (Durum, Görev, Eylem, Somut Sonuç)
- Yönetici Duruşu ve Profesyonellik (Executive Presence)
Ardından adayın güçlü yönlerini, eksik/gelişime açık kısımlarını belirt.
En önemlisi: Aynı soruya adayın vermesi gereken, STAR metodunu harika kullanan ve somut etki/metrikler içeren örnek bir MODEL CEVAP (improvedModelAnswer) ve akılda kalıcı bir altın KOÇLUK İPUCU (coachingTip) sun.
Tüm yanıtı Türkçe ve belirlenen JSON şemasına uygun ver.`
      : `You are an executive interview evaluator providing instant mock simulation coaching.
The candidate answered the question: "${question}".
Interviewer Title: "${interviewerTitle || 'Interviewer'}", Target Role: "${targetRole || 'Target Role'}".
Evaluate the candidate's answer constructively and rigorously across:
- Clarity
- Relevance to the interviewer's mindset & target role
- STAR structure adherence (Situation, Task, Action, Measurable Result)
- Executive presence & credibility
Provide detailed strengths, areas for improvement, a stellar model answer utilizing STAR with concrete impact, and one golden coaching tip.
Return the output in English adhering to the JSON schema.`;

    const userPrompt = `
Interviewer Title: ${interviewerTitle || 'General Interviewer'}
Target Role: ${targetRole || 'Role'}
Interview Question: ${question}
Candidate's Answer:
"""
${userAnswer}
"""
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: evaluationSchema,
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({ error: error?.message || 'Failed to evaluate answer' });
  }
});

// Route: Analyze Skills Gap and Generate Career Learning Roadmap
app.post('/api/career/roadmap', async (req, res) => {
  try {
    const { currentResume, completedCourses, targetNextRole, language = 'tr' } = req.body;

    if (!targetNextRole || (!currentResume && !completedCourses)) {
      return res.status(400).json({ error: 'Target role and CV/course history are required.' });
    }

    const isTr = language === 'tr';

    const systemInstruction = isTr
      ? `Sen küresel seviyede bir kariyer stratejisti ve eğitim gelişim direktörüsün.
Kullanıcı sana:
1. Mevcut CV'sini / iş tecrübelerini,
2. Bugüne kadar katıldığı eğitimleri, kursları, sertifikaları ve içerikleri,
3. Bir sonraki adımda ulaşmak istediği hedef pozisyonu (${targetNextRole}) veriyor.

Görevin:
- Adayın mevcut yetkinlikleri ile hedef pozisyonun gereksinimleri arasındaki "Yetkinlik Açığını (Skill Gap)" derinlemesine analiz etmek.
- Kazanılmış/Kanıtlanmış Yetkinlikler (Mastered), Kısmi/Geliştirilmesi Gerekenler (Partial) ve Eksik Kritik Yetkinlikler (Missing) matrisini oluşturmak.
- Bir sonraki adıma başarıyla geçebilmesi için ALMASI GEREKEN SOMUT EĞİTİMLERİ, online kursları, sertifikasyonları ve uygulamalı proje konularını önceliklendirerek (Acil, İkincil, Sürekli) belirlemek.
- Zaman çizelgeli (Haftalık/Aylık fazlar), somut çıktılı (portföy projeleri, sertifikalar) bir öğrenme ve gelişim yol haritası (Milestone Plan) tasarlamak.
- Genel hazır oluşluk puanı (readinessScore) ve stratejik kariyer tavsiyesi vermek.
Tüm içeriği profesyonel, ilham verici Türkçe ile ve belirlenen JSON şemasına tam uyarak oluştur.`
      : `You are an elite career development strategist and learning director.
The user provides:
1. Their current resume / work experience,
2. Completed trainings, courses, workshops, and certifications,
3. Target next-step role (${targetNextRole}).

Your mission:
- Conduct an in-depth Skills Gap Analysis between their current baseline and the expectations of the target next-step role.
- Map competencies into Mastered, Partial/Emerging, and Missing Critical skills.
- Recommend concrete next-step courses, certifications, specialized programs, and hands-on projects categorized by priority (Immediate, Secondary, Continuous).
- Provide a phased, actionable milestone learning roadmap with tangible portfolio deliverables.
- Estimate an overall readiness score (0-100) and strategic coaching guidance.
Deliver all responses in articulate English adhering strictly to the JSON schema.`;

    const userPrompt = `
Target Next Role: ${targetNextRole}

Candidate CV / Work Experience:
"""
${currentResume || 'Not provided in detail'}
"""

Participated Courses, Content & Certifications:
"""
${completedCourses || 'Not provided in detail'}
"""

Language: ${language}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: roadmapSchema,
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate career roadmap' });
  }
});

// Vite middleware or static file serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerCraft AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
