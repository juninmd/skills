import os
import re

# List of files to update, based on the grep results
FILES_TO_UPDATE = [
    ".agents/skills/rabbitmq-skill/SKILL.md",
    ".agents/agents/software_architect.md",
    ".agents/agents/frontend_expert.md",
    ".agents/agents/mobile_engineer.md",
    ".agents/agents/secops_agent.md",
    ".agents/agents/terminal_operator.md",
    ".agents/skills/ci-knife-skill/SKILL.md",
    ".agents/skills/infrastructure-skill/SKILL.md",
    ".agents/skills/docker-skill/SKILL.md",
    ".agents/skills/security-skill/SKILL.md",
    ".agents/skills/shell-skill/SKILL.md",
    ".agents/skills/cyber-incident-responder/SKILL.md",
    ".agents/skills/scaffolding-skill/SKILL.md",
    ".agents/skills/infrastructure-as-code-specialist/SKILL.md",
    ".agents/skills/code-auditor/SKILL.md",
    ".agents/skills/autonomous-loop-skill/SKILL.md",
    ".agents/skills/data-analyst/SKILL.md",
    ".agents/skills/network-skill/SKILL.md",
    ".agents/skills/k8s-skill/SKILL.md",
    ".agents/skills/node-skill/SKILL.md",
    ".agents/skills/netskope-skill/SKILL.md",
    ".agents/skills/renovate-skill/SKILL.md",
    ".agents/skills/git-skill/SKILL.md",
    ".agents/skills/python-skill/SKILL.md",
    ".agents/skills/ci-cd-pipeline-architect/SKILL.md",
    ".agents/skills/cloud-cost-optimizer/SKILL.md",
    ".agents/skills/env-security-skill/SKILL.md",
    ".agents/agents/quality_engineer.md",
    ".agents/agents/platform_engineer.md",
    ".agents/skills/gcp-skill/SKILL.md",
    ".agents/skills/observability-skill/SKILL.md",
    ".agents/skills/accessibility-auditor/SKILL.md",
    ".agents/skills/api-integrator/SKILL.md",
    ".agents/skills/cloud-infrastructure-manager/SKILL.md",
    ".agents/skills/audio-processing-specialist/SKILL.md",
    ".agents/skills/tooling-developer/SKILL.md",
    ".agents/skills/database-administrator/SKILL.md",
    ".agents/skills/cicd-skill/SKILL.md",
    ".agents/skills/blockchain-explorer/SKILL.md",
    ".agents/skills/triage-skill/SKILL.md",
    ".agents/skills/quality-skill/SKILL.md",
    ".agents/skills/org-skill/SKILL.md",
    ".agents/skills/api-catalog-skill/SKILL.md"
]

def update_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Regex to find works_on line inside YAML frontmatter
        pattern = r"^(works_on:\s*\[.*?\])"
        
        # Check if already updated (metadata: parent) - simple check
        if "metadata:\n  works_on:" in content:
             print(f"Skipping {filepath}: Already has metadata structure")
             return

        lines = content.splitlines()
        new_lines = []
        in_frontmatter = False
        frontmatter_count = 0
        
        for line in lines:
            if line.strip() == "---":
                frontmatter_count += 1
                if frontmatter_count <= 2:
                    in_frontmatter = (frontmatter_count == 1)
                else:
                    in_frontmatter = False # Stop checking after second ---
                
                new_lines.append(line)
                continue
            
            # We are inside the first block of --- ... ---
            if frontmatter_count == 1:
                match = re.match(pattern, line)
                if match:
                    # Found it! Transform it.
                    works_on_line = match.group(1)
                    new_lines.append("metadata:")
                    new_lines.append(f"  {works_on_line}")
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)

        new_content = "\n".join(new_lines)
        if content.endswith("\n") and not new_content.endswith("\n"):
            new_content += "\n"
        
        # Only write if changed
        if new_content != content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filepath}")
        else:
             print(f"No changes made to {filepath}")

    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    for filepath in FILES_TO_UPDATE:
        if os.path.exists(filepath):
            update_file(filepath)
        else:
            print(f"Warning: File not found {filepath}")

if __name__ == "__main__":
    main()
