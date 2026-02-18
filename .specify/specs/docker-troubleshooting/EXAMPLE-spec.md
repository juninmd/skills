# Specification Example - Docker Troubleshooting Skill

This is a completed example specification showing how to properly fill out the template.

---

## Header Section

- **Feature Name**: Docker Troubleshooting Skill
- **Type**: `skill`
- **Branch**: `feature/docker-troubleshooting-skill`
- **Date**: 2026-02-18
- **Status**: `draft`
- **Description**: AI-powered skill that analyzes Docker errors, container logs, and image issues, providing actionable troubleshooting steps and best practice recommendations.
- **Platforms**: gemini_cli, copilot, antigravity, claude, cursor, windsurf, cline

---

## User Scenarios & Testing

### P1: Analyze Container Error Messages

**Narrative**:
- **Who**: DevOps engineers and developers debugging containerized applications
- **What**: They run a Docker container that fails to start or encounters runtime errors
- **Why**: Quick diagnosis saves time in development and production troubleshooting

**Independent Testing Approach**:
- Provide a common Docker error message (e.g., "OOMKilled", port binding error, permission denied)
- Verify the skill correctly identifies the root cause
- Check that suggestions match Docker documentation best practices
- Test both on local Docker and in output from CI/CD logs

**Acceptance Criteria**:
```gherkin
Scenario: Docker OOMKilled error analysis
Given a container has been killed with "OOMKilled" status
When the user asks the skill to analyze the error
Then the skill should:
  - Identify that it's an out-of-memory error
  - Suggest increasing memory limits
  - Recommend monitoring memory usage with docker stats
  - Provide the exact docker update command to apply

Scenario: Port already in use
Given a container fails with "Bind for 0.0.0.0:8080 failed: port is already allocated"
When the user asks for troubleshooting
Then the skill should:
  - Identify the port conflict
  - Show which process is using port 8080 (lsof/netstat commands)
  - Suggest killing the existing process or using a different port
  - Note this issue and provide docker restart strategy
```

### P2: Analyze Container Logs for Issues

**Narrative**:
- **Who**: Application developers reviewing container logs
- **What**: They have container logs that might contain errors or warnings
- **Why**: Logs often contain clues about what went wrong; the skill saves manual review time

**Independent Testing Approach**:
- Provide realistic logs from actual applications (Node.js, Python, Java, Go examples)
- Verify the skill identifies error patterns
- Check that actionable fixes are provided
- Validate that false positives are avoided

**Acceptance Criteria**:
```gherkin
Scenario: Node.js unhandled rejection in logs
Given container logs contain "UnhandledPromiseRejectionWarning: Error: connect ECONNREFUSED"
When the skill analyzes the logs
Then it should suggest:
  - Checking if dependent services are running
  - Adding proper error handling for rejections
  - Verifying network connectivity between containers
  - Providing docker-compose networking debugging commands

Scenario: Memory leak pattern detection
Given logs show increasing memory usage over time and eventual crash
When the skill analyzes the logs
Then it should:
  - Identify potential memory leak symptoms
  - Suggest profiling tools (node --inspect for Node.js, etc.)
  - Recommend log rotation if logs are consuming space
```

### P3: Image Build Troubleshooting

**Narrative**:
- **Who**: Container image maintainers and CI/CD pipeline owners
- **What**: Docker image builds fail with cryptic error messages
- **Why**: Understanding build errors speeds up iteration and reduces deployment delays

**Independent Testing Approach**:
- Common Dockerfile errors (base image not found, missing layer, permission issues)
- Verify suggestions follow Docker best practices
- Test that the skill recognizes common patterns vs. unique issues

### Edge Cases

- **Error Scenario 1**: What if error message is in a different language? → Flag as potentially non-English and suggest looking at raw error messages
- **Error Scenario 2**: What if logs are extremely large (> 1MB)? → Suggest sampling or filtering before analysis
- **Error Scenario 3**: What if error contains sensitive information (API keys, passwords)? → Flag for user review and suggest scrubbing logs
- **Boundary Case 1**: What is the maximum log size we can effectively analyze? → Recommend 100KB-1MB for good performance

---

## Requirements

### Functional Requirements

- **FR-001**: Parse Docker error messages from container output, logs, or CLI errors
  - Definition: Extract error type, message, and context from various Docker outputs
  - Scope: Support `docker run`, `docker build`, `docker logs`, `docker pull` errors
  - Exclusions: Not responsible for parsing tool-specific logs (K8s, etc.)

- **FR-002**: Match errors against a knowledge base of common Docker issues
  - Definition: Recognize patterns and map to known root causes
  - Scope: Include top 50 Docker errors from Stack Overflow and Docker documentation
  - Implementation: Can use regex patterns or LLM-based matching

- **FR-003**: Provide actionable troubleshooting steps for identified errors
  - Definition: Give specific commands or configuration changes to resolve issues
  - Scope: Range from simple (kill process, restart container) to complex (rebuild with new base image)
  - Accessible on all supported platforms

