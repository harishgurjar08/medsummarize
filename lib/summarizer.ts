/**
 * lib/summarizer.ts
 * -----------------
 * Converts raw medical text into a structured, plain-English summary.
 *
 * Strategy (no paid APIs, no expiry):
 *   1. Use HuggingFace Inference API — FREE tier with facebook/bart-large-cnn
 *      (3,000 requests/month free, no credit card, no expiry on free tier)
 *   2. If HF is unavailable/overloaded → intelligent rule-based fallback
 *      that still produces a high-quality structured output.
 *
 * The HF_TOKEN env var is optional — the free models work without a token
 * (just with lower rate limits). Set it for higher limits.
 */

export interface SummaryResult {
  overview:           string;   // 2-3 sentence plain-English overview
  whatWasFound:       string[]; // key findings in simple language
  whatItMeans:        string[]; // interpretation for the patient
  whatToDoNext:       string[]; // suggested actions
  urgency:            "routine" | "follow-up" | "urgent";
  disclaimer:         string;
}

// ── Main entry point ──────────────────────────────────────────────────────────

export async function summarizeMedicalReport(rawText: string): Promise<SummaryResult> {
  // Truncate to ~2000 words to stay within model limits
  const truncated = truncateToWords(rawText, 2000);

  // Try HuggingFace Inference API (free, no expiry)
  let aiSummary = "";
  try {
    aiSummary = await callHuggingFace(truncated);
  } catch {
    // HF unavailable — use rule-based extraction only
    aiSummary = "";
  }

  // Build structured output using AI summary + rule-based extraction
  return buildStructuredOutput(aiSummary, rawText);
}

// ── HuggingFace Inference API (Free tier) ─────────────────────────────────────

async function callHuggingFace(text: string): Promise<string> {
  const HF_TOKEN = process.env.HF_TOKEN || "";
  const MODEL    = "facebook/bart-large-cnn";
  const API_URL  = `https://api-inference.huggingface.co/models/${MODEL}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (HF_TOKEN) headers["Authorization"] = `Bearer ${HF_TOKEN}`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      inputs: text,
      parameters: {
        max_length:  300,
        min_length:  80,
        do_sample:   false,
      },
    }),
    // 25 second timeout
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HuggingFace API error ${response.status}: ${err}`);
  }

  const result = await response.json();

  // Handle model loading response (HF cold starts)
  if (result.error && result.estimated_time) {
    throw new Error("Model loading, using fallback");
  }

  if (Array.isArray(result) && result[0]?.summary_text) {
    return result[0].summary_text;
  }

  throw new Error("Unexpected HF response shape");
}

// ── Structured output builder ─────────────────────────────────────────────────

function buildStructuredOutput(aiSummary: string, originalText: string): SummaryResult {
  const text = originalText.toLowerCase();

  const findings   = extractFindings(originalText);
  const meanings   = extractMeanings(originalText);
  const actions    = extractActions(originalText);
  const urgency    = detectUrgency(text);

  // Build the overview from AI summary or rule-based extraction
  const overview = aiSummary
    ? humanizeAISummary(aiSummary)
    : buildFallbackOverview(originalText);

  return {
    overview,
    whatWasFound:  findings.length  ? findings  : ["No specific critical findings were automatically detected. Your doctor will explain the full report to you."],
    whatItMeans:   meanings.length  ? meanings  : ["This report contains medical findings that your doctor will review with you.", "Some terms in medical reports can sound scary but may be routine findings."],
    whatToDoNext:  actions.length   ? actions   : ["Schedule a follow-up appointment with your doctor.", "Bring this report and this summary to your next consultation.", "Write down any questions you have before your appointment."],
    urgency,
    disclaimer: "⚠️ This AI summary is meant to help you understand your report in plain English. It is NOT a medical diagnosis. Always consult your doctor for proper medical advice.",
  };
}

// ── Plain-English conversion ──────────────────────────────────────────────────

