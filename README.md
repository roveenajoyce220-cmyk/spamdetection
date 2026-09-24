# TRUTHLENS AI
### AI-Powered Global News Spam & Credibility Detection Platform

> *"Know the Truth Before You Share" • "AI-Powered Global News Verification"*

---

## 📌 1. Project Overview

**TruthLens AI** is an enterprise-grade, intelligence-driven news verification platform designed to evaluate articles, headlines, and external URLs from around the globe. Rather than reducing veracity to a simplistic binary ("TRUE" or "FAKE"), TruthLens AI implements a 14-signal explainable heuristic and neural ensemble pipeline to determine:

1. **NOT SPAM / CREDIBLE** (High factual consistency, neutral tone, accredited source)
2. **SUSPICIOUS / NEEDS VERIFICATION** (Unverified claims, sensational undertones, missing bylines)
3. **SPAM / FALSE / MISLEADING** (Clickbait tropes, emotional manipulation, fabricated citations, flagged domains)

---

## 🏗️ 2. System Architecture

```
                                  [ User Input ]
                   (Article Text, Headline, URL, or File Upload)
                                        │
                                        ▼
                             [ REST API (FastAPI) ]
                                        │
                     ┌──────────────────┴──────────────────┐
                     ▼                                     ▼
         [ Web Scraper & Parser ]                [ User & Auth Service ]
       (Semantic HTML & Metadata)                    (JWT & Argon2/Bcrypt)
                     │
                     ▼
          [ AI Detection Pipeline ]
        ┌─────────────────────────────────────────────────────────┐
        │ 1. Text Preprocessing & Tokenization                    │
        │ 2. Language & Topic Categorization                      │
        │ 3. 14-Point Linguistic & Structural Signal Extraction   │
        │ 4. Claim Extraction & Corroborating Evidence Matching   │
        │ 5. Publisher & Source Intelligence Metering             │
        │ 6. Multi-Factor Credibility Scoring Engine              │
        │ 7. Explainable AI Reason & Concern Synthesizer          │
        └─────────────────────────────────────────────────────────┘
                     │
                     ▼
         [ Structured JSON Assessment ]
         (Verdict, Score, Confidence, Claims, Signals, Metadata)
                     │
                     ▼
         [ Modern Frontend UI (React 19 + TypeScript + Tailwind) ]
         (Interactive Circular Gauge, Claim Cards, Signal Grids, Maps)
```

---

## 🚀 3. Features & Pages

| Page / Route | Description |
| :--- | :--- |
| **Landing Page** (`/`) | Hero with interactive world visualization, live sample modal, feature overview, and workflow walkthrough. |
| **News Analyzer** (`/analyzer`) | Dedicated input terminal for full text, headline, or live URL ingestion with real-time character counters and pre-filled samples. |
| **Analysis Result** (`/result/:id`) | Circular credibility score gauge, AI confidence, risk level, explainable reasons & concerns, claim corroboration, and signal audit grid. |
| **Global News Dashboard** (`/dashboard`) | Telemetry overview with Recharts analytics, credibility distribution, time-series volume, and live intelligence feed. |
| **Global Trends** (`/trends`) | Interactive world intelligence map, country credibility indices, topic distribution, and trending unverified claims. |
| **Source Explorer** (`/sources`) | Searchable directory of international publishers with trust tier filters, domain age, HTTPS compliance, and spam ratios. |
| **How It Works / About** (`/about`) | Deep dive into the 8-stage AI detection pipeline, methodology, limitations, and ethical guidelines. |
| **Authentication** (`/login`, `/register`) | Secure JWT-based registration and login with session persistence. |
| **User Profile** (`/profile`) | Analyst credentials, API key generator, role badges, and activity telemetry. |
| **Settings** (`/settings`) | Detection sensitivity sliders, alert notifications, theme presets, and security preferences. |

---

## ⚡ 4. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Dark Theme Glassmorphism Design System
- **Icons**: Lucide React
- **Motion & Visuals**: Framer Motion & Canvas Confetti
- **Analytics & Data Visualizations**: Recharts
- **Routing**: React Router DOM v7

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Database ORM**: SQLAlchemy 2.0 (SQLite for local development / PostgreSQL ready)
- **Validation**: Pydantic v2
- **Security**: JWT (`python-jose`) + Password Hashing (`bcrypt` / `passlib`)
- **Scraping & Parsing**: `BeautifulSoup4` + `httpx` / `urllib`
- **Machine Learning**: Modular Heuristic-Neural Ensemble Service

---

## 🛠️ 5. Quick Start & Setup

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The database and initial seed data (publishers, demo analyses, demo analyst accounts) will initialize automatically on first run.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## 🔑 6. Demo Accounts

For rapid testing and grading:
- **Analyst Account**:
  - Email: `analyst@truthlens.ai`
  - Password: `truthlens2026`
- **Standard User**:
  - Email: `demo@truthlens.ai`
  - Password: `demo1234`
- *Or register any new account instantly through the UI!*

---

## 🛡️ 7. UX & Ethics Principle

TruthLens AI adheres to strict fact-checking ethics:
1. **Explainable AI**: Every score is accompanied by itemized reasons, potential concerns, and signal breakdowns.
2. **Non-Partisan**: The model evaluates linguistic structure, source attribution, and evidence consistency without editorial political bias.
3. **Probabilistic Assessment**: Clearly states AI confidence and emphasizes that outputs represent algorithmic assessments rather than infallible proclamations.
