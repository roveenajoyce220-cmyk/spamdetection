# 🚀 TruthLens AI Deployment Guide (Vercel + Render / Railway)

This guide walks you through deploying **TruthLens AI** with the **Frontend on Vercel** and the **Backend API on Render or Railway** (100% Free Tier compatible).

---

## 📦 Architecture Overview

```
 [ User Browser ] 
        │
        ├──► Vercel (React + Vite Frontend) 
        │         │ (API Calls via VITE_API_URL)
        │         ▼
        └──► Render / Railway (FastAPI Backend + SQLite / PostgreSQL)
```

---

## 🛠️ Step 1: Push Code to GitHub

Make sure your project is committed and pushed to GitHub:

```bash
git add .
git commit -m "Configure deployment for Vercel and Render"
git push origin main
```

---

## 🌐 Step 2: Deploy the Backend (Render or Railway)

### Option A: Deploy on Render (Recommended)

1. Go to **[Render Dashboard](https://dashboard.render.com/)** and sign in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the settings:
   - **Name:** `truthlens-api` (or your choice)
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** `Free`
5. Under **Environment Variables**, add:
   - `SECRET_KEY`: *(Generate any random string, e.g. `truthlens_secret_key_prod_2026`)*
   - `PYTHON_VERSION`: `3.12.0`
6. Click **Deploy Web Service**.
7. Once deployed, copy your Render URL (e.g. `https://truthlens-api.onrender.com`).

---

### Option B: Deploy on Railway

1. Go to **[Railway.app](https://railway.app/)** and create a project.
2. Click **Deploy from GitHub repo**.
3. Select your repository.
4. Under service settings:
   - **Root Directory:** `/backend`
   - Railway will automatically detect the [`Dockerfile`](file:///C:/Users/dines/spam%20detection/backend/Dockerfile) or [`requirements.txt`](file:///C:/Users/dines/spam%20detection/backend/requirements.txt).
5. Add a domain under **Networking** to get your public API URL.

---

## ⚡ Step 3: Deploy the Frontend (Vercel)

1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)** and log in.
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the project configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and choose `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Expand **Environment Variables** and add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-service.onrender.com/api`  *(Your backend URL + `/api`)*
6. Click **Deploy**.

---

## ✅ Step 4: Verification

Once both are deployed:
1. Open your Vercel URL (e.g. `https://truthlens-ai.vercel.app`).
2. Run a news credibility analysis, check the live dashboard, explore sources, or log in with the pre-seeded credentials:
   - **Analyst:** `analyst@truthlens.ai` / `truthlens2026`
   - **Standard User:** `demo@truthlens.ai` / `demo1234`
3. Click the **API Docs** button in the header to view your live interactive Swagger UI on Render!
