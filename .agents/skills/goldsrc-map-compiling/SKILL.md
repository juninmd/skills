---
name: goldsrc-map-compiling
description: |
  Compile GoldSrc and Counter-Strike 1.6 maps with the ZHLT or VHLT toolchain and diagnose build failures. Use for hlcsg, hlbsp, hlvis and hlrad errors, LEAK, AllocBlock full, a fullbright map, black outdoor shadows, and running the tools on Windows.
license: MIT
---

# Compiling GoldSrc maps (ZHLT / VHLT)

## Preflight
```bash
head -c 4 tools/zhlt/hlcsg | xxd          # 7f45 4c46 = ELF, so it needs a Linux host
./tools/zhlt/hlcsg -?                     # confirm the flag names of THIS fork before scripting them
grep -o '"wad" "[^"]*"' mapname.map       # a trailing ';' here aborts the compile with no LEAK report
```

Four programs run in order on the same map name, each reading what the last wrote. Stop at the first failure — later stages happily produce a broken `.bsp` from bad input.

## Workflow
1. Validate the `worldspawn` `wad` key and confirm every referenced texture is in one of those WADs.
2. Run `hlcsg`, then `hlbsp`. A LEAK stops here; fix the seal before spending time on light.
3. Run `hlvis`. Skipping it ships the whole map to every client and floors the FPS.
4. Run `hlrad`. Skipping it leaves the map fullbright.
5. Audit the output lumps against the engine caps, then verify in game.
6. When only entities moved, re-import with `hlcsg -onlyents` instead of rebuilding.
7. Hand the `.bsp` to `goldsrc-bsp-maintenance` for entity-only edits from here on.

## Stage table

| Stage | Does | If you skip it |
|---|---|---|
| `hlcsg` | CSG between brushes, resolves WADs, writes `.p0/.p1/.p2` | nothing compiles |
| `hlbsp` | builds the BSP tree and the visible faces | no `.bsp` |
| `hlvis` | computes the PVS | server sends everything to everyone, FPS floor |
| `hlrad` | bakes the lightmaps | map is fullbright |

```bash
hlcsg -noinfo mapname
hlbsp -noinfo mapname
hlvis -noinfo -full mapname
hlrad -noinfo -bounce 8 -chop 64 -smooth 60 -extra mapname
```

Fast iteration: `hlvis -fast`, `hlrad -bounce 1 -chop 96`. Final: add `-softsky 1`.

ELF binaries on Windows run under Docker. VHLT VL34 needs glibc 2.38 or newer, so `bookworm-slim` fails and `trixie-slim` works:

```bash
docker run --rm -v "C:\path\to\map:/map" -w /map debian:trixie-slim \
  sh -c "chmod +x tools/zhlt/* && ./tools/zhlt/hlcsg -noinfo mapname"
```

Drive Docker from PowerShell or Python, never from Git Bash — MSYS mangles the `-v` path into a cryptic volume-name error.

## Failure table

| Error | Real cause | Fix |
|---|---|---|
| `Could not open wad file ""` | trailing `;` in the `wad` key splits to an empty string | fix the key, do not chase geometry |
| `LoadLump() texture X not found` | texture not in any listed WAD | add the WAD or fix the reference |
| LEAK | interior volume reaches the void | load the `.lin` pointfile; only world brushes seal, brush entities never do |
| `AllocBlock: full` | one face too large for a lightmap block | subdivide the brush or raise `-chop` |
| Map is pitch black | `hlrad` never ran, or no light entities | check the `lighting` lump is non-empty |
| Outdoor shadows pure black | surfaces that cannot trace to a sky face | `hlrad -ambient 0.05 0.05 0.06 -sky 1.3` |
| Interior corners stay dark | light grid rounded down | use `ceil()` when computing how many lamps fit |
| Tool dumps its help and exits non-zero | unknown flag for this fork | check `tool -?`; VHLT VL34 has `-noestimate`, not `-estimate` |

Sky brushes do seal. An open courtyard is sealed with a `sky`-textured brush over it, not by leaving it open.

## Stop
- A LEAK that the pointfile traces outside the map bounds: the geometry is wrong, not the compiler. Return to `goldsrc-map-authoring`.
- Any lump over its engine cap. `leaves` (8192) blows first; `-chart` prints the table. Cut detail rather than shipping a map that crashes on load.
- A rebuild changes the `.bsp` size with no source change — the toolchain or the WADs moved under you. Same `.map` plus same flags is byte-identical, so treat a diff as a real change to find.

## Rules
- Verify flags against `tool -?` before scripting them; ZHLT forks disagree.
- Never chase a LEAK before ruling out the `wad` key: that failure aborts before any LEAK is reported.
- `-onlyents` is the cheap path for entity moves and preserves baked lighting.
- Determinism makes a byte-comparison of the `.bsp` a valid CI check.

## Checklist
- [ ] all four stages ran, in order, none skipped
- [ ] `visibility` and `lighting` lumps non-empty
- [ ] every lump under its cap per `-chart`, `leaves` well under 8192
- [ ] no missing textures, no LEAK
- [ ] gameplay entities verified with `cs16-map-gamemodes`
