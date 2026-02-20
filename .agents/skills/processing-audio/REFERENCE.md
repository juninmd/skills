# Audio Processing Specialist Reference

## Tools

### 1. `ffmpeg`
**Description:** A complete, cross-platform solution to record, convert and stream audio and video.
**Common Commands:**
- `ffmpeg -i input.mp3 output.wav`: Convert format.
- `ffmpeg -i input.wav -ar 16000 output.wav`: Resample to 16kHz.

### 2. `Whisper` (OpenAI)
**Description:** Robust Speech Recognition via Large-Scale Weak Supervision.
**Common Commands:**
- `whisper audio.mp3 --model medium`: Transcribe audio.
- `whisper audio.mp3 --task translate`: Translate to English.

### 3. `gTTS` (Google Text-to-Speech)
**Description:** Python library and CLI tool to interface with Google Translate's text-to-speech API.
**Common Commands:**
- `gtts-cli 'Hello world' --output hello.mp3`: Generate speech.
