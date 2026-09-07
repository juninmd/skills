# Final review procedure
Execute the `finishing-dev` workflow and [review protocol](review-protocol.md) before creating a PR. The entry is a complete local candidate, not an already published PR.

Record `evidence.md` for sustained loops: resolved base/head or candidate snapshot, code reviewer and security reviewer scope, findings, adjudication, fixes, final review result, exact checks and concise outcomes, acceptance criteria, and residual uncertainty. Keep secrets and private logs out of evidence.

All material corrections require affected checks and independent re-review. A reviewer agreeing with another reviewer is not proof: verify each concrete trigger and consequence against code. Do not require a different model when the client does not offer one; independent contexts and distinct lenses are the minimum.

Prepare the real PR body and finish authorized publication only after review is complete. Local green gates permit PR creation; pending/failed remote checks block readiness. Hand off to [readiness procedure](phase-done.md). Never auto-merge.
