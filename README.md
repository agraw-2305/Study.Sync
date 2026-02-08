# 📘 Study.Sync

Study.Sync is an AI-powered learning assistant that transforms YouTube lectures or user-provided transcripts into structured, exam-ready study materials.

It helps learners move from passive video consumption to active learning by automatically generating:

- 📑 Clear, organized notes
- 🃏 Revision-focused flashcards
- 🧪 Practice quizzes for self-assessment

Built with a FastAPI backend, Next.js frontend, and powered by Groq LLMs, Study.Sync is designed with real-world reliability, fallback handling, and scalability in mind.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Why Study.Sync?](#-why-studysync)
- [Core Philosophy](#-core-philosophy)
- [Key Features](#-key-features)
- [System Workflow](#-system-workflow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Configuration](#environment-configuration)
- [API Reference](#-api-reference)
- [Usage Guidelines](#-usage-guidelines)
- [Error Handling and Reliability](#-error-handling-and-reliability)
- [Security and Privacy](#-security-and-privacy)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

Study.Sync is built for students, self-learners, and developers who rely heavily on long-form educational videos but want a faster and more structured learning workflow.

Instead of:

- Rewatching hours of lectures
- Manually taking notes
- Creating flashcards from scratch

Study.Sync converts lecture content into ready-to-use learning assets that support understanding, revision, and recall.

> 🎯 Study.Sync focuses on learning outputs, not conversational chat.

---

## ❓ Why Study.Sync?

Learning from videos is powerful, but inefficient without structure.

### Common Problems

- ⏸️ Constant pausing to write notes
- 🔁 Rewatching the same sections before exams
- 📝 Manually creating flashcards and quizzes
- 🚫 Missing or temporarily blocked YouTube captions

### How Study.Sync Helps

- ⚡ Converts videos into structured content instantly
- 🧠 Reinforces learning using active recall
- 🔄 Supports transcript upload as a fallback
- 🧩 Handles real-world API and transcript issues gracefully

---

## 🧠 Core Philosophy

Study.Sync is designed around these principles:

- Structure over conversation
- Learning assistance, not shortcuts
- Reliability over novelty
- Local-first and self-host friendly

### What Study.Sync Is

- ✅ A structured study material generator
- ✅ A notes + flashcards + quiz system
- ✅ A tool built for real academic workflows

### What Study.Sync Is Not

- ❌ A chatbot or tutoring replacement
- ❌ A video downloader
- ❌ An answer-spitting exam solver

---

## ✨ Key Features

### 🔗 Flexible Input Options

- YouTube URLs (with captions enabled)
- Manual transcript paste or upload (.txt, .srt)

### 📝 Structured Notes

- Topic-wise sections
- Concept-focused summaries
- Clean formatting for revision

### 🃏 Flashcards

- Question–answer format
- Optimized for spaced repetition
- Regeneratable on demand

### 🧪 Practice Quizzes

- Multiple-choice questions (MCQs)
- Adjustable question count
- Designed to test understanding, not memorization

### 🛡️ Reliability by Design

- Graceful handling of transcript failures
- Chunked processing for long videos
- Clear and actionable error messages

---

## ⚙️ System Workflow

1. User provides a YouTube URL or uploads a transcript
2. Backend attempts caption extraction with fallback logic
3. Transcript is cleaned, normalized, and chunked
4. Groq LLM generates:
   - Structured notes
   - Flashcards
   - Quiz questions
5. Frontend renders results in a clean, distraction-free UI

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

### AI and Processing

- Groq API
- LLaMA 3.1 8B Instant

---

## 📁 Project Structure

```text
studysync/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app + CORS
│   │   ├── routes.py                # Notes, flashcards, quiz APIs
│   │   └── services/
│   │       ├── groq_service.py      # LLM prompts and parsing
│   │       └── transcript_service.py# YouTube + fallback handling
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Main UI
│   │   └── api/
│   │       └── */route.ts           # Backend proxy routes
│   ├── components/
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Python 3.11+
- Groq API Key

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create .env inside backend/:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Run the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

API Docs:

- http://127.0.0.1:8000/docs

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Open the app:

- http://localhost:3000

### Environment Configuration

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

## 🧭 Usage Guidelines

- Upload a transcript if captions are unavailable
- Flashcards: typically 10–20 per session
- Quizzes: typically 5–15 questions
- Long transcripts are processed in chunks automatically

---

## 🛠 Error Handling and Reliability

Study.Sync is designed to handle:

- Temporary YouTube transcript blocks
- Long or noisy transcripts
- API failures with clear user feedback

All failures return actionable error messages, not silent crashes.

---

## 🔒 Security and Privacy

- No authentication required
- No user data storage
- No transcripts are persisted
- Designed for local and self-hosted usage

---

## 🔮 Future Enhancements

- PDF and article input support
- Export to Anki, Notion, or PDF
- Learning history and personalization
- Multi-language support
- User accounts (optional)

---

## 🤝 Contributing

Contributions are welcome.

- Fork the repository
- Create a feature branch
- Commit your changes
- Open a pull request

---

## 📄 License

Licensed under the MIT License.

