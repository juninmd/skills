// Pattern: two file cards: the primary is missing, the fallback lights up. Copy to src/scenes/, replace every string, keep the last reveal <= 3.5s.
import { h } from '../engine/dom.js';
import { ease, prog } from '../engine/ease.js';
import { featureFrame } from './frame.js';
import { typeInto, rise, fade } from './parts.js';

const WIDTHS = [90, 70, 82, 48];

function card(parent, name, left, cls) {
  const el = h('div', `card ${cls}`, '', parent, { left: `${left}px`, top: '40px' });
  h('div', 'fname', name, el);
  const lines = cls === 'ghost' ? [] : WIDTHS.map(w => h('div', 'ln', '', el, { width: `${w}%`, transformOrigin: 'left' }));
  return { el, lines };
}

export default {
  id: 'file-cards',
  dur: 4.5,
  transition: 'glitch',
  build(root) {
    const f = featureFrame(root, {
      n: 5,
      version: '0.0.0',
      title: ['Fallback behavior', 'between two files'],
      desc: 'One sentence on which file wins and when.',
    });
    const miss = card(f.area, 'primary.md', 0, 'ghost');
    const live = card(f.area, 'fallback.md', 532, '');
    const missing = h('div', 'chip hot', 'not found', f.area, { left: '0', top: '370px', position: 'absolute', fontSize: '28px' });
    const wire = h('div', 'wire', '', f.area, { left: '420px', top: '190px', width: '112px', background: 'var(--phos)' });
    const arrow = h('div', 'mono', '›', f.area, { left: '510px', top: '168px', position: 'absolute', fontSize: '44px', color: 'var(--phos)' });
    const read = h('div', 'chip', '✓ read', f.area, { left: '532px', top: '370px', position: 'absolute', fontSize: '28px' });
    const cfg = h('div', 'chip dim', '', f.area, { left: '0', top: '500px', position: 'absolute', fontSize: '28px' });

    return t => {
      f.tick(t);
      rise(miss.el, t, 1.0, 0.5, 24);
      fade(missing, t, 1.6, 0.3);
      wire.style.transform = `scaleX(${ease.outCubic(prog(t, 2.0, 0.4))})`;
      fade(arrow, t, 2.2, 0.2);
      rise(live.el, t, 2.2, 0.5, 24);
      live.el.classList.toggle('live', t >= 2.5);
      live.lines.forEach((l, i) => { l.style.transform = `scaleX(${ease.outCubic(prog(t, 2.5 + i * 0.1, 0.4))})`; });
      fade(read, t, 2.8, 0.3);
      typeInto(cfg, 'setting → where to change it', prog(t, 2.8, 0.7), t);
    };
  },
};
