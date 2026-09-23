# PR Evidence: Screenshots and Payloads

## Contents

- Decide what the diff requires
- Visual evidence
- Payload evidence
- Migration and rollback notes
- Delegation
- Stop

Every pull request body carries proof of the change. Which proof depends on what the diff touches; a PR that changes visible behaviour or a contract and shows neither is incomplete.

## Decide what the diff requires

| Changed surface | Required evidence |
|---|---|
| Web UI, component, style, layout, page | Screenshot of the rendered result; before/after pair when the change modifies existing UI |
| Terminal / CLI output, TUI, log format, help text | Fenced block with the real captured session output |
| Markdown, docs, README, generated report, diagram | Rendered screenshot or the rendered excerpt, not only the source diff |
| Mobile or desktop app screen | Screenshot per affected screen and state |
| Email template, PDF, chart, image pipeline | Rendered artifact screenshot |
| HTTP/RPC endpoint, event, webhook, queue message, schema, DTO | Request and response payload of every new or modified contract |
| Database or config schema | Resulting schema excerpt plus a sample record |
| Pure refactor with no observable change | State that explicitly, with the gates that prove behaviour is unchanged |

A change can require both: an endpoint that also renders a screen gets the payload and the screenshot.

## Visual evidence

1. Capture from the change actually running, never from a mockup or a description. Frontend capture procedure lives in the `frontend-engineering` screenshot reference.
2. One image per affected state that differs: empty, loaded, error, and the responsive or dark variant when the diff touches it.
3. Before/after uses the same route, same viewport, same seeded data, same theme. Only the change may differ.
4. Attach images to the PR body; a path inside a temp directory is not evidence a reviewer can open.
5. Redact real credentials, tokens, customer names, and personal data before attaching.
6. Terminal evidence is pasted as text in a fenced block, not as a screenshot of text: it stays searchable and diffable.

~~~markdown
## Evidence

### Before
<!-- image of the empty state, referenced by its uploaded URL -->

### After
<!-- same route, same viewport, after the change -->

### CLI
```console
$ mytool sync --dry-run
✔ 3 records planned, 0 conflicts
```
~~~

## Payload evidence

Show the payload of every contract the diff adds or modifies, as JSON (or the transport's real format), with realistic but synthetic values.

- New contract: full request and full response, plus the status code and relevant headers when they are part of the contract.
- Modified contract: the payload with the changed fields marked, and what a previous client receives — say whether the change is backward compatible.
- Removed field or endpoint: state the removal and the migration path.
- Errors: the error payload shape for the new failure modes.
- Events and messages: the published body plus its key/topic and schema version.

~~~markdown
### `POST /v1/orders` (new)

Request
```json
{ "customerId": "cus_123", "items": [{ "sku": "ABC-1", "quantity": 2 }] }
```

Response `201`
```json
{ "id": "ord_789", "status": "pending", "total": 4990, "currency": "BRL" }
```

Error `422`
```json
{ "error": "invalid_sku", "message": "Unknown sku ABC-1", "field": "items[0].sku" }
```

Compatibility: additive; existing clients ignore `currency`.
~~~

Derive payloads from the code or a real captured call. Never invent a field the implementation does not produce, and never paste a payload containing production data or secrets.

## Migration and rollback notes
A change that touches a schema, a stored data shape, a feature-flag default, or a deployment step is incomplete without knowing how to undo it. Humble and Farley's *Continuous Delivery* treats this as release evidence: a deployment pipeline is not proven safe until the rollback path is tested as thoroughly as the forward path.

| Change type | PR body must state |
|---|---|
| Schema/data migration | Forward migration command, whether it is reversible, the down-migration or an explicit "not reversible — do X instead," and expected duration/lock behavior on production-sized data |
| Feature-flag default flip | The flag name, old and new default, and the exact toggle to revert without a redeploy |
| Config or infrastructure change | The previous value, and the command or PR that restores it |
| Breaking API/contract change | The deprecation window, the migration path for existing callers, and the version it becomes mandatory |
| Anything with no safe rollback | Say so explicitly and name the mitigation (forward-fix only, staged rollout behind a flag) — silence reads as "rollback exists" |

Derive the rollback note from the actual migration or flag code, never assume symmetry: a destructive migration (dropped column, deleted rows) has no clean down-migration, and claiming one is worse than admitting there isn't one.

## Delegation

Evidence capture and PR description are two separate subagent tasks, run alongside the [correctness/security review pair](review-protocol.md) on the same stable candidate. They are not adversarial to each other, but each is bounded and reports back rather than the orchestrator authoring both from memory.

| Task | Load | Produces |
|---|---|---|
| Evidence capture | `frontend-engineering` for screenshot capture, `run` to launch the app for CLI/TUI/web output, `documentation` for schema/OpenAPI payload extraction | One real screenshot or terminal capture per affected state, one real request/response payload per new or modified contract, or a named capture blocker |
| Description drafting | This skill's PR preparation step and the repository's PR template | PR title and body — problem, resulting behavior, design decisions, verification, material limits — with every claim traceable to a diff line |

Merge both outputs into a single PR body before publication. A missing or fabricated capture blocks readiness the same as a failed check; the description subagent cites the evidence subagent's captures, it does not re-describe them in prose.

## Stop

- Evidence cannot be captured (no runnable environment, missing credentials): say so explicitly in the PR body, name the blocker, and do not substitute a written description presented as proof.
- A capture shows behaviour that contradicts the claimed change: fix the change, then re-capture.
