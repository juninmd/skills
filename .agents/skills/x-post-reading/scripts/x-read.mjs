#!/usr/bin/env node
// Reads public X posts through the syndication endpoint. No login, no API key, no dependencies.
//
//   node x-read.mjs post <url|id> [--json]
//   node x-read.mjs thread <url|id> [--json]   walks parent posts upward
//   node x-read.mjs batch <url|id>... [--json] one record per post, failures counted
//
// Exit codes: 0 ok, 1 at least one post failed, 2 usage error.

const ENDPOINT = "https://cdn.syndication.twimg.com/tweet-result";
const THREAD_LIMIT = 20;
const TIMEOUT_MS = 15000;

function usage(message) {
  if (message) process.stderr.write(`${message}\n`);
  process.stderr.write("usage: x-read.mjs post|thread|batch <url|id>... [--json]\n");
  process.exit(2);
}

function toId(input) {
  const status = input.match(/status\/(\d{5,25})/);
  if (status) return status[1];
  if (/^\d{5,25}$/.test(input)) return input;
  usage(`not a post id or status URL: ${input}`);
}

function handleOf(post) {
  return post.user?.screen_name ?? "i";
}

function isTruncated(post) {
  const text = post.text ?? "";
  return text.endsWith("\u2026") || (post.note_tweet !== undefined && !post.note_tweet.text);
}

async function fetchPost(id) {
  const response = await fetch(`${ENDPOINT}?id=${id}&token=a`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "Mozilla/5.0 (compatible; x-read/1.0)" },
  });
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const body = await response.json();
  if (!body?.text) {
    const error = new Error("response carried no text");
    error.status = 404;
    throw error;
  }
  return body;
}

function normalize(post) {
  return {
    id: post.id_str,
    url: `https://x.com/${handleOf(post)}/status/${post.id_str}`,
    author: handleOf(post),
    at: post.created_at,
    lang: post.lang,
    text: post.text,
    likes: post.favorite_count ?? null,
    replies: post.conversation_count ?? null,
    truncated: isTruncated(post),
    inReplyTo: post.in_reply_to_screen_name ?? null,
    quoted: post.quoted_tweet
      ? {
          author: post.quoted_tweet.user?.screen_name ?? null,
          text: post.quoted_tweet.text ?? null,
        }
      : null,
    photos: (post.photos ?? []).map((photo) => photo.url),
    hasVideo: post.video !== undefined,
  };
}

function printRecord(record) {
  const lines = [
    `${record.id}  ${record.at}  @${record.author}`,
    `  likes=${record.likes} replies=${record.replies} lang=${record.lang}${record.hasVideo ? " video" : ""}`,
    ...record.text.split("\n").map((line) => `  ${line}`),
  ];
  if (record.quoted) lines.push(`  quotes @${record.quoted.author}: ${oneLine(record.quoted.text)}`);
  if (record.inReplyTo) lines.push(`  reply-to @${record.inReplyTo}`);
  for (const photo of record.photos) lines.push(`  photo ${photo}`);
  if (record.truncated) lines.push(`  TRUNCATED - read the full note at ${record.url}`);
  process.stdout.write(`${lines.join("\n")}\n\n`);
}

function oneLine(text) {
  return (text ?? "").replace(/\s+/g, " ").slice(0, 160);
}

async function run(command, targets, asJson) {
  const ids = targets.map(toId);
  const records = [];
  const failures = [];

  const collect = async (id) => {
    try {
      const post = await fetchPost(id);
      records.push(normalize(post));
      return post;
    } catch (error) {
      failures.push({ id, error: error.message });
      return null;
    }
  };

  if (command === "thread") {
    let cursor = ids[0];
    for (let hop = 0; cursor && hop < THREAD_LIMIT; hop += 1) {
      const post = await collect(cursor);
      if (!post) break;
      cursor = post.parent?.id_str ?? null;
    }
  } else {
    for (const id of ids) await collect(id);
  }

  if (asJson) {
    process.stdout.write(`${JSON.stringify({ records, failures }, null, 2)}\n`);
  } else {
    for (const record of records) printRecord(record);
    for (const failure of failures) process.stderr.write(`failed ${failure.id}: ${failure.error}\n`);
  }
  process.exit(failures.length ? 1 : 0);
}

const argv = process.argv.slice(2);
const command = argv[0];
const asJson = argv.includes("--json");
const targets = argv.slice(1).filter((argument) => argument !== "--json");
if (!["post", "thread", "batch"].includes(command)) usage(command ? `unknown command: ${command}` : null);
if (targets.length === 0) usage("no post id given");
if (command !== "batch" && targets.length > 1) usage(`${command} takes one post id`);

await run(command, targets, asJson);