function humanizeAISummary(summary: string): string {
  // Replace common medical abbreviations with plain English
  return summary
    .replace(/\bCT\b/g, "CT scan (cross-sectional X-ray)")
    .replace(/\bMRI\b/g, "MRI scan (detailed imaging)")
    .replace(/\bCXR\b/g, "chest X-ray")
    .replace(/\bBP\b/g, "blood pressure")
    .replace(/\bHR\b/g, "heart rate")
    .replace(/\bWBC\b/g, "white blood cells (infection fighters)")
    .replace(/\bRBC\b/g, "red blood cells (oxygen carriers)")
    .replace(/\bHgb\b|\bHb\b/g, "hemoglobin (oxygen-carrying protein)")
    .replace(/\bDx\b/g, "diagnosis")
    .replace(/\bRx\b/g, "treatment")
    .replace(/\bHx\b/g, "medical history")
    .replace(/\bSx\b/g, "symptoms")
    .replace(/\bPt\b/g, "patient")
    .replace(/\bFx\b/g, "fracture (broken bone)")
    .replace(/\bca\b|\bCA\b/g, "cancer")
    .replace(/\bSOB\b/g, "shortness of breath")
    .replace(/\bHTN\b/g, "high blood pressure")
    .replace(/\bDM\b/g, "diabetes")
    .replace(/\bCHF\b/g, "heart failure");
}

function buildFallbackOverview(text: string): string {
  // Try to extract an impression or conclusion section
  const impressionMatch = text.match(
    /(?:impression|conclusion|summary|assessment|findings?)[:\s]+([^\n]{40,300})/i
  );
  if (impressionMatch) {
    return `Your medical report has been reviewed. The main finding is: ${impressionMatch[1].trim()}. Please discuss this with your doctor to fully understand what it means for your health.`;
  }

  return "Your medical report has been processed and the key information has been extracted below in plain English. Please review each section and discuss the findings with your healthcare provider.";
}

// ── Medical keyword extractors ────────────────────────────────────────────────

const FINDING_PATTERNS = [
  /(?:impression|finding|result|diagnosis|assessment)[:\s]+([^\n.]{15,200})/gi,
  /(?:there (?:is|are)|shows?|reveals?|demonstrates?|identifies?)\s+([^\n.]{10,180})/gi,
  /(?:no evidence of|no signs? of|normal|abnormal|unremarkable|significant)\s+([^\n.]{5,120})/gi,
  /(?:mass|nodule|lesion|fracture|opacity|effusion|pneumonia|tumor|edema|consolidation|atelectasis|calcification|stenosis|abscess|cyst|polyp|hernia|inflammation)\s*[^\n.]{0,100}/gi,
  /(?:mild|moderate|severe|minimal|extensive)\s+(?:\w+\s+){1,5}(?:noted|seen|observed|identified|present)/gi,
];

function extractFindings(text: string): string[] {
  const found = new Set<string>();

  for (const pattern of FINDING_PATTERNS) {
    const matches = text.matchAll(pattern);
    for (const m of matches) {
      const raw = (m[1] || m[0]).trim();
      if (raw.length > 12 && raw.length < 200) {
        found.add(simplifyMedicalTerm(capitalize(truncate(raw, 160))));
      }
    }
  }

  return [...found].slice(0, 6);
}

const MEANING_MAP: [RegExp, string][] = [
  [/cardiomegaly/i,       "Your heart appears larger than normal. This can happen for several reasons and your doctor will explain what it means for you."],
  [/pneumonia/i,          "There are signs of a lung infection (pneumonia). This is treatable with the right medication."],
  [/atelectasis/i,        "Part of your lung is not fully open (collapsed). This is often temporary and can improve."],
  [/pleural effusion/i,   "There is some fluid around your lungs. Your doctor will decide if this needs treatment."],
  [/fracture/i,           "There is a break or crack in a bone. Your doctor will recommend the right treatment."],
  [/mass|tumor|neoplasm/i,"An abnormal growth was detected. Your doctor needs to determine if it is harmful or harmless."],
  [/calcification/i,      "Calcium deposits were found. These are often harmless but your doctor will review them."],
  [/stenosis/i,           "There is a narrowing in a blood vessel or passage. Your doctor will advise on next steps."],
  [/no acute|unremarkable|within normal/i, "The main findings appear to be within normal range. This is generally good news."],
  [/normal/i,             "Several areas appear normal, which is reassuring."],
];

