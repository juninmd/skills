# VRM SpringBone Physics

Open when hair, accessories, or clothing spring physics explode, stick out horizontally, or lock stiffly in `@pixiv/three-vrm`.

## Contents

- Common Failure Symptoms
- Delta Time Clamping (Exploding Physics)
- SpringBone Collider Radius Mismatch
- Runtime Scene Scaling
- Model Hierarchy and Bone Issues
- Robust Initialization Pattern
- SpringBone API Reference

## Common Failure Symptoms

| Symptom | Primary Cause | Immediate Check |
|---|---|---|
| Hair flies upward or explodes on scene load | Delta time passed in milliseconds instead of seconds, or unhandled frame spikes | Clamp delta to `0.05` max seconds; confirm `clock.getDelta()` |
| Hair sticks out horizontally in mid-air | Spherical colliders on head/body are oversized relative to bone scale | Inspect head collider radius; scale down radius by 50% |
| Hair remains rigid and unmoving | Joint stiffness/drag set to 1, or missing child bone in hierarchy | Verify bone has child node with non-zero length |
| Physics operates from offset initial position | Physics updated before model reached rest pose or initial transform | Call `springBoneManager.setInitState()` after transform setup |

## Delta Time Clamping (Exploding Physics)

`vrm.update(delta)` expects `delta` expressed in **seconds** (typically `~0.016` for 60 FPS). Passing milliseconds (e.g., `16.6`) will cause numerical instability and blow apart spring joints. Frame drops or background tab resumption can also supply large delta values.

```javascript
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // Clamp delta to prevent explosion after tab blur or frame lag
  const rawDelta = clock.getDelta();
  const clampedDelta = Math.min(rawDelta, 0.05);

  if (vrm) {
    vrm.update(clampedDelta);
  }

  renderer.render(scene, camera);
}
```

## SpringBone Collider Radius Mismatch

VRM models embed spherical colliders to prevent hair from clipping through the skull, torso, or shoulders. When exported from authoring tools with non-uniform bone scaling, collider radii often export larger than the visual mesh, pushing hair outward into permanent horizontal projection.

### Diagnosis

Disable colliders temporarily to isolate the source:

```javascript
const colliders = Array.from(vrm.springBoneManager?.colliders || []);
colliders.forEach((collider) => {
  if (collider.shape) collider.shape.radius = 0;
});
```

If the hair falls naturally upon collider neutralization, the colliders are oversized.

### Remedies

#### Option A: 50% Radius Scale Factor (Standard Fix)

Scales down collider radii uniformly while preserving collision protection:

```javascript
const SCALE_FACTOR = 0.5;
const colliders = Array.from(vrm.springBoneManager?.colliders || []);

colliders.forEach((collider) => {
  if (collider.shape?.radius > 0) {
    if (collider._originalRadius === undefined) {
      collider._originalRadius = collider.shape.radius;
    }
    collider.shape.radius = collider._originalRadius * SCALE_FACTOR;
  }
});
```

#### Option B: Target Head and Face Colliders Only

```javascript
colliders.forEach((collider) => {
  const boneName = collider.bone?.name?.toLowerCase() || '';
  if (boneName.includes('head') || boneName.includes('face')) {
    collider.shape.radius = 0;
  }
});
```

## Runtime Scene Scaling

When scaling `vrm.scene` dynamically for viewport adaptation, bone coordinates scale while collider sphere radii remain in local units unless explicitly synchronized:

```javascript
function setVRMScale(vrm, scaleFactor) {
  vrm.scene.scale.setScalar(scaleFactor);

  const manager = vrm.springBoneManager;
  if (!manager) return;

  const colliders = Array.from(manager.colliders || []);
  colliders.forEach((collider) => {
    if (collider.shape?.radius !== undefined) {
      if (collider._originalRadius === undefined) {
        collider._originalRadius = collider.shape.radius;
      }
      collider.shape.radius = collider._originalRadius * scaleFactor;
    }
  });
}
```

## Model Hierarchy and Bone Issues

If physics bones report zero length (`_worldSpaceBoneLength: 0`) or fail to respond:

1. **Missing terminal node:** SpringBone chains require a leaf/child bone at the tip to establish chain direction and segment length. Without a terminal node, segment length evaluates to zero.
2. **Missing gravity direction:** Verify `gravityDir` points downward along negative Y `(0, -1, 0)`.
3. **Rig verification:** Test the model in an independent reference VRM viewer. If physics fails there, the issue resides in the exported file structure rather than the runtime loader.

## Robust Initialization Pattern

```javascript
export function setupVRMPhysics(vrm) {
  const manager = vrm.springBoneManager;
  if (!manager) return;

  // Compensate for oversized authoring collider exports
  const COLLIDER_FACTOR = 0.5;
  const colliders = Array.from(manager.colliders || []);

  colliders.forEach((collider) => {
    if (collider.shape?.radius > 0) {
      collider._originalRadius = collider.shape.radius;
      collider.shape.radius *= COLLIDER_FACTOR;
    }
  });

  // Reset initial simulation state to avoid initial velocity jerk
  manager.reset();
  manager.setInitState();
}
```

## SpringBone API Reference

| Method / Property | Description |
|---|---|
| `manager.reset()` | Re-centers bones to their rest transforms |
| `manager.setInitState()` | Snapshots current bone transform as simulation baseline |
| `manager.joints` | Active set of simulation spring joints |
| `manager.colliders` | Active set of collision volumes |
| `vrm.update(delta)` | Advances both humanoid pose and spring simulation |

### Joint Settings Properties

| Property | Typical Value | Purpose |
|---|---|---|
| `stiffness` | `0.1` - `0.8` | Spring restoring force back toward baseline rest angle |
| `gravityPower` | `0.0` - `1.0` | Magnitude of gravitational acceleration |
| `gravityDir` | `(0, -1, 0)` | Direction vector for gravitational influence |
| `dragForce` | `0.2` - `0.6` | Velocity damping to prevent endless oscillation |
