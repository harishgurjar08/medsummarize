import Head from "next/head";
import { useState } from "react";
import { Stethoscope, ShieldCheck, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";
import SummaryCard from "@/components/SummaryCard";
import Loader from "@/components/Loader";
import type { SummaryResult } from "@/lib/summarizer";

export default function Home() {
  const [file,    setFile]    = useState<File | null>(null);
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [error,   setError]   = useState("");

  const handleSubmit = async () => {
    setError(""); setSummary(null);

    if (!file && !text.trim()) {
      setError("Please upload a file or paste your report text below.");
      return;
    }

    setLoading(true);
    try {
      let res: Response;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        res = await fetch("/api/summarize", { method:"POST", body: fd });
      } else {
        res = await fetch("/api/summarize", {
          method:  "POST",
          headers: { "Content-Type":"application/json" },
          body:    JSON.stringify({ text }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSummary(data.summary);

      // Scroll to result
      setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior:"smooth" }), 120);

    } catch (e: unknown) {
      setError((e as Error).message || "Failed to process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null); setText(""); setSummary(null); setError("");
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  return (
    <>
      <Head>
        <title>MedSimplify — Understand Your Medical Report</title>
      </Head>

      <div className="grid-bg min-h-screen">
        <Navbar />

        {/* ── Ambient orbs ─────────────────────────────────────────────── */}
        <div className="pointer-events-none fixed top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.06] animate-orb"
          style={{ background:"radial-gradient(circle,#00d68f,transparent)", zIndex:0 }} />
        <div className="pointer-events-none fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.04] animate-orb"
          style={{ background:"radial-gradient(circle,#4da6ff,transparent)", zIndex:0, animationDelay:"-5s" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4">

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <section className="pt-24 pb-14 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-in"
              style={{ background:"var(--green-dim)", border:"1px solid rgba(0,214,143,0.25)", color:"var(--green)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              100% Free · No API Keys · Deploys to Vercel
            </div>

            <h1 className="animate-fade-up mb-5"
              style={{ fontSize:"clamp(2.4rem,6vw,4rem)", fontWeight:800, color:"var(--text-1)", animationDelay:"0.05s" }}>
              Understand Your
              <br />
              <span className="text-grad">Medical Report</span>
            </h1>

            <p className="animate-fade-up max-w-xl mx-auto text-lg mb-10"
              style={{ color:"var(--text-2)", lineHeight:1.7, animationDelay:"0.15s" }}>
              Upload any radiology or medical report — PDF, image, or plain text — and get a
              clear explanation in everyday language that <em>anyone</em> can understand.
            </p>

            <div className="animate-fade-up flex flex-wrap justify-center gap-3 mb-6"
              style={{ animationDelay:"0.25s" }}>
              {[
                { icon:<Stethoscope size={13}/>, text:"Radiology & Lab Reports" },
                { icon:<Zap size={13}/>,         text:"Instant Processing"      },
                { icon:<ShieldCheck size={13}/>, text:"Private — Nothing Stored" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                  style={{ background:"var(--ink-3)", border:"1px solid var(--border)", color:"var(--text-2)" }}>
                  <span style={{ color:"var(--green)" }}>{icon}</span>{text}
                </div>
              ))}
            </div>
          </section>

          {/* ── Upload card ───────────────────────────────────────────────── */}
          <section className="animate-fade-up mb-8" style={{ animationDelay:"0.3s" }}>
            <div className="card p-6 sm:p-8">
              <h2 className="mb-1" style={{ fontFamily:"'Cabinet Grotesk',serif", fontWeight:800, fontSize:"1.3rem", color:"var(--text-1)" }}>
                Upload Your Report
              </h2>
              <p className="text-sm mb-6" style={{ color:"var(--text-3)" }}>
                PDF, JPG, PNG, or plain text — up to 20 MB.
              </p>

              <UploadZone onFile={setFile} file={file} disabled={loading} />

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background:"var(--border)" }} />
                <span className="text-xs" style={{ color:"var(--text-3)" }}>or paste text</span>
                <div className="flex-1 h-px" style={{ background:"var(--border)" }} />
              </div>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={!!file || loading}
                rows={6}
                placeholder="Paste your medical report text here…&#10;&#10;e.g. CHEST X-RAY REPORT&#10;Clinical indication: Cough and fever&#10;Findings: The lungs show patchy consolidation..."
                className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{
                  background: "var(--ink-3)",
                  border:     "1px solid var(--border)",
                  color:      "var(--text-1)",
                  fontFamily: "'Satoshi',sans-serif",
                  lineHeight: 1.6,
                }}
              />

              {error && (
                <div className="mt-4 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                  style={{ background:"rgba(255,92,122,0.08)", border:"1px solid rgba(255,92,122,0.2)", color:"var(--rose)" }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || (!file && !text.trim())}
                className="btn-primary w-full mt-5 py-4 text-base flex items-center justify-center gap-2"
                style={{ fontSize:"1rem" }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75"/>
                    </svg>
                    Processing…
                  </>
                ) : "✦ Simplify My Report"}
              </button>
            </div>
          </section>

          {/* ── Result section ────────────────────────────────────────────── */}
          {(loading || summary) && (
            <section id="result" className="mb-24">
              <div className="card p-6 sm:p-8">
                {loading ? (
                  <Loader />
                ) : summary ? (
                  <>
                    <SummaryCard data={summary} />
                    <button onClick={reset} className="mt-6 text-sm underline underline-offset-4"
                      style={{ color:"var(--text-3)" }}>
                      ← Analyse another report
                    </button>
                  </>
                ) : null}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}
