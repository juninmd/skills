#!/bin/bash
# Script para configurar interativamente o agente autônomo baseado no Autonomous Loop Skill
# Uso: ./scripts/setup_autonomous_agent.sh

echo "🤖 Setting up Autonomous Agent Environment..."
echo "--------------------------------------------"

# 1. Collect Project Info
read -p "📝 Enter Project Name: " project_name
if [ -z "$project_name" ]; then project_name="Autonomous Project"; fi

read -p "🎯 Enter Main Goal: " main_goal
if [ -z "$main_goal" ]; then main_goal="Complete all tasks efficiently."; fi

echo "--------------------------------------------"
echo "📋 Enter tasks one by one. Press Enter on an empty line to finish."

tasks=()
while true; do
    read -p "Task: " task
    if [ -z "$task" ]; then break; fi
    tasks+=("$task")
done

if [ ${#tasks[@]} -eq 0 ]; then
    echo "⚠️ No tasks entered. Exiting setup."
    exit 1
fi

# 2. Generate TODO_LIST.md
echo "📝 Generating TODO_LIST.md..."
cat <<EOF > TODO_LIST.md
# ${project_name} Plan
**Goal:** ${main_goal}

EOF

for task in "${tasks[@]}"; do
    echo "- [ ] ${task}" >> TODO_LIST.md
done

# 3. Create specs directory
mkdir -p specs

# 4. Generate PROMPT.md (The Brain - Adapted for TODO_LIST.md)
echo "🧠 Generating PROMPT.md..."
cat <<EOF > PROMPT.md
# Role
You are a Senior Autonomous Engineer working on **${project_name}**.
**Mission:** ${main_goal}

# Context
- **Plan:** \`TODO_LIST.md\` (This is your primary source of truth)
- **Specs:** \`specs/\` (Consult for detailed requirements)
- **Code:** \`src/\` (Implementation directory)

# Protocol (Execute Strictly)

### Phase 1: Orientation & Triage
1. **Read Plan:** Read \`TODO_LIST.md\` to understand the  current state of the project.

### Phase 2: Execution
1. Print: "🛠️ EXECUTING: [Task Name]"
2. **Implementation:**
   - Write professional, clean, and error-handled code for that single item.
   - **Refactor** if necessary to ensure the new code integrates smoothly.
3. **Verification:**
   - Run a test to confirm the specific feature works.
   - If no test exists, create a minimal unit test.

### Phase 3: Documentation & Exit
1. **Update Plan:**
   - Rewrite \`TODO_LIST.md\` with the completed task marked \`[x]\`.
2. **Termination:**
   - Print: "✅ TURN_COMPLETED"
   - **STOP GENERATING.**

# Quality Standards
- **No Placeholders:** Never write \`pass\` or \`# TODO\`. Implement the logic fully.
- **Atomic Commits:** Focus only on the selected task. Do not "fix" unrelated files.
EOF

# 5. Generate run_agent.sh (The Loop)
echo "🔄 Generating run_agent.sh..."
cat <<EOF > run_agent.sh
#!/bin/bash
while :; do
  echo "--------------------------------"
  echo "♻️  RESTARTING AGENT..."

  # Check for victory condition in logs or output if needed,
  # but for now rely on the prompt to stop generating actions.

  cat PROMPT.md | gemini --yolo

  sleep 0.5
done
EOF

chmod +x run_agent.sh

echo "✅ Environment Ready!"
echo "👉 Review 'TODO_LIST.md' if needed."
echo "👉 Run './run_agent.sh' to start the autonomous loop."