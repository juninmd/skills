# Screenshots

Open this file when the project has a UI and the README needs screenshots or a demo GIF.

## Capture plan

| Shot | Purpose | File |
|---|---|---|
| Hero | the main screen, used under the header | `home-light.png`, `home-dark.png` |
| One per primary feature | proves each Highlights bullet | `feature-<name>.png` |
| Demo | one end-to-end task, 5 to 15 seconds | `demo.gif` or an uploaded `.mp4` |

Seed realistic, non-personal data first. Empty states and lorem ipsum make the project look unfinished; real customer data leaks.

## Web app with Playwright

Start the app with its real dev or preview script, then:

```js
// scripts/readme-screenshots.mjs
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const shots = [
  { name: "home", path: "/" },
  { name: "feature-editor", path: "/editor" },
];

const browser = await chromium.launch();
for (const scheme of ["light", "dark"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: scheme });
  for (const shot of shots) {
    await page.goto(base + shot.path, { waitUntil: "networkidle" });
    await page.screenshot({ path: `.github/assets/screenshots/${shot.name}-${scheme}.png` });
  }
  await page.close();
}
await browser.close();
```

```bash
mkdir -p .github/assets/screenshots
node scripts/readme-screenshots.mjs
```

## Reproducible capture with a mocked backend

Desktop and full-stack apps often cannot boot their backend in CI. Render the real frontend with a second Vite config that aliases the native or HTTP bindings to mocks and serves generated images, then drive it with Playwright from a `screenshots` script:

```ts
// vite.screens.config.ts: real UI, fake backend, used only by the screenshots script
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const mock = (name: string) => fileURLToPath(new URL(`./scripts/screenshots/mock/${name}.ts`, import.meta.url));

export default defineConfig({
  resolve: { alias: { "@tauri-apps/api/core": mock("core"), "@tauri-apps/api/window": mock("window") } },
});
```

Draw demo content procedurally (SVG scenes, seeded fixtures) instead of committing stock photos, and say so under the Develop block, so readers trust the screenshots and maintainers can regenerate them.

## Other stacks

| Stack | Capture with |
|---|---|
| CLI or TUI | `vhs` tape file or `asciinema` plus `agg` for a GIF; a fixed 100×30 terminal |
| Android | `adb exec-out screencap -p > screen.png` on an emulator with demo data |
| iOS | `xcrun simctl io booted screenshot screen.png` |
| Desktop (Electron, Tauri) | Playwright's Electron launcher, or the OS screenshot tool at a fixed window size |
| Flutter | `flutter screenshot` or integration test `takeScreenshot` |

## Optimize

```bash
oxipng -o 4 --strip safe .github/assets/screenshots/*.png
du -h .github/assets/screenshots/*
```

Keep each PNG under 1 MB and each GIF under 5 MB; shorten or downscale the GIF before dropping the frame rate below 10 fps.

## Rules

- Capture the current build. Re-capture when the UI changes; a stale screenshot is a false claim.
- Crop browser chrome and OS bars unless the frame is part of the hero composition.
- Blur or replace any token, email, avatar, or internal hostname before committing.
- Commit the capture script, so the next person regenerates the images instead of guessing.
