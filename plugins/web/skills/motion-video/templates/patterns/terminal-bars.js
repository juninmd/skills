// Pattern: a terminal command prints rows with bars and flags. Copy to src/scenes/, replace every string, keep the last reveal <= 3.5s.
import { h } from '../engine/dom.js';
import { ease, prog } from '../engine/ease.js';
import { featureFrame } from './frame.js';
import { terminal, barRow } from './terminal.js';
import { typeInto, rise } from './parts.js';

// Illustrative sample data; the scene says so on screen.
const SKILLS = [
  { name: 'item-a', tok: 2.1, used: true },
  { name: 'item-b', tok: 1.4, used: true },
  { name: 'item-c', tok: 3.8, used: false },
  { name: 'item-d', tok: 0.9, used: false },
];
const MAX = 3.8;

export default {
  id: 'terminal-bars',
  dur: 4.5,
  transition: 'glitch',
  build(root) {
    const f = featureFrame(root, {
      n: 3,
      version: '0.0.0',
      title: ['/command-name'],
      desc: 'One sentence on what the output tells you.',
    });
    const { box, body } = terminal(f.area, { title: 'shell', height: 480 });
    const cmd = h('div', 'prompt', '', body);
    const rows = SKILLS.map(s => ({
      s,
      ...barRow(body, { name: s.name, num: `${s.tok.toFixed(1)}k`, flag: s.used ? 'in use' : 'unused', hot: !s.used }),
    }));
    const total = h('div', 'prompt', '', body, { marginTop: '34px' });
    const note = h('div', 'note', 'SAMPLE DATA', f.area, { top: '510px', position: 'absolute' });

    return t => {
      f.tick(t);
      rise(box, t, 0.9, 0.5, 30);
      typeInto(cmd, '> command --flag', prog(t, 1.2, 0.5), t);
      rows.forEach(({ row, fill, s }, i) => {
        const start = 1.9 + i * 0.25;
        rise(row, t, start, 0.4, 14);
        fill.style.transform = `scaleX(${ease.outCubic(prog(t, start, 0.6)) * (s.tok / MAX)})`;
      });
      typeInto(total, 'prune 2 = -4.7k tokens', prog(t, 2.8, 0.65), t);
      rise(note, t, 1.2, 0.4, 8);
    };
  },
};
