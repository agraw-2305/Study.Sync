from groq import Groq
from app.config import GROQ_API_KEY
import json
import time
import hashlib
import re
from typing import Any, List, Optional

client = Groq(api_key=GROQ_API_KEY)

MODEL = "llama-3.1-8b-instant"

# Keep prompts comfortably under Groq limits.
# (Chars are a crude but reliable proxy for tokens across languages.)
_MAX_TRANSCRIPT_CHARS = 15000
_MAX_SUMMARY_CHARS = 9000

_SUMMARY_CACHE = {}
_NOTES_CACHE = {}
_FLASHCARDS_CACHE = {}
_QUIZ_CACHE = {}


def _strip_code_fences(text: str) -> str:
    text = (text or "").strip()
    if text.startswith("```"):
        # Remove leading and trailing fenced code blocks.
        text = re.sub(r"^```[a-zA-Z0-9_-]*\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()


def _extract_json_candidate(text: str) -> Optional[str]:
    text = _strip_code_fences(text)
    if not text:
        return None

    # Heuristic: find the first '{' or '[' and the last matching '}' or ']'.
    start_obj = text.find("{")
    start_arr = text.find("[")
    if start_obj == -1 and start_arr == -1:
        return None

    if start_obj == -1:
        start = start_arr
        end = text.rfind("]")
    elif start_arr == -1:
        start = start_obj
        end = text.rfind("}")
    else:
        # Choose whichever appears first.
        if start_arr < start_obj:
            start = start_arr
            end = text.rfind("]")
        else:
            start = start_obj
            end = text.rfind("}")

    if end == -1 or end <= start:
        return None
    return text[start : end + 1].strip()


def _loads_json_lenient(text: str) -> Any:
    candidate = _extract_json_candidate(text)
    if not candidate:
        raise ValueError("Model did not return any JSON")
    return json.loads(candidate)


def _ask_groq_json(prompt: str, schema_hint: str) -> Any:
    last_err: Exception | None = None
    raw = ""
    for attempt in range(3):
        try:
            raw = _ask_groq(prompt)
            return _loads_json_lenient(raw)
        except Exception as e:
            last_err = e
            repair_prompt = f"""Return ONLY valid JSON matching this schema:
{schema_hint}

Rules:
- Output must be pure JSON (no markdown, no commentary)
- Double quotes for all keys/strings

Fix this output into valid JSON:
{raw}
"""
            prompt = repair_prompt

    raise RuntimeError(f"Failed to produce valid JSON: {last_err}")


def _sample_text(text: str, max_chars: int) -> str:
    text = (text or "").strip()
    if len(text) <= max_chars:
        return text

    # Take slices from start/middle/end to represent the whole video.
    piece = max_chars // 3
    start = text[:piece]
    mid_start = max(0, (len(text) // 2) - (piece // 2))
    middle = text[mid_start : mid_start + piece]
    end = text[-piece:]
    return (start + "\n...\n" + middle + "\n...\n" + end).strip()


def _ask_groq(prompt: str) -> str:
    last_err: Exception | None = None
    for attempt in range(4):
        try:
            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": "You help students study."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            last_err = e
            msg = str(e).lower()
            if "rate_limit" in msg or "tpm" in msg or "413" in msg or "429" in msg:
                time.sleep(1.5 * (attempt + 1))
                continue
            raise

    raise last_err  # type: ignore[misc]


def _chunk_text(text: str, max_chars: int) -> List[str]:
    text = (text or "").strip()
    if not text:
        return []

    # Prefer splitting on sentence-ish boundaries, then fall back to hard cuts.
    parts = [p.strip() for p in re.split(r"(?<=[.!?])\s+", text) if p.strip()]
    chunks: List[str] = []
    buf: List[str] = []
    buf_len = 0

    def flush():
        nonlocal buf, buf_len
        if buf:
            chunks.append("\n".join(buf).strip())
            buf = []
            buf_len = 0

    for part in parts:
        if len(part) > max_chars:
            flush()
            for i in range(0, len(part), max_chars):
                chunks.append(part[i : i + max_chars])
            continue

        if buf_len + len(part) + 1 > max_chars:
            flush()

        buf.append(part)
        buf_len += len(part) + 1

    flush()
    return [c for c in chunks if c]


def _summarize_transcript(transcript: str) -> str:
    transcript = (transcript or "").strip()
    if len(transcript) <= _MAX_TRANSCRIPT_CHARS:
        return transcript

    key = hashlib.sha1(transcript.encode("utf-8", errors="ignore")).hexdigest()
    cached = _SUMMARY_CACHE.get(key)
    if cached:
        return cached

    # Very long transcripts: do a single-call sampled summary to avoid many LLM calls.
    if len(transcript) > _MAX_TRANSCRIPT_CHARS * 4:
        sampled = _sample_text(transcript, _MAX_TRANSCRIPT_CHARS)
        prompt = f"""Create very detailed study notes in bullet-point format.
    Use headings with bullet points and sub-bullets. Include definitions, steps, formulas, examples, and key terms.
    Expand each main bullet with 1-2 supporting sub-bullets. Avoid paragraphs.

Sample:
{sampled}
"""
        result = _ask_groq(prompt)
        _SUMMARY_CACHE[key] = result
        return result

    chunks = _chunk_text(transcript, _MAX_TRANSCRIPT_CHARS)
    if not chunks:
        return transcript

    summaries: List[str] = []
    for idx, chunk in enumerate(chunks, start=1):
        prompt = f"""Summarize chunk {idx}/{len(chunks)} into very detailed study bullets.
    Keep definitions, steps, formulas, examples, and key terms. Use sub-bullets. No filler.

Text:
{chunk}
"""
        summaries.append(_ask_groq(prompt))

    combined = "\n\n".join(summaries).strip()
    if len(combined) <= _MAX_SUMMARY_CHARS:
        return combined

    # One more compression pass if needed.
    compress_prompt = f"""Compress into one clean outline with headings + bullets.
Keep key points; use bullet points only and keep sub-bullets where needed.

Summaries:
{combined}
"""
    final_summary = _ask_groq(compress_prompt)
    _SUMMARY_CACHE[key] = final_summary
    return final_summary


def generate_notes(transcript: str) -> str:
    raw_key = hashlib.sha1((transcript or "").encode("utf-8", errors="ignore")).hexdigest()
    cached = _NOTES_CACHE.get(raw_key)
    if cached:
        return cached

    # If transcript is long, the summarizer already produces structured notes.
    if (transcript or "") and len(transcript) > _MAX_TRANSCRIPT_CHARS:
        notes = _summarize_transcript(transcript)
        _NOTES_CACHE[raw_key] = notes
        return notes

    transcript = _summarize_transcript(transcript)
    prompt = f"""Create very detailed study notes in bullet-point format.
Use headings with bullet points and sub-bullets. Include definitions, steps, formulas, examples, and key terms.
Expand each main bullet with 1-2 supporting sub-bullets. Avoid paragraphs.

Transcript:
{transcript}
"""
    notes = _ask_groq(prompt)
    _NOTES_CACHE[raw_key] = notes
    return notes



def generate_flashcards(transcript: str, count: int = 10):
    count = max(10, min(count, 20))  # enforce limits

    raw_key = hashlib.sha1((transcript or "").encode("utf-8", errors="ignore")).hexdigest()
    cache_key = f"{raw_key}:{count}"
    cached = _FLASHCARDS_CACHE.get(cache_key)
    if cached:
        return cached

    transcript = _summarize_transcript(transcript)

    prompt = f"""Generate exactly {count} flashcards as JSON.
No filler, avoid repeats, no yes/no.
Make answers slightly longer with 1-2 sentences of context or example.

Format: [{{"question":"...","answer":"..."}}, ...]

Transcript:
{transcript}
"""
    schema_hint = """[
  {"question": "string", "answer": "string"}
]"""
    cards = _ask_groq_json(prompt, schema_hint)
    _FLASHCARDS_CACHE[cache_key] = cards
    return cards



def generate_quiz(transcript: str, count: int = 5):
    count = max(5, min(count, 10))  # enforce limits

    raw_key = hashlib.sha1((transcript or "").encode("utf-8", errors="ignore")).hexdigest()
    cache_key = f"{raw_key}:{count}"
    cached = _QUIZ_CACHE.get(cache_key)
    if cached:
        return cached

    transcript = _summarize_transcript(transcript)

    prompt = f"""Create exactly {count} MCQs as JSON.

Rules:
- Provide 4 answer choices as full text strings.
- "correct_answer" must be one of "A", "B", "C", "D" indicating which option is correct.
- Avoid trick questions; keep medium difficulty.

Format: [{{"question":"...","options":["...","...","...","..."],"correct_answer":"A"}}, ...]

Transcript:
{transcript}
"""
    schema_hint = """[
  {"question": "string", "options": ["string", "string", "string", "string"], "correct_answer": "A"}
]"""
    quiz = _ask_groq_json(prompt, schema_hint)
    _QUIZ_CACHE[cache_key] = quiz
    return quiz
