
# CS 1.6 game modes and gameplay entities

## Preflight
```bash
ripent -export map.bsp && grep -c 'info_player_start'      map.entities   # CT spawns
ripent -export map.bsp && grep -c 'info_player_deathmatch' map.entities   # T spawns
grep -oE 'func_bomb_target|hostage_entity|info_vip_start|func_escapezone' map.entities | sort -u
```

Compare that entity list against the **filename prefix**. The engine picks the mode from the prefix alone; there is no `worldspawn` key for it.

## Workflow
1. Decide the mode, then name the file for it. Renaming `de_map.bsp` to `as_map.bsp` changes the mode and silently orphans the old objective entities.
2. Place both spawn sets, at least 12 to 16 per team.
3. Place the objective entities the prefix requires.
4. Place buy zones, or `info_map_parameters` with `"buying" "0"`.
5. Add lighting entities, or the map ships fullbright.
6. Verify every spawn is in open space with floor under it, programmatically — use `goldsrc-bsp-maintenance`.
7. Ship the custom WADs to server **and** clients, or the map renders entirely purple.

## Prefix to entities

| Prefix | Mode | Required entities |
|---|---|---|
| `as_` | VIP escort | `info_vip_start` plus `func_vip_safetyzone` |
| `de_` | bomb defusal | `func_bomb_target`, or the point variant `info_bomb_target` |
| `cs_` | hostage rescue | `hostage_entity` plus `func_hostage_rescue` |
| `es_` | escape | `func_escapezone` |

| Entity | Team |
|---|---|
| `info_player_start` | **Counter-Terrorists** |
| `info_player_deathmatch` | **Terrorists** |
| `info_vip_start` | the VIP, `as_` only, drawn from the CT team |

The naming is counter-intuitive: `info_player_start` is the CT spawn, not "the player start".

## Symptom to cause

| Symptom | Cause | Fix |
|---|---|---|
| Round never ends, map plays as deathmatch | prefix does not match the objective entities present | rename the file, or add the entities the prefix requires |
| Players telefrag or fail to spawn on a full server | fewer than 12 spawns for that team | add spawns; they are markers, the game assigns free ones |
| Player spawns stuck or falls on respawn | spawn inside a brush, or no floor beneath | test the 32x32x72 box at each origin |
| Nobody can buy anything | no `func_buyzone` and no `info_map_parameters` | ship at least one of the two |
| Whole map is bright purple | custom WADs missing on the client | ship the WADs with the map |
| Map is fullbright | no `light`, `light_spot` or `light_environment` | add lights and recompile with `hlrad` |

## Converting an existing map's mode

The entity layer is text in lump 0, so most of this needs no recompile:

1. Rename the file to the target prefix.
2. Rewrite the entity lump: drop the old objective entities, add the new ones.
3. Point entities — `info_vip_start`, spawns — can be added freely.
4. Brush entities — `func_vip_safetyzone`, `func_bomb_target`, `func_buyzone` — need a `"model" "*N"` that already exists in the BSP.

So reusing an existing trigger volume for a new purpose is a pure ripent job; needing a *new* volume means going back to the `.map` and `goldsrc-map-authoring`.

## Stop
- The conversion needs a brush volume the BSP does not have. Recompile through `goldsrc-map-compiling`; do not fabricate a `*N`.
- `zhlt.wad` is a 12-byte empty stub. You then have no `AAATRIGGER`, `NULL`, `CLIP` or `ORIGIN` and cannot build trigger volumes at all — generate a real one first.
- Start-to-objective distance is trivially short. A VIP that spawns beside the safety zone ends the round instantly; that is a design failure, not a wiring one.

## Rules
- Objective and buy volumes are brush entities textured `AAATRIGGER`, which `hlcsg` strips so they render invisible.
- `de_` wants two bomb sites; one site plays badly.
- Make the objective legible in the world — a marked floor strip, signage, a gate. Players cannot win an objective they cannot find.
- `info_map_parameters` also carries `"bombradius"`.
- Any map with sky faces needs `skyname`, or clients fall back to a default.

## Checklist
- [ ] filename prefix matches the objective entities present
- [ ] at least 12 spawns per team, none inside a brush, all with floor beneath
- [ ] objective volumes reachable and visibly marked
- [ ] buy zones for both teams, or `info_map_parameters`
- [ ] lighting and visibility lumps non-empty
- [ ] no missing textures; custom WADs shipped to server and clients
