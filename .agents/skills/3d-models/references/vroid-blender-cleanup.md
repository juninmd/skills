# VRoid Avatar Cleanup in Blender

Turn a raw VRoid Studio export into a tidy Blender project: readable bone, material, texture, shape key and mesh names, synced MToon shading, optional ARKit face shapes. The phase order and naming facts come from [miramocha/blender-skills-and-rules](https://github.com/miramocha/blender-skills-and-rules/tree/0aa78005cc56b8c9ce51de4b9fc6133972b03e6b/skills/vroid-vrm-blender-cleanup), which publishes no license. This page is our own summary: run its scripts from a vetted local clone at that commit, never copy them into a shipped repository.

## Preflight

```bash
blender --version
blender --background --python-expr "import bpy; print('vrm' in dir(bpy.ops.import_scene), 'transfer_shapekeys' in dir(bpy.ops.vrm))"
```

Needs the VRM Add-on for Blender (import and bone rename). ARKit shapes also need the Beyond VRM Extension Suite add-on (`transfer_shapekeys`). Agents drive Blender through a Blender MCP server, or the user runs scripts in the Scripting workspace. Save a copy of the `.blend` and the `textures/` folder first: texture renames also rename files on disk.

## Phase Order

Run each phase as dry-run, then approval, apply, verify. Order matters:

| Step | Phase | Result | Depends on |
|---|---|---|---|
| 1 | Import (optional) | `.vrm` loaded into an empty file; armature and Face object names recorded | VRM add-on |
| 2 | A: humanoid bones | VRoid `J_Bip_*` bones renamed to VRM humanoid names via the add-on's bone rename | Always required |
| 3 | B: materials | `N00_000_00_` style prefixes and ` (Instance)` stripped; `Face_00_SKIN` becomes `Face_Skin`; alias map stored on the scene | A |
| 4 | C: textures | MToon image datablocks and PNG files renamed `<material>_<slot>` (`base`, `shade`, `normal`, `emissive`, `matcap`, `rim`, `outline_width`, `shading_shift`, `uv_anim_mask`) | B |
| 5 | B again | Catches `.001` duplicate materials that still carry prefixes | C |
| 6 | D: ARKit shapes | Beyond add-on transfers male or female ARKit face shapes | User stated body type |
| 7 | E: reset | Face shape key values zeroed | D applied |
| 8 | B + C cleanup | Duplicate materials from D rewired to canonical images; unused images removed | D |
| 9 | J: MToon sync | Rim and toony shading copied from a reference material such as `Face_Skin`; shading shift stays per material | B, C |
| 10 | F: shape keys | `Fcl_*` keys renamed and VRM expression binds updated to match | A |
| 11 | G: custom bones | Project bone naming, hair mirror pairs, vertex groups and F-curves updated together | A |
| 12 | K: bone collections | Bones grouped into Hair, Body and Clothing | G |
| 13 | H: colliders | Collider empties renamed after their bone; display names synced | G |
| 14 | I: mesh data | `(merged)` and `.baked` suffixes removed from mesh datablocks | Last |

Without a stated body type, skip D and E, finish the rest, and ask at the end whether to run them.

## Topology Trap

Transfer ARKit shapes (D) on the original triangle mesh. Tris-to-quads, merges, separating by material, decimation or remeshing first makes transferred shapes land offset. If the mesh is already quads, go back to the pre-conversion `.blend`, run D there, then redo the topology work.

## Naming Traps

- A single-material hairstyle's `Hair_00_HAIR` maps to `Hair_Back`, the back-of-head slot on Body. On a strand Hair object, rename it to `Hair_01` before C so its textures get the right prefix.
- When shade and lit textures are the same image, keep one `base` texture instead of duplicating it.
- Multiple `.vrm` files in one folder: ask which one to import.

## Stop

- Phase A is missing from a requested run, or G is requested before A.
- Body type for D was not stated by the user.
- A required add-on or the MCP connection is missing; report which one.
- No backup of the `.blend` and texture folder exists before C.

## Rules

- Never guess male or female for ARKit transfer.
- Remind the user to save after C and at the end.
- Out of scope unless asked: per-material shade color edits, VRM re-export validation, automatic VRM 1.0 expression assignment.

## Checklist

- [ ] Backup taken; add-ons and MCP confirmed.
- [ ] Phases ran in order, each dry-run before apply.
- [ ] D ran before any topology change, or was skipped with a follow-up question.
- [ ] Final names verified and the `.blend` saved.
