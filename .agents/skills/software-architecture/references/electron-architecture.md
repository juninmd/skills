
# Electron Architecture

## Preflight
```bash
rg -n 'nodeIntegration|contextIsolation|sandbox|webSecurity' src/ | head
rg -n 'contextBridge|ipcRenderer|ipcMain' src/ | head
cat package.json | jq '.devDependencies.electron'
```

Any of `nodeIntegration: true`, `contextIsolation: false`, or `sandbox: false` is the first finding, before any feature work.

## Workflow
1. Split the app into main process, renderer, and native integration. Decide which layer owns each capability **before** writing code — retrofitting a boundary means rewriting both sides.
2. Keep privileged work — filesystem, shell, OS APIs, credentials — in the main process only.
3. Expose a narrow, typed bridge from preload instead of handing the renderer raw process access.
4. Define every inter-process channel as a contract: name, payload schema, validation, error shape, timeout.
5. Abstract the bridge behind renderer services so UI components stay portable and testable without a desktop shell.
6. Measure startup, window creation, and main-thread blocking before optimizing.

## Capability Ownership

| Capability | Main | Preload | Renderer |
|---|---|---|---|
| Filesystem, shell, child processes | ✅ | — | ❌ |
| Credentials, keychain, tokens | ✅ | — | ❌ |
| Native modules, OS integration | ✅ | — | ❌ |
| Window and menu lifecycle | ✅ | — | ❌ |
| Typed, allowlisted API surface | — | ✅ | — |
| UI, state, rendering | — | — | ✅ |

The renderer runs web content. Treat it as hostile: one dependency's compromised transitive package is now running in your app.

## The Security Baseline

```js
new BrowserWindow({
  webPreferences: {
    contextIsolation: true,      // never false
    sandbox: true,               // never false
    nodeIntegration: false,      // never true
    preload: path.join(__dirname, 'preload.js'),
  },
});
```

```js
// preload.js — expose functions, never modules or ipcRenderer itself
contextBridge.exposeInMainWorld('api', {
  readConfig: () => ipcRenderer.invoke('config:read'),
  saveNote: (text) => ipcRenderer.invoke('note:save', text),
});
```

Exposing `ipcRenderer` or `require` through the bridge undoes context isolation completely — the flag stays `true` and the protection is gone.

## Validate on Arrival

```js
ipcMain.handle('note:save', async (event, text) => {
  if (typeof text !== 'string' || text.length > 10_000) throw new Error('invalid');
  const target = path.resolve(NOTES_DIR, sanitize(id));
  if (!target.startsWith(NOTES_DIR)) throw new Error('path escape');   // ../../ 
  return writeNote(target, text);
});
```

| Attack | Guard |
|---|---|
| Path traversal via a renderer string | resolve, then verify the prefix |
| Command injection into `shell.openExternal` | protocol allowlist — `https:` only |
| Arbitrary channel invocation | handlers registered explicitly; unknown channel rejected |
| Malicious navigation or popup | deny `will-navigate` and `setWindowOpenHandler` by default |

## Reference Routing
- Main process structure and services: [main-process.md](main-process.md)
- Renderer and UI patterns: [renderer-patterns.md](renderer-patterns.md)
- Security configuration and hardening: [security.md](security.md)
- Native integration and performance: [native-performance.md](native-performance.md)

## Stop
- Context isolation or the sandbox is disabled without a written justification and a compensating control. Fix that first.
- The preload bridge exposes `ipcRenderer`, `require`, or a whole module. That undoes isolation entirely.
- A renderer string reaches a shell, a path, or a dynamic import unvalidated. Stop; resolve and allowlist it in main.

## Rules
- Renderers never receive unrestricted Node.js access. Disabling context isolation or the sandbox requires a written justification and a compensating control.
- Reject, never coerce: an unknown channel, a wrong shape, or an out-of-range value is an error, not something to normalize.
- Never pass a raw renderer string to a shell, a file path, or a dynamic import; resolve and allowlist it in the main process.
- Long native or filesystem work runs off the main thread with a timeout and a bounded output buffer, or it freezes every window at once.
- Ship auto-update over a signed channel and verify the signature before applying. An unsigned update channel is remote code execution with a progress bar.
- Broader system design belongs to `software-architecture`; the renderer's UI work to `frontend-engineering`; dependency CVEs to `security-ops`.

## Checklist
- [ ] Every privileged capability lives only in the main process.
- [ ] `contextIsolation` and `sandbox` on, `nodeIntegration` off; the bridge exposes functions, never modules.
- [ ] Every IPC payload validated on arrival; unknown channels rejected.
- [ ] Paths resolved and prefix-checked; navigation and popups denied by default.
- [ ] Long work off the main thread, bounded and cancellable.
- [ ] Auto-update signed and verified before applying.
