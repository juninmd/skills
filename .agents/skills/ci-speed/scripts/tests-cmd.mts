// `tests`: which tests ran before and after, by name. Exits 1 when any was lost or newly fails.
import type { Outcome } from "./junit.mts";
import { junitResults, showTest } from "./junit.mts";
import { die } from "./stats.mts";

export function cmdTests(a: { before: string; after: string; json?: boolean }): number {
  const b = junitResults(a.before);
  const c = junitResults(a.after);
  if (!b.tests.size || !c.tests.size) die(`no test cases found in ${b.tests.size ? a.after : a.before}`);
  if (!b.executed) die(`no case in ${a.before} shows a test ran (every case skipped, or only errors such as a collection failure); nothing to compare, so this verifies nothing`);
  const ran = (o: Outcome[]) => o.filter((x) => x === "passed" || x === "failed").length;
  const failed = (o: Outcome[]) => o.filter((x) => x === "failed" || x === "errored").length;
  const present = (o: Outcome[]) => o.filter((x) => x !== "skipped").length;
  const count = (o: Outcome[], k: Outcome) => o.filter((x) => x === k).length;
  const stopped: [string, number, number][] = [];
  const newlySkipped = new Set<string>();
  const newlyErrored = new Set<string>();
  const newFail: [string, number][] = [];
  for (const t of [...new Set([...b.tests.keys(), ...c.tests.keys()])].sort()) {
    const ob = b.tests.get(t) ?? [];
    const oc = c.tests.get(t) ?? [];
    const lost = Math.max(ran(ob) - ran(oc), ob.length - oc.length, present(ob) - present(oc));
    if (lost > 0) {
      stopped.push([t, lost, ob.length]);
      if (count(oc, "skipped") > count(ob, "skipped")) newlySkipped.add(t);
      else if (count(oc, "errored") > count(ob, "errored")) newlyErrored.add(t);
    }
    if (failed(oc) > failed(ob)) newFail.push([t, failed(oc) - failed(ob)]);
  }
  const suiteErrors = [...c.errors].filter(([k, n]) => n > (b.errors.get(k) ?? 0)).map(([k, n]): [string, number] => [k, n - (b.errors.get(k) ?? 0)]).sort();
  const ok = !stopped.length && !newFail.length && !suiteErrors.length;
  const label = (t: string, k: number, n: number) => showTest(t) + (n <= 1 ? "" : ` (${k} of ${n} copies)`);
  const sum = (m: Map<string, Outcome[]>) => [...m.values()].reduce((s, v) => s + ran(v), 0);
  const res = {
    ran_before: sum(b.tests), ran_after: sum(c.tests),
    stopped_running: stopped.map(([t, k, n]) => label(t, k, n)), newly_skipped: [...newlySkipped].map(showTest),
    new_failures: newFail.map(([t, k]) => label(t, k, k)),
    new_suite_errors: suiteErrors.map(([s, k]) => showTest(s) + (k > 1 ? ` (${k})` : "")),
    verdict: ok ? "tests kept" : "FAIL: tests lost or newly failing",
  };
  if (a.json) console.log(JSON.stringify(res, null, 2));
  else {
    console.log(`tests that ran: before ${res.ran_before}, after ${res.ran_after}`);
    for (const [t, k, n] of stopped) console.log(`  stopped running: ${label(t, k, n)}${newlySkipped.has(t) ? "  (now skipped)" : newlyErrored.has(t) ? "  (now only an error)" : ""}`);
    for (const [t, k] of newFail) console.log(`  new failure: ${showTest(t)}${k === 1 ? "" : ` (${k} more copies)`}`);
    for (const [s, k] of suiteErrors) {
      if ((JSON.parse(s) as string[]).at(-1) === "(retried)") console.log(`  new failure, passed only on a retry: ${showTest(s).replace("::(retried)", "")}`);
      else console.log(`  new suite error: ${showTest(s)}${k === 1 ? "" : ` (${k} new)`}`);
    }
    console.log(`verdict: ${res.verdict}`);
  }
  return ok ? 0 : 1;
}
