import Head from "next/head";
import { Upload, ScanLine, BrainCircuit, FileCheck2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const STEPS = [
  {
    num: "01", icon: <Upload size={22}/>,
    title: "You Upload Your Report",
    color: "var(--blue)", bg: "rgba(77,166,255,0.08)", border: "rgba(77,166,255,0.2)",
    body: "Start by uploading your medical or radiology report. You can drag and drop a PDF file, a scanned image (JPG or PNG), or simply paste the text directly. Your file is processed instantly and never stored anywhere — everything stays private.",
    tools: [],
  },
  {
    num: "02", icon: <ScanLine size={22}/>,
    title: "Text Is Extracted Automatically",
    color: "var(--amber)", bg: "rgba(255,181,71,0.08)", border: "rgba(255,181,71,0.2)",
    body: "If you uploaded a PDF, a tool called pdf-parse reads every page and pulls out all the words — just like copying text from a document. If you uploaded a photo or scanned image, a technology called Tesseract OCR 'reads' the image the same way your eyes would, recognising each letter and word.",
    tools: ["pdf-parse (PDF reading)", "Tesseract.js (image-to-text)"],
  },
  {
    num: "03", icon: <BrainCircuit size={22}/>,
    title: "AI Reads and Understands It",
    color: "var(--green)", bg: "var(--green-dim)", border: "rgba(0,214,143,0.2)",
    body: "The extracted text is sent to an open-source AI model (BART by Facebook, running via HuggingFace's free tier). This AI has been trained on millions of documents and understands medical language. It reads your report, picks out the important parts, and rewrites them in simple everyday language.",
    tools: ["HuggingFace Inference API (free tier)", "facebook/bart-large-cnn model", "Rule-based keyword analysis"],
  },
  {
    num: "04", icon: <FileCheck2 size={22}/>,
    title: "You Get a Clear, Simple Summary",
    color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)",
    body: "The result is organised into four easy sections: an Overview (the big picture in 2–3 sentences), What Was Found (the actual findings in plain words), What It Means For You (what those findings usually indicate), and What To Do Next (practical next steps). You can copy or download the summary to take to your doctor.",
    tools: [],
  },
];

const TOOLS = [
  { e:"🔍", name:"Tesseract.js", what:"OCR — Optical Character Recognition. It reads images and photos the same way a human would, recognising text from scanned or photographed documents." },
  { e:"📄", name:"pdf-parse",   what:"A JavaScript library that opens PDF files and extracts all the text from them, preserving paragraphs and structure." },
  { e:"🤖", name:"BART (AI model)", what:"An open-source AI developed by Facebook, trained to understand and summarise long pieces of text. We use it through HuggingFace's free public API — no subscription needed." },
  { e:"⚡", name:"Next.js API Routes", what:"The backend of this app runs entirely inside Next.js serverless functions. No separate server to manage — it all deploys as one project on Vercel." },
  { e:"🌐", name:"Vercel", what:"The platform that hosts this app for free. You push your code to GitHub and it goes live instantly, with automatic updates on every change." },
  { e:"🎨", name:"React + Tailwind CSS", what:"The tools used to build this website's interface — fast, modern, and responsive on all screen sizes." },
];

export default function HowItWorks() {
  return (
    <>
      <Head><title>How It Works — MedSimplify</title></Head>
      <div className="grid-bg min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">

          <div className="text-center mb-16 animate-fade-up">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background:"rgba(77,166,255,0.1)", border:"1px solid rgba(77,166,255,0.25)", color:"var(--blue)" }}>
              Simple Explanation — No Tech Knowledge Needed
            </span>
            <h1 style={{ fontSize:"clamp(2rem,5vw,3rem)", fontWeight:800, color:"var(--text-1)", marginBottom:"1rem" }}>
              How It Works
            </h1>
            <p style={{ color:"var(--text-2)", fontSize:"1.1rem", maxWidth:"520px", margin:"0 auto" }}>
              Four simple steps — from uploading your report to reading a plain-English explanation.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-5 mb-20">
            {STEPS.map((s, i) => (
              <div key={i} className="rounded-2xl p-6 sm:p-8 border animate-fade-up"
                style={{ background:s.bg, border:`1px solid ${s.border}`, animationDelay:`${0.1+i*0.1}s` }}>
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background:s.border, color:s.color }}>{s.icon}</div>
                    <span className="text-xs font-bold" style={{ color:s.color, fontFamily:"'JetBrains Mono',monospace" }}>{s.num}</span>
                  </div>
                  <div>
                    <h2 className="mb-2" style={{ fontFamily:"'Cabinet Grotesk',serif", fontWeight:800, fontSize:"1.2rem", color:"var(--text-1)" }}>
                      {s.title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-3" style={{ color:"var(--text-2)" }}>{s.body}</p>
                    {s.tools.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {s.tools.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tools */}
          <div className="animate-fade-up" style={{ animationDelay:"0.5s" }}>
            <h2 className="text-center mb-2" style={{ fontFamily:"'Cabinet Grotesk',serif", fontWeight:800, fontSize:"1.8rem", color:"var(--text-1)" }}>
              Tools Used (Plain English)
            </h2>
            <p className="text-center text-sm mb-10" style={{ color:"var(--text-3)" }}>
              Every single tool is free, open-source, and never expires.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOLS.map((t, i) => (
                <div key={i} className="card card-hover p-5 animate-fade-up" style={{ animationDelay:`${0.55+i*0.07}s` }}>
                  <div className="text-2xl mb-3">{t.e}</div>
                  <h3 className="font-bold text-sm mb-1.5" style={{ color:"var(--text-1)" }}>{t.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color:"var(--text-3)" }}>{t.what}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center animate-fade-up" style={{ animationDelay:"0.8s" }}>
            <a href="/" className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm">
              ✦ Try It Now →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
