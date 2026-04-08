# Distributed Systems Architect Formulários 📋
## 1. Architecture Design Request (arch_design.md)

### Goal
Define the high-level architecture for a new distributed system or microservice.

### Fields
- **Project Name:** [Name]
- **Core Requirements:** [Brief description of functionality]
- **Estimated Load:** [Requests per second, Data volume]
- **Scalability Goals:** [Horizontal/Vertical scaling needs]
- **Availability Requirements:** [e.g., 99.9% uptime]
- **Proposed Services:**
    - **Service A:** [Functionality, Technology]
    - **Service B:** [Functionality, Technology]
- **Communication Pattern:** [Sync (REST/gRPC) / Async (Message Queues)]

## 2. Distributed System Health Report (system_health.md)

### Goal
Summarize the operational status and performance of the distributed system.

### Fields
- **Reporting Period:** [Start Date - End Date]
- **Service Status:**
    - **Service [Name]:** [Up/Down/Degraded, Latency P99]
- **Messaging Health:**
    - **Broker:** [Status, CPU/Memory]
    - **Queue [Name]:** [Message Rate, Queue Depth, Consumers]
- **Incident Summary:** [Total incidents, MTTR]
- **Optimization Suggestions:** [Bottlenecks identified, proposed fixes]
