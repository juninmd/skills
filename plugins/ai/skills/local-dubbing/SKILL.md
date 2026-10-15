---
name: local-dubbing
description: |
  Generate local AI dubbing and actor voice clones with Qwen3-TTS. Use for reference audio, dialogue translation, distinct character voices, pronunciation, and original-versus-synthetic comparison. Trigger on 'clone the actor voice', 'dub all dialogue', 'dublagem local', 'copie a voz do ator', 'uma voz para cada personagem'.
---

# Local Dubbing

Produce a small, reviewable voice sample before scaling a dub. Match the user's choice of original voice design or reference-based cloning; they use different model variants.

**Not this skill:** beat-locked music and motion graphics (`motion-video`), general Python dependency repairs (`package-management`). This workflow produces audio; installing it into a game's dialogue system needs a separate, format-specific integration.

## Preflight

- Identify target language, character, desired voice source, and one short line. Reuse choices already made in the conversation.
- Inspect local Python interpreters, CUDA/VRAM, FFmpeg, existing models, repository state, and ignored staging paths. An Unsloth installation may provide a working CUDA Python without being the TTS engine.
- Inspect the reference's actual encoding and speaker boundaries. A `.dat` extension does not establish a codec; do not guess raw PCM settings from the filename.
- Use [qwen-local.md](references/qwen-local.md) for the tested runtime, setup, generation, and ASR checks. Read [soul-reaver-pc.md](references/soul-reaver-pc.md) only for the original Soul Reaver PC audio layout and the validated Raziel example.

## Workflow

1. **Stage outside originals.** Keep source audio read-only; record its hash and extraction offsets. Keep weights, extracted voices, and generated takes outside tracked skill files.
2. **Choose the model.** For the requested actor's voice, use Qwen3-TTS **Base** with a clean single-speaker reference and its exact source-language transcript. VoiceDesign creates an identity from a description; CustomVoice uses predefined speakers. Neither silently substitutes for actor cloning.
3. **Prepare a short reference.** Start with roughly 5–10 seconds of isolated speech, including the full phrase and excluding the next speaker. Prefer dialogue data over a cinematic mixed with music. Use word timestamps to refine boundaries, then preserve the trimmed reference.
4. **Translate for speech.** Preserve meaning, character, and register. Store canonical display text separately from pronunciation text so a spelling such as `Dumá` can guide synthesis without renaming `Dumah` in subtitles. Keep the exact reference transcript in its original language.
5. **Generate one preview.** Run the supplied script with local model paths and a new output directory. It saves raw float audio, a PCM16 listening copy, hashes, generation settings, and numerical evidence. Existing output directories are refused.
6. **Verify and compare.** Check nonempty finite audio, duration, peak, and a target-language ASR transcript. Compare original then synthetic at similar loudness using the second script. An ASR mistake on a proper name is a review signal, not proof that the audio is wrong; intelligibility, accent, acting, and identity require listening.
7. **Scale after the sample is accepted.** Assign each character a stable ID, reference hash, transcript, model revision, and pronunciation glossary. Track every line's ID, source text, translation, synthesis text, take, seed, duration, ASR result, and review status. Reuse each character's reference and change one variable per retry. This sample script is not a resumable batch engine.

## Decisions

| Observation or goal | Action |
|---|---|
| "Copy the actor so I can compare" | Base model, actor reference, matching transcript; label the result synthetic |
| Different original voices for the cast | VoiceDesign, then retain each accepted reference; see the model selection notes |
| Unsloth has CUDA but incompatible Transformers | Isolated environment or a checked, pinned overlay; preserve Unsloth's installed packages |
| FlashAttention missing | Use tested PyTorch SDPA; do not compile FlashAttention merely to make a preview |
| Names or inflections transcribed incorrectly | Check the text and audio; try one pronunciation or wording correction, retaining earlier takes |
| The line exceeds the available slot | Shorten the translation or regenerate; measure timing before considering gentle time stretching |
| A complete mod is requested | Validate asset mapping, codecs, offsets, lips/synchronization, and playback in a staged game copy separately |

## Commands

PowerShell example; set paths to the selected interpreter, skill, local weights, and staging directory:

```powershell
& $python "$skill/scripts/generate_voice_sample.py" --model "$work/model" `
  --reference "$work/reference.wav" --reference-text-file "$work/reference-en.txt" `
  --text-file "$work/synthesis-ptbr.txt" --output-dir "$work/take-01" `
  --model-revision fd4b254389122332181a7c3db7f27e918eec64e3
& $python "$skill/scripts/compare_audio.py" --original "$work/reference.wav" `
  --synthetic "$work/take-01/sample.wav" --output "$work/take-01/comparison.mp3"
```

When reusing an existing Python via the tested overlay, add `--extra-packages "$work/python-packages"` to the generation command. No shell activation is required.

## Gotchas

- The Unsloth launcher is not necessarily the CUDA interpreter. Inspect `sys.executable`, imported package versions, `torch.cuda.is_available()`, and GPU name before installing anything.
- The tested Qwen package pins Transformers 4.57.3. Downgrading a shared Unsloth environment can break its own Transformers 5.x installation; isolate instead.
- Full cloning uses `ref_text` plus `x_vector_only_mode=False`. Speaker-vector-only mode drops the transcript conditioning; it is not the tested path.
- Source-language reference speech can condition a Portuguese target. Do not translate `ref_text` while leaving the English reference audio unchanged.
- A seed records generation settings; it does not guarantee identical bytes across GPU kernels or dependency versions.
- The tested model's language option is `Portuguese`, not a guarantee of Brazilian accent. Have the user judge accent and performance.

## Stop

- Required local model/tokenizer files, usable CUDA, or a verified reference are missing: report the missing prerequisite before inference.
- A speaker boundary or source format is unresolved: resolve extraction before claiming a character match.
- Audio is empty, non-finite, silent, or truncated: keep the failed take separate and diagnose before scaling.
- A short preview fails the requested voice or pronunciation: return the comparison and resolve that sample before generating the entire cast.

## Rules

- Keep reference rights/provenance and synthesis labels with the project. Owning a game copy does not establish redistribution rights for its voices.
- Do not upload actor references, model weights, game archives, or private transcripts to the skills repository. A local sample request does not authorize publishing a voice pack.
- Do not change game archives, saves, or shared ML environments to produce a preview. Model downloads are a separate setup step; the generation script runs offline.
- Report measured/ASR checks separately from human listening approval and actual in-game playback. Do not describe a generated WAV as an installed, synchronized dub.

## Checklist

- [ ] Voice mode follows the user's choice; source, character, transcript, and reference hash recorded.
- [ ] Runtime isolated; model source/revision and imported versions recorded; originals preserved.
- [ ] Listening copy and raw take saved; no overwritten prior output; numerical checks passed.
- [ ] Target-language ASR inspected; unresolved pronunciation and timing issues stated.
- [ ] Original-versus-synthetic comparison delivered and identified as synthetic.
- [ ] Batch generation and game integration claimed only to the extent actually exercised.
