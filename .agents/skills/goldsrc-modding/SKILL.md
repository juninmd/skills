---
name: goldsrc-modding
description: |
  Author, compile, maintain, and configure Counter-Strike 1.6 and GoldSrc maps and game modes. Use for Valve 220 .map geometry, ZHLT/VHLT compile pipelines, BSP30 lump editing, and CS 1.6 entity logic.
---


# GoldSrc Modding

## Preflight
```bash
which hlcsg hlbsp hlvis hlrad 2>/dev/null || which ripent 2>/dev/null || echo "GoldSrc tools checked"
```

## Workflow
1. Inspect map source format and target game mode entities.
2. Select topic reference from [Reference Map](references/TOPIC_MAP.md) based on task needs:
   - For brush construction and texture alignment: [Map Authoring](references/goldsrc-map-authoring.md)
   - For compiler pipelines and build errors: [Map Compiling](references/goldsrc-map-compiling.md)
   - For BSP lump extraction and entity tweaks: [BSP Maintenance](references/goldsrc-bsp-maintenance.md)
   - For round objectives, spawns and buy zones: [Game Modes](references/cs16-map-gamemodes.md)
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

## Stop
- Halt when compile logs report LEAK or unrecoverable brush corruption.
- Do not ship decompiled maps without checking coplanar brush degradation.

## Rules
- Hand off build tools to `tooling-dev`, map exploration to `codebase-mapping`, and engine architecture to `software-architecture`.
- Always keep world brushes convex and grid-aligned (minimum 1 unit).
- Consult [Reference Map](references/TOPIC_MAP.md) before diagnosing compile errors or lump formats.

## Checklist
- [ ] Map geometry verified clean without leaks or coplanar errors
- [ ] Round objectives, buy zones, and spawn points properly configured
- [ ] Compiler toolchain flags set and compile log verified clean
