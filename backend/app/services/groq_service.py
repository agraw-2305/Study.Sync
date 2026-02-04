from groq import Groq
from app.config import GROQ_API_KEY
import json

client = Groq(api_key=GROQ_API_KEY)

MODEL = "llama-3.1-8b-instant"

def _ask_groq(prompt: str) -> str:
    print("🔥 GROQ API CALLED") 
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an educational AI."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    return response.choices[0].message.content.strip()


def generate_notes(transcript: str) -> str:
    prompt = f"""
Convert this lecture into clean structured notes.
Use headings and bullet points.

Lecture:
{transcript}
"""
    return _ask_groq(prompt)


def generate_flashcards(transcript: str):
    prompt = f"""
Create 6 flashcards.
Return ONLY valid JSON.

Format:
[
  {{ "question": "...", "answer": "..." }}
]

Lecture:
{transcript}
"""
    return json.loads(_ask_groq(prompt))


def generate_quiz(transcript: str):
    prompt = f"""
Create 5 MCQ questions.
Return ONLY valid JSON.

Format:
[
  {{
    "question": "...",
    "options": ["A","B","C","D"],
    "correct_answer": "A"
  }}
]

Lecture:
{transcript}
"""
    return json.loads(_ask_groq(prompt))
