---
name: engineering-culture
description: MyProject engineering culture, quality patterns, and delivery mindset.
applyTo: '**/*.{ts,tsx,js,jsx,py,go,java,kt,md}'
---

# Rule: MyProject Culture

## 1. Hands-On Mindset and Ownership
- **Proactive Autonomy**: do not only report problems; investigate root cause in logs (backend, frontend, or Android via ADB) and propose a concrete fix.
- **Simplicity (KISS)**: avoid over-engineering. Prefer solutions that scale with minimal complexity.
- **Ownership**: if coverage drops or Sonar fails, assume responsibility to fix it.

## 2. Data-Driven Technical Excellence (DORA and Kaizen)
- **DORA Metrics**: focus on pipeline stability and deployment frequency. A 90% coverage floor helps reduce change failure rate.
- **Continuous Improvement (Kaizen)**: follow the scout rule; leave the repository better than you found it.
- **Lead Time Reduction**: automate repetitive work (build, lint, tests via Makefile and CI-Knife).

## 3. Cognitive Load and Code Sustainability
- **Lower Cognitive Load**: write code for humans. Use Google-style docstrings and semantic naming. If it requires long explanations, simplify it.
- **Psychological Safety**: treat incidents as learning opportunities (postmortems). Explain security failures with clarity and actionable guidance.
- **Documentation as a Living Asset**: README and ContainerRegistry Info are critical for discoverability. Keep Release Notes current.

## 4. Asynchronous Collaboration and Flow
- **Asynchronous Communication**: descriptive commits reduce meeting overhead. Anyone should understand the rationale from Git history.
- **Flow Preservation**: resolve technical issues autonomously (self-healing), within safety boundaries.
- **Feedback Culture**: clear logs and precise reports accelerate team evolution.

