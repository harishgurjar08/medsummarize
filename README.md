# 🏥 MedSimplify — AI Medical Report Summarizer

> **One project. One command. Deploy to Vercel for free.**
> Upload any medical or radiology report → get a plain-English summary anyone can understand.

---

## ✨ What Makes This Different

| Feature | Detail |
|---|---|
| **Single project** | No separate frontend + backend. One Next.js app handles everything. |
| **Deploys to Vercel** | Push to GitHub → live in 2 minutes. Zero server management. |
| **No paid APIs** | Uses HuggingFace free tier (3,000 req/month, no credit card). Falls back gracefully if unavailable. |
| **No expiry** | Free HuggingFace token never expires. The app keeps working forever. |
| **True privacy** | Files processed in memory. Nothing stored. Nothing sent to third parties. |
| **Plain English output** | 4 structured sections written for patients, not doctors. |

---

## 🗂️ Project Structure

```
medsummarize/
├── pages/
│   ├── _app.tsx              # Root app wrapper
│   ├── _document.tsx         # HTML document with meta tags
│   ├── index.tsx             # Home page (hero + upload + result)
│   ├── how-it-works.tsx      # Step-by-step explanation page
│   ├── about.tsx             # About Developer page
│   └── api/
│       └── summarize.ts      # Single API route — handles all processing
├── components/
│   ├── Navbar.tsx            # Sticky top navigation
│   ├── UploadZone.tsx        # Drag-and-drop file uploader
│   ├── SummaryCard.tsx       # Structured 4-section result display
│   └── Loader.tsx            # Animated processing indicator
├── lib/
│   ├── textExtractor.ts      # PDF (pdf-parse) + Image OCR (Tesseract.js)
│   ├── summarizer.ts         # HuggingFace BART + rule-based pipeline
│   └── formParser.ts         # Multipart form data parser (uses busboy)
├── styles/
│   └── globals.css           # Design tokens + animations
├── public/
│   └── favicon.svg
├── vercel.json               # Vercel deployment config (60s timeout)
├── .env.local.example        # Environment variable template
└── package.json
```

---

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1 — Get a free HuggingFace token (2 min)

1. Go to [huggingface.co](https://huggingface.co) → Sign up (free, no credit card)
2. Go to Settings → Access Tokens → New Token
3. Name: `medsummarize`, Role: **Read**
4. Copy the token (starts with `hf_...`)

> **Note:** The app works without a token too, just with lower rate limits.

### Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/medsummarize.git
git push -u origin main
```

### Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Under **Environment Variables**, add:
   ```
   HF_TOKEN = hf_your_token_here
   ```
5. Click **Deploy** ✓

Your app is live at `https://medsummarize.vercel.app` (or your custom domain).

---

## 💻 Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local and add your HF_TOKEN

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🤖 How the AI Works

The summarization pipeline has two layers:

### Layer 1 — HuggingFace Inference API (Free)
- Model: `facebook/bart-large-cnn`
- Produces a fluid, readable summary of the report
- **Free tier:** 3,000 requests/month with a free token
- **Never expires** — HuggingFace's free tier is permanent

### Layer 2 — Rule-Based Extraction (Always Available)
Runs in parallel regardless of HF availability:
- **Findings extractor** — matches 15+ medical finding patterns
- **Meaning translator** — maps 12+ medical terms to plain explanations
- **Action extractor** — pulls recommended actions from report text
- **Urgency detector** — classifies as routine / follow-up / urgent
- **Medical term simplifier** — replaces 25+ jargon terms with plain English

If HuggingFace is slow or unavailable, Layer 2 still produces a complete, high-quality structured output.

---

## 📤 Output Structure

```json
{
  "overview":      "Plain-English 2-3 sentence overview of the report",
  "whatWasFound":  ["Finding 1 in simple language", "Finding 2..."],
  "whatItMeans":   ["What finding 1 means for the patient", "..."],
  "whatToDoNext":  ["Practical next step 1", "..."],
  "urgency":       "routine | follow-up | urgent",
  "disclaimer":    "Standard medical disclaimer"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 | Pages + API routes in one project |
| Language | TypeScript 5.7 | Type-safe throughout |
| Styling | Tailwind CSS 3.4 | Utility-first responsive design |
| PDF | pdf-parse 1.1.1 | Extract text from PDF files |
| OCR | Tesseract.js 5.1.1 | Read text from images |
| AI | HuggingFace BART | Summarise medical text |
| Deploy | Vercel | Free hosting + serverless functions |

---

## ⚠️ Disclaimer

MedSimplify is for **educational and informational purposes only**. It is not a medical device and does not provide medical diagnoses. Always consult a licensed healthcare professional for medical advice.

---

## 👨‍💻 Developer

**Harish Singh** — AI & Data Science Engineer
[LinkedIn](https://linkedin.com/in/harish-singh) · [GitHub](https://github.com/harish-singh)
