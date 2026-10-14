export function h(tag, cls = '', text = '', parent = null, style = null) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text) el.textContent = text;
  if (style) Object.assign(el.style, style);
  if (parent) parent.append(el);
  return el;
}
