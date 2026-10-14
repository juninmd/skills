// Pattern: the same flow, but the gate fails and a stamp blocks it. Copy to src/scenes/, replace every string, keep the last reveal <= 3.5s.
import { h } from '../engine/dom.js';
import { ease, prog, track } from '../engine/ease.js';
import { featureFrame } from './frame.js';
import { typeInto, rise, fade } from './parts.js';

const CAUSES = ['cause one', 'cause two', 'cause three'];
const Y = 120;

export default {
  id: 'flow-block',
  dur: 4.5,
  transition: 'wipe',
  build(root) {
    const f = featureFrame(root, {
      n: 8,
      version: '0.0.0',
      title: ['Failure case', 'blocks the flow'],
      desc: 'One sentence on what is blocked and why.',
    });
    const a = h('div', 'node', 'action', f.area, { left: '0', top: `${Y}px` });
    const gate = h('div', 'node gate', 'check', f.area, { left: '361px', top: `${Y}px` });
    const b = h('div', 'node', 'result', f.area, { left: '722px', top: `${Y}px` });
    const wires = [230, 591].map(x => h('div', 'wire', '', f.area, { left: `${x}px`, top: `${Y + 75}px`, width: '131px' }));
    const packet = h('div', 'packet', '', f.area, { top: `${Y + 60}px` });
    const causes = h('div', 'verbs', '', f.area, { left: '0', top: `${Y + 210}px` });
    const chips = CAUSES.map(c => h('div', 'chip dim', c, causes, { fontSize: '26px' }));
    const stamp = h('div', 'stamp', 'BLOCKED', f.area, { left: '280px', top: `${Y + 300}px` });
    const cfg = h('div', 'chip', '', f.area, { left: '0', top: '600px', position: 'absolute', fontSize: '30px' });
    const note = h('div', 'note', 'BEFORE: THE FAILURE LET IT THROUGH', f.area, { top: '700px', position: 'absolute' });

    return t => {
      f.tick(t);
      [a, gate, b].forEach((el, i) => rise(el, t, 1.0 + i * 0.12, 0.5, 24));
      wires.forEach((w, i) => { w.style.transform = `scaleX(${ease.outCubic(prog(t, 1.2 + i * 0.1, 0.5))})`; });
      const x = track(t, [[1.7, 215], [2.3, 361 - 40]]);
      packet.style.left = `${x}px`;
      packet.style.opacity = prog(t, 1.6, 0.2) * (t < 2.4 ? 1 : 0);
      const failing = t >= 2.3;
      gate.classList.toggle('hot', failing);
      const active = failing ? Math.floor((t - 2.3) / 0.35) % CAUSES.length : -1;
      chips.forEach((c, i) => { c.className = `chip ${i === active ? 'hot' : 'dim'}`; });
      fade(causes, t, 1.5);
      stamp.style.opacity = t >= 2.5 ? 1 : 0;
      stamp.style.transform = `scale(${1 + 0.35 * (1 - ease.outExpo(prog(t, 2.5, 0.25)))})`;
      typeInto(cfg, 'setting: "value"', prog(t, 2.8, 0.6), t);
      rise(note, t, 3.1, 0.4, 8);
    };
  },
};
