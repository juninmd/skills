import { buildTimeline, TR } from './engine/timeline.js';
import { buildHud } from './hud.js';
import config from './config.js';
import scenes from './scenes/index.js';

const meta = { fps: config.fps, width: 1080, height: 1920 };
const stage = document.getElementById('stage');
const timeline = buildTimeline(scenes, stage);
const updateHud = buildHud(stage, meta, config.hud);

window.__meta = { ...meta, duration: timeline.duration, cuts: timeline.cuts, transition: TR };
// Pure function of the frame index: no rAF, no CSS animations, so renders are reproducible.
const lastFrame = Math.round(timeline.duration * meta.fps) - 1;
window.__renderFrame = rawFrame => {
  const frame = Math.min(rawFrame, lastFrame);
  const t = frame / meta.fps;
  timeline.render(t, frame);
  updateHud(t, timeline.duration, frame);
};

document.fonts.ready.then(() => {
  window.__renderFrame(0);
  window.__ready = true;
});
