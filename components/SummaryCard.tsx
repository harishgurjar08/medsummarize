import { useState } from "react";
import { Copy, Download, CheckCheck, AlertTriangle, Lightbulb, Search, ArrowRight, Clock } from "lucide-react";
import type { SummaryResult } from "@/lib/summarizer";

interface Props { data: SummaryResult; }

const URGENCY_CONFIG = {
  routine:   { label:"Routine — No Immediate Action", color:"var(--green)",  bg:"var(--green-dim)",  icon:"✓" },
  "follow-up": { label:"Follow-Up Recommended",       color:"var(--amber)", bg:"rgba(255,181,71,0.1)", icon:"→" },
  urgent:    { label:"Urgent — See Doctor Soon",       color:"var(--rose)",  bg:"rgba(255,92,122,0.1)", icon:"!" },
};

function Section({ icon, title, color, bg, children }: {
  icon: React.ReactNode; title: string; color: string; bg: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-5 border" style={{ background: bg, borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 mb-3.5">
        <span style={{ color }}>{icon}</span>
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{title}</h3>
      </div>
      <div style={{ color:"var(--text-2)", fontSize:"0.9rem", lineHeight:1.7 }}>{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:"currentColor", opacity:0.5 }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SummaryCard({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const urgCfg = URGENCY_CONFIG[data.urgency];

  const fullText = [
    "MEDICAL REPORT SUMMARY — MedSimplify\n",
    "OVERVIEW:\n" + data.overview,
    "\nWHAT WAS FOUND:\n" + data.whatWasFound.map(x=>`• ${x}`).join("\n"),
    "\nWHAT IT MEANS FOR YOU:\n" + data.whatItMeans.map(x=>`• ${x}`).join("\n"),
    "\nWHAT TO DO NEXT:\n" + data.whatToDoNext.map(x=>`→ ${x}`).join("\n"),
    "\n" + data.disclaimer,
  ].join("\n");

  const copy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    const blob = new Blob([fullText], { type:"text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "medical-report-summary.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-up space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background:"var(--green)" }} />
          <h2 style={{ fontFamily:"'Cabinet Grotesk',serif", fontWeight:800, fontSize:"1.35rem", color:"var(--text-1)" }}>
            Your Plain-English Summary
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
            {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button onClick={download} className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs">
            <Download size={13} />
            Download
          </button>
        </div>
      </div>

      {/* Urgency badge */}
      <div className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: urgCfg.bg, border: `1px solid ${urgCfg.color}30` }}>
        <span className="text-lg">{urgCfg.icon}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: urgCfg.color }}>Status</p>
          <p className="text-sm font-medium" style={{ color:"var(--text-1)" }}>{urgCfg.label}</p>
        </div>
      </div>

      {/* Overview */}
      <Section icon={<Search size={15}/>} title="Overview" color="var(--blue)" bg="rgba(77,166,255,0.06)">
        <p>{data.overview}</p>
      </Section>

      {/* What was found */}
      <Section icon={<AlertTriangle size={15}/>} title="What Was Found" color="var(--amber)" bg="rgba(255,181,71,0.06)">
        <BulletList items={data.whatWasFound} />
      </Section>

      {/* What it means */}
      <Section icon={<Lightbulb size={15}/>} title="What It Means For You" color="var(--green)" bg="var(--green-dim)">
        <BulletList items={data.whatItMeans} />
      </Section>

      {/* What to do next */}
      <Section icon={<ArrowRight size={15}/>} title="What To Do Next" color="#a78bfa" bg="rgba(167,139,250,0.07)">
        <ul className="space-y-2">
          {data.whatToDoNext.map((action, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span style={{ color:"#a78bfa", flexShrink:0, marginTop:"2px" }}>→</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Disclaimer */}
      <div className="rounded-xl p-4 flex gap-3 text-xs"
        style={{ background:"rgba(255,92,122,0.06)", border:"1px solid rgba(255,92,122,0.15)", color:"var(--text-3)" }}>
        <Clock size={14} style={{ color:"var(--rose)", flexShrink:0, marginTop:1 }} />
        <span>{data.disclaimer}</span>
      </div>
    </div>
  );
}
