# StudySynth

An AI-powered study assistant that helps you transform lecture notes, transcripts, and study materials into summaries, flashcards, and quizzes.

## Project Structure

```
StudySynth/
│
├── backend/
│   ├── main.py           # Flask API server
│   ├── ai.py             # AI content generation
│   ├── transcript.py     # Transcript processing
│   └── requirements.txt  # Python dependencies
│
├── frontend/
│   ├── index.html        # Main HTML page
│   ├── style.css         # Styling
│   └── script.js         # Frontend logic
│
└── README.md
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   python main.py
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   python -m http.server 8000
   ```

3. Access the app at `http://localhost:8000`

## Features

- 📝 Generate summaries from lecture notes
- 🎴 Create flashcards for better memorization
- ❓ Generate quiz questions to test your knowledge
- 🎙️ Process video/audio transcripts
- 🤖 AI-powered content generation

## Technologies

- **Backend:** Python, Flask
- **Frontend:** HTML, CSS, JavaScript
- **AI:** OpenAI API (to be configured)

## License

MIT
