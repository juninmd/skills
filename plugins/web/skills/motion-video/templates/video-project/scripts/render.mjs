import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'out');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i < 0 ? null : (args[i + 1] ?? ''); };
const stills = opt('--still')?.split(',').map(Number).filter(Number.isFinite);
const audio = opt('--audio');
const outFile = join(OUT, opt('--out') ?? 'video.mp4');
const partFile = `${outFile}.part`; // renamed to outFile only after ffmpeg finishes cleanly

// Local-only static server so ES modules load; rejects anything outside src/.
function serve() {
  const server = createServer(async (req, res) => {
    try {
      const path = normalize(join(SRC, decodeURIComponent(new URL(req.url, 'http://localhost').pathname)));
      const file = path.endsWith(sep) ? join(path, 'index.html') : path;
      if (!file.startsWith(SRC + sep) || !MIME[extname(file)]) { res.writeHead(404).end(); return; }
      const body = await readFile(file); // read before writeHead so a failure can still answer
      res.writeHead(200, { 'content-type': MIME[extname(file)] }).end(body);
    } catch { res.writeHead(404).end(); }
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => ok(server)));
}

function startFfmpeg(fps) {
  const input = ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', 'pipe:0'];
  const sound = audio ? ['-i', audio, '-af', 'apad', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : [];
  // Tag and convert as BT.709 so players do not assume a different matrix for HD.
  const color = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709'];
  // -x264-params writes the VUI tags; the -color_* flags alone left primaries/transfer "unknown".
  const vui = 'colorprim=bt709:transfer=bt709:colormatrix=bt709';
  const video = ['-vf', 'scale=out_color_matrix=bt709:out_range=tv', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', ...color, '-x264-params', vui, '-movflags', '+faststart', '-f', 'mp4'];
  const proc = spawn('ffmpeg', [...input, ...sound, ...video, partFile], { stdio: ['pipe', 'ignore', 'pipe'] });
  let log = '';
  proc.stderr.on('data', d => { log = (log + d).slice(-2000); });
  proc.on('error', e => { log += String(e); });
  proc.stdin.on('error', () => {}); // EPIPE after an early exit is reported through `done`
  const done = once(proc, 'close').then(([code]) => { if (code) throw new Error(`ffmpeg exit ${code}\n${log}`); });
  done.catch(() => {}); // still rethrown where awaited; avoids an unhandled rejection if ffmpeg dies mid-loop
  return { proc, done };
}

const server = await serve();
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  let pageError = null;
  page.on('pageerror', e => { pageError ??= e; }); // checked per frame; throwing here would skip cleanup
  const { address, port } = server.address(); // the loopback address it actually bound
  await page.goto(Object.assign(new URL('http://localhost'), { hostname: address, port: String(port) }).href);
  await page.waitForFunction('window.__ready === true');
  const { fps, duration } = await page.evaluate('window.__meta');
  const shot = async frame => {
    await page.evaluate(f => window.__renderFrame(f), frame);
    if (pageError) throw pageError;
    return page.screenshot({ type: 'png' });
  };
  await mkdir(OUT, { recursive: true });

  if (args.includes('--meta')) {
    await writeFile(join(OUT, 'meta.json'), `${JSON.stringify(await page.evaluate('window.__meta'))}
`);
    console.error('meta: out/meta.json');
  } else if (stills) {
    for (const t of stills) await writeFile(join(OUT, `still-${t}.png`), await shot(Math.round(t * fps)));
    console.error(`stills: ${stills.join(', ')} (duration ${duration.toFixed(2)}s)`);
  } else {
    const total = Math.floor(duration * fps);
    const ff = startFfmpeg(fps);
    try {
      for (let f = 0; f < total; f++) {
        if (!ff.proc.stdin.write(await shot(f))) await once(ff.proc.stdin, 'drain');
        if (f % 90 === 0) console.error(`frame ${f}/${total}`);
      }
      ff.proc.stdin.end();
      await ff.done;
      await rename(partFile, outFile);
    } catch (e) {
      if (ff.proc.exitCode === null && ff.proc.signalCode === null) {
        ff.proc.kill();
        await once(ff.proc, 'close');
      }
      await rm(partFile, { force: true });
      // if ffmpeg died first, its log is the root cause; the pipe error is only a symptom
      throw (await ff.done.then(() => null, err => err)) ?? e;
    }
    console.error(`done: ${outFile} (${total} frames, ${duration.toFixed(2)}s)`);
  }
} finally {
  await browser.close();
  server.close();
}
