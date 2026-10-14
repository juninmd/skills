import { h } from '../engine/dom.js';
import { words, revealWords, fade, rise } from './parts.js';

export const TOTAL = 8;

// Shared chrome of every feature scene: index, version, headline, one-line description.
// `area` is the free 952x800 canvas below the text where each scene draws its own visual.
export function featureFrame(root, { n, total = TOTAL, version, title, desc }) {
  const pos = { position: 'absolute', left: '64px', right: '64px' };
  const head = h('div', '', '', root, { ...pos, top: '250px', display: 'flex', justifyContent: 'space-between' });
  const idx = h('div', 'label hot', `› ${String(n).padStart(2, '0')}/${String(total).padStart(2, '0')}`, head);
  const ver = h('div', 'label', `v${version}`, head);
  const box = h('div', '', '', root, { ...pos, top: '330px' });
  const lines = title.map((txt, i) => {
    const spans = words(box, txt, 'title sm');
    if (i === title.length - 1) spans.forEach(s => s.classList.add('acc'));
    return spans;
  });
  const body = h('div', 'body', desc, box, { marginTop: '36px' });
  const area = h('div', '', '', root, { ...pos, top: '930px', height: '800px' });

  return {
    area,
    tick(t) {
      fade(idx, t, 0.05);
      fade(ver, t, 0.15);
      lines.forEach((spans, i) => revealWords(spans, t, 0.15 + i * 0.25));
      rise(body, t, 0.7, 0.6, 20);
    },
  };
}
