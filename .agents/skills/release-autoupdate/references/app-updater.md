## Contents

- Keys and secrets
- Config
- Rust and capabilities
- Frontend flow

## Keys and secrets

```bash
npx tauri signer generate -w ~/.tauri/app.key
gh secret set TAURI_SIGNING_PRIVATE_KEY < ~/.tauri/app.key
gh secret set TAURI_SIGNING_PRIVATE_KEY_PASSWORD
```

Commit only the public key (`app.key.pub`) in `tauri.conf.json`. Lose the private key and installed clients can never update: back it up in a password manager, never in the repository.

## Config

`src-tauri/tauri.conf.json`: updater endpoint on the repository's latest release, passive Windows install.

```json
{
  "plugins": {
    "updater": {
      "pubkey": "CONTENT_OF_PUBLIC_KEY_FILE",
      "endpoints": ["https://github.com/OWNER/REPO/releases/latest/download/latest.json"],
      "windows": { "installMode": "passive" }
    }
  }
}
```

`src-tauri/tauri.updater.conf.json` (used only by CI, so local `tauri build` needs no private key):

```json
{ "bundle": { "createUpdaterArtifacts": true } }
```

Add `src-tauri/tauri.release-version.conf.json` to `.gitignore`. Keep `version` in `tauri.conf.json` and `Cargo.toml` as a placeholder; the real version comes from the tag.

## Rust and capabilities

```toml
tauri-plugin-updater = { version = "2", default-features = false, features = ["rustls-tls", "system-proxy"] }
tauri-plugin-process = "2"
```

```rust
tauri::Builder::default()
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_process::init())
```

Grant `updater:default` and `process:allow-restart` in `src-tauri/capabilities/default.json`. Gate desktop-only plugins with `#[cfg(desktop)]` if the app also targets mobile.

## Frontend flow

1. First check about 5 seconds after start, then every 6 hours; swallow offline errors in the background check.
2. Notify once per new version; let the user open the details, install, and see download progress.
3. `update.downloadAndInstall(onProgress)` verifies the signature before touching disk.
4. Flush stores and stop worker processes before the installer runs, then call `relaunch()`.

```ts
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

const update = await check();
if (update) {
  await update.downloadAndInstall((e) => console.log(e.event));
  await relaunch();
}
```
