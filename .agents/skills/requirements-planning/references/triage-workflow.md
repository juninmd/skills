# GitHub Triage Workflow

Detailed procedures for managing the issue lifecycle.

## 1. Context Gathering (Step 1)
- Read issue body, comments, and labels.
- Explore codebase to understand relevant paths.
- Redundancy check: search open and closed issues for a duplicate (`gh issue list --state all --search '<concept>'`) and the code for an existing implementation by domain concept, not the reporter's wording. Report where you looked.
- Check `.out-of-scope/` for rejected similar concepts.

## 2. Recommendation & Interaction (Step 2)
- Present Category and State recommendations to the maintainer.
- Wait for direction: Apply, Discuss, or Override.

## 3. Bug Reproduction (Step 3)
- Execute reproduction steps to confirm behavior.
- Report observed behavior and originating code paths.
- Flag as `needs-info` if reproduction is impossible without more data.

## 4. Outcome Application (Step 5)
- **ready-for-agent:** Post agent brief (see `agent-brief.md`).
- **ready-for-human:** Post summary of task establishing triage established.
- **Duplicate:** Link the original issue and close as a duplicate.
- **Already implemented:** Close as completed with a pointer to where the behavior lives; never write it to `.out-of-scope/`, which records rejections, not built features.
- **wontfix:** Close with polite explanation (and log if a rejected enhancement).

Adapted in part from mattpocock/skills (MIT, © 2026 Matt Pocock).
