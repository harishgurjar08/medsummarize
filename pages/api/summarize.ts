/**
 * pages/api/summarize.ts
 * ----------------------
 * Single API route that:
 *   1. Receives multipart form data (file) or JSON (text)
 *   2. Extracts text using pdf-parse or tesseract.js
 *   3. Summarizes using HuggingFace + rule-based pipeline
 *   4. Returns structured JSON
 *
 * Runs as a Next.js serverless function — deploys to Vercel with zero config.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { extractText } from "@/lib/textExtractor";
import { summarizeMedicalReport } from "@/lib/summarizer";

// Disable Next.js built-in body parser so we can handle multipart manually
export const config = {
  api: {
    bodyParser: false,
    // Give AI processing up to 60s on Vercel Pro / 10s on Hobby
    responseLimit: "10mb",
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let rawText = "";
    const contentType = req.headers["content-type"] || "";

    if (contentType.includes("multipart/form-data")) {
      // ── File upload ────────────────────────────────────────────────────────
      const { parseFormData } = await import("@/lib/formParser");
      const { fields, files } = await parseFormData(req);

      if (files.file) {
        const file = files.file;
        const buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
        rawText = await extractText(buffer, file.filename || "file", file.mimetype || "");
      } else if (fields.text) {
        rawText = String(fields.text);
      }
    } else {
      // ── JSON text input ────────────────────────────────────────────────────
      const body = await readBody(req);
      const parsed = JSON.parse(body);
      rawText = parsed.text || "";
    }

    // Validate
    if (!rawText || rawText.trim().length < 20) {
      return res.status(422).json({
        error: "Could not extract enough text from your input. Please ensure the file contains readable text or paste the report directly.",
      });
    }

    // Run summarization pipeline
    const summary = await summarizeMedicalReport(rawText.trim());

    return res.status(200).json({
      success: true,
      charCount: rawText.length,
      summary,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/summarize] Error:", message);
    return res.status(500).json({ error: `Processing failed: ${message}` });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end",  () => resolve(body));
    req.on("error", reject);
  });
}
