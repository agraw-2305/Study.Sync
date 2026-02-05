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
You are an expert educator.

Create VERY DETAILED, CRISP, and STRUCTURED study notes from the lecture below.

Rules:
- Use clear headings and subheadings
- Explain concepts step-by-step
- Include definitions, key points, and examples
- Use bullet points where possible
- Write in exam-ready language
- Avoid unnecessary fluff
- Make the notes useful even without watching the video

Lecture Transcript:
{transcript}
"""
    return _ask_groq(prompt)



def generate_flashcards(transcript: str, count: int = 10):
    count = max(10, min(count, 20))  # enforce limits

    prompt = f"""
You are generating flashcards for active recall learning.

Generate exactly {count} HIGH-QUALITY flashcards.

Rules:
- Each flashcard must test a key concept
- Questions must be clear and specific
- Answers must be concise but complete
- Avoid repetition
- Avoid yes/no questions
- Return ONLY valid JSON

Format:
[
  {{
    "question": "Question text",
    "answer": "Answer text"
  }}
]

Lecture Transcript:
{transcript}
"""
    return json.loads(_ask_groq(prompt))



def generate_quiz(transcript: str, count: int = 5):
    count = max(5, min(count, 15))  # enforce limits

    prompt = f"""
You are an exam question setter.

Create exactly {count} multiple-choice questions.

Rules:
- Each question must test understanding
- Provide 4 options (A, B, C, D)
- Only ONE correct answer
- Avoid trivial questions
- Medium difficulty
- Return ONLY valid JSON

Format:
[
  {{
    "question": "Question text",
    "options": ["A","B","C","D"],
    "correct_answer": "A"
  }}
]

Lecture Transcript:
{transcript}
"""
    return json.loads(_ask_groq(prompt))
