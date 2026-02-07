# 📘 Study.Sync

**Study.Sync** is an AI-powered learning assistant that transforms **YouTube lectures or uploaded transcripts** into clear, structured study materials.  
It generates **organized notes, interactive flashcards, and practice quizzes**, helping learners move from passive watching to active understanding.

Built with a **FastAPI backend**, **Next.js frontend**, and powered by **Groq LLMs**, Study.Sync is designed to handle real-world challenges like **YouTube transcript limits** gracefully.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Motivation and Use Cases](#motivation-and-use-cases)
- [What Study.Sync Is (and Is Not)](#what-studysync-is-and-is-not)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Configuration](#configuration)
- [API Reference](#api-reference)
- [Usage Notes](#usage-notes)
- [Troubleshooting](#troubleshooting)
- [Limitations](#limitations)
- [Security and Privacy](#security-and-privacy)
- [Extensibility](#extensibility)
- [Contributing](#contributing)
- [License](#license)

---

## 🔍 Overview

Study.Sync is built for students and self-learners who rely on long-form video lectures but struggle with note-taking, revision, and self-assessment.

Instead of rewatching videos, Study.Sync extracts key ideas and converts them into **actionable learning assets**—notes for understanding, flashcards for revision, and quizzes for recall.

> 🎯 Focused on **structured learning outputs**, not free-form chat.

---

## 🎯 Motivation and Use Cases

Learning from videos is often inefficient due to:
- Constant pausing to take notes
- Rewatching entire lectures before exams
- Manually creating flashcards or quizzes
- Missing or blocked YouTube transcripts

Study.Sync helps by:
- ⏱️ Saving time with AI-generated materials
- 🧠 Improving retention through active recall
- 🔁 Providing transcript upload fallback
- 🧩 Handling real-world API limitations

### Example Use Cases
- 📚 University lecture revision  
- 🧪 Exam preparation from tutorials  
- 💻 Learning technical concepts  
- 📝 Studying when captions are unavailable  

---

## ❓ What Study.Sync Is (and Is Not)

### ✅ Study.Sync IS
- A structured learning material generator
- A notes + flashcards + quiz tool
- Reliable and fallback-aware
- Designed for real student workflows

### ❌ Study.Sync IS NOT
- A chatbot or conversational tutor
- A video downloader
- A plagiarism or answer generator
- A replacement for learning itself

---

## ✨ Key Features

### 🔗 Flexible Input
- YouTube URL (with captions)
- Manual transcript upload or paste (`.txt`, `.srt`)

### 📝 Structured Notes
- Clear sections
- Concept-focused summaries

### 🃏 Flashcards
- Question–answer format
- Optimized for revision
- Regeneratable on demand

### 🧪 Practice Quizzes
- MCQ-based assessment
- Adjustable question count
- Designed for understanding

### 🛡️ Reliability by Design
- Graceful handling of YouTube limits
- Chunked processing for long transcripts
- Clear, user-friendly error states

---

## ⚙️ How It Works

1. User provides a YouTube URL **or** uploads a transcript
2. Backend fetches captions with fallback logic
3. Transcript is cleaned and chunked
4. Groq LLM generates:
   - Notes
   - Flashcards
   - Quiz questions
5. Frontend displays results in a clean UI

---

## 🧰 Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS

### Backend
- Python
- FastAPI
- Uvicorn

### AI
- Groq API
- LLaMA 3.1 8B Instant

---

## 📁 Project Structure

```text
studysync/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app and CORS
│   │   ├── routes.py                # Notes, flashcards, quiz APIs
│   │   └── services/
│   │       ├── groq_service.py      # LLM calls and parsing
│   │       └── transcript_service.py# YouTube and fallback logic
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Main UI
│   │   └── api/
│   │       └── */route.ts           # API proxy routes
│   ├── components/
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Python 3.11+
- Groq API key

---

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create backend/.env:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Run the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Swagger UI: http://127.0.0.1:8000/docs

---

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

App URL: http://localhost:3000

---

### Configuration

```bash
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

---

## 🔌 API Reference

All endpoints accept either a YouTube URL or a transcript.

### POST /api/notes

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "transcript": "optional raw transcript"
}
```

### POST /api/flashcards?count=10

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "transcript": "optional raw transcript"
}
```

### POST /api/quiz?count=5

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "transcript": "optional raw transcript"
}
```

---

## 📝 Usage Notes

- If captions fail, upload a transcript directly.
- Flashcards: 10 or 20 items (UI).
- Quizzes: 5 or 10 questions (UI).
- Long transcripts are chunked automatically.

---

## 🛠 Troubleshooting

- Missing API key: check backend/.env and restart the backend.
- Transcript error: try another video or upload a transcript.
- Network error: ensure the backend runs on port 8000.

---

## ⚠️ Limitations

- Depends on caption availability for YouTube.
- Quiz quality depends on transcript clarity.
- No user accounts or persistence yet.

---

## 🔒 Security and Privacy

- No user authentication required.
- No personal data storage.
- Designed for local or self-hosted usage.

---

## 🔧 Extensibility

- Add PDF or article support
- Swap or upgrade LLMs
- Export to PDF, Anki, or Notion
- Add learning history and personalization

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

Licensed under the MIT License. See the LICENSE file for details.