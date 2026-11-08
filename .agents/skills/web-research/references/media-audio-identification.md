# Media and Soundtrack Identification

Techniques for identifying soundtracks, background audio, music, and uncredited media from social video clips (X/Twitter, TikTok, YouTube Shorts, Reels) when no textual metadata is present.

## Keyless Stream Extraction

Retrieve the underlying media stream directly without relying on browser rendering or official platform API credentials:

| Platform | Endpoint / Technique | Output |
|---|---|---|
| **X/Twitter** | `https://api.fxtwitter.com/:user/status/:id` | JSON payload containing direct MP4 variant URLs in `tweet.media.videos[].variants[].url`. |
| **YouTube / Shorts** | `yt-dlp --print urls "<url>"` | Direct media stream URL or format list without browser automation. |
| **Direct MP4/WebM** | `curl.exe -s -L --max-time 30 "<video_url>" -o "$TEMP/clip.mp4"` | Raw media file bounded by download timeout. |

## Audio and Visual Extraction

Social clips frequently place a distinct audio track over unrelated visual content, or use visual memes to hint at the audio origin:

```bash
# 1. Extract audio track to standard MP3
ffmpeg -i clip.mp4 -vn -c:a mp3 -b:a 192k audio.mp3 -y

# 2. Extract visual frames at distinct timestamps for character/text clues
ffmpeg -ss 00:00:10 -i clip.mp4 -frames:v 1 frame1.jpg -y
ffmpeg -ss 00:00:30 -i clip.mp4 -frames:v 1 frame2.jpg -y
```

## Transcription and Lyric Extraction

When the track contains vocals or spoken dialogue, transcribe phonetically to unlock search queries:

```python
# Always force UTF-8 output to avoid Windows console cp1252/cp850 UnicodeEncodeError
from faster_whisper import WhisperModel

model = WhisperModel("tiny", device="cpu", compute_type="int8")
segments, info = model.transcribe("audio.mp3", beam_size=1)
lyrics = "\n".join([s.text for s in segments])

with open("lyrics.txt", "w", encoding="utf-8") as f:
    f.write(lyrics)
```

### Gotchas

- **Windows Console Encoding**: Printing non-ASCII transcriptions (Japanese kana/kanji, Korean, Cyrillic, accented Latin) directly to stdout on Windows default `cp1252` throws `UnicodeEncodeError`. Always write transcriptions directly to a file with `encoding="utf-8"` or set `$env:PYTHONIOENCODING = "utf-8"`.
- **Python 3.13+ Audioop Removal**: Python 3.13 and 3.14 removed the standard library `audioop` module. Legacy audio fingerprinting packages (e.g. older `pydub`, `shazamio`) fail on import with `ModuleNotFoundError: No module named 'audioop'`. Prefer local speech-to-text models (`faster-whisper`), Chromaprint CLI (`fpcalc`), or standalone binaries over unmaintained Python wrappers.
- **Vocal Pitches & Speed Modifications**: Nightcore, slowed+reverb, or pitch-shifted audio will fail acoustic fingerprinting. Transcribed lyrical fragments remain robust to tempo and pitch shifts where acoustic hashes fail.

## Search Reformulation for Soundtracks

Triangulate identity using the extracted audio and visual fragments:

1. **Phonetic Phrases**: Quote distinctive multi-word fragments from the transcription:
   `"distinctive lyric fragment"` or `"repeated chorus phrase"`
2. **Visual + Theme Correlation**: Pair visual character attributes or meme text with anime/show themes:
   `"character name" dance song` or `"series title" non-credit ending`
3. **Official Attribution**: Verify against canonical sources (official studio channels, streaming platform series entries, database records) to pinpoint track title, performing artist / voice actor (CV), and release episode (OP/ED/Insert).
