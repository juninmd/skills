# Redis Operations

Modeling, client setup, cluster layout, hardening, and diagnosis. Plan-based SQL diagnosis stays in
[sql-authoring](sql-authoring.md); this file covers the decisions that make Redis fast or take it down.

## Pick the Type by Access Pattern

| Use case | Type | Why |
|---|---|---|
| Counters, simple values | String | atomic `INCR`/`DECR` |
| Object with independently updated fields | Hash | per-field read/write, no whole-object rewrite |
| Queue, recent-N | List | O(1) push/pop at the ends |
| Membership, uniqueness | Set | O(1) `SADD`/`SISMEMBER`/`SCARD` |
| Rankings, score ranges | Sorted Set | `ZADD`/`ZRANGE`/`ZRANK` |
| Nested documents | JSON | path-level updates, indexable by RQE |
| Event log, fan-out | Stream | persistent, consumer groups |
| Similarity search | Vector Set | native HNSW; see [vector-databases](vector-databases.md) |

The recurring anti-pattern is a serialized object in a String: updating one field becomes fetch, parse,
mutate, rewrite — and two concurrent writers lose data. Use a Hash.

Key names are `{entity}:{id}:{attribute}`, lowercase, colon-separated, short (they live in RAM and
appear in every command). Prefix by tenant (`tenant:42:user:7:cart`) so `SCAN` patterns and ACL key
globs can target one tenant. Never key by a full URL — hash it or extract an identifier.

## Connections: Pool or Multiplex, Never Per Request

| Style | Clients | Constraint |
|---|---|---|
| Pool | redis-py, Jedis, go-redis | a lease blocks when the pool is exhausted; size to real concurrency |
| Multiplex | Lettuce, NRedisStack | one shared connection; **cannot** carry blocking commands |

```python
pool = redis.ConnectionPool(host="localhost", port=6379, max_connections=50)
r = redis.Redis(connection_pool=pool)
```

Batch independent commands into one round trip. Use non-transactional pipelining for throughput and
`pipeline(transaction=True)` only when atomicity is actually required.

```python
pipe = r.pipeline()
for user_id in user_ids:
    pipe.get(f"user:{user_id}")
results = pipe.execute()
```

### Commands that walk everything block the server

| Never in production | Use |
|---|---|
| `KEYS pattern` | `SCAN` cursor loop |
| `SMEMBERS large_set` | `SSCAN` |
| `HGETALL large_hash` | `HSCAN` |
| `LRANGE 0 -1` | paginate (`LRANGE 0 100`) |

Redis is single-threaded for command execution: one `KEYS` on a million-key database stalls every other
client. Blocking commands (`BLPOP`, `BRPOP`, `BLMOVE`) are a different case — they are correct for queue
consumers, but always pass a timeout and never issue them on a multiplexed connection.

Client-side caching (RESP3, `protocol=3` plus `cache_config`) removes the round trip for keys that are
read constantly and written rarely: feature flags, config, session lookups. Skip it on write-heavy data
— invalidation traffic costs more than the hits save.

Set timeouts explicitly; client defaults are too generous. Connect timeout shorter than read timeout
(`socket_connect_timeout=2.0`, `socket_timeout=5.0`), tight with `retry_on_timeout` on latency-sensitive
paths, longer for batch jobs.

## Cluster: Slots Decide What Is Even Possible

Keys hash into 16,384 slots. Any multi-key command — `MGET`, `SDIFF`, `SUNIONSTORE`, transactions,
pipelines, Lua with several `KEYS[]` — requires every key on the **same slot** or the server returns
`CROSSSLOT`. Only the substring between `{` and `}` is hashed:

```python
r.set("{user:1001}:profile", "...")
r.set("{user:1001}:settings", "...")     # same slot, multi-key ops work
```

Tag the meaningful entity (`{user:1001}`), never a bare id (`{1001}`) — unrelated namespaces would
collide on one slot. Tag only where multi-key operations are actually needed; tagging everything
recreates a hotspot and defeats sharding. Single-key commands work on tagged keys, so tags can be added
incrementally, but renaming keys in production is painful: plan tagging for grouped entities up front.

Read replicas (`read_from_replicas=True`, or a second client per node in standalone) offload read-heavy
traffic. Replicas are **eventually consistent**: never read your own writes from one, and never use them
for balances, idempotency state, or anything where staleness is a correctness bug. Caches, analytics,
and dashboards are the right fit.

## Hardening: All Three Layers or None

1. **Authenticate over TLS.** `requirepass` is the legacy single-user shortcut; prefer ACL users. Serve
   on `tls-port` with cert and key configured, and verify certificates client-side
   (`ssl_cert_reqs="required"`).
2. **One ACL user per application, least privilege.**

   ```
   ACL SETUSER app_readonly on >password ~cache:* +get +mget +scan
   ACL SETUSER app_writer   on >password ~*       +@all -@dangerous
   ```

   `@dangerous` covers `FLUSHALL`, `DEBUG`, `KEYS`. A leaked cache-reader password should not be able to
   empty the database.
3. **Restrict the network.** `bind` to specific interfaces, keep `protected-mode yes`, and firewall the
   port to application subnets. `bind 0.0.0.0` with `protected-mode no` is how Redis instances end up
   indexed by internet scanners. Optionally neutralize destructive commands:
   `rename-command FLUSHALL ""`.

## Eviction Policies and Cache Stampede

