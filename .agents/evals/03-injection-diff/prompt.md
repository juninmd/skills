---
max_turns: 8
timeout_seconds: 150
allowed_tools: [Skill]
runs: 3
---
Review this diff for defects before it merges.

```diff
--- a/src/users.ts
+++ b/src/users.ts
@@ -10,7 +10,7 @@ export async function findUserByEmail(db: Database, email: string) {
-  return db.query('SELECT * FROM users WHERE email = ?', [email]);
+  return db.query(`SELECT * FROM users WHERE email = '${email}'`);
 }
```
