import { h } from './engine/dom.js';

const pad = n => String(n).padStart(2, '0');

// Persistent overlay: corner labels, progress bar, scanlines. All driven by t.
export function buildHud(stage, { fps, width, height }, labels) {
  const hud = h('div', 'hud', '', stage);
  h('div', 'label tl', labels.topLeft, hud);
  const tr = h('div', 'label tr', '', hud);
  h('div', 'label bl', labels.bottomLeft, hud);
  h('div', 'label br', `${fps} FPS · ${width}×${height}`, hud);
  for (const [x, y] of [[36, 36], [1020, 36], [36, 1860], [1020, 1860]]) {
    h('div', 'plus', '+', hud, { left: `${x}px`, top: `${y}px` });
  }
  const bar = h('div', 'bar', '', hud);
  const fill = h('i', '', '', bar);
  const scan = h('div', 'scan', '', hud);
  h('div', 'lines', '', hud);
  h('div', 'vig', '', hud);

  return function update(t, duration, frame) {
    const f = frame % fps;
    tr.textContent = `REC ${pad(Math.floor(t / 60))}:${pad(Math.floor(t % 60))}:${pad(f)}`;
    fill.style.transform = `scaleX(${t / duration})`;
    scan.style.top = `${((t * 0.16) % 1.3) * height - 220}px`;
    stage.style.setProperty('--gy', `${(t * 14) % 90}px`);
  };
}
