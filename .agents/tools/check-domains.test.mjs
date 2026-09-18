import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkDomains, collectFiles, extractHosts, parseAllowlist, readText } from "./check-domains.mjs";

function createTree(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "domain-check-"));
  for (const [relativePath, contents] of Object.entries(files)) {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
  return root;
}

function run(files, allowlist) {
  const root = createTree(files);
  return checkDomains(collectFiles(["skills"], root), allowlist, root).errors;
}

const ALLOWLIST = `# comment
[approved]
"github.com" = "source hosting"
"*.docs.dev" = "documentation subdomains"

[placeholders]
"localhost" = "local server"  # trailing comment
`;

test("hosts are reduced to the lowercase name, without scheme, userinfo, port, or path", () => {
  const hosts = extractHosts("a https://User@GitHub.com:443/x?y#z b http://localhost:3000/health\nc http://[::1]:8080/");
  assert.deepEqual(hosts, [
    { host: "github.com", line: 1 },
    { host: "localhost", line: 1 },
    { host: "[::1]", line: 2 },
  ]);
});

test("markdown punctuation around a URL is not part of the host", () => {
  const hosts = extractHosts("[x](https://github.com/a) <https://localhost/> `https://github.com`");
  assert.deepEqual(hosts.map(({ host }) => host), ["github.com", "localhost", "github.com"]);
});

test("escaped slashes, backslash separators, uppercase schemes, and CRLF still yield the host", () => {
  const hosts = extractHosts('{"u": "https:\\/\\/Evil.com\\/a"}\r\nHTTP:\\\\evil.org\r\nsee https://github.com, then https://x.io;');
  assert.deepEqual(hosts, [
    { host: "evil.com", line: 1 },
    { host: "evil.org", line: 2 },
    { host: "github.com", line: 3 },
    { host: "x.io", line: 3 },
  ]);
});

test("a URL nested in another URL's query or fragment is checked too", () => {
  const hosts = extractHosts("https://good.com/?u=https://evil.com/p#http://evil.org");
  assert.deepEqual(hosts.map(({ host }) => host), ["good.com", "evil.com", "evil.org"]);
});

test("a regex that mentions a scheme, or a bare scheme in code, yields no host", () => {
  assert.deepEqual(extractHosts("rg -o 'https?://[^ ]+' and \"http://\" + host"), []);
});

test("approved and placeholder hosts pass, and so does a subdomain under a wildcard", () => {
  const files = { "skills/a/SKILL.md": "https://github.com/x http://localhost:1 https://api.docs.dev/v1" };
  assert.deepEqual(run(files, ALLOWLIST), []);
});

test("an unapproved host fails with its file and line", () => {
  const errors = run(
    { "skills/a/SKILL.md": "https://github.com http://localhost https://api.docs.dev\nfetch https://evil.io/payload" },
    ALLOWLIST,
  );
  assert.equal(errors.length, 1);
  assert.match(errors[0], /SKILL\.md:2: evil\.io is not approved/);
});

test("a wildcard does not approve its apex", () => {
  const errors = run({ "skills/a/SKILL.md": "https://github.com http://localhost https://api.docs.dev https://docs.dev" }, ALLOWLIST);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /docs\.dev is not approved/);
});

test("scripts and configs are checked too, binaries are skipped", () => {
  const root = createTree({
    "skills/a/SKILL.md": "https://github.com http://localhost https://api.docs.dev",
    "skills/a/scripts/run.ps1": "Invoke-RestMethod https://unknown.net/api",
  });
  fs.writeFileSync(path.join(root, "skills/a/image.png"), Buffer.from([0x89, 0x00, ...Buffer.from("https://binary.net")]));
  const { errors } = checkDomains(collectFiles(["skills"], root), ALLOWLIST, root);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /run\.ps1:1: unknown\.net/);
});

test("a templated or garbled host is reported as not a hostname instead of demanding an approval", () => {
  const errors = run({ "skills/a/SKILL.md": "https://github.com http://localhost https://api.docs.dev curl https://$HOST/x" }, ALLOWLIST);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /"\$host" is not a hostname/);
});

test("UTF-16 text with a byte-order mark is read, and a NUL without one means binary", () => {
  const utf16 = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from("iwr https://ps.net", "utf16le")]);
  assert.equal(readText(utf16), "iwr https://ps.net");
  assert.equal(readText(Buffer.from([0x41, 0x00, 0x42])), null);
});

test("an approval no skill uses is reported as stale", () => {
  const errors = run({ "skills/a/SKILL.md": "https://github.com http://localhost" }, ALLOWLIST);
  assert.deepEqual(errors, ['.agents/approved-domains.toml: "*.docs.dev" is approved but no skill cites it; remove it']);
});

test("malformed allowlist lines are rejected instead of guessed at", () => {
  const { errors } = parseAllowlist(
    '"early.com" = "outside"\n[approved]\n"Upper.com" = "x"\n"dup.com" = "a"\n"dup.com" = "b"\n"empty.com" = ""\nhost = "unquoted"\n[other]\n[approved]\n"*.com" = "whole TLD"\n"a.com" = "C:\\\\p"',
  );
  assert.deepEqual(errors, [
    'line 1: "early.com" is outside a section',
    'line 3: "Upper.com" is not a lowercase hostname or a "*.name.tld" wildcard',
    'line 5: "dup.com" is listed twice',
    'line 6: "empty.com" needs a reason',
    'line 7: expected "host" = "reason" (no backslashes or inner quotes)',
    "line 8: unknown section [other]",
    "line 9: section [approved] is declared twice",
    'line 10: "*.com" is not a lowercase hostname or a "*.name.tld" wildcard',
    'line 11: expected "host" = "reason" (no backslashes or inner quotes)',
  ]);
});

test("the repository allowlist parses cleanly", () => {
  const text = fs.readFileSync(new URL("../approved-domains.toml", import.meta.url), "utf8");
  assert.deepEqual(parseAllowlist(text).errors, []);
});
