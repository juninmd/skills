// Pattern: a big number counts up while a segmented bar fills. Copy to src/scenes/, replace every string, keep the last reveal <= 3.5s.
import { h } from '../engine/dom.js';
import { ease, prog } from '../engine/ease.js';
import { featureFrame } from './frame.js';
import { typeInto, rise } from './parts.js';

const CELLS = 40;
const TARGET = 1_000_000;
const fmt = n => Math.round(n).toLocaleString('pt-BR');

export default {
  id: 'counter-bar',
  dur: 4.5,
  transition: 'glitch',
  build(root) {
    const f = featureFrame(root, {
      n: 1,
      version: '0.0.0',
      title: ['Big number', 'headline'],
      desc: 'One sentence on what the number means.',
    });
    const chip = h('div', 'chip', '', f.area);
    const num = h('div', 'bignum', '', f.area, { marginTop: '64px' });
    const unit = h('div', 'label', 'unit of the number', f.area, { marginTop: '12px' });
    const grid = h('div', 'cells', '', f.area);
    const cells = Array.from({ length: CELLS }, () => h('i', '', '', grid));

    return t => {
      f.tick(t);
      typeInto(chip, 'label-text', prog(t, 0.9, 0.6), t);
      const p = ease.outExpo(prog(t, 1.2, 1.8));
      num.textContent = fmt(p * TARGET);
      rise(unit, t, 1.2, 0.5, 12);
      cells.forEach((c, i) => c.classList.toggle('on', i < p * CELLS));
    };
  },
};
