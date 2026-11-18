# GitHub Triage Workflow

Procedures per lifecycle stage.

## 1. Context Gathering (Step 1)
- Read the issue body, comments, and labels.
- Explore the code the issue touches.
- Redundancy check: search open and closed issues for a duplicate (`gh issue list --state all --search '<concept>'`), and the code for an existing implementation, searching by domain concept rather than the reporter's wording. State where you looked.
- Check `.out-of-scope/` for similar rejections.

## 2. Recommendation & Interaction (Step 2)
- Recommend a Category and State to the maintainer.
- Wait for: Apply, Discuss, or Override.

## 3. Bug Reproduction (Step 3)
- Run the reproduction steps.
- Report what you observed and the code paths behind it.
- If more data is needed to reproduce, label `needs-info`.

## 4. Outcome Application (Step 5)
- **ready-for-agent:** post an agent brief (see `agent-brief.md`).
- **ready-for-human:** post a task summary showing what triage established.
- **Duplicate:** link the original and close it.
- **Already implemented:** close as completed, pointing to where the behavior lives. Never write it to `.out-of-scope/`; that holds rejections, not shipped features.
- **wontfix:** close with a courteous explanation, and log it if it is a rejected enhancement.
