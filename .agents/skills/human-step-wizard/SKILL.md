---
name: human-step-wizard
description: |
  Turn the steps only a person can perform into a numbered walkthrough with a check after each one. Use for browser sign-in and consent screens, two-factor enrolment, vendor dashboards, hardware, and any manual step that must be handed to a human and then verified.
---

# Human Step Wizard

## Preflight
```bash
gh auth status; aws sts get-caller-identity      # is the step already done?
<vendor-cli> --help | rg -i 'login|token|apply'  # is there a non-interactive path at all?
rg -rn 'TODO: manual|do this by hand' docs/      # steps someone already gave up on
```

Prove no automated path exists before writing a single manual step. Most "only a human can" steps are a flag away from being a command, and a manual step outlives the reason it was manual.

## Automate or Hand Over

| Step | Hand to a human? | Instead |
|---|---|---|
| Browser sign-in with a consent screen | yes | Verify with a whoami command afterwards |
| Two-factor enrolment, hardware key | yes | Nothing — it is designed to resist automation |
| Approving a billing or plan change | yes | Then record the resulting id |
| Creating an API token | usually no | The vendor CLI or API |
| A DNS record, a bucket, a role | no | Infrastructure as code — `cloud-devops` |
| Clicking through a production console | no | The change belongs in code and review |
| Anything needing a secret typed in | yes, by them | Into an env var or file, never into chat |

## Workflow
1. Cut the list to steps that genuinely resist automation; everything else becomes a command.
2. One action per step, imperative, with the exact place: full URL, or the literal menu path.
3. Give every step a verification command **you** run afterwards. A step whose result you cannot check is a step you cannot depend on.
4. State what the person will see when it worked, so a silent failure is visible on their side too.
5. Deliver it as a numbered walkthrough that pauses and re-checks, rather than prose to interpret.
6. Say what happens on a second run. A wizard that is not safe to re-run gets abandoned halfway through.
7. Record the outputs — ids, ARNs, project numbers — into a file, and never ask for a secret to be pasted back.

```bash
step() {  # print, wait, verify; refuse to advance on a failed check
  printf '\n[%s] %s\n' "$1" "$2"
  read -r -p 'press enter when done: ' _
  eval "$3" && echo "  ok" || { echo "  NOT DONE — retry this step"; return 1; }
}

step 1 'Open https://console.example.com/apps and click Authorize' \
       'vendor-cli whoami'
step 2 'Copy the client id into .env as VENDOR_CLIENT_ID (never paste it here)' \
       'rg -q "^VENDOR_CLIENT_ID=." .env'
```

## Stop
- A step asks anyone to paste a credential into chat, a ticket, or a commit. Redirect it to an env var or a secret store — `security-ops` owns the handling.
- A step has no verification. Find one, or say plainly that the outcome is unverified.
- The manual step is a repeated production change. It is missing automation, not a wizard; route it to `cloud-devops`.
- The walkthrough exceeds roughly ten steps. It is a runbook now, and it belongs in the docs with an owner — `documentation`.

## Rules
- Verify, do not trust. "Done" from a person is a claim like any other; the check is the evidence.
- Name the exact screen. "In settings" costs a round trip; the full URL costs nothing.
- One action per step. Two verbs in one line is the step that gets half-done.
- Never proceed past a failed check. Silent advancement produces a broken end state nobody can locate.
- Make it re-runnable: every step should either be idempotent or detect that it is already satisfied.
- Capture identifiers as they appear. Asking for them later means asking someone to go back and look.
- Time-box the human. If a step needs a support ticket or an approval queue, say so up front instead of blocking on it.
- Automate the step the second the vendor ships an API. Track it as debt, not as documentation.

## Checklist
- [ ] Every remaining step proven to have no automated path.
- [ ] One action per step, with the exact URL or menu path.
- [ ] A verification command after each step, and no advancement past a failure.
- [ ] Expected on-screen result stated for each step.
- [ ] Re-run behavior described; steps idempotent or self-detecting.
- [ ] No secret ever requested into chat; outputs recorded to a file.
