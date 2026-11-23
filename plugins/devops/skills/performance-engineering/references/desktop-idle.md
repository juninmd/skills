# Desktop and Tray App Idle Cost

A tray or menu-bar app is hidden almost all of its life, so the metric is **work done while nobody looks**, not first paint. Load this for Tauri, Electron, or any webview shell reported as "using CPU/battery at rest", slow to open, or heavy on memory.

## Preflight
```bash
# Count wakeups, not average CPU: an idle process at 0.3% can still wake 50x/s.
# Windows: Resource Monitor > CPU > Threads, or WPR/WPA (CPU Usage Sampled + Timer).
# Linux/macOS: pidstat -w -p <pid> 5 · top -pid <pid> -stats cpu,idlew
# Webview: DevTools > Performance monitor (JS heap, DOM nodes, layouts/s) with the window hidden.
```
State the target as a number first: wakeups/s hidden, RSS hidden, ms to first interactive after show.

## Workflow
1. Record the hidden baseline for 5 minutes, window hidden, nothing polling on the user's side.
2. List every recurring source: `setInterval`/`setTimeout` chains, `requestAnimationFrame`, CSS animations, polling `fetch`/IPC, file watchers, backend timers. Each needs an owner and a reason to run while hidden.
3. Gate each on visibility: skip the tick while `document.hidden` and resync on `visibilitychange` (the UI side), or on the shell's show/hide event (the host side, authoritative when the webview does not report visibility).
4. Re-measure the same 5 minutes. Keep only if hidden wakeups or CPU dropped beyond noise and the first frame after show is still current.
5. Guard it: a unit test with fake timers and a mocked `document.hidden` that asserts no state change while hidden and a catch-up on reveal.

## Decision Table
| Symptom | Likely cause | Check | Fix |
|---|---|---|---|
| CPU/battery at rest | timer or animation firing while hidden | wakeups/s with window hidden | pause on hidden, resync on show |
| Slow first show | work deferred until the window opens | trace show-to-ready | keep last state in memory, render from it, refresh in background |
| Heavy RSS | one webview per window, large heap | heap snapshot, DOM node count | one window, drop caches on hide, split rarely used screens |
| Big install/boot | whole app in one chunk | bundle analyzer, boot bench under CPU throttle | lazy-load locales and rarely used routes |
| Throttled but still woke | browser throttles hidden timers, does not stop them | background timers still run at reduced rate | explicit pause, not reliance on throttling |

## Rules
- Throttling is not pausing: Chromium throttles hidden-page timers (about once per second, tighter after several minutes), so a tick still fires. Pause explicitly.
- Hidden-state signals differ by shell. Verify `visibilitychange` fires on the real target; if the host hides the window without it, forward a host event instead of trusting the web API.
- Resync immediately on show; a paused clock must not display stale countdowns.
- Boot benchmarks: build both bundles, run Chromium with CPU throttling (4x) over 15+ runs, report median and spread, never one run.
- A change that cannot be measured on the CI box (tray, DPI, WebView2) is stated as unverified in the PR, never implied.

## Checklist
- [ ] Hidden baseline recorded (wakeups/s, CPU, RSS) with the window hidden for 5 minutes.
- [ ] Every recurring timer, animation, and poll has an owner and a hidden-state policy.
- [ ] Pause and resume covered by a fake-timer test.
- [ ] Re-measured on the real shell, or the gap stated.
