// A small XML reader for JUnit reports: elements and attributes only (text is not needed).
export interface El {
  tag: string;
  attrs: Record<string, string>;
  kids: El[];
  parent: El | null;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e: string) => {
    if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e] ?? m;
  });

export const local = (tag: string) => tag.slice(tag.lastIndexOf(":") + 1);

/** Returns the root element, or throws on anything that is not well-formed enough. */
export function parseXml(src: string): El {
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<(\/?)([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/g;
  let root: El | null = null;
  let cur: El | null = null;
  for (let m = re.exec(src); m; m = re.exec(src)) {
    if (!m[2]) continue;
    if (m[1]) {
      if (!cur || cur.tag !== m[2]) throw new Error(`unexpected </${m[2]}>`);
      cur = cur.parent;
      continue;
    }
    const attrs: Record<string, string> = {};
    for (const a of m[3].matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) attrs[a[1]] = decode(a[2] ?? a[3]);
    const el: El = { tag: m[2], attrs, kids: [], parent: cur };
    if (cur) cur.kids.push(el);
    else if (root) throw new Error("more than one root element");
    else root = el;
    if (!m[4]) cur = el;
  }
  if (!root || cur) throw new Error("unclosed element");
  return root;
}

export function* walk(el: El): Generator<El> {
  yield el;
  for (const k of el.kids) yield* walk(k);
}
