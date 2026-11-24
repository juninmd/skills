// `cachelog`: only fixed cache outcome labels and counters from one job's log, never log text.
import crypto from "node:crypto";
import { ghText } from "./gh.mts";

const OUTCOMES: [RegExp, string][] = [
  [/^\s*key:\s+\S/i, "requested"],
  [/^\s*(\S+ )?(cache restored from key|restored from cache key)\b/i, "restore: hit"],
  [/^\s*(\S+ )?(cache (is )?not found|no cache found)\b/i, "restore: miss"],
  [/^\s*cache hit occurred on (the )?(\S+ )?primary key [^,]*, not saving cache\.?\s*$/i, "save: skipped (exact hit)"],
  [/^\s*cache saved\b/i, "save: saved"],
  [/^\s*(failed to save|unable to reserve cache)\b/i, "save: failed"],
  [/^\s*cache hit occurred\b.*not saving cache/i, "save: skipped, reason unknown"],
];
const KEY = /(?:input keys|key):?\s+([^,]+?)\s*(?:,|$)/i;
const SCCACHE = /^\s*(cache hits|cache misses|compile requests)\s+(\d+)\s*$/i;

export function cacheLines(log: string): string[] {
  const out: string[] = [];
  for (const line of log.split(/\r?\n/)) {
    const text = line.replace(/^\S+Z\s/, "");
    const hit = OUTCOMES.find(([rx]) => rx.test(text));
    if (hit) {
      const k = KEY.exec(text);
      // A short hash names the key without printing it.
      out.push(hit[1] + (k ? ` key#${crypto.createHash("sha1").update(k[1].normalize("NFC").toLowerCase()).digest("hex").slice(0, 8)}` : ""));
    } else {
      const m = SCCACHE.exec(text);
      if (m) out.push(`sccache ${m[1].toLowerCase()}: ${m[2]}`);
    }
  }
  return out;
}

export function cmdCachelog(a: { repo: string; job: string }): void {
  for (const l of cacheLines(ghText(`repos/${a.repo}/actions/jobs/${a.job}/logs`))) console.log(l);
}
