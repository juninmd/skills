---
max_turns: 8
timeout_seconds: 150
allowed_tools: [Skill]
runs: 3
---
Review this diff for defects before it merges. `page` is 1-indexed (the first page is `page=1`).

```diff
--- a/src/pagination.ts
+++ b/src/pagination.ts
@@ -8,7 +8,7 @@ export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
-  const offset = (page - 1) * pageSize;
+  const offset = page * pageSize;
   return items.slice(offset, offset + pageSize);
 }
```
