import Head from "next/head";
import { Github, Linkedin, Code2, Database, Brain, Globe, Cpu } from "lucide-react";
import Navbar from "@/components/Navbar";

const SKILLS = [
  { icon: <Brain size={14}/>,    label: "Machine Learning & NLP"   },
  { icon: <Database size={14}/>, label: "Data Engineering"          },
  { icon: <Code2 size={14}/>,    label: "Python & FastAPI"          },
  { icon: <Globe size={14}/>,    label: "Full-Stack Development"    },
  { icon: <Cpu size={14}/>,      label: "AI Model Deployment"       },
];

const PROJECTS = [
  {
    title: "MedSimplify — Medical Report Summarizer",
    desc:  "Single-stack web app that converts complex radiology and medical reports into plain-English summaries using open-source AI, OCR, and PDF parsing. Deploys entirely on Vercel with no separate backend.",
    tech:  ["Next.js 15", "HuggingFace BART", "Tesseract.js", "pdf-parse", "TypeScript"],
    color: "var(--green)",
  },
  {
    title: "NLP Text Classification Pipeline",
    desc:  "End-to-end multi-class text classification pipeline using transformer-based models with custom fine-tuning, data augmentation, and automated model evaluation.",
    tech:  ["PyTorch", "Transformers", "scikit-learn", "MLflow"],
    color: "var(--blue)",
  },
  {
    title: "Data Analytics Dashboard",
    desc:  "Interactive analytics dashboard for visualising large datasets with real-time filtering, drill-down views, and one-click export. Built for non-technical stakeholders.",
    tech:  ["Python", "Pandas", "React", "Recharts", "FastAPI"],
    color: "var(--amber)",
  },
];

export default function About() {
  return (
    <>
      <Head><title>About Developer — MedSimplify</title></Head>
      <div className="grid-bg min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">

          {/* ── Profile card ────────────────────────────────────────────── */}
          <div className="card p-8 sm:p-10 mb-8 animate-fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,rgba(0,214,143,0.2),rgba(77,166,255,0.15))",
                  border: "1px solid rgba(0,214,143,0.3)",
                  color: "var(--green)",
                  fontFamily: "'Cabinet Grotesk',serif",
                }}>
                HS
              </div>
              <div>
                <h1 style={{ fontFamily:"'Cabinet Grotesk',serif", fontWeight:800, fontSize:"clamp(2rem,5vw,3rem)", color:"var(--text-1)", lineHeight:1.1 }}>
                  Harish Singh
                </h1>
                <p className="mt-1 font-semibold" style={{ color:"var(--green)", fontSize:"1rem" }}>
                  AI &amp; Data Science Engineer
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-3 text-sm leading-relaxed mb-8" style={{ color:"var(--text-2)" }}>
              <p>
                A passionate AI and Data Science Engineer with hands-on experience designing and deploying
                intelligent systems that tackle real-world problems. Specialising in natural language
                processing, end-to-end machine learning pipelines, and full-stack AI applications built
                entirely with open-source tools.
              </p>
              <p>
                Driven by the belief that advanced AI should be accessible to everyone — building tools
                that bridge the gap between complex technology and everyday users, particularly in
                high-impact domains like healthcare, where a plain-language explanation can genuinely
                change a patient's experience.
              </p>
              <p>
                Open-source advocate and continuous learner, constantly exploring the latest advances in
                large language models, transformer architectures, and data engineering to create reliable,
                production-ready AI products with zero proprietary dependencies.
              </p>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {SKILLS.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background:"var(--ink-3)", border:"1px solid var(--border)", color:"var(--text-2)" }}>
                  <span style={{ color:"var(--green)" }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-3">
              <a href="https://linkedin.com/in/harishgurjar11" target="_blank" rel="noopener noreferrer"
                className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm"
                style={{ color:"var(--blue)", borderColor:"rgba(77,166,255,0.25)", background:"rgba(77,166,255,0.07)" }}>
                <Linkedin size={15}/> LinkedIn
              </a>
              <a href="https://github.com/harishgurjar08" target="_blank" rel="noopener noreferrer"
                className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm">
                <Github size={15}/> GitHub
              </a>
            </div>
          </div>

          {/* ── Featured projects ────────────────────────────────────────── */}
          <div className="animate-fade-up" style={{ animationDelay:"0.15s" }}>
            <h2 className="mb-6" style={{ fontFamily:"'Cabinet Grotesk',serif", fontWeight:800, fontSize:"1.8rem", color:"var(--text-1)" }}>
              Featured Projects
            </h2>
            <div className="space-y-4">
              {PROJECTS.map((p, i) => (
                <div key={i} className="card card-hover p-5 animate-fade-up" style={{ animationDelay:`${0.2+i*0.1}s` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background:p.color }} />
                    <div>
                      <h3 className="font-bold text-base mb-1.5" style={{ color:"var(--text-1)" }}>{p.title}</h3>
                      <p className="text-sm mb-3 leading-relaxed" style={{ color:"var(--text-2)" }}>{p.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tech.map(t => <span key={t} className="tag" style={{ fontSize:"11px" }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── About this project ───────────────────────────────────────── */}
          <div className="mt-8 rounded-2xl p-6 border animate-fade-up" style={{
            background: "rgba(0,214,143,0.05)",
            border: "1px solid rgba(0,214,143,0.18)",
            animationDelay: "0.45s",
          }}>
            <h2 className="mb-3" style={{ fontFamily:"'Cabinet Grotesk',serif", fontWeight:800, fontSize:"1.25rem", color:"var(--text-1)" }}>
              Why I Built This
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color:"var(--text-2)" }}>
              After seeing how confused and anxious people get when handed a medical report full of
              jargon they don't understand, I wanted to build something that helps. MedSimplify is
              a single Next.js application — no separate backend, no paid API keys, no subscriptions
              that expire — just upload your report and get a plain-English explanation instantly.
              Everything runs on Vercel's free tier and uses only open-source models.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Next.js 15", "HuggingFace", "BART Model", "Tesseract.js", "pdf-parse", "Vercel", "TypeScript", "Tailwind CSS"].map(t => (
                <span key={t} className="tag" style={{ fontSize:"11px" }}>{t}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
