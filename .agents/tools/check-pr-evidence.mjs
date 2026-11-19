import fs from "node:fs";
import { fileURLToPath } from "node:url";

const MIN_EVIDENCE_CHARS = 40;
const BAD_LINK = /(?:file:\/\/|\(\/tmp\/|\s\/tmp\/|raw\.githubusercontent\.com\/)/i;
const IMAGE = /!\[[^\]]*\]\(https?:\/\/[^)\s]+\)|<img\s[^>]*src=["']https?:\/\//i;
const ATTACHMENT = /https:\/\/github\.com\/(?:user-attachments|[^/\s]+\/[^/\s]+\/actions\/runs)\/\S+/i;
const FENCE = /```[\s\S]*?\S[\s\S]*?```/;

export function extractEvidence(body) {
  const clean = String(body ?? "").replace(/<!--[\s\S]*?-->/g, "");
  const match = clean.match(/^##[ \t]+Evidence[ \t]*$/im);
  if (!match) return null;
  const rest = clean.slice(match.index + match[0].length);
  const next = rest.search(/^##[ \t]+\S/m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

export function checkPrEvidence(body) {
  const evidence = extractEvidence(body);
  if (evidence === null) return ["Missing '## Evidence' section (see .github/pull_request_template.md)"];
  const errors = [];
  if (BAD_LINK.test(evidence)) {
    errors.push("Evidence uses a local path or raw branch URL; upload to user-attachments instead");
  }
  const prose = evidence.replace(FENCE, "").replace(/\s+/g, " ").trim();
  const hasProof = IMAGE.test(evidence) || ATTACHMENT.test(evidence) || FENCE.test(evidence);
  if (!hasProof) {
    errors.push("Evidence needs a screenshot/GIF/video link, a CI run link, or a fenced block with real output");
  }
  if (prose.length + (FENCE.test(evidence) ? MIN_EVIDENCE_CHARS : 0) < MIN_EVIDENCE_CHARS) {
    errors.push(`Evidence section is empty or too short (min ${MIN_EVIDENCE_CHARS} chars)`);
  }
  return errors;
}

function main() {
  const body = process.env.PR_BODY ?? (process.argv[2] ? fs.readFileSync(process.argv[2], "utf8") : "");
  const errors = checkPrEvidence(body);
  for (const err of errors) console.error(`ERROR: ${err}`);
  if (errors.length) process.exit(1);
  console.log("PR evidence OK");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
