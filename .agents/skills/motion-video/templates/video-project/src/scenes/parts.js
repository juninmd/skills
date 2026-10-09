import { h } from '../engine/dom.js';
import { ease, prog, lerp } from '../engine/ease.js';

// One headline line split into word spans so reveal can stagger them.
export function words(parent, text, cls = 'title') {
  const line = h('div', `line ${cls}`, '', parent);
  return text.split(' ').map((w, i, a) => h('span', 'w', i < a.length - 1 ? `${w} ` : w, line));
}

export function revealWords(spans, t, start, stagger = 0.08, dur = 0.6, rise = 48) {
  spans.forEach((s, i) => {
    const p = ease.outExpo(prog(t, start + i * stagger, dur));
    s.style.opacity = p;
    s.style.transform = `translateY(${lerp(rise, 0, p)}px)`;
  });
}

// Typewriter with a 2 Hz blinking cursor; p is 0..1 typing progress.
export function typeInto(el, text, p, t) {
  el.classList.add('type');
  el.style.visibility = p > 0 ? '' : 'hidden';
  el.textContent = text.slice(0, Math.floor(text.length * p));
  el.dataset.blink = Math.floor(t * 2) % 2 === 0 || p < 1 ? '1' : '0';
}

export function fade(el, t, start, dur = 0.4) {
  el.style.opacity = ease.outCubic(prog(t, start, dur));
}

export function rise(el, t, start, dur = 0.5, dist = 30) {
  const p = ease.outExpo(prog(t, start, dur));
  el.style.opacity = p;
  el.style.transform = `translateY(${lerp(dist, 0, p)}px)`;
}
