from pydantic import BaseModel, HttpUrl
from typing import List

class VideoRequest(BaseModel):
    url: HttpUrl

class Flashcard(BaseModel):
    question: str
    answer: str

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