- **FR-004**: [NEEDS CLARIFICATION] Suggest performance improvements for container configuration
  - Questions: Should this proactively suggest resource limits, log drivers, restart policies?
  - Scope: Unclear if this is in the skill or a separate feature

- **FR-005**: Format output for readability in different AI agent interfaces
  - Definition: Optimize presentation for Gemini CLI, GitHub Copilot, Claude, etc.
  - Scope: Use markdown formatting, code blocks, and structured sections
  - Exclude: Platform-specific UI components (use plain markdown only)

### Non-Functional Requirements

- **Performance**: Analyze errors and return suggestions in < 2 seconds
- **Scalability**: Handle individual container logs up to 100KB without degradation
- **Security**: Do not expose sensitive environment variables or secrets in suggestions
- **Accessibility**: Clear, jargon-free explanations (link to Docker docs for advanced concepts)
- **Compatibility**: Work across Linux, macOS, and Windows Docker installations

### Key Entities & Data Model

**Entity: Docker Error**
```typescript
interface DockerError {
  id: string;                    // Unique identifier
  errorType: string;             // e.g., "OOMKilled", "PortAlreadyInUse"
  originalMessage: string;       // Full error message as seen by user
  container_id?: string;         // If available
  image_name?: string;           // If available
  timestamp?: Date;              // When error occurred
  confidence: number;            // 0-1 confidence in classification (1.0 = certain)
  detected_at: Date;
  updated_at: Date;
}
```

**Entity: Troubleshooting Suggestion**
```typescript
interface TroubleshootingSuggestion {
  id: string;
  error_id: string;              // Links to DockerError
  title: string;                 // Short description
  root_cause: string;            // Why did this happen?
  steps: string[];               // Ordered steps to fix
  commands: string[];            // CLI commands to run
  references: string[];          // Links to Docker docs
  priority: "immediate" | "important" | "nice-to-have";
}
```

**Relationships**:
```
DockerError 1 -- N TroubleshootingSuggestion
  ↳ One error can have multiple resolution paths
  ↳ Different users might choose different fixes
```

---

## Dependencies & Constraints

### External Dependencies
- **Docker**: Assumes user has Docker installed and CLI available
- **API**: Could optionally integrate with Docker Hub API (image metadata)
- **Knowledge Base**: Need access to curated Docker error patterns

### Internal Dependencies
- **Skills Framework**: Must follow the skill metadata and registration pattern
- **CLI Installer**: Compatible with existing pnpm installer scripts
- **Platform SDKs**: Works with each AI agent's documentation/knowledge

### Constraints
- **No Docker daemon access**: Skill only analyzes text (error messages, logs) - doesn't run Docker commands
- **Language**: English error messages and recommendations
- **Size**: Should not require large ML models - use pattern matching and inference
- **License**: Only reference Docker's official documentation and open-source knowledge

### Assumptions
- User is familiar with basic Docker concepts (containers, images, volumes)
- User has access to docker CLI and can run suggested commands
- Environmental information may not always be available
- Some errors are environment-specific and may need manual investigation

---

## Success Criteria

- **SC-001**: All P1 user scenarios (error analysis, log analysis) execute successfully with > 80% accuracy
- **SC-002**: Suggestions match Docker documentation and are actionable
- **SC-003**: Works on all 7 specified platforms (Gemini, Copilot, Claude, Antigravity, Cursor, Windsurf, Cline)
- **SC-004**: Test coverage > 85% (unit + integration tests)
- **SC-005**: Documentation complete with 5+ real-world examples in SKILL.md
- **SC-006**: Catalog entry generated with proper metadata (name, description, platforms, tags)
- **SC-007**: Build validation passes: `pnpm docs:build` completes without errors
- **SC-008**: Feedback from testing team on usability and accuracy improvements needed before production

---

## Out of Scope

- Running Docker commands on user's system (read-only analysis only)
- Kubernetes troubleshooting (separate skill)
- Docker image registry (Docker Hub, ECR) troubleshooting beyond basic auth issues
- Advanced networking diagnostics (beyond "check if service is running")
- Performance profiling tools integration
- Historical error tracking or analytics

---

## Related Documents

- **Constitution**: See `.specify/memory/constitution.md` for core principles
- **Plan**: Will be created at `.specify/specs/docker-troubleshooting/plan.md`
- **Tasks**: Will be created at `.specify/specs/docker-troubleshooting/tasks.md`
- **References**:
  - Docker Official Documentation: https://docs.docker.com/
  - Common Docker Errors: https://docs.docker.com/config/containers/resource_constraints/
  - Docker Logs: https://docs.docker.com/engine/reference/commandline/logs/

---

## Notes for Planning Phase

- Consider whether error classification should be rule-based (regex patterns) or LLM-based (more flexible but less deterministic)
- Research top 50 Docker errors from public sources to ensure comprehensive coverage
- Plan how to handle errors not in the knowledge base (fallback to general debugging steps)
- Consider adding a feedback mechanism for users to report incorrect suggestions
