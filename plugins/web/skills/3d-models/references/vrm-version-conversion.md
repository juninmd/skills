# VRM 0.x and 1.0 Conversion

Convert a `.vrm` file between VRM 0.x and 1.0 on disk, without Blender or Unity. The reference implementation is the migration code in UniVRM; the facts below come from it and from the [vrm-specification](https://github.com/vrm-c/vrm-specification). Our own wording; no upstream text or code is copied.

## Preflight

```bash
python --version
python -c "import json,struct,sys; d=open(sys.argv[1],'rb').read(); n=struct.unpack_from('<I',d,12)[0]; e=json.loads(d[20:20+n]).get('extensions',{}); print([k for k in e if k.startswith('VRM')])" model.vrm
```

The file must be a glTF 2.0 binary container (GLB) whatever its extension. The second command prints which spec the file declares: `VRM` means 0.x, `VRMC_vrm` means 1.0. A file that declares both needs an explicit direction; never guess.

## Tooling

| Option | Use when | Check first |
|---|---|---|
| `convert_vrm.py` from [miramocha/blender-skills-and-rules](https://github.com/miramocha/blender-skills-and-rules/tree/0aa78005cc56b8c9ce51de4b9fc6133972b03e6b/skills/vrm0-vrm1-convert) | Headless batch conversion with a drop report | No license is published: run it from a vetted local clone at that commit, never copy it into a shipped repository |
| UniVRM in Unity | Unity is already in the pipeline | Its `Migration*` classes are the reference behavior |
| VRM Add-on for Blender import, then export as the other version | The model also needs Blender edits | Round-tripping re-bakes data; compare counts before and after |

Vet the clone with `plugin-vetting.md` from `security-ops` before running it. Its CLI is dry-run by default and needs `--apply` to write, with `--direction auto|0to1|1to0`.

## Workflow

1. Detect the source spec. Copy the file; never write over the only original.
2. Dry-run and read the report: counts of humanoid bones, expressions, springs and MToon materials, plus `dropped[]` and `approximated[]` lists.
3. Show the user every dropped or approximated field before writing. A 1.0 to 0.x downgrade always loses data.
4. Write to a new path, then reopen the output in a VRM viewer or importer. Compare bone, expression and spring counts with the dry-run plan.
5. Keep conversion separate from Blender cleanup; feed the result into [vroid-blender-cleanup.md](vroid-blender-cleanup.md) only if the user asks.

## What Changes Between Versions

| Area | 0.x | 1.0 | Conversion note |
|---|---|---|---|
| Axes | +X right, +Y up, -Z forward | -X right, +Y up, +Z forward | Mesh positions, normals and node translations become `(-x, y, -z)`; UVs and triangle order stay |
| Bind matrices | — | — | Conjugate with `R = diag(-1, 1, -1, 1)`; rotations turn 180° about Y. The same transform reverses itself |
| Extension vectors | spring `gravityDir`/offsets, lookAt head offset | same fields | Only X is negated, per UniVRM `MigrateVector3` |
| Thumbs | `ThumbProximal`, `ThumbIntermediate` | `ThumbMetacarpal`, `ThumbProximal` | Names shift down one segment; node indices stay |
| Expressions | `a i u e o`, `joy sorrow fun`, `blink_l/r` | `aa ih ou ee oh`, `happy sad relaxed`, `blinkLeft/Right` | Morph weights scale 0-100 to 0-1; binds point at nodes, not mesh indices |
| Meta | `title`, `author`, usage enums | `name`, `authors[]`, boolean usage flags | License mapping is lossy; record it, never invent license terms |
| Springs | collider groups, bone groups | sphere or capsule colliders, joint chains | 0 to 1 expands chains and adds end joints; 1 to 0 drops capsules and flattens chains |
| MToon | Unity-style properties | `VRMC_materials_mtoon` | World outline cm to m (×0.01); screen outline ×1/200; `shadingShiftTexture` has no 0.x slot |

## Typically Lost Going 1.0 to 0.x

- `VRMC_node_constraint` and capsule colliders.
- Meta fields with no 0.x slot: redistribution, modification, credit notation, copyright, third-party licenses, license URL, antisocial and political/religious usage.
- MToon 1.0-only textures such as the shading shift texture.

## Stop

- Both specs declared and the user has not chosen a direction.
- The report drops data the user did not approve, or the output's counts differ from the plan.
- A license field must be approximated and nobody with authority over the model has confirmed it.

## Rules

- One output spec per file; never write `VRM` and `VRMC_vrm` together.
- Use mapping tables from UniVRM or the specification, never guessed preset or bone names.
- Geometry, skins, morph targets and textures are preserved; only coordinates and extension JSON are rewritten.

## Checklist

- [ ] Source spec detected and original kept.
- [ ] Dry-run report reviewed; drops and approximations approved.
- [ ] Output reopened and counts match the plan.
