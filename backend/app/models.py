from pydantic import BaseModel
from typing import List, Optional

class VideoRequest(BaseModel):
    url: Optional[str] = None
    transcript: Optional[str] = None

class Flashcard(BaseModel):
    question: str
    answer: str

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
