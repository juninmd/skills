# Qwen3-TTS local runtime

## Model and environment selection

The [official inference examples](https://github.com/QwenLM/Qwen3-TTS) distinguish Base (reference cloning), VoiceDesign (text-described identity), and CustomVoice (predefined speakers). The supplied script implements **Base cloning only**. For designed voices, use the official `generate_voice_design` path with the matching model, then retain each accepted identity's audio reference for later Base cloning.

Tested on 2026-10-14: Windows, Python 3.13.15, Torch 2.10.0+cu130, RTX 4060 Ti 16 GB, BF16, PyTorch SDPA, six CPU threads. The accepted 6.08-second Raziel take used about 4304 MiB of peak Torch allocated VRAM and 28 seconds for loading plus generation. These are observations, not minimum requirements or speed guarantees. No fine-tuning or Unsloth training was needed.

Use [Qwen/Qwen3-TTS-12Hz-1.7B-Base](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base), tested revision `fd4b254389122332181a7c3db7f27e918eec64e3`. Download the complete snapshot, including its speech tokenizer. Pin and record revisions; do not represent these tested pins as the latest releases.

## Isolate dependencies

Prefer a dedicated environment. When reusing a working CUDA interpreter, the proven alternative is a local overlay containing only selected compatible packages; inspect the interpreter's remaining dependencies first. This is not a complete fresh-environment requirements list.

```powershell
& $python -c "import sys, torch; print(sys.executable); print(torch.__version__); print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0))"
uv pip install --python $python --target "$work/python-packages" --no-deps `
  'qwen-tts==0.1.1' 'transformers==4.57.3' 'accelerate==1.12.0' `
  'huggingface-hub==0.36.2' onnxruntime sox
```

The accepted test reused NumPy, SoundFile, librosa, Torch, torchaudio, and other dependencies already present in the CUDA interpreter. `--no-deps` prevents replacing them; it does not prove compatibility. Inspect the package's declared requirements and perform the import/GPU smoke before inference. Resolve missing dependencies inside the isolated environment/overlay, without downgrading a shared installation. Keep overlays trusted, project-local, and outside Git; they shadow installed packages.

Download separately while online; this snippet uses the same overlay explicitly:

```powershell
$download = @'
import json, sys
from pathlib import Path
work = Path(sys.argv[1])
sys.path.insert(0, str(work / "python-packages"))
from huggingface_hub import snapshot_download
source = {"repo_id": "Qwen/Qwen3-TTS-12Hz-1.7B-Base", "revision": "fd4b254389122332181a7c3db7f27e918eec64e3"}
snapshot_download(**source, local_dir=str(work / "model"))
(work / "model-source.json").write_text(json.dumps(source, indent=2), encoding="utf-8")
'@
& $python -c $download $work
```

The script's `--model-revision` records a **declared** revision. It does not independently attest that local weights match it; retain the snapshot download record. The model's license is separate from rights to the reference performance.

## Input and output

Save UTF-8 files for the exact reference transcript and the desired synthesis text. Use a short mono reference; convert a separate copy if resampling or downmixing is needed. Supply `--language Portuguese` (the default), not `pt-BR`. Default sampling is seed 20261014, temperature 0.75, top-p 0.95, max 512 new tokens, non-streaming mode. This cap is for previews, not arbitrary long dialogue.

`generate_voice_sample.py --help` shows all inputs. Outputs are `sample-raw.wav` (float), `sample.wav` (PCM16, gain capped at 4 and peak capped at 0.89), and `metadata.json`. A new directory is reserved before loading the model; failures may leave an incomplete directory for inspection. Choose another take directory on retry.

The script sets Hugging Face and Transformers offline mode and accepts only an existing local model directory. This prevents accidental model downloads during inference; it is not an OS network sandbox. The script does not implement ASR, batch resumability, voice design, or game integration.

## ASR and listening checks

Use an available multilingual Whisper model for Portuguese; English-only `.en` checkpoints are for English references. Record the checkpoint and recognized text. If its weights are not already local, treat their download as setup, not an invisible inference step.

```powershell
$transcribe = @'
import json, sys, whisper
from pathlib import Path
audio, weights, output = map(Path, sys.argv[1:4])
model = whisper.load_model(str(weights), device="cuda")
result = model.transcribe(str(audio), language="pt", verbose=False, temperature=0)
output.write_text(json.dumps({"model": str(weights), "text": result["text"], "segments": result["segments"]}, ensure_ascii=False, indent=2), encoding="utf-8")
print(result["text"])
'@
& $python -X utf8 -c $transcribe "$work/take-01/sample.wav" "$work/asr-models/small.pt" "$work/take-01/asr.json"
```

For extracting a reference, enable word timestamps and inspect the neighboring speakers rather than trusting coarse segment boundaries. Automated transcription does not establish vocal similarity. Deliver the original-then-synthetic comparison and request listening feedback through the ordinary conversation.

## Observed failures and remedies

| Symptom | Interpretation and response |
|---|---|
| Missing `flash-attn` | SDPA worked for this preview; no Windows extension build was needed |
| Missing SoX executable warning | The exercised WAV cloning path still worked; install a binary only if the selected operation actually invokes it |
| TorchAO extension compatibility warning | The tested path did not use that extension; verify actual CUDA inference rather than treating every warning as fatal |
| `Dumah` becomes ASR text resembling "de um mar" | Try pronunciation text `Dumá`, keeping the canonical character name unchanged |
| ASR changes a verb or drops words | Review the recording, then simplify phrasing or regenerate one take; never approve a whole dub from numerical checks |
| OOM while ASR and TTS overlap | Run them sequentially in separate processes so model memory is released between checks |
