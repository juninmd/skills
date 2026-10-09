import { h } from '../engine/dom.js';
import { ease, prog } from '../engine/ease.js';
import { words, revealWords, typeInto, fade } from './parts.js';

// Hook: promise the payoff in under 3.5s. Replace every string; durations stay multiples of 0.5s.
export default {
  id: 'hook',
  dur: 3.5,
  transition: 'cut',
  build(root) {
    const box = h('div', '', '', root, { position: 'absolute', left: '64px', right: '64px', top: '700px' });
    const kicker = h('div', 'label hot', '› topic or series', box, { marginBottom: '36px' });
    const l1 = words(box, 'Headline line one');
    const l2 = words(box, 'line two.');
    l2.forEach(s => s.classList.add('acc'));
    const rule = h('div', 'rule', '', box, { marginTop: '48px' });
    const sub = h('div', 'body mono', '', box, { marginTop: '36px' });

    return t => {
      fade(kicker, t, 0.1);
      revealWords(l1, t, 0.3);
      revealWords(l2, t, 0.7);
      rule.style.transform = `scaleX(${ease.inOutQuart(prog(t, 1.2, 0.7))})`;
      typeInto(sub, 'one line that promises the payoff', prog(t, 1.6, 1.4), t);
    };
  },
};
