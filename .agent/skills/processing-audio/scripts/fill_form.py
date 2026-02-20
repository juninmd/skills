#!/usr/bin/env python3
import sys
import argparse

def generate_audio_report(task):
    """Generates a markdown template for an audio analysis report."""
    template = f"""# Audio Analysis Report: {task}

## Input
`recording.wav`

## Metadata
- **Duration:** 00:02:15
- **Sample Rate:** 44100 Hz
- **Channels:** Stereo

## Transcription
> "Hello, this is a test of the emergency broadcast system. This is only a test."

## Output
`transcript.txt`
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate an audio analysis report template.")
    parser.add_argument("task", help="The audio task performed.")
    args = parser.parse_args()

    print(generate_audio_report(args.task))

if __name__ == "__main__":
    main()
