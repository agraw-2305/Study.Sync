import re
import time
from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound
)

_TRANSCRIPT_CACHE = {}

def extract_video_id(url: str) -> str:
    match = re.search(r"(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})", url)
    if not match:
        raise ValueError("Invalid YouTube URL")
    return match.group(1)

def fetch_transcript(url) -> str:
    url = str(url)
    video_id = extract_video_id(url)

    # ✅ Cache hit
    if video_id in _TRANSCRIPT_CACHE:
        return _TRANSCRIPT_CACHE[video_id]

    last_error = None

    for attempt in range(3):
        try:
            # 1️⃣ Try English first
            try:
                transcript = YouTubeTranscriptApi.get_transcript(
                    video_id, languages=["en"]
                )
            except NoTranscriptFound:
                # 2️⃣ Fallback: ANY available transcript
                transcript = YouTubeTranscriptApi.get_transcript(video_id)

            text = " ".join(item["text"] for item in transcript)
            _TRANSCRIPT_CACHE[video_id] = text
            return text

        except TranscriptsDisabled:
            raise RuntimeError("Transcripts are disabled for this video")

        except Exception as e:
            last_error = str(e).lower()

            if "too many requests" in last_error or "429" in last_error:
                time.sleep(2)
                continue

            raise RuntimeError(str(e))

    raise RuntimeError(
        "YouTube blocked transcript requests temporarily. "
        "Please wait a few minutes or try another video."
    )
