#!/usr/bin/env bash
# spec-status.sh — Dashboard de status de todas as specs do projeto
# Uso: bash .specify/scripts/spec-status.sh

set -euo pipefail

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SPECS_DIR="$PROJECT_ROOT/.specify/specs"

# --- Helpers ---

get_status() {
    local file="$1"
    grep -m1 '^\- \*\*Status\*\*:' "$file" 2>/dev/null | \
        sed 's/.*`\(.*\)`.*/\1/' | tr -d '[:space:]' || echo "—"
}

get_status_color() {
    local status="$1"
    case "$status" in
        draft)       echo "$YELLOW" ;;
        review)      echo "$CYAN" ;;
        approved)    echo "$GREEN" ;;
        implemented) echo "$GREEN" ;;
        *)           echo "$NC" ;;
    esac
}

count_tasks() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo "—"
        return
    fi

    local total
    total=$(grep -c '^\- \*\*TASK-' "$file" 2>/dev/null || echo "0")

    local done
    done=$(grep -c '\[x\].*TASK-\|TASK-.*\[x\]\|✓.*TASK-\|TASK-.*complete' "$file" 2>/dev/null || echo "0")

    echo "$done/$total"
}

count_clarifications() {
    local file="$1"
    grep -c '\[NEEDS CLARIFICATION\]' "$file" 2>/dev/null || echo "0"
}

has_file() {
    local file="$1"
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
}

# --- Main ---

echo -e ""
echo -e "${BOLD}${CYAN}📊 Spec-Driven Development — Status Dashboard${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -d "$SPECS_DIR" ] || [ -z "$(ls -A "$SPECS_DIR" 2>/dev/null)" ]; then
    echo -e "${YELLOW}  Nenhuma spec encontrada em .specify/specs/${NC}"
    echo -e ""
    echo -e "  Para criar uma nova spec, use:"
    echo -e "  ${CYAN}bash .specify/scripts/init-spec.sh <feature-name>${NC}"
    exit 0
fi

# Header
printf "  ${BOLD}%-30s %-14s %-10s %-6s %-6s %-6s %-8s${NC}\n" \
    "Feature" "Status" "Tasks" "Spec" "Plan" "Tasks" "Clarify"
echo -e "${CYAN}  ─────────────────────────────────────────────────────────────────────────────${NC}"

TOTAL_SPECS=0
TOTAL_DRAFT=0
TOTAL_REVIEW=0
TOTAL_APPROVED=0
TOTAL_IMPLEMENTED=0

for spec_dir in "$SPECS_DIR"/*/; do
    if [ ! -d "$spec_dir" ]; then
        continue
    fi

    feature_name=$(basename "$spec_dir")
    spec_file="$spec_dir/spec.md"
    plan_file="$spec_dir/plan.md"
    tasks_file="$spec_dir/tasks.md"

    TOTAL_SPECS=$((TOTAL_SPECS + 1))

    # Get data
    if [ -f "$spec_file" ]; then
        status=$(get_status "$spec_file")
        clarifications=$(count_clarifications "$spec_file")
    else
        status="—"
        clarifications="—"
    fi

    status_color=$(get_status_color "$status")
    tasks_progress=$(count_tasks "$tasks_file")
    has_spec=$(has_file "$spec_file")
    has_plan=$(has_file "$plan_file")
    has_tasks=$(has_file "$tasks_file")

    # Count by status
    case "$status" in
        draft)       TOTAL_DRAFT=$((TOTAL_DRAFT + 1)) ;;
        review)      TOTAL_REVIEW=$((TOTAL_REVIEW + 1)) ;;
        approved)    TOTAL_APPROVED=$((TOTAL_APPROVED + 1)) ;;
        implemented) TOTAL_IMPLEMENTED=$((TOTAL_IMPLEMENTED + 1)) ;;
    esac

    # Clarification warning
    if [ "$clarifications" -gt 0 ] 2>/dev/null; then
        clarify_display="${YELLOW}${clarifications}${NC}"
    else
        clarify_display="${GREEN}${clarifications}${NC}"
    fi

    printf "  %-30s ${status_color}%-14s${NC} %-10s %b      %b      %b      %b\n" \
        "$feature_name" "$status" "$tasks_progress" "$has_spec" "$has_plan" "$has_tasks" "$clarify_display"
done

# Footer
echo -e "${CYAN}  ─────────────────────────────────────────────────────────────────────────────${NC}"
echo -e ""
echo -e "  ${BOLD}Total:${NC} $TOTAL_SPECS spec(s)"
echo -e "  ${YELLOW}Draft:${NC} $TOTAL_DRAFT  ${CYAN}Review:${NC} $TOTAL_REVIEW  ${GREEN}Approved:${NC} $TOTAL_APPROVED  ${GREEN}Implemented:${NC} $TOTAL_IMPLEMENTED"
echo -e ""
