# I/O-bound work and desktop/native apps

For file scanners, hashing, indexers, file managers and other programs where the symptom is "slow on disk" or "UI hitches", not an endpoint. Run it before reaching for a CPU profiler: the answer is often how many times each byte is read.

## Workflow
1. Split the clock first: `time ./bench` gives `real`, `user`, `sys`. `sys` close to or above `user` means system calls and copying, not compute; `(user+sys)/real` far below the core count means a serial phase or waiting.
2. Count passes over the data. Bytes read = file size x number of stages that open it (hash, then compare, then thumbnail). Fixing a 2x pass count beats any micro-optimization.
3. Count system calls: `strace -c -f ./bench` (calls and time per syscall), `strace -f -e trace=file ./bench 2>&1 | wc -l` for opens. One `stat` per entry is the floor for metadata; more is a finding.
4. State the cache state next to every number. Warm page cache measures CPU and memory bandwidth; cold measures the disk. Cold needs root (`sync; echo 3 > /proc/sys/vm/drop_caches`) or a file set larger than RAM; without either, say "warm only".
5. Test parallelism as a hypothesis, not a default: with a warm cache and a memory-bound loop, rayon across groups can be a wash (measured 125 vs 120 ms, inside the noise). Keep it only if the delta beats the variance and the cold case plausibly helps.
6. Compare CLI alternatives with `hyperfine --warmup 3 --runs 10 'cmd a' 'cmd b'`; it reports mean, stdev, min and max.

## Decision table

| Symptom | First check | Typical fix |
|---|---|---|
| `sys` >= `user` | `strace -c -f` | fewer opens/stats, bigger read buffer, one pass |
| Same files read in several stages | count reads per file | merge stages; a 2-item group compares directly instead of hash-then-compare |
| Cores idle, wall time long | `(user+sys)/real` | find the serial phase; parallelize across groups, not inside tiny ones |
| Parallel version no faster | warm cache? memory bound? | revert; the simpler serial code wins |
| Huge directory slow to list | stat per entry, sort cost | stream the first page, sort in the background |
| Memory grows with item count | RSS at 1x/2x/4x input | bound the cache (LRU), store handles not decoded bitmaps |

## GUI without a GPU
A headless CI or cloud box (Xvfb, no GPU) falls back to a software renderer, which then dominates the UI thread. Frame time and scroll FPS measured there are not the user's numbers. Report them as unmeasurable, measure the non-render core (listing, filter, hashing, decode) with a repeatable bench binary, and ask the user where they feel the lag on real hardware before tuning rendering. Moving work off the UI thread (pre-decoding images) is a hypothesis: price it first (decode time per item x items per screen vs memory per decoded item) before building it.

## Stop
- The delta sits inside the run-to-run band over 9+ runs: not a result.
- The only way to show the gain is a metric this machine cannot produce (GPU frame time): record it as unproven instead of shipping it.

## Rules
- Keep the bench in the repo with a fixed generator (seeded content, fixed sizes) so the number is reproducible, and add the command and result to the repo's performance doc.
- Never trade a correctness guarantee (byte-for-byte confirmation) for speed; remove redundant passes instead.
