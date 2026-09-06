
# Authoring GoldSrc geometry (`.map`, Valve 220)

## Preflight
```bash
head -20 mapname.map                       # "mapversion" "220"? anything else is a different dialect
grep -c '^{' mapname.map                   # brush + entity count, against the 8192-leaf ceiling
grep -o '"wad" "[^"]*"' mapname.map        # every texture must live in one of these
```

A `.map` is plain text: a brush is a set of planes, each defined by three points, and the solid is their intersection. That is why geometry can be generated from code and reviewed as a diff instead of a binary `.rmf`.

## Workflow
1. Fix the coordinate conventions first — 16-unit grid, floor tops at round numbers, one storey 224–288 units. Retrofitting a grid costs more than choosing one.
2. Emit brushes with correct winding. Plane normal is `cross(p3 - p1, p2 - p1)`; the three points read clockwise seen from outside. Backwards windings compile silently into holes.
3. Cut, never overlay. A brush entirely inside another loses every face to `hlcsg` and vanishes.
4. Set texture axes per face, then scale and offset. Defaults tile; signs need one exact repeat.
5. Decompose props into at least three brushes each — a single box textured "wood" reads as a concrete block.
6. Generate walls as segments around openings plus a lintel. Never try to subtract.
7. Render a contact sheet of the `.wad` and choose textures by looking, not by name.
8. Compile with `goldsrc-map-compiling`, then place the gameplay entities with `cs16-map-gamemodes`.

## Face syntax
```
( x1 y1 z1 ) ( x2 y2 z2 ) ( x3 y3 z3 ) TEXTURE [ ux uy uz uoff ] [ vx vy vz voff ] rot uscale vscale
```

Axis-aligned box `(x0,y0,z0)-(x1,y1,z1)`, windings that are correct:

| Face | p1 | p2 | p3 |
|---|---|---|---|
| top (z1) | (x0,y1,z1) | (x1,y1,z1) | (x1,y0,z1) |
| bottom (z0) | (x0,y0,z0) | (x1,y0,z0) | (x1,y1,z0) |
| west (x0) | (x0,y1,z1) | (x0,y0,z1) | (x0,y0,z0) |
| east (x1) | (x1,y1,z0) | (x1,y0,z0) | (x1,y0,z1) |
| north (y1) | (x1,y1,z1) | (x0,y1,z1) | (x0,y1,z0) |
| south (y0) | (x1,y0,z0) | (x0,y0,z0) | (x0,y0,z1) |

## Symptom to cause

| Symptom | Cause | Fix |
|---|---|---|
| Sign text is mirrored | default U axis on `+Y` / `-X` faces | `+X` U=(0,1,0), `-X` U=(0,-1,0), `+Y` U=(-1,0,0), `-Y` U=(1,0,0) |
| Texture tiles instead of fitting | `uscale` left at 1 | `uscale = face_width / texture_width`, then offset texel 0 onto the edge |
| Wood grain is a flat color smear | scale 1 on a 6-unit prop | shrink to about 0.3 wood, 0.5 concrete, so one repeat lands |
| Fence or glass renders as a solid blue slab | `{`-masked texture on a world brush | make it a `func_wall` with a render mode, or build it opaque |
| Hole in the floor that looks like a leak | slab fully contained in another slab | emit the general floor as pieces around it, both at the same z |
| Detail panel loses its texture | coplanar face, earlier brush | emit the backing wall first; the later brush wins |

Texture fit, for a south face spanning `x0..x1` with `u = (P·U)/uscale + uoff`:

```python
uscale = (x1 - x0) / texture_width
uoff   = -x0 / uscale        # U = (1,0,0)
voff   =  z1 / vscale        # V = (0,0,-1), texel 0 at the top edge
```

## Stop
- The compiler reports a LEAK you cannot trace to an opening — geometry may be inside-out; re-check windings before hunting for a hole.
- A brush count near 8192 leaves. Cut detail, do not raise the cap.
- The `.map` is a build artifact and someone hand-edited it. Re-injecting hand-detailed fragments into `worldspawn` is the only safe merge; overwriting silently deletes their work.

## Rules
- Overlapping solids are fine; fully contained ones are not.
- Texture names do not describe surfaces, especially in photo-sourced WADs. Look before choosing.
- A prop needs orientation and vertical clearance, not just brushes — a tower 42 tall under a top at 26 pokes through the desk.
- Player box standing is 32x32x72, origin 36 above the feet; a door 128 tall is comfortable.
- Generated `.map` files are build artifacts. Say so in the repo or someone edits them and loses the change.

## Checklist
- [ ] `mapversion 220`, `wad` key lists every WAD used and has no trailing `;`
- [ ] every brush winds clockwise from outside; no brush fully inside another
- [ ] signs read correctly and fit exactly once; prop textures show at least one repeat
- [ ] openings built as segments plus lintel, doors at least 128 tall
- [ ] compiles clean through `goldsrc-map-compiling` with no LEAK
