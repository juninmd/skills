---
name: 3d-models
description: |
  Prepare, convert and debug 3D model assets and avatars. Use for Blender cleanup, VRM 0.x/1.0 conversion, VRoid exports, MToon materials, shape keys, ARKit blendshapes, humanoid rigs, and VRM SpringBone hair physics.
---

# 3D Models

## Preflight

```bash
git status --short
rg --files -g '*.vrm' -g '*.glb' -g '*.gltf' -g '*.blend' -g '*.fbx' -g '*.pmx'
blender --version
```

Identify the asset format and spec version, the authoring tool (Blender, VRoid Studio, Unity/UniVRM), installed add-ons, and where the model is consumed (engine, viewer, `@pixiv/three-vrm`). Record the asset license and redistribution terms before editing or shipping it. Work on a copy: model tools rename datablocks and files on disk.

## Workflow

1. Classify the task: format conversion, authoring cleanup, rig or shape key work, or runtime behavior. Open the matching reference below.
2. Snapshot the original (`.blend`, `.vrm`, texture folder) and capture baseline counts: bones, meshes, materials, textures, shape keys, expressions, spring joints and colliders.
3. Run every destructive step as dry-run first. Show the plan, including dropped or approximated data, and wait for approval.
4. Apply in the documented order; dependent phases (bone rename before bone remap, ARKit transfer before topology changes) are not optional.
5. Reopen the result in the consuming tool and compare counts with the baseline and the approved plan. Check a screenshot for material and physics regressions.
6. Report changed assets, dropped data, and anything not verified in the target runtime.

## Task Routing

| Task | Reference | Trap |
|---|---|---|
| VRM 0.x ↔ 1.0 file conversion | [vrm-version-conversion.md](references/vrm-version-conversion.md) | 1.0 → 0.x always drops data; list it before writing |
| VRoid export cleanup in Blender | [vroid-blender-cleanup.md](references/vroid-blender-cleanup.md) | ARKit transfer after tris-to-quads lands offset |
| Hair/cloth physics wrong in three-vrm | [springbone-physics.md](references/vrm-springbone-physics/springbone-physics.md) | Delta in milliseconds or oversized colliders, not a physics bug |
| Scene rendering, loaders, GPU cleanup | `threejs` | Asset fixes belong here; renderer fixes belong there |

See [Reference Map](references/TOPIC_MAP.md) for provenance and scope.

## Stop

- The asset's license forbids modification or redistribution, or its terms are unknown for a shipped build.
- A required add-on, Blender MCP connection or source file is missing.
- The dry-run shows data loss the user has not approved, or post-apply counts differ from the plan.
- A choice needs user input the tools must not guess: body type for ARKit, conversion direction for a dual-spec file.

## Rules

- Never overwrite the only copy of a model; write outputs to new paths.
- Run third-party model scripts only from a vetted clone at a pinned commit; `security-ops` owns vetting. Unlicensed upstream code is referenced, never copied into this repository.
- Treat empirical fixes (collider shrink factors, magic offsets) as hypotheses to measure on the target model.
- Keep conversion, cleanup and runtime tuning as separate steps with their own verification.
- Renderer, loader and GPU resource work goes to `threejs`; measured frame-time work to `performance-engineering`.

## Checklist

- [ ] Format, spec version, tools and asset license identified.
- [ ] Original snapshot and baseline counts captured.
- [ ] Destructive steps dry-run and approved; phase order respected.
- [ ] Output reopened in the consuming tool; counts and visuals match the plan.