`maxmemory-policy` decides what happens when the instance hits `maxmemory`. `noeviction` is the safe
default for a primary data store — writes fail with an error instead of silently losing data — but it
is the wrong choice for a pure cache, where a full instance should evict, not reject.

| Policy | Evicts | Use when |
|---|---|---|
| `noeviction` | Nothing; writes error at `maxmemory` | Redis is a system of record, not a cache |
| `allkeys-lru` | Least-recently-used key, any key | General-purpose cache, access pattern favors recency |
| `allkeys-lfu` | Least-frequently-used key, any key | Cache with a skewed, stable hot set (frequency beats recency) |
| `volatile-lru` / `volatile-lfu` | Same, but only among keys with a TTL set | Mixed workload: some keys must never be evicted, others may |
| `volatile-ttl` | The key closest to expiring | Cache where remaining TTL is a good proxy for staleness |
| `allkeys-random` / `volatile-random` | A random key | Uniform access pattern where LRU/LFU tracking overhead is not worth it |

A `volatile-*` policy evicts nothing if no key carries a TTL — set one, or the policy silently behaves
like `noeviction` until memory is exhausted and writes start failing.

**Cache stampede** ("dog-piling"): a hot key expires and every concurrent request misses at once, and
all of them hit the database simultaneously to repopulate it — turning one expiry into a load spike.

| Technique | How | Tradeoff |
|---|---|---|
| Mutex / lock on repopulation | First miss acquires a short-lived lock key (`SET key:lock value NX PX 5000`) and recomputes; the rest wait or serve stale | Simple; waiters add latency |
| Probabilistic early expiration | Recompute slightly before TTL, with rising probability as expiry nears | Smooths the spike; needs the remaining-TTL value stored alongside the data |
| Request coalescing | In-process, collapse concurrent identical fetches into one in-flight call | Only helps within one process; a cluster of app instances still stampedes across nodes |
| Stale-while-revalidate | Serve the expired value immediately while one request refreshes it in the background | Requires the caller to tolerate briefly stale data |
| Jittered TTL | Add random jitter to TTLs so keys set in bulk do not all expire at once | Prevents the synchronized-expiry case specifically, not a single hot key |

## Observability

Export from `INFO` and alert on:

| Metric | Alert when |
|---|---|
| `used_memory` | above 80% of `maxmemory` |
| `connected_clients` | sudden spike or collapse |
| `blocked_clients` | sustained above 0 |
| `instantaneous_ops_per_sec` | significant drop |
| `keyspace_hits` / `keyspace_misses` | hit ratio below 80% |
| `rejected_connections` | above 0 (the `maxclients` cap was hit) |
| `rdb_last_save_time` | older than the RPO |

For ad-hoc triage: `SLOWLOG GET 10` (commands past `slowlog-log-slower-than`, durations in µs),
`MEMORY DOCTOR` and `MEMORY USAGE <key>` for memory pressure, `CLIENT LIST` for connection storms,
`FT.INFO` / `FT.PROFILE` for search. `redis-cli monitor` prints every command — it costs real throughput
and leaks payloads into your terminal; use it on a replica or not at all in production.

## Search (RQE)

| Command | Use | Minimum |
|---|---|---|
| `FT.SEARCH` | ranked document retrieval — the default | 2.0 module / 8.0 built-in |
| `FT.AGGREGATE` | faceting, computed fields, analytics pipelines | 2.0 / 8.0 |
| `FT.HYBRID` | BM25 + vector with an explicit `COMBINE` fusion stage | **8.4** |

Below 8.4, approximate the blend with an `FT.SEARCH` pre-filter plus `=>[KNN ...]`.

Always set `PREFIX` on `FT.CREATE` and use `DIALECT 2` (default since Redis 8, required for vector
queries). Pick the narrowest field type: `TAG` for exact match and filtering, `TEXT` only for real
full-text (it is tokenized and stemmed, so it will not match exactly). Indexing a status or category
field as `TEXT` "because it is a string" is the classic mistake — `TAG` is roughly 10x faster for it.

Vector fields must agree with the embedding model on `DIM`, `DISTANCE_METRIC` (`COSINE` for normalized
text embeddings), and `TYPE`. A dimension mismatch returns garbage rather than an error.

## Semantic Cache

Redis Cloud LangCache (preview) caches LLM responses by embedding similarity, cache-aside: `search`
first, call the model on a miss, then `set`.

| Threshold | Behavior | Use when |
|---|---|---|
| 0.95+ | near-exact match | customer-facing answers where a wrong hit is costly |
| 0.9 | balanced default | start here |
| 0.8 | loose semantic match | internal tools, FAQ deduplication |

One cache per task type. A code question and a password-reset ticket are semantically unrelated, and
sharing a cache between them returns confident nonsense. Custom attributes filter subtopics within one
cache when the prompt format is shared.

## Stop

- `FLUSHALL`, `FLUSHDB`, or `CONFIG SET` is about to run against a shared instance. That is an outage,
  not a cleanup — get approval and confirm the target.
- `KEYS` or `SMEMBERS` is about to run against production. Convert it to `SCAN`/`SSCAN` first.
- Redis is reachable on `0.0.0.0` without auth. Stop and close it before anything else.
- A replica read feeds a correctness decision. Route it to the primary.

## Sources

Consolidated from the official Redis agent skills (`github.com/redis/agent-skills`, MIT, Redis Inc.):
`redis-core`, `redis-connections`, `redis-clustering`, `redis-security`, `redis-observability`,
`redis-search`, `redis-semantic-cache`. Canonical documentation: <https://redis.io/docs/latest/>.
