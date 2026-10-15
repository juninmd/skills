# Original Soul Reaver PC: reference extraction

This is a case study for the original Steam game (AppID 224920, build 23388), **not Remastered** and not a general `.dat` decoder. Verify the local edition and source hash before reusing offsets.

## Established source layout

The local `voices.dat` was raw signed 16-bit little-endian PCM, mono, 22050 Hz. This was confirmed against the `SR1PCMonolithicAudioClip` implementation in the source collection for [The Sound of Her Wings](https://www.thelostworlds.net/Software/The_Sound_of_Her_Wings.html), obtained from the author's [source collections](https://www.thelostworlds.net/Software/Source_Code_Collections.html), and then exercised on the actual local archive. No third-party implementation is copied into this skill.

Source SHA-256: `E2A193B62F9723F5F477F705C53A56F895375CE2D980D276D0D0FCEEB2645DF5`.

The Bink cinematics have separate mixed audio; the intro was stereo at 44100 Hz. A music-heavy cinematic was less suitable than isolated dialogue for the voice reference. Do not apply the DAT's PCM flags to a `.bik` file.

## Raziel example that the user accepted

The reference begins at raw-audio second **759.92**, duration **6.26** seconds. The preceding speaker ends around 759.46; the next begins around 766.56. These offsets were refined with English ASR word timestamps and apply to the hash above.

```powershell
Get-FileHash -LiteralPath "$game/voices.dat" -Algorithm SHA256
ffmpeg -hide_banner -loglevel error -n -f s16le -ar 22050 -ac 1 `
  -ss 759.92 -i "$game/voices.dat" -t 6.26 -c:a pcm_s16le "$work/reference.wav"
```

Expected extracted WAV SHA-256 from FFmpeg 8.1.1: `8fa47e41d8e1f068f6db1606ac478c1c6c2d70be2cdef452b8b294b8debaa868`. WAV container metadata can vary across tools; different hashes need inspection rather than an automatic claim of identical extraction.

Reference transcript: “Your thanks are premature, Dumah. I have not forgotten whose hands bore me into the abyss.”

Accepted pronunciation text: “Sua gratidão é prematura, Dumá. Eu não esqueci quem me lançou no abismo.” The shortened wording was a voice preview, not an approved literal translation or timing-aligned replacement for the entire scene.

Qwen Base produced a 6.08-second, 24000 Hz mono sample with BF16/SDPA. Multilingual Whisper small recognized the sentence while rendering the proper name as “do má”. The user listened to an original-then-synthetic comparison and accepted the voice. This validates one local voice preview; it does not establish every character's identity, all dialogue coverage, Brazilian accent consistency, or playback inside the game.

## Integration boundary

Raw audio offsets are not dialogue IDs. Discover the game's event-to-clip mapping before replacing lines; differing durations may require an index/repacker rather than splicing bytes into `voices.dat`. Preserve original archives and test in a separate game copy. Match the engine's required encoding at the final conversion step; keep the 24000 Hz synthesis master.

4K rendering, archive repacking, subtitle injection, lip synchronization, and an installer were not exercised by this voice experiment. Treat each as a separate acceptance gate. Keep all game data, actor references, and generated voice packs out of the skills distribution.
