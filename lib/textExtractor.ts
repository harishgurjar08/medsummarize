/**
 * lib/textExtractor.ts
 * --------------------
 * Server-side text extraction for PDF and image files.
 * Runs inside Next.js API routes — no separate backend needed.
 *
 * PDF  → pdf-parse  (pure JS, no binary deps, works on Vercel)
 * Image → tesseract.js  (pure JS WASM OCR, works on Vercel)
 */

// ── PDF Extraction ────────────────────────────────────────────────────────────

export async function extractFromPdf(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import so it only loads server-side
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer, {
      // Limit pages to avoid timeout on huge files
      max: 20,
    });
    return cleanText(data.text);
  } catch (err) {
    throw new Error(`PDF extraction failed: ${(err as Error).message}`);
  }
}

// ── Image OCR ─────────────────────────────────────────────────────────────────

export async function extractFromImage(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    const Tesseract = await import("tesseract.js");

    // createWorker signature changed in v5 — no path args needed
    const worker = await Tesseract.createWorker("eng", 1, {
      // Silence verbose logging
      logger: () => {},
    });

    // Convert buffer to base64 data URL for Tesseract.js v5
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const { data: { text } } = await worker.recognize(dataUrl);
    await worker.terminate();

    return cleanText(text);
  } catch (err) {
    throw new Error(`OCR extraction failed: ${(err as Error).message}`);
  }
}

// ── Plain text pass-through ───────────────────────────────────────────────────

export function extractFromText(raw: string): string {
  return cleanText(raw);
}

// ── Dispatch by file type ─────────────────────────────────────────────────────

export async function extractText(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const lower = filename.toLowerCase();

  if (lower.endsWith(".pdf") || mimeType === "application/pdf") {
    return extractFromPdf(buffer);
  }

  if (
    lower.match(/\.(jpe?g|png|bmp|tiff?|webp)$/) ||
    mimeType.startsWith("image/")
  ) {
    return extractFromImage(buffer, mimeType);
  }

  // Plain text fallback
  return extractFromText(buffer.toString("utf8"));
}

// ── Text cleaning ─────────────────────────────────────────────────────────────

function cleanText(text: string): string {
  if (!text) return "";

  return text
    // Remove non-printable characters (keep newlines and tabs)
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    // Collapse 3+ blank lines → one blank line
    .replace(/\n{3,}/g, "\n\n")
    // Collapse multiple spaces
    .replace(/ {2,}/g, " ")
    // Trim
    .trim();
}
