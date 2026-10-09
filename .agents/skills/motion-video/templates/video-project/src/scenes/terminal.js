import { h } from '../engine/dom.js';

// Terminal window: titlebar with three dots, then an empty body the scene fills.
export function terminal(parent, { title = 'zsh', height = 480, top = 0 } = {}) {
  const box = h('div', 'term', '', parent, { height: `${height}px`, top: `${top}px` });
  const bar = h('div', 'termbar', '', box);
  for (let i = 0; i < 3; i++) h('i', 'dot', '', bar);
  h('span', 'label', title, bar, { fontSize: '20px', marginLeft: '12px' });
  const body = h('div', 'termbody', '', box);
  return { box, body };
}

// name | bar | number | flag; `fill` is the inner bar the scene scales.
export function barRow(body, { name, num, flag, hot = false }) {
  const row = h('div', 'row', '', body);
  h('span', 'name', name, row);
  const fill = h('i', hot ? 'hot' : '', '', h('div', 'bar', '', row));
  h('span', 'num', num, row);
  h('span', `flag ${hot ? 'hot' : ''}`, flag, row);
  return { row, fill };
}
