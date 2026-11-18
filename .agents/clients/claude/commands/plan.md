---
description: Break a spec into thin, verifiable slices
argument-hint: <spec, issue, or goal>
---
Input: $ARGUMENTS

Read the repository first (callers, conventions, existing tests). Produce an ordered list of vertical slices; each slice ships behavior end to end and names the command that proves it. Flag any step that is destructive, touches shared state, or needs approval. Do not edit files.
