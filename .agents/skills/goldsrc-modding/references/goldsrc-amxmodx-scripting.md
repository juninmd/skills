
# AMX Mod X / Pawn scripting (.sma/.amxx)

Pawn is not C: no operator overloading, no array-literal concatenation, and its native/forward boundary is a real seam — most GoldSrc server crashes trace back to one side violating what the other side promised.

## Language traps

| Trap | Symptom | Fix |
|---|---|---|
| Array-literal concatenation (`new x[] = a[] + b[]`) | Compile error or garbage data — Pawn has no `+` operator for arrays | Build with `copy()`/`format()`/`add()` from `string.inc`, never literal concatenation |
| Unparenthesized bit-shift in a mask (`flags & 1<<5`) | Wrong branch taken silently, no compiler warning | Always parenthesize shift masks explicitly: `flags & (1<<5)` |
| `precache_model()`/`precache_sound()` called outside `plugin_precache()` | Server crash (invalid precache index) the first time that asset is used | Precache everything in `plugin_precache()`, every map change — indices are not shared across maps |
| A native's return type doesn't match its registered signature | Silent stack corruption, crash far from the actual bug | Verify `register_native()`/`register_forward()` signatures against the calling convention before debugging the call site |

## Native vs. forward

- A **native** is implemented in a compiled module or the engine and called *from* Pawn (`register_native()`); the plugin is the caller.
- A **forward** is implemented in Pawn and called *into* by the engine/module (`register_forward()` or an engine forward like `client_death`); the plugin is the callee.
- Getting the direction backwards (writing a forward's logic as if it were a native's, or vice versa) is the most common source of "works until a specific game event" crashes.

## Crash forensics from a core dump

1. Reproduce with the server's own binary and mods — a decompiled/rebuilt server rarely crashes the same way.
2. Capture the core dump (`ulimit -c unlimited` before launch; in a container, mount a writable path for it).
3. `gdb hlds_linux core` → `bt full` for the backtrace; map frames back to the AMXX module, not just `engine_i486.so`.
4. If the trace bottoms out in `amxx_i386.so` with no plugin frame, suspect a native/forward signature mismatch or a `precache_*` call outside its lifecycle, not the plugin's own logic.

## Stop

- Do not fix a crash by wrapping the call site in a bounds check without first confirming the native/forward direction and precache lifecycle are correct — that hides the real defect one call further out.
