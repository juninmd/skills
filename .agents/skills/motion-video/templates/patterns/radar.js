// Pattern: a radar sweep flags blips; a command chip enables it. Copy to src/scenes/, replace every string, keep the last reveal <= 3.5s.
import { h } from '../engine/dom.js';
import { ease, prog } from '../engine/ease.js';
import { featureFrame } from './frame.js';
import { typeInto, rise, fade } from './parts.js';

const C = 300;
const SWEEP_DEG_PER_S = 200;
// [angle from top in degrees, radius in px]
const BLIPS = [[40, 190], [150, 235], [250, 120]];

export default {
  id: 'radar',
  dur: 4.5,
  transition: 'glitch',
  build(root) {
    const f = featureFrame(root, {
      n: 7,
      version: '0.0.0',
      title: ['Radar headline'],
      desc: 'One sentence on what gets flagged.',
    });
    const radar = h('div', 'radar', '', f.area);
    [200, 400].forEach(d => h('div', 'ring', '', radar, { width: `${d}px`, height: `${d}px`, left: `${C - d / 2}px`, top: `${C - d / 2}px` }));
    const sweep = h('div', 'sweep', '', radar);
    const blips = BLIPS.map(([deg, r]) => {
      const a = (deg * Math.PI) / 180;
      const x = C + r * Math.sin(a) - 11;
      const y = C - r * Math.cos(a) - 11;
      return { deg, el: h('div', 'blip', '', radar, { left: `${x}px`, top: `${y}px` }) };
    });
    const cmd = h('div', 'chip', '', f.area, { left: '0', top: '650px', position: 'absolute', fontSize: '28px' });
    const note = h('div', 'note', 'CONDITION OR CAVEAT GOES HERE', f.area, { top: '740px', position: 'absolute' });

    return t => {
      f.tick(t);
      fade(radar, t, 1.0, 0.5);
      const angle = Math.max(0, t - 1.2) * SWEEP_DEG_PER_S;
      sweep.style.transform = `rotate(${angle}deg)`;
      blips.forEach(({ deg, el }) => {
        const since = (angle - deg) / SWEEP_DEG_PER_S; // seconds since the sweep crossed it
        el.style.opacity = since < 0 ? 0 : 0.6 + 0.4 * (1 - ease.outCubic(Math.min(1, since / 0.8)));
        el.style.transform = `scale(${since < 0 ? 0 : 1 + 0.8 * (1 - ease.outCubic(Math.min(1, since / 0.4)))})`;
      });
      typeInto(cmd, '/command enable some-name', prog(t, 2.0, 1.3), t);
      rise(note, t, 3.2, 0.4, 8);
    };
  },
};
