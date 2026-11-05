# Vizag Go (వైజాగ్ గో) ⚡

> **A gamified civic radar that crowdsources local hazards to prevent duplicate complaints.**  
> Built for tech-savvy college students and young professionals (18–28) in **Visakhapatnam, Andhra Pradesh, India**.  
> **Team:** `black tigers`

---

## 🌟 What It Does
Citizens and the Greater Visakhapatnam Municipal Corporation (GVMC) waste hours every week on duplicate, unverified complaints because there is no shared, location-based public map of local issues.

**Vizag Go** solves this by providing:
1. **Radar Map:** A real-time, Pokémon Go-style civic radar powered by **Mapbox GL JS v3** with 3D vector styling (`streets-v12`, `dark-v11`, `satellite-streets-v12`), showing live user location, navigation controls, and nearby color-coded issue pins (Roads, Sanitation, Electrical, Water, Public Safety).
2. **AI Camera Viewfinder:** Allows citizens to snap a quick photo and enter short notes (e.g., *"light dead"*). Powered by Google Gemini AI, it automatically classifies the issue, generates a municipal title (*"Streetlight Outage"*), assigns severity (*"Medium"*), and recommends GVMC actions.
3. **Issue Cards with "+1 I see this too":** Instead of submitting redundant Spandana or IVRS complaints, commuters tap a single big upvote button to verify existing hazards, preventing duplicate tickets while elevating priority.
4. **Gamified Civic XP:** Users earn Scout XP for scanning hazards (+25 XP) and upvoting community issues (+10 XP) to rank up from Scout to Civic Vanguard.
5. **Bilingual Support:** Instant 1-click toggle between **English** and **Telugu (తెలుగు)**.

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.8+ (No external pip libraries or `node_modules` required; runs on standard library!)
- Modern web browser (Chrome, Edge, Safari, Firefox on mobile or desktop)

### Running the App
1. Open PowerShell or Terminal in the project directory:
   ```powershell
   cd C:\Users\Ramayya\.gemini\antigravity\scratch\vizag-go
   ```
2. (Optional) Set your Gemini API Key if you wish to run against live Google Cloud Gemini endpoints:
   ```powershell
   $env:GEMINI_API_KEY="your-gemini-api-key"
   ```
   *Note: If no API key is set, the app automatically runs its built-in offline Vision AI classification engine with 100% fidelity.*

3. Start the server:
   ```powershell
   python server.py
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## ☁️ How to Deploy

### 1. Render / Railway / Fly.io / Heroku (Standard Web Service)
- **Start Command:** `python server.py`
- **Environment Variables:**
  - `PORT`: `8080` (or platform default `$PORT`)
  - `GEMINI_API_KEY`: `AIza...`

### 2. Vercel / Netlify
- The `public/` directory can be deployed as static frontend hosting, with the Python `/api/analyze` deployed as a serverless function (`api/analyze.py`).

### 3. Docker Container
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["python", "server.py"]
```

---

## 📊 Pre-Loaded Sample Records (Visakhapatnam Corridors)

1. **Pothole at Rushikonda Road** — `17.833335, 83.332287` | Upvotes: 12 (Sample)
2. **Overflowing garbage** — `17.819620, 83.355207` | Upvotes: 5 (Sample)
3. **Fallen tree on Beach Road** — `17.712, 83.331` | Upvotes: 24 (Sample)
4. **Broken pipe leaking** — `17.827616, 83.329883` | Upvotes: 8 (Sample)
5. **Streetlight out** — `17.839055, 83.333145` | Upvotes: 2 (Sample)
6. **Dead animal on Highway NH16** — `17.761, 83.220` | Upvotes: 1 (Sample)
7. **Blocked drain** — `17.834479, 83.328854` | Upvotes: 15 (Sample)
8. **Missing manhole cover** — `17.833499, 83.325764` | Upvotes: 30 (Sample)
9. **Illegal dumping** — `17.833499, 83.329883` | Upvotes: 4 (Sample)
10. **Broken pedestrian signal** — `17.711, 83.301` | Upvotes: 9 (Sample)

---

## 📋 5-Step Test Checklist

| Step | Action | Expected Result |
|---|---|---|
| **1. Explore Radar Map** | Open `http://localhost:8080`. Tap any pin across Visakhapatnam (NAD Junction, Beach Road, Siripuram). Filter by "Roads", "Electrical", etc. | Map centers smoothly on Vizag, dark cartography renders, pulsing GPS marker appears, and popups show hazard photo, severity, and upvote button. |
| **2. Test Gemini AI Camera** | Switch to **AI Camera** tab or click the floating **⚡ Scan New Hazard** button. Click the *"Streetlight Outage ('light dead')"* preset (or snap/upload your own photo). Click **📸 Capture & Analyze with Gemini**. | Radar scanner animation appears in loading state. Structured JSON result displays Title: *"Streetlight Outage"*, Category: *"Electrical"*, Severity: *"Medium"*, and GVMC action. |
| **3. Pin New Hazard to Radar** | Click **📍 Confirm & Pin to Civic Radar (+25 XP)**. | Toast alert triggers, XP increments from 40 to 65 XP, and the newly scanned hazard is immediately pinned onto the live Visakhapatnam radar map. |
| **4. Upvote & Prevent Duplicate** | Switch to **Issue Cards** tab. Find *"Fallen tree on Beach Road"* (24 upvotes). Click the big **👍 I see this too (+1)** button. | Counter increments instantly to 25, button turns green, verification progress bar updates, and duplicate Spandana ticket prevention counter increments. |
| **5. Test Telugu & Clear Data** | Click **తెలుగు** in top nav. Switch to **About** screen. Review Why It Matters stat cards and click **🗑️ Clear My Data**. | All UI labels switch to Telugu. Clear data confirmation dialog prompts; upon confirm, localStorage resets cleanly to the 10 default sample records. |

---

## 💡 5 Ideas for the Next Version

1. **GVMC Open Civic API / Webhook Integration:** Directly dispatch verified hazards (issues reaching 10+ community upvotes) into GVMC's official backend ticket management system with geo-fenced ward assignment.
2. **Citizen Leaderboards & Neighborhood Patrol Quests:** Weekly civic challenges for college clubs (AU, GITAM, Gayatri) to patrol coastal corridors and earn digital badges sponsored by local CSR partners.
3. **Audio-Guided Hazard Radar for Two-Wheelers:** Bluetooth audio ping alerts (e.g. *"Caution: severe pothole 50 meters ahead on Beach Road"*) to prevent accidents before commuters reach the spot.
4. **Resolution Verification Loop ("Fixed" Photo Proof):** Allow GVMC contractors or citizens to post a "Resolved" photo; nearby commuters verify the fix to close the ticket and claim verification bounty points.
5. **Offline PWA & Mesh Sync:** Offline Progressive Web App with service workers allowing commuters to snap photos in low-connectivity areas; auto-syncs when reconnecting to Wi-Fi.

---
*Built with ❤️ for Visakhapatnam by Team **black tigers**.*
