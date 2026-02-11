---
name: audio-processing-specialist
description: This skill enables the agent to process, analyze, and generate audio.
---

# Audio Processing Specialist

## Instructions
- Load audio files (WAV, MP3, FLAC).
- Convert formats (e.g., using `ffmpeg`).
- Resample audio (e.g., to 16kHz for ML models).
- Remove noise or silence.
- Transcribe spoken audio into text using models like Whisper or APIs.
- Identify speakers (diarization).
- Generate timestamps for words or sentences.
- Convert text into spoken audio using TTS engines.
- Select voices, languages, and speaking rates.
- Generate audio files for playback.
- Extract audio features (spectrograms, MFCCs).
- Detect events (e.g., applause, music).
- Edit audio (cut, splice, fade).

## Resources
- **Sample Rate:** Ensure the audio sample rate matches the requirement of the model being used.
- **Format:** Use lossless formats (WAV, FLAC) for intermediate processing to preserve quality.
- **Noise:** Clean up background noise before attempting transcription for better accuracy.
