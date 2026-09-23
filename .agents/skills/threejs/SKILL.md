---
name: threejs
description: |
  Build and debug Three.js interactive 3D scenes. Use for GLTF/GLB model viewers, cameras, lighting, raycasting, shaders, animation, WebGL/WebGPU rendering, asset loading, scene performance, and GPU resource cleanup. Trigger on '3D model viewer', 'the scene renders black', 'textures leak memory', 'click to select in 3D'.
---

# Three.js

**Not this skill:** preparing or converting the model assets a scene loads (`3d-models`), or non-3D web UI (`frontend-engineering`).

## Preflight

```bash
rg --files -g package.json -g '*lock*' -g '*three*' -g '*.glb' -g '*.gltf'
rg -n 'WebGLRenderer|WebGPURenderer|Canvas|useFrame|GLTFLoader|setAnimationLoop|requestAnimationFrame' src
```

Adapt the source path to the repository. Read the installed Three.js and optional React Three Fiber versions, existing renderer ownership, asset licenses, target devices and browser constraints. Confirm a real browser with graphics support is available; a successful build cannot prove a scene renders.

## Workflow

1. Define the visible result, interaction, asset budget and target viewport/device. Preserve the existing renderer and framework unless a requirement justifies migration.
2. Establish one canvas and renderer owner, scene, camera, lights and resize handling. Measure the canvas container; update camera aspect/projection and drawing-buffer size when it changes. Cap pixel ratio against the agreed quality budget.
3. Load a minimal asset through `GLTFLoader` from `three/addons/loaders/GLTFLoader.js`; add the decoders its extensions require. Test asset URLs in the production build, loading progress, failure and a late load resolving after unmount.
4. Frame model bounds with deliberate clipping planes and controls limits. Verify material appearance against a reference image before changing color space, exposure or tone mapping; use APIs matching the installed version.
5. Give animation one scheduler. Use `renderer.setAnimationLoop` for continuous rendering; a static viewer may render on demand after loads, resize and interaction. Drive motion by elapsed time; stop the loop and detach controls/listeners on teardown. In React Three Fiber use its lifecycle and `useFrame`, never a second renderer loop.
6. Track ownership of geometries, materials, textures, render targets, mixers and decoder workers. Release owned resources on replacement/unmount; shared cached assets remain live until the last owner releases them. Dispose late load results instead of attaching them to a dead scene.
7. Run the build and browser checks: visible first frame, resize, pointer and keyboard controls, failed asset, reduced motion, repeated mount/unmount and supported renderer fallback. Record console errors and a screenshot; use `performance-engineering` for repeatable CPU/GPU analysis.

## Rendering Decisions

| Evidence / requirement | Action | Tradeoff or check |
|---|---|---|
| Existing WebGL shaders or EffectComposer passes | Keep WebGLRenderer until a migration is tested | WebGPURenderer does not accept these as drop-in equivalents |
| WebGPU or TSL features needed | Evaluate WebGPURenderer and its WebGL 2 fallback | Test target browsers and forceWebGL; initialize before manual rendering |
| Many repeated meshes | Consider InstancedMesh with measured draw-call reduction | Picking and per-instance updates require explicit handling |
| Fill rate or memory dominated by textures/shadows | Reduce pixel ratio, texture size, shadow resolution or passes based on evidence | Lower triangle count alone may not help |
| Static product viewer | Render on demand; invalidate for controls and asset updates | Damping and animation still need ongoing frames while active |
| No supported graphics context / assistive technology | Provide HTML content, controls and a useful static alternative | `frontend-engineering` owns accessible surrounding UI |
| Raycasting against a large or high-poly scene is slow | Narrow the candidate list before raycasting (layers, a bounding-volume hierarchy such as `three-mesh-bvh`, or spatial partitioning) instead of testing every mesh | A naive `raycaster.intersectObjects(scene.children, true)` scales with total triangle count, not with what's under the pointer |
| GPU memory or load time dominated by textures | Ship compressed GPU texture formats (KTX2/Basis via `KTXLoader`, or platform-native ASTC/ETC2) instead of raw PNG/JPEG decoded to a full-size GPU texture | Compressed formats trade a build step for far lower VRAM and faster upload; verify decoder support on target browsers first |

## Stop

- No graphics-capable browser is available: report build evidence separately from unverified rendering.
- Asset provenance is unclear, load fails silently, renderer initialization fails, or console errors remain unexplained.
- Repeated scene replacement causes sustained growth in owned GPU resources, or cleanup breaks another scene's shared asset.

## Rules

- Do not assume WebGPU is faster: compare the same scene and quality settings on the target device.
- Removing objects from a scene does not free GPU resources. Material disposal does not dispose its textures. Close owned ImageBitmap data only after all consumers are done.
- Use `renderer.info` for counts and trends, not total GPU memory or proof that all internal caches must reach zero.
- Keep accessible product information outside the canvas; honor reduced motion and avoid trapping keyboard focus in controls.
- Hand general component work to `frontend-engineering`, application boundaries to `software-architecture`, measured optimization to `performance-engineering`, and VRM/Blender asset preparation to `3d-models`.

## Sources

Consult these official references for the installed release, especially before renderer migration:
- [Renderer selection and migration](https://threejs.org/manual/en/webgpurenderer.html).
- [GLTFLoader and decoder requirements](https://threejs.org/docs/pages/GLTFLoader.html).
- [GPU resource ownership and disposal](https://threejs.org/manual/en/cleanup.html).

## Checklist

- [ ] Scene and assets render in the target browser with correct framing and material appearance.
- [ ] Resize, interactions, loading failures and accessible alternative exercised.
- [ ] One scheduler; repeated teardown releases owned resources without damaging shared ones.
- [ ] Build and browser evidence recorded; renderer/performance limitations explicit.
