import re
import time
import os
import tempfile
from xml.etree.ElementTree import ParseError
from typing import Optional
from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound
)

_TRANSCRIPT_CACHE = {}


def _vtt_to_text(vtt: str) -> str:
    # Minimal WebVTT parser: drop headers, timestamps, cue indices.
    lines = []
    for raw_line in vtt.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("WEBVTT"):
            continue
        if "-->" in line:
            continue
        if re.fullmatch(r"\d+", line):
            continue
        if line.startswith("NOTE"):
            continue
        lines.append(line)

    text = " ".join(lines)
    text = re.sub(r"<[^>]+>", " ", text)  # strip tags
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _fetch_transcript_via_ytdlp(url: str) -> Optional[str]:
    try:
        from yt_dlp import YoutubeDL  # type: ignore
    except Exception:
        return None

    with tempfile.TemporaryDirectory(prefix="studysynth_subs_") as tmpdir:
        ydl_opts = {
            "skip_download": True,
            "quiet": True,
            "no_warnings": True,
            "writesubtitles": True,
            "writeautomaticsub": True,
            "subtitlesformat": "vtt",
            "outtmpl": os.path.join(tmpdir, "%(id)s.%(ext)s"),
        }

        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            video_id = info.get("id")

            # Prefer English if available; otherwise try whatever exists.
            requested = []
            subtitles = info.get("subtitles") or {}
            auto_subtitles = info.get("automatic_captions") or {}
            for lang in ("en", "en-US", "en-GB"):
                if lang in subtitles or lang in auto_subtitles:
                    requested.append(lang)

            if not requested:
                # Fall back to any available language key (manual first, then auto)
                requested = list(subtitles.keys())[:1] or list(auto_subtitles.keys())[:1]

            if requested:
                ydl.params["subtitleslangs"] = requested
                ydl.download([url])
            else:
                return None

            # Find the downloaded .vtt file
            candidates = []
            if video_id:
                candidates.extend(
                    [
                        os.path.join(tmpdir, f"{video_id}.{lang}.vtt")
                        for lang in requested
                    ]
                )

            # Fallback: any .vtt in directory
            for name in os.listdir(tmpdir):
                if name.lower().endswith(".vtt"):
                    candidates.append(os.path.join(tmpdir, name))

            for path in candidates:
                if os.path.exists(path) and os.path.getsize(path) > 0:
                    with open(path, "r", encoding="utf-8", errors="ignore") as f:
                        text = _vtt_to_text(f.read())
                    if text:
                        return text

    return None

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
            # 1️⃣ Try preferred languages first (English)
            try:
                transcript = YouTubeTranscriptApi.get_transcript(
                    video_id, languages=["en", "en-US", "en-GB"]
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
            message = str(e)
            last_error = message.lower()

            # youtube-transcript-api sometimes fails with an XML parse error when
            # YouTube returns an empty/blocked response body.
            if isinstance(e, ParseError) or "no element found" in last_error:
                time.sleep(2)
                continue

            if "too many requests" in last_error or "429" in last_error:
                time.sleep(2)
                continue

            if "no transcript found" in last_error:
                raise RuntimeError(
                    "No transcript found for this video (captions may be unavailable,"
                    " region-restricted, or auto-captions are disabled)."
                )

            raise RuntimeError(message)

    raise RuntimeError(
        "Could not retrieve a transcript from YouTube right now. "
        "This often happens when YouTube returns an empty/blocked response (XML parse error) "
        "or rate-limits transcript requests. Please wait a few minutes, try again, "
        "or try a different video with captions enabled."
    )


def fetch_transcript_with_fallback(url) -> str:
    url = str(url)
    video_id = extract_video_id(url)

    # ✅ Cache hit
    if video_id in _TRANSCRIPT_CACHE:
        return _TRANSCRIPT_CACHE[video_id]

    try:
        text = fetch_transcript(url)
        _TRANSCRIPT_CACHE[video_id] = text
        return text
    except Exception:
        # Try yt-dlp subtitles as a fallback when youtube-transcript-api gets blocked.
        ytdlp_text = _fetch_transcript_via_ytdlp(url)
        if ytdlp_text:
            _TRANSCRIPT_CACHE[video_id] = ytdlp_text
            return ytdlp_text

        raise RuntimeError(
            "Unable to fetch captions for this video. "
            "Either captions are not available, or YouTube blocked transcript access. "
            "Try a different video with captions enabled (English)."
        )


def normalize_transcript_text(text: str) -> str:
    raw = (text or "").strip()
    if not raw:
        return ""
    if "-->" in raw or "WEBVTT" in raw:
        return _vtt_to_text(raw)
    return re.sub(r"\s+", " ", raw).strip()
