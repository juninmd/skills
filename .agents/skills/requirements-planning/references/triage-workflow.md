# GitHub Triage Workflow

Detailed procedures for managing the issue lifecycle.

## 1. Context Gathering (Step 1)
- Read issue body, comments, and labels.
- Explore codebase to understand relevant paths.
- Check `.out-of-scope/` for rejected similar concepts.

## 2. Recommendation & Interaction (Step 2)
- Present Category and State recommendations to the maintainer.
- Wait for direction: Apply, Discuss, or Override.

## 3. Bug Reproduction (Step 3)
- Execute reproduction steps to confirm behavior.
- Report observed behavior and originating code paths.
- Flag as `needs-info` if reproduction is impossible without more data.

## 4. Outcome Application (Step 5)
- **ready-for-agent:** Post agent brief (see `AGENT-BRIEF.md`).
- **ready-for-human:** Post summary of task establishing triage established.
- **wontfix:** Close with polite explanation (and log if enhancement).
