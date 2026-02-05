from fastapi import APIRouter, HTTPException
from app.models import VideoRequest
from app.services.transcript_service import fetch_transcript
from app.services.groq_service import (
    generate_notes,
    generate_flashcards,
    generate_quiz
)

router = APIRouter(prefix="/api")

@router.post("/notes")
def notes(req: VideoRequest):
    try:
        transcript = fetch_transcript(req.url)
        return {"notes": generate_notes(transcript)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/flashcards")
def flashcards(req: VideoRequest, count: int = 10):
    transcript = fetch_transcript(req.url)
    return {
        "flashcards": generate_flashcards(transcript, count)
    }



@router.post("/quiz")
def quiz(req: VideoRequest, count: int = 5):
    transcript = fetch_transcript(req.url)
    return {
        "quiz": generate_quiz(transcript, count)
    }

