// Renders docs/hero/hero.html frame by frame (every frame is a pure function of time) into a GIF.
// Usage: node docs/hero/render.mjs [out.gif]   Requires playwright and ffmpeg on PATH.
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(process.argv[2] ?? path.join(here, "../public/images/hero.gif"));
const FPS = 15, SECONDS = 10.5, HOLD_FROM = 9.0;
const names = fs.readdirSync(path.join(here, "../../.agents/skills")).sort().join(" ");
const html = fs.readFileSync(path.join(here, "hero.html"), "utf8").replace("__NAMES__", names);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 420 } });
await page.setContent(html);
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
  "-vf", "split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4", "-loop", "0", out],
  { stdio: ["pipe", "inherit", "inherit"] });
for (let i = 0; i < FPS * SECONDS; i++) {
  await page.evaluate((t) => window.render(t), Math.min(i / FPS, HOLD_FROM + 0.5));
  ff.stdin.write(await page.screenshot({ type: "png" }));
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log(`wrote ${out}`);
