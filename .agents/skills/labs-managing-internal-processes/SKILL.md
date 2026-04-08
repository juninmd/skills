---
name: labs-managing-internal-processes
description: Management of internal processes, demand cards, operational requests, and administrative flows within Luizalabs.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[request-type] [options]"
---

# Internal Portals & Processes

This skill helps navigate and manage non-technical requests and administrative flows using the standard Luizalabs portals.

## Key Portals
- **Turia (IAM):** [https://iam.corp.luizalabs.com](https://iam.corp.luizalabs.com)
  - Use to request access to internal systems, tools, and environments.
- **Kanban Force:** [https://kanban-force.web.app](https://kanban-force.web.app)
  - Use to manage and track demand cards for squads and tribes.
- **Papagali:** [https://papagali.ipet.sh/](https://papagali.ipet.sh/)
  - Use to create operational request cards (e.g., infrastructure requests, service tasks).
- **Kirk:** [https://kirk.magazineluiza.com.br](https://kirk.magazineluiza.com.br)
  - Use for administrative flows (e.g., approvals, HR tasks, official company procedures).

## Instructions

### 1. Requesting Access (Turia)
- If a user needs permission to access a system, database, or internal tool, direct them to **Turia**.
- It manages Identity and Access Management (IAM) for Luizalabs corporate systems.

### 2. Managing Demands (Kanban Force)
- When a user asks about the status of a project or feature, refer to the **Kanban Force** link.
- Emphasize that all demands must be logged here for traceability.

### 2. Operational Requests (Papagali)
- If a task requires manual operational intervention (not automated by CI/CD), guide the user to create a card in **Papagali**.
- This ensures the task is properly queued and handled by the operations team.

### 3. Administrative Flows (Kirk)
- For requests involving approvals or specific administrative procedures (outside the dev/ops scope), use **Kirk**.
- This portal handles the company's official business workflows.

## Best Practices
- **Single Source of Truth:** Always encourage users to use the appropriate portal instead of ad-hoc requests (Slack/Email).
- **Documentation:** When a request is completed via one of these portals, link the card/task to the related GitLab Issue or Documentation for future reference.
- **Traceability:** Ensure the project name and context are clear in each card created.
