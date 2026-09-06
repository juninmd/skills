
# Maintaining compiled GoldSrc `.bsp` files

## Preflight
```bash
xxd -l 4 map.bsp                  # 1e000000 = version 30; anything else is a different engine
cp map.bsp map.bsp.bak            # always, before any import
```

A BSP30 is a plain container: a 124-byte header of 15 `(offset, length)` pairs, then the lumps. Nothing is compressed or encrypted, so a couple hundred lines of Python read all of it.

## Workflow
1. Parse the header, assert version 30, and dump the lump table.
2. Export lump 0 (entities, plain NUL-terminated text) to a file.
3. Edit the text. Point entities can be added freely; brush entities cannot.
4. Re-import by rebuilding the file with every non-entity lump in its original order, 4-byte aligned, the new entity text appended, and the header offsets rewritten.
5. Verify losslessness by comparing every other lump byte for byte against the backup.
6. Audit the engine limits and run the point-in-world query over every spawn.
7. When the fix needs new geometry, stop and go back through `goldsrc-map-compiling`.

## Lump table

| # | Lump | Content | Entry size | Cap |
|---|---|---|---|---|
| 0 | entities | plain text, NUL-terminated | — | ~512 KB |
| 1 | planes | normal + distance | 20 | 32767 |
| 2 | textures | embedded miptex, or just the name | — | — |
| 3 | vertices | 3 floats | 12 | 65535 |
| 4 | visibility | compressed PVS | — | 2 MB |
| 5 | nodes | BSP tree nodes | 24 | 32767 |
| 6 | texinfo | texture axes, Valve 220 | 40 | 32767 |
| 7 | faces | polygon, plane, texinfo, lightmap offset | 20 | 65535 |
| 8 | lighting | RGB lightmaps | — | 6 MB |
| 9 | clipnodes | collision hulls 1-3 | 8 | 32767 |
| 10 | leaves | leaves and `contents` | 28 | **8192, blows first** |
| 11 | marksurfaces | faces per leaf | 2 | 65535 |
| 12/13 | edges / surfedges | the sign of a surfedge gives direction | 4 | 256000 / 512000 |
| 14 | models | model 0 is the world, 1..N are brush entities | 64 | 400 |

The world must also stay within plus or minus 4096 on every axis.

## Ripent: the one technique that pays for itself

No other lump depends on lump 0, so the whole entity list can be rewritten with no recompile and no loss of baked lighting. That fixes, with no source available: missing spawns, spawns inside walls, a team with no spawns, objective entities in the wrong place, a wrong `skyname`, a `wad` key holding the original author's absolute local paths, and an entity that crashes the server.

Editing a lamp's `_light` is allowed but **shadows do not recompute** — the lightmap is baked and only `hlrad` changes it.

## Point-in-world query

Walk the tree exactly as the engine does, on hull 0:

```python
idx = 0
while idx >= 0:
    planenum, child0, child1 = nodes[idx]
    dist = dot(plane_normal[planenum], point) - plane_dist[planenum]
    idx = child0 if dist >= 0 else child1
leaf = -(idx + 1)
return leaf_contents[leaf]   # EMPTY -1, SOLID -2, SKY -6
```

Test the eight corners of the 32x32x72 player box around each spawn origin, with the origin 36 above the feet, and check for solid directly below it. Spawns buried in geometry only surface on a full server and are nearly invisible walking the map.

## Stop
- The import needs a `"model" "*N"` that does not exist in the `models` lump. You cannot create a brush entity by ripent; a tool that emits it produces a `.bsp` that crashes clients. Recompile instead.
- Version is not 30, or a lump offset points past end of file. Do not repair in place.
- Any lump over its cap — report it; a map at the limit needs geometry cuts from `goldsrc-map-authoring`.

## Rules
- Write the `.bak` before the import, every time.
- Verify by byte-comparing untouched lumps, not by loading the map.
- `offsets[0] == 0` in a miptex means the texture is external and lives in a `.wad`.
- Names drive engine behavior: `sky`, `{`-prefixed masks, and `AAATRIGGER`, `NULL`, `CLIP`, `ORIGIN`, `HINT`, `SKIP`, `BEVEL`.
- Rendering headless: apply a gamma lift of about 1/1.35 or the image is far darker than the game, and pick the floor slice as the lowest height holding meaningful area, never the height with the most upward-facing area.

## Checklist
- [ ] version 30 confirmed, `.bak` written
- [ ] non-entity lumps byte-identical after the import
- [ ] no brush entity invented; every `*N` already existed
- [ ] every spawn tested against the player box and has floor beneath
- [ ] all lumps under their caps
