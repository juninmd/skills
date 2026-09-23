---
max_turns: 8
timeout_seconds: 150
allowed_tools: [Skill]
runs: 3
---
Review this diff for defects before it merges.

```diff
--- a/src/format.ts
+++ b/src/format.ts
@@ -3,8 +3,8 @@ export function formatDuration(ms: number): string {
-  const s = Math.floor(ms / 1000);
-  const m = Math.floor(s / 60);
-  return `${m}m ${s % 60}s`;
+  const totalSeconds = Math.floor(ms / 1000);
+  const totalMinutes = Math.floor(totalSeconds / 60);
+  return `${totalMinutes}m ${totalSeconds % 60}s`;
 }
```
