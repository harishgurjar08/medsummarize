import { useCallback, useState, useRef } from "react";
import { Upload, FileText, Image, File, X, CheckCircle2 } from "lucide-react";

interface Props {
  onFile:   (f: File | null) => void;
  file:     File | null;
  disabled: boolean;
}

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.txt";

function fmt(bytes: number) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024*1024)   return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1048576).toFixed(1)} MB`;
}

function FileIcon({ type }: { type: string }) {
  if (type.includes("pdf"))   return <FileText size={24} style={{ color:"var(--rose)" }} />;
  if (type.includes("image")) return <Image    size={24} style={{ color:"var(--blue)" }} />;
  return <File size={24} style={{ color:"var(--green)" }} />;
}

export default function UploadZone({ onFile, file, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (f: File): boolean => {
    setError("");
    const ok = /\.(pdf|jpe?g|png|txt)$/i.test(f.name);
    const size = f.size < 20 * 1024 * 1024;
    if (!ok)   { setError("Unsupported file type. Please upload PDF, JPG, PNG, or TXT."); return false; }
    if (!size) { setError("File too large. Maximum 20 MB."); return false; }
    return true;
  };

  const pick = useCallback((f: File) => {
    if (validate(f)) onFile(f);
  }, [onFile]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) pick(f);
  };

  if (file) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl border"
        style={{ background:"var(--ink-3)", borderColor:"var(--border-2)" }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background:"var(--ink-4)" }}>
          <FileIcon type={file.type} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color:"var(--text-1)" }}>{file.name}</p>
          <p className="text-xs mt-0.5" style={{ color:"var(--text-3)" }}>{fmt(file.size)} · {file.type || "text/plain"}</p>
        </div>
        <CheckCircle2 size={18} style={{ color:"var(--green)", flexShrink:0 }} />
        {!disabled && (
          <button onClick={() => { onFile(null); setError(""); }}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color:"var(--text-3)" }}>
            <X size={15} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        className={`dropzone p-10 text-center select-none ${dragging ? "dropzone-active" : ""} ${disabled ? "opacity-40 pointer-events-none" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept={ACCEPT} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); }} />

        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: dragging ? "var(--green-dim)" : "var(--ink-3)",
            border: `1px solid ${dragging ? "var(--green)" : "var(--border)"}`,
            transition: "all 0.25s",
          }}>
          <Upload size={26} style={{ color: dragging ? "var(--green)" : "var(--text-2)", transition:"color 0.2s" }} />
        </div>

        <p className="font-semibold mb-1.5" style={{ color:"var(--text-1)", fontFamily:"'Cabinet Grotesk',serif", fontSize:"1.05rem" }}>
          {dragging ? "Drop it here!" : "Drag & drop your medical report"}
        </p>
        <p className="text-sm mb-5" style={{ color:"var(--text-3)" }}>
          or <span style={{ color:"var(--green)" }}>click to browse files</span>
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {["PDF", "JPG / PNG", "TXT"].map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
          <span className="tag">Max 20 MB</span>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm" style={{ color:"var(--rose)" }}>⚠️ {error}</p>
      )}
    </div>
  );
}
