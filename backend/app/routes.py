from fastapi import APIRouter, HTTPException
from app.models import VideoRequest
from app.services.transcript_service import fetch_transcript_with_fallback, normalize_transcript_text
from app.services.groq_service import (
    generate_notes,
    generate_flashcards,
    generate_quiz
)

router = APIRouter(prefix="/api")


def _resolve_transcript(req: VideoRequest) -> str:
    transcript = normalize_transcript_text(req.transcript or "")
    if transcript:
        return transcript
    if not req.url:
        raise HTTPException(status_code=400, detail="URL or transcript is required")
    return fetch_transcript_with_fallback(req.url)


def _handle_request(req: VideoRequest, build_response):
    try:
        transcript = _resolve_transcript(req)
        return build_response(transcript)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/notes")
def notes(req: VideoRequest):
    return _handle_request(req, lambda transcript: {"notes": generate_notes(transcript)})


@router.post("/flashcards")
def flashcards(req: VideoRequest, count: int = 10):
    return _handle_request(
        req, lambda transcript: {"flashcards": generate_flashcards(transcript, count)}
    )



@router.post("/quiz")
def quiz(req: VideoRequest, count: int = 5):
    return _handle_request(req, lambda transcript: {"quiz": generate_quiz(transcript, count)})

