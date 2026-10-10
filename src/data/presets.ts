import { PresetProfile } from '../types';

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'tech-lead-to-em',
    titleKey: 'preset_tech_lead',
    interviewerTitle: 'VP of Engineering',
    companyContext: 'Hızlı büyüyen B2B SaaS Scale-up (250+ çalışan, Microservices & Cloud-Native)',
    targetRole: 'Engineering Manager (Mühendislik Yöneticisi)',
    jobDescription: '12 kişilik backend ve altyapı ekibine liderlik edecek, sprint teslimatlarını optimize edecek, teknik borç ile ürün yol haritasını dengeleyecek, mühendislerin kariyer gelişimini koçlukla yönetecek.',
    currentResume: `Deneyim:
- 4 Yıl Senior Backend Developer (Go, Kubernetes, PostgreSQL)
- 2 Yıl Tech Lead (5 kişilik ödeme sistemleri ekibinin teknik mimarisi, kod incelemeleri ve mimari kararlar)
- Başarılar: Ödeme gecikmesini %35 azalttı, sistem uptime oranını %99.98'e çıkardı.
- Eksikler: Doğrudan performans değerlendirmesi, bütçe yönetimi ve organizasyonel çatışma çözümü tecrübesi resmi olarak yok.`,
    completedCourses: `Tamamlanan İçerikler & Sertifikalar:
- AWS Certified Solutions Architect Associate (2024)
- Domain-Driven Design (DDD) Uygulamalı Atölyesi (16 saat)
- Modern Concurrency in Go & Distributed Systems (Udemy, 24 saat)
- Temel Agile Scrum Master Eğitimi (2 gün)`,
    targetNextRole: 'Engineering Director / VP of Engineering',
  },
  {
    id: 'pm-to-senior-pm',
    titleKey: 'preset_pm',
    interviewerTitle: 'Chief Product Officer (CPO)',
    companyContext: 'Fintech / Dijital Bankacılık Uygulaması (2M+ aktif kullanıcı)',
    targetRole: 'Senior Product Manager (Kıdemli Ürün Yöneticisi)',
    jobDescription: 'Büyüme (Growth) ve kullanıcı onboarding ekiplerini yönetecek, C-level paydaşlarla KPI hizalanması sağlayacak, veri odaklı A/B test deneyleri kurgulayacak ve ürün vizyonunu şekillendirecek.',
    currentResume: `Deneyim:
- 3 Yıl Mid-Level Product Manager (Mobil B2C App)
- Kullanıcı kazanım dönüşümünü (funnel conversion) %18 artırdı.
- SQL, Amplitude ve Jira ile günlük sprint yönetimi ve kullanıcı araştırmaları yaptı.
- Eksikler: Çok ekipli stratejik vizyon yönetimi, P&L (kâr/zarar) sorumluluğu ve üst yönetim sunumlarında derinleşme ihtiyacı.`,
    completedCourses: `Tamamlanan İçerikler & Sertifikalar:
- Reforge Growth Series (2024, 6 Hafta)
- Advanced Product Metrics & A/B Testing Mastery (Coursera)
- Scrum Product Owner Sertifikası (CSPO)
- UX Araştırma ve Müşteri Görüşmesi Teknikleri Eğitimi`,
    targetNextRole: 'Head of Product / Group PM',
  },
  {
    id: 'analyst-to-ml-eng',
    titleKey: 'preset_data',
    interviewerTitle: 'Head of AI & Data Science',
    companyContext: 'E-ticaret Platformu (Büyük Veri, Öneri Sistemleri ve MLOps)',
    targetRole: 'Senior Machine Learning Engineer',
    jobDescription: 'Gerçek zamanlı öneri algoritmaları ve talep tahminleme modellerini üretim ortamına (production) alacak, MLOps boru hatlarını (Kubeflow, MLflow) kuracak ve model drift izlemesini yönetecek.',
    currentResume: `Deneyim:
- 3 Yıl Senior Data Analyst / Junior Data Scientist (Python, SQL, Tableau)
- Satış tahmin modelleri (XGBoost, Scikit-Learn) geliştirdi, iş birimlerine haftalık içgörüler sundu.
- Eksikler: Dağıtık derin öğrenme mimarileri (PyTorch), Docker/Kubernetes MLOps pipeline deployment tecrübesi ve düşük gecikmeli inferans (low latency inference) sistemleri.`,
    completedCourses: `Tamamlanan İçerikler & Sertifikalar:
- Deep Learning Specialization (Andrew Ng, DeepLearning.AI, 5 Kurs)
- Machine Learning with Python (IBM, Coursera)
- SQL for Data Science (Udacity Nanodegree)`,
    targetNextRole: 'Staff AI Engineer / AI Architect',
  },
];
