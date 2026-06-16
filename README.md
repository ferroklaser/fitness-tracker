# 🏋️‍♂️ FitInsight AI

> **Turn raw gym logs into a personalized fitness narrative.** FitInsight AI bridges the gap between simple data collection and intelligent, coach-like analysis, eliminating data fatigue and manual spreadsheet parsing.

[![React Native](https://img.shields.io/badge/Frontend-React%20Native%20%2F%20Expo-61DAFB?logo=react)](https://reactnative.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/AI%20Engine-Google%20Gemini-4285F4?logo=googlegemini)](https://ai.google.dev/)

---

## 💡 Inspiration

The concept for FitInsight AI was born out of a common frustration shared by fitness enthusiasts and beginners alike: **data fatigue**. While tracking workouts via notebook apps or traditional logging software is easy, deriving actionable meaning from hundreds of rows of historical data is not. Many users find themselves consistently logging sets, reps, and weights without actually knowing if they are applying progressive overload or if their training behavior aligns with their long-term goals.

FitInsight AI was inspired by the desire to bridge the gap between simple data collection and intelligent, coach-like analysis—making personalised fitness insights accessible to everyone without the need for manual spreadsheet parsing.

---

## ✨ Key Features

* **Effortless Workout Logging:** A fully responsive web interface optimised for smooth data entry using pre-saved templates or custom routines.
* **AI-Powered Insights:** Leverages the Google Gemini API to analyse historical data alongside the user's personal profile.
* **Plateau & Pattern Detection:** Automatically flags training plateaus, identifies behavioral patterns, and generates highly contextual, goal-aware progress summaries that tell the user exactly why they are or aren't hitting their targets.
* **Adaptive UI:** A data-dense dashboard on desktop that effortlessly folds down into an intuitive, lightweight tracker on mobile web browsers.

---

## 🛠️ Tech Stack & Architecture

FitInsight AI utilises a decoupled, modern stack designed for speed, type safety, and scalability.

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React Native, JavaScript, Expo | Multi-platform, highly responsive web experience |
| **Backend** | FastAPI (Python) | High-performance orchestration server, handles business logic and pre-processes metrics |
| **Database & Auth** | Supabase | Secure user authentication and relational time-series fitness records (users, routines, logs, exercises) |
| **AI Engine** | Google Gemini API | Evaluates historical data alongside profile goals to generate structured narrative context |

### Data-to-Insight Pipeline
1. **Log:** User inputs workout data effortlessly via the responsive React Native frontend.
2. **Store:** Data is securely piped and stored as relational time-series records in Supabase.
3. **Process:** The FastAPI backend aggregates historical metrics, structures payloads, and optimizes context framing.
4. **Analyse:** Gemini API processes the structured prompt and returns clean, safe, and structured Markdown directly to the frontend UI.

---

## 🚧 Challenges We Ran Into

### Prompt Determinism and Formatting
Initially, the AI output was highly variable, sometimes generating walls of text or unsafe fitness assumptions. 
* **Solution:** We resolved this by implementing strict system instructions that forced the Gemini API to return structured Markdown, ensuring that progress summaries were consistently clean, easy to read, and safely framed before rendering directly on the frontend UI.

### Cross-Ecosystem Dependency Management
Operating a decoupled stack across completely different software environments introduced significant version control friction:
* **Frontend:** Aligning third-party JavaScript libraries with Expo’s strict SDK versioning requirements often caused conflicting builds.
* **Backend:** Managing breaking updates between FastAPI versions and database integration packages required rigorous dependency locking. 
* **Solution:** Ensuring data types remained identical between the Python server and the JavaScript client required precise coordination, as a single breaking update on either side could disrupt the entire real-time pipeline.

---

## 🎉 Accomplishments & Learnings

* **End-to-End Pipeline:** We are incredibly proud of successfully building a functional, end-to-end pipeline that connects a modern web interface to a secure database and an AI layer, executing the entire data-to-insight generation loop smoothly. 
* **UI Responsiveness:** Creating an interface that feels like a clean, data-dense dashboard on a desktop computer while effortlessly folding down into an intuitive, lightweight tracker on a mobile web browser was a major milestone. 
* **Context Optimization:** A major engineering takeaway was realizing that LLMs are heavily dependent on the way raw data context is framed within a prompt. Taking the time to structure backend payloads into clear, logically ordered text strings yields vastly superior AI responses compared to throwing raw database dumps at the LLM interface.
* **Technical Mastery:** The project sharpened our skills regarding relational schema design for time-series data within Supabase, state management in React, and optimising prompt pipelines for real-time user experiences.

---

## 🚀 What's Next for FitInsight AI

- [ ] **Web Push Notifications:** Implement browser push notifications to remind users of their historical lifting targets right before their scheduled workout times.
- [ ] **Computer Vision Form Analysis:** Introduce computer vision capabilities, allowing users to upload a video of their exercise form directly to the web app and have Gemini analyse their mechanics against safety standards.
- [ ] **Wearable API Integrations:** Connect third-party fitness APIs to cross-reference workout intensity with sleep and recovery data for truly holistic health insights.

---

## ⚙️ Getting Started

### Prerequisites
* Node.js (v18+) & npm/yarn
* Python 3.10+
* Supabase Account
* Google Gemini API Key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
# Create a .env file with your SUPABASE_URL, SUPABASE_KEY, and GEMINI_API_KEY
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npx expo start --web
```