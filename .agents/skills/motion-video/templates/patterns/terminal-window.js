// Pattern: a command in a terminal opens an app window with results. Copy to src/scenes/, replace every string, keep the last reveal <= 3.5s.
import { h } from '../engine/dom.js';
import { ease, prog, lerp } from '../engine/ease.js';
import { featureFrame } from './frame.js';
import { terminal } from './terminal.js';
import { typeInto, rise, fade } from './parts.js';

const FLAGS = ['--flag', '--other', '--third <id>'];

export default {
  id: 'terminal-window',
  dur: 4.5,
  transition: 'wipe',
  build(root) {
    const f = featureFrame(root, {
      n: 6,
      version: '0.0.0',
      title: ['command --flag'],
      desc: 'One sentence on what the command opens.',
    });
    const { box, body } = terminal(f.area, { title: 'shell', height: 150 });
    const cmd = h('div', 'prompt', '', body);
    const win = h('div', 'win', '', f.area, { top: '200px', height: '420px', transformOrigin: 'center top' });
    const wbar = h('div', 'termbar', '', win);
    for (let i = 0; i < 3; i++) h('i', 'dot', '', wbar);
    h('span', 'label', 'App', wbar, { fontSize: '20px', marginLeft: '12px' });
    const side = h('div', 'side', '', win);
    [70, 90, 55, 80].forEach(w => h('div', 'ln', '', side, { width: `${w}%` }));
    const main = h('div', 'main', '', win);
    const l1 = h('div', 'prompt', '', main);
    const l2 = h('div', 'prompt', '', main, { marginTop: '24px' });
    const chips = h('div', 'verbs', '', f.area, { left: '0', top: '660px' });
    const flags = FLAGS.map(x => h('div', 'chip dim', x, chips, { fontSize: '28px' }));

    return t => {
      f.tick(t);
      rise(box, t, 0.9, 0.5, 30);
      typeInto(cmd, '> command --flag --other', prog(t, 1.2, 0.8), t);
      const p = ease.outExpo(prog(t, 2.1, 0.7));
      win.style.opacity = p;
      win.style.transform = `scale(${lerp(0.94, 1, p)}) translateY(${lerp(30, 0, p)}px)`;
      typeInto(l1, '✓ first result', prog(t, 2.5, 0.5), t);
      typeInto(l2, '✓ second result', prog(t, 3.0, 0.5), t);
      fade(chips, t, 1.0);
      flags.forEach((c, i) => { c.className = `chip ${t >= 1.6 + i * 0.25 ? '' : 'dim'}`; });
    };
  },
};
