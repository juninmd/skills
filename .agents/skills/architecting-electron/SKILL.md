---
name: architecting-electron
description: |
  **ARCHITECTURE SKILL** - Design secure Electron apps.
  USE FOR: Main/Renderer separation, IPC, contextBridge, security, native integration.
  DO NOT USE FOR: packaging (use electron-best-practices), general feature implementation (use electron).
  INVOKES: file reading tools, architecture checklists.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Electron, Windows, macOS, Linux"
allowed-tools: [read_file]
---

# Architecting Electron Applications

Expert guide for secure, performant, and scalable Electron apps with a clean three-layer architecture.

**USE FOR:**
- Designing app structures (Main, Renderer, Preload).
- Implementing secure IPC handlers and `contextBridge`.
- Auditing security (isolation, sandbox, integration).
- Integrating native tools and OS APIs securely.
- Designing error handling and performance strategies.

**DO NOT USE FOR:**
- Packaging installers (see `electron-best-practices`).
- Specific UI features without architectural impact.

**INVOKES:**
- `contextBridge`, `ipcMain`, `ipcRenderer` patterns.

## Standards
Refer to these modules:
1. [Main Process](references/main-process.md) | [Security](references/security.md)
2. [Renderer Patterns](references/renderer-patterns.md) | [Native/Performance](references/native-performance.md)

## Code Review Checklist
- [ ] **Security:** Isolation enabled, nodeIntegration disabled, sandbox active.
- [ ] **IPC:** Messages validated; no raw `ipcRenderer` in renderer.
- [ ] **Native:** Shell commands use `spawn` with arg arrays.
- [ ] **Async:** Proper error handling and timeouts used.
- [ ] **Memory:** Unsubscribe from Electron events in Renderer.

## Checklist
- [ ] Identify Main vs Renderer responsibilities before implementing.
- [ ] Define `contextBridge` in `preload.ts` before IPC usage.
- [ ] Ensure IPC handlers return structured `{ success, data, error }`.
