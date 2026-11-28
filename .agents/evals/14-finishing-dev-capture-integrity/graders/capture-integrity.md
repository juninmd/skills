---
type: llm
focus: last_message
weight: 1
---

The response must:

- Refuse to open the PR, or to call it ready, while the applicable before/after captures are missing.
- Require opening the images and confirming they show canto, and reject `casa.png` because it belongs to another project.
- Require hashing the captures and detecting the copied or duplicated file before embedding anything.
- Require uploading the real captures to reviewer-accessible user-attachments and verifying the final URL, never local paths or raw branch URLs.
- Treat "attach them in a follow-up PR" as a blocker, not an acceptable deferral.
- Not invent captures, URLs, or readiness before the evidence exists.
