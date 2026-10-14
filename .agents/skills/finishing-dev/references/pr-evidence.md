# PR Evidence: Screenshots, Recordings, and Payloads

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
| Web UI, component, style, layout, page | Screenshot of each affected state; before/after pair when modifying existing UI |
| CLI output content, log format, help text without visual or interactive changes | Fenced block with the real captured session output; no screenshot or recording required |
| TUI or CLI layout, colors, alignment, wrapping, visual hierarchy | Screenshot of the actual terminal rendering, before/after for existing presentation; captured text when meaningful |
| Interaction, navigation, keyboard/focus flow, animation, transition, progress/loading behavior in web, desktop, mobile, TUI, or CLI | GIF or video when the sequence, timing, or motion is needed to demonstrate the change; screenshots for changed static states as applicable |
| Markdown, docs, README, generated report, diagram | Rendered screenshot or the rendered excerpt, not only the source diff |
| Mobile or desktop app screen | Screenshot per affected screen and state; before/after when modifying existing UI |
| Email template, PDF, chart, image pipeline | Rendered artifact screenshot |
| HTTP/RPC endpoint, event, webhook, queue message, schema, DTO | Request and response payload of every new or modified contract |
| Database or config schema | Resulting schema excerpt plus a sample record |
| Pure refactor with no observable change | State that explicitly, with the gates that prove behaviour is unchanged |

A change can require both: an endpoint that also renders a screen gets the payload and the screenshot.

Choose evidence from the actual diff and acceptance criteria. Static presentation needs screenshots; behavior across time needs a recording when still images cannot prove it; output wording alone needs text. Do not demand all formats for every PR. In `## Evidence`, state which formats apply and explain any relevant format marked not applicable. A required capture that is unavailable is a blocker, not an exemption.

## Visual evidence

1. Capture from the change actually running, never from a mockup or a description. Frontend capture procedure lives in the `frontend-engineering` screenshot reference.
2. One screenshot per affected static state that differs: empty, loaded, error, and the responsive or dark variant when the diff touches it. Record the relevant interaction as a short GIF or video when changed motion, timing, or sequence cannot be demonstrated by still images.
3. Before/after uses the same route or terminal command, viewport or terminal dimensions, seeded data, and theme. State the affected surface, environment, and steps; a recording must show the trigger and resulting behavior.
4. Attach screenshots and GIFs, or link/attach videos in the PR body using reviewer-accessible uploaded URLs. A path inside a temp directory or local filesystem (`/tmp/...`, `file:///...`) cannot render in a reviewer's browser. Never commit screenshot binaries into the repository tree.
5. Keep real credentials, tokens, customer names, and personal data out of screenshots and every frame/audio track of a recording before attaching.
6. Keep captured CLI output searchable in a fenced text block when text is meaningful. Add screenshots for visual terminal changes and GIFs/videos for applicable interactive or dynamic terminal behavior; text alone cannot prove layout, color, focus, or timing.

### Reviewer-accessible image attachments

Do not paste local paths (`/tmp/...`, `file:///...`) or commit screenshot binaries to the repository. Local paths cannot render in a reviewer's browser, and raw branch URLs (`https://raw.githubusercontent.com/:owner/:repo/:branch/...`) permanently 404 once the feature branch is merged and deleted, as well as failing under authentication proxies on private repositories.

Upload captured image files to GitHub's permanent `user-attachments` asset storage to obtain reviewer-accessible URLs:

```bash
# bash (Linux / macOS / WSL)
REPO_ID=$(gh api repos/:owner/:repo --jq .id)
IMAGE_URL=$(curl -s -X POST \
  -H "Authorization: Bearer $(gh auth token)" \
  -H "Accept: application/json" \
  -H "Content-Type: image/png" \
  --data-binary "@$IMAGE_PATH" \
  "https://uploads.github.com/user-attachments/assets?name=$(basename "$IMAGE_PATH")&content_type=image/png&repository_id=$REPO_ID" \
  | jq -r .url)
```

```powershell
# PowerShell (Windows)
$repoId = (gh api repos/:owner/:repo --jq .id).Trim()
$fileName = [System.IO.Path]::GetFileName($imagePath)
$imageUrl = (curl.exe -s -X POST `
  -H "Authorization: Bearer $((gh auth token).Trim())" `
  -H "Accept: application/json" `
  -H "Content-Type: image/png" `
  --data-binary "@$imagePath" `
  "https://uploads.github.com/user-attachments/assets?name=$fileName&content_type=image/png&repository_id=$repoId" | ConvertFrom-Json).url
```

When using `gh` CLI v2.99.0+, `gh pr create --attach "$IMAGE_PATH#Alt text"` automatically handles the upload and markdown reference rewrite.

Embed in the PR body as:
`![Description](https://github.com/user-attachments/assets/<uuid>)`

When upload is unavailable (offline, unauthenticated, non-GitHub remote), state that visual captures are pending attachment via the web interface. Never substitute local file paths or raw branch URLs.

~~~markdown
## Evidence

Surface/state: <!-- web, desktop, mobile, TUI, or CLI; environment and scenario -->
Capture choice: <!-- applicable formats and reasons for relevant N/A formats -->

### Before / after — visual changes
<!-- attach real screenshots using uploaded user-attachments URLs -->
<!-- ![Before](https://github.com/user-attachments/assets/<uuid>) -->
<!-- ![After](https://github.com/user-attachments/assets/<uuid>) -->
<!-- same route/command, viewport/terminal size, seeded data, and theme -->

### Interaction / motion — when applicable
<!-- attach a GIF or link/upload a video showing the trigger and result -->
<!-- caption: reproduction steps and expected behavior -->

### CLI output — when applicable
```console
$ mytool sync --dry-run
✔ 3 records planned, 0 conflicts
```
~~~

This is a template, not evidence. Replace comments with real captures and context; omit inapplicable subsections while keeping the applicability explanation. The CLI command/output above is illustrative, not a recorded run.

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
| Evidence capture | `frontend-engineering` for web capture, the app's domain skill and host execution tools for desktop/mobile/CLI/TUI captures, `documentation` for schema/OpenAPI payload extraction | Applicable screenshots, GIFs/videos, searchable terminal output, contract payloads, reproduction context and accessible attachment links, or a named capture blocker |
| Description drafting | This skill's PR preparation step and the repository's PR template | PR title and body — problem, resulting behavior, design decisions, verification, material limits — with every claim traceable to a diff line |

Merge both outputs into a single PR body before publication. A missing or fabricated capture blocks readiness the same as a failed check; the description subagent cites the evidence subagent's captures, it does not re-describe them in prose.

## Stop

- Evidence cannot be captured (no runnable environment, missing credentials): say so explicitly in the PR body, name the blocker, and do not substitute a written description presented as proof.
- A capture shows behaviour that contradicts the claimed change: fix the change, then re-capture.
