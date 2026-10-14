import { ease, rand } from './ease.js';

// Each transition styles the INCOMING scene; p goes 0..1 over the overlap window.
export const transitions = {
  wipe(el, p) {
    el.style.clipPath = `inset(0 ${100 - ease.inOutQuart(p) * 100}% 0 0)`;
  },
  glitch(el, p, frame) {
    const band = (1 - p) * 45;
    const top = rand(frame) * band;
    const bottom = rand(frame + 977) * band;
    el.style.clipPath = `inset(${top}% 0 ${bottom}% 0)`;
    el.style.transform = `translateX(${(rand(frame + 31) - 0.5) * 90 * (1 - p)}px)`;
    el.style.opacity = rand(frame + 5) < p * 1.3 ? 1 : 0.25;
  },
};

export function clearTransition(el) {
  el.style.clipPath = '';
  el.style.transform = '';
  el.style.opacity = '';
}
