---
name: goldsrc-modding
description: |
  Author, compile, and maintain Counter-Strike 1.6 and GoldSrc maps, game modes, and AMX Mod X plugins. Use for Valve 220 .map geometry, ZHLT/VHLT compiles, BSP30 lumps, CS 1.6 entities, and Pawn (.sma/.amxx) natives, forwards, precache, and crash forensics. Trigger on 'my map leaks', 'AllocBlock full', 'the plugin crashes the server'.
---


# GoldSrc Modding

**Not this skill:** modern engines or generic 3D assets (`3d-models`, `threejs`).

## Preflight
```bash
for tool in hlcsg hlbsp hlvis hlrad ripent; do command -v "$tool" >/dev/null 2>&1 && echo "$tool: found" || echo "$tool: MISSING"; done
```

## Workflow
1. Inspect map source format and target game mode entities.
2. Select topic reference from [Reference Map](references/TOPIC_MAP.md) based on task needs:
   - For brush construction and texture alignment: [Map Authoring](references/goldsrc-map-authoring.md)
   - For compiler pipelines and build errors: [Map Compiling](references/goldsrc-map-compiling.md)
   - For BSP lump extraction and entity tweaks: [BSP Maintenance](references/goldsrc-bsp-maintenance.md)
   - For round objectives, spawns and buy zones: [Game Modes](references/cs16-map-gamemodes.md)
   - For AMX Mod X plugin bugs, crashes, or native/forward design: [AMX Mod X Scripting](references/goldsrc-amxmodx-scripting.md)
3. Author geometry adhering to grid snapping, CSG convex brush rules, and texture alignments.
4. Validate entity logic, spawn counts, and round objectives.
5. Compile with ZHLT/VHLT toolchain flags and check logs for leaks or AllocBlock errors.
6. Audit compiled BSP lumps or patch entity tables with ripent.

## Domain Reference Map
| Sub-domain | Reference | When to use |
|---|---|---|
| Map geometry & brushes | [Map Authoring](references/goldsrc-map-authoring.md) | Valve 220 format, brush construction, texture alignment |
| Compilation & tools | [Map Compiling](references/goldsrc-map-compiling.md) | ZHLT/VHLT build passes, leak debugging, AllocBlock fixes |
| BSP30 maintenance | [BSP Maintenance](references/goldsrc-bsp-maintenance.md) | Lump inspection, entity editing with ripent, engine limits |
| Game modes & entities | [Game Modes](references/cs16-map-gamemodes.md) | Bomb targets (de_), hostages (cs_), VIP escort (as_), buy zones |
| AMX Mod X / Pawn plugins | [AMX Mod X Scripting](references/goldsrc-amxmodx-scripting.md) | .sma/.amxx crashes, native/forward design, precache lifecycle |

## Stop
- Halt when compile logs report LEAK or unrecoverable brush corruption.
- Do not ship decompiled maps without checking coplanar brush degradation.

## Rules
- Hand off build tools to `tooling-dev`, map exploration to `starting-dev`, and engine architecture to `software-architecture`.
- Always keep world brushes convex and grid-aligned (minimum 1 unit).
- Consult [Reference Map](references/TOPIC_MAP.md) before diagnosing compile errors or lump formats.

## Checklist
- [ ] Map geometry verified clean without leaks or coplanar errors
- [ ] Round objectives, buy zones, and spawn points properly configured
- [ ] Compiler toolchain flags set and compile log verified clean
