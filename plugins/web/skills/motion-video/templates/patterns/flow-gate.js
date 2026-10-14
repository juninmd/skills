// Pattern: a packet travels through a gate that offers choices. Copy to src/scenes/, replace every string, keep the last reveal <= 3.5s.
import { h } from '../engine/dom.js';
import { ease, prog, track } from '../engine/ease.js';
import { featureFrame } from './frame.js';
import { rise, fade } from './parts.js';

const VERBS = ['option one', 'option two', 'option three'];
const Y = 120;

export default {
  id: 'flow-gate',
  dur: 4.5,
  transition: 'wipe',
  build(root) {
    const f = featureFrame(root, {
      n: 2,
      version: '0.0.0',
      title: ['Flow with a gate', 'that decides'],
      desc: 'One sentence on what the gate decides.',
    });
    const a = h('div', 'node', 'node A', f.area, { left: '0', top: `${Y}px` });
    const gate = h('div', 'node gate', 'gate', f.area, { left: '361px', top: `${Y}px` });
    const b = h('div', 'node', 'node B', f.area, { left: '722px', top: `${Y}px` });
    const wires = [230, 591].map(x => h('div', 'wire', '', f.area, { left: `${x}px`, top: `${Y + 75}px`, width: '131px' }));
    const packet = h('div', 'packet', '', f.area, { top: `${Y + 60}px` });
    const verbs = h('div', 'verbs', '', f.area, { left: '0', top: `${Y + 210}px` });
    const chips = VERBS.map(v => h('div', 'chip dim', v, verbs, { fontSize: '30px' }));
    const post = h('div', 'chip dim', 'after-step', f.area, { right: '0', top: `${Y + 210}px`, position: 'absolute', fontSize: '28px' });

    return t => {
      f.tick(t);
      [a, gate, b].forEach((el, i) => rise(el, t, 1.0 + i * 0.12, 0.5, 24));
      wires.forEach((w, i) => { w.style.transform = `scaleX(${ease.outCubic(prog(t, 1.2 + i * 0.1, 0.5))})`; });
      const x = track(t, [[1.7, 215], [2.2, 361 + 100], [3.0, 361 + 100], [3.5, 722 + 100]]);
      packet.style.left = `${x}px`;
      packet.style.opacity = prog(t, 1.6, 0.2);
      const active = t >= 2.2 && t < 3.0 ? Math.floor((t - 2.2) / 0.27) % VERBS.length : -1;
      chips.forEach((c, i) => c.className = `chip ${i === active ? (i === 0 ? 'hot' : '') : 'dim'}`);
      gate.classList.toggle('hot', active === 0);
      fade(verbs, t, 1.5);
      const arrived = t >= 3.4;
      post.className = `chip ${arrived ? '' : 'dim'}`;
      fade(post, t, 1.6);
    };
  },
};
