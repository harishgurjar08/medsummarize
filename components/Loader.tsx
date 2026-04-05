const STEPS = [
  { label: "Reading your file…",              done: true  },
  { label: "Extracting medical text…",        done: true  },
  { label: "AI identifying key findings…",    done: false },
  { label: "Translating to plain English…",   done: false },
];

export default function Loader() {
  return (
    <div className="flex flex-col items-center py-14 gap-7 animate-fade-in">
      {/* Animated rings */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor:"var(--green)", borderRightColor:"var(--green)", animationDuration:"0.85s" }} />
        <div className="absolute inset-2.5 rounded-full border-2 border-transparent animate-spin"
          style={{ borderBottomColor:"var(--blue)", borderLeftColor:"var(--blue)", animationDuration:"1.3s", animationDirection:"reverse" }} />
        <div className="absolute inset-[30%] rounded-full animate-pulse"
          style={{ background:"var(--green)", opacity:0.5 }} />
      </div>

      <div className="text-center">
        <p className="font-semibold text-lg mb-1"
          style={{ fontFamily:"'Cabinet Grotesk',serif", color:"var(--text-1)" }}>
          Analysing your report
        </p>
        <p className="text-sm" style={{ color:"var(--text-3)" }}>
          Extracting text and generating your plain-English summary…
        </p>
      </div>

      <div className="w-full max-w-xs space-y-2.5">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="step-dot flex-shrink-0"
              style={{ animationDelay:`${i * 0.35}s`, background: step.done ? "var(--green)" : "var(--text-3)" }} />
            <span className="text-xs" style={{ color: step.done ? "var(--text-2)" : "var(--text-3)" }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
