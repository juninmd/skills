import { h } from './dom.js';
import { transitions, clearTransition } from './transitions.js';

// Overlap between scenes; scene durations stay multiples of one 120 BPM beat (0.5s).
export const TR = 0.5;

export function buildTimeline(scenes, stage) {
  let cursor = 0;
  const items = scenes.map((s, i) => {
    const overlap = i === 0 || !transitions[s.transition] ? 0 : TR;
    const start = cursor - overlap;
    cursor = start + s.dur;
    const el = h('section', 'scene', '', stage);
    el.dataset.scene = s.id;
    return { s, el, start, end: cursor, overlap, update: s.build(el) };
  });

  function render(t, frame) {
    items.forEach(({ s, el, start, end, overlap, update }, i) => {
      const local = t - start;
      const visible = local >= 0 && t < end;
      el.style.visibility = visible ? 'visible' : 'hidden';
      el.style.zIndex = i;
      if (!visible) return;
      if (local < overlap) transitions[s.transition](el, local / overlap, frame);
      else clearTransition(el);
      update(local, s.dur);
    });
  }

  return { duration: cursor, cuts: items.slice(1).map(i => i.start), render };
}
