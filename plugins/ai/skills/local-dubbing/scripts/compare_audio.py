"""Encode an original-then-synthetic MP3 with matched loudness and a short pause."""

import argparse
from pathlib import Path
import shutil
import subprocess


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--original", type=Path, required=True)
    parser.add_argument("--synthetic", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        parser.error("FFmpeg must be available on PATH")
    if not args.original.is_file() or not args.synthetic.is_file():
        parser.error("Both input audio files must exist")
    if args.output.exists():
        parser.error("Output already exists; preserve earlier comparisons")
    if args.output.suffix.lower() != ".mp3":
        parser.error("--output must end in .mp3")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    filters = (
        "[0:a]loudnorm=I=-18:TP=-1.5:LRA=11,aresample=24000,aformat=channel_layouts=mono[a0];"
        "[1:a]loudnorm=I=-18:TP=-1.5:LRA=11,aresample=24000,aformat=channel_layouts=mono[a1];"
        "[a0][2:a][a1]concat=n=3:v=0:a=1[out]"
    )
    subprocess.run([
        ffmpeg, "-hide_banner", "-loglevel", "error", "-nostdin", "-n",
        "-i", str(args.original.resolve()), "-i", str(args.synthetic.resolve()),
        "-f", "lavfi", "-t", "0.8", "-i", "anullsrc=r=24000:cl=mono",
        "-filter_complex", filters, "-map", "[out]", "-ar", "24000", "-ac", "1",
        "-c:a", "libmp3lame", "-b:a", "96k", str(args.output.resolve()),
    ], check=True, timeout=120)
    print(f"Original, 0.8-second pause, synthetic: {args.output}")


if __name__ == "__main__":
    main()
