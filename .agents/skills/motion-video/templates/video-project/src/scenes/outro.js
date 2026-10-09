import { h } from '../engine/dom.js';
import { ease, prog } from '../engine/ease.js';
import { words, revealWords, typeInto, fade } from './parts.js';

// Outro: one takeaway plus the source of every claim. Hold the last text at least 0.5s before `dur`.
export default {
  id: 'outro',
  dur: 4.5,
  transition: 'glitch',
  build(root) {
    const box = h('div', '', '', root, { position: 'absolute', left: '64px', right: '64px', top: '700px' });
    const kicker = h('div', 'label hot', '› end', box, { marginBottom: '36px' });
    const l1 = words(box, 'Closing line');
    const l2 = words(box, 'with the takeaway.');
    l2.forEach(s => s.classList.add('acc'));
    const rule = h('div', 'rule', '', box, { marginTop: '48px' });
    const src = h('div', 'body mono', '', box, { marginTop: '32px', fontSize: '30px' });

    return t => {
      fade(kicker, t, 0.1);
      revealWords(l1, t, 0.3);
      revealWords(l2, t, 0.6);
      rule.style.transform = `scaleX(${ease.inOutQuart(prog(t, 1.4, 0.6))})`;
      typeInto(src, 'source: where every claim comes from', prog(t, 2.0, 1.2), t);
    };
  },
};