function extractMeanings(text: string): string[] {
  const meanings: string[] = [];
  for (const [pattern, explanation] of MEANING_MAP) {
    if (pattern.test(text)) {
      meanings.push(explanation);
    }
  }
  return meanings.slice(0, 4);
}

const ACTION_PATTERNS = [
  /(?:recommend(?:ed)?|suggest(?:ed)?|advise(?:d)?|follow.?up|refer(?:ral)?|consult(?:ation)?|biopsy|repeat|additional|further|urgent|clinical correlation)[^.]{5,160}/gi,
  /(?:return in|come back|appointment|next visit|additional imaging|should be)[^.]{5,100}/gi,
];

function extractActions(text: string): string[] {
  const found = new Set<string>();

  for (const pattern of ACTION_PATTERNS) {
    const matches = text.matchAll(pattern);
    for (const m of matches) {
      const raw = m[0].trim();
      if (raw.length > 15 && raw.length < 200) {
        found.add(capitalize(truncate(simplifyMedicalTerm(raw), 160)));
      }
    }
  }

  const result = [...found].slice(0, 5);

  // Always add these two baseline actions
  result.push("Bring a copy of this report and summary to your next doctor's appointment.");
  result.push("Write down any questions you have — no question is too small to ask your doctor.");

  return result;
}

// ── Urgency detection ─────────────────────────────────────────────────────────

function detectUrgency(text: string): "routine" | "follow-up" | "urgent" {
  const urgentKeywords = /urgent|emergent|immediately|acute|critical|stat|emergency|severe|life.threatening|rupture|hemorrhage|stroke|infarct/i;
  const followupKeywords = /follow.?up|recommend|suggest|monitor|repeat|further|additional|consult|refer/i;

  if (urgentKeywords.test(text)) return "urgent";
  if (followupKeywords.test(text)) return "follow-up";
  return "routine";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function simplifyMedicalTerm(text: string): string {
  return text
    .replace(/\bpneumothorax\b/gi,    "air leaking around the lung")
    .replace(/\bhemothorax\b/gi,      "blood around the lung")
    .replace(/\bbilateral\b/gi,       "on both sides")
    .replace(/\bunilateral\b/gi,      "on one side")
    .replace(/\baorta\b/gi,           "main artery (aorta)")
    .replace(/\bmyocardial\b/gi,      "heart muscle")
    .replace(/\bpulmonary\b/gi,       "lung/breathing")
    .replace(/\bhepatic\b/gi,         "liver")
    .replace(/\brenal\b/gi,           "kidney")
    .replace(/\bcervical\b/gi,        "neck/cervical")
    .replace(/\blumbar\b/gi,          "lower back")
    .replace(/\bthoracic\b/gi,        "chest/thoracic")
    .replace(/\bosseous\b/gi,         "bone")
    .replace(/\bsuperficial\b/gi,     "near the surface")
    .replace(/\bbenign\b/gi,          "non-cancerous (benign)")
    .replace(/\bmalignant\b/gi,       "cancerous (malignant)")
    .replace(/\bmetastasis\b/gi,      "spread of cancer")
    .replace(/\bprognosis\b/gi,       "expected outcome")
    .replace(/\bacute\b/gi,           "sudden/recent")
    .replace(/\bchronic\b/gi,         "long-term/ongoing")
    .replace(/\binfiltrate\b/gi,      "fluid/material in the lung")
    .replace(/\bopacity\b/gi,         "shadow/cloudy area");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function truncateToWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ");
}
