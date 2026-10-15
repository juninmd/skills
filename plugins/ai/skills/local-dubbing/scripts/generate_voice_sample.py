"""Generate one offline Qwen3-TTS Base clone without modifying source audio."""

import argparse
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import sys
import time


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--model-revision", help="Declared snapshot revision, not a weight attestation")
    parser.add_argument("--reference", type=Path, required=True)
    parser.add_argument("--reference-text-file", type=Path, required=True)
    parser.add_argument("--text-file", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True, help="Must not already exist")
    parser.add_argument("--extra-packages", type=Path, help="Trusted local dependency overlay")
    parser.add_argument("--language", default="Portuguese")
    parser.add_argument("--seed", type=int, default=20261014)
    args = parser.parse_args()
    if not args.model.is_dir() or not (args.model / "config.json").is_file():
        parser.error("--model must be an existing local model directory with config.json")
    for field in ("reference", "reference_text_file", "text_file"):
        if not getattr(args, field).is_file():
            parser.error(f"Missing input: {getattr(args, field)}")
    if args.output_dir.exists():
        parser.error("--output-dir already exists; choose a new take directory")
    if args.extra_packages and not args.extra_packages.is_dir():
        parser.error("--extra-packages must be an existing trusted directory")
    return parser, args


def main():
    parser, args = parse_args()
    text = args.text_file.read_text(encoding="utf-8-sig").strip()
    reference_text = args.reference_text_file.read_text(encoding="utf-8-sig").strip()
    if not text or not reference_text:
        parser.error("Synthesis text and reference transcript must be nonempty")
    if args.extra_packages:
        sys.path.insert(0, str(args.extra_packages.resolve()))
    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["TRANSFORMERS_OFFLINE"] = "1"
    os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

    import numpy as np
    import soundfile as sf
    import torch
    from transformers import set_seed
    from qwen_tts import Qwen3TTSModel

    reference, reference_rate = sf.read(args.reference, dtype="float32")
    if reference.ndim != 1 or not reference.size or not np.isfinite(reference).all():
        parser.error("Reference must contain finite, nonempty mono audio")
    if np.max(np.abs(reference)) < 0.0001:
        parser.error("Reference is effectively silent")
    if not torch.cuda.is_available() or not torch.cuda.is_bf16_supported():
        parser.error("This tested path requires a CUDA GPU supporting BF16")

    reference_hash = sha256(args.reference)
    args.output_dir.mkdir(parents=True, exist_ok=False)
    set_seed(args.seed)
    torch.set_num_threads(6)
    torch.cuda.reset_peak_memory_stats()
    started = time.perf_counter()
    print("Loading local Qwen3-TTS Base on CUDA with BF16/SDPA", flush=True)
    model = Qwen3TTSModel.from_pretrained(
        str(args.model.resolve()), device_map="cuda:0",
        dtype=torch.bfloat16, attn_implementation="sdpa",
    )
    settings = {
        "language": args.language, "x_vector_only_mode": False,
        "non_streaming_mode": True, "max_new_tokens": 512,
        "temperature": 0.75, "top_p": 0.95,
    }
    with torch.inference_mode():
        waves, sample_rate = model.generate_voice_clone(
            text=text, ref_audio=str(args.reference.resolve()),
            ref_text=reference_text, **settings,
        )
    wave = np.asarray(waves[0], dtype=np.float32)
    if wave.ndim != 1 or not wave.size or not np.isfinite(wave).all():
        raise RuntimeError("Generated audio is not finite, nonempty mono audio")
    peak = float(np.max(np.abs(wave)))
    if peak < 0.0001 or sample_rate <= 0:
        raise RuntimeError("Generated audio is silent or has an invalid sample rate")
    if sha256(args.reference) != reference_hash:
        raise RuntimeError("Reference changed during generation; inspect the source")

    raw_output = args.output_dir / "sample-raw.wav"
    output = args.output_dir / "sample.wav"
    sf.write(raw_output, wave, sample_rate, subtype="FLOAT")
    gain = min(0.89 / peak, 4.0)
    normalized = wave * gain
    sf.write(output, normalized, sample_rate, subtype="PCM_16")
    decoded, decoded_rate = sf.read(output, dtype="float32")
    if decoded_rate != sample_rate or not np.isfinite(decoded).all():
        raise RuntimeError("Saved listening copy failed decode validation")
    metadata = {
        "label": "Experimental AI-synthesized reference voice clone",
        "text": text, "reference_transcript": reference_text,
        "reference_path": str(args.reference.resolve()),
        "reference_sha256": reference_hash,
        "reference_sample_rate": reference_rate,
        "reference_duration_seconds": len(reference) / reference_rate,
        "model_path": str(args.model.resolve()),
        "declared_model_revision": args.model_revision,
        "seed": args.seed, "generation": settings,
        "dtype": "bfloat16", "attention": "sdpa", "cpu_threads": 6,
        "sample_rate": sample_rate, "duration_seconds": len(decoded) / sample_rate,
        "raw_peak": peak, "gain": gain,
        "decoded_peak": float(np.max(np.abs(decoded))),
        "decoded_rms": float(np.sqrt(np.mean(decoded**2))),
        "elapsed_seconds": time.perf_counter() - started,
        "peak_gpu_memory_mib": torch.cuda.max_memory_allocated() / 1024**2,
        "gpu": torch.cuda.get_device_name(0), "python": sys.version.split()[0],
        "packages": {name: importlib.metadata.version(name) for name in (
            "torch", "qwen-tts", "transformers", "accelerate", "huggingface-hub",
        )},
        "raw_sha256": sha256(raw_output), "output_sha256": sha256(output),
        "validation": "Numerical/decode checks passed; ASR and human listening pending",
    }
    (args.output_dir / "metadata.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
    )
    print(json.dumps({"output": str(output), "duration_seconds": metadata["duration_seconds"]}))


if __name__ == "__main__":
    main()
