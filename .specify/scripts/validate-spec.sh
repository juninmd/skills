#!/usr/bin/env bash
# validate-spec.sh — Linter de specs para Spec-Driven Development
# Uso: bash .specify/scripts/validate-spec.sh [feature-name]
# Se nenhum feature-name for fornecido, valida todas as specs.

set -euo pipefail

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SPECS_DIR="$PROJECT_ROOT/.specify/specs"

ERRORS=0
WARNINGS=0
SPECS_CHECKED=0

# --- Validation Functions ---

check_section_exists() {
    local file="$1"
    local section="$2"
    local label="$3"

    if ! grep -q "^## $section" "$file" 2>/dev/null; then
        echo -e "    ${RED}✗${NC} Seção obrigatória ausente: ${RED}## $section${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
    return 0
}

check_no_needs_clarification() {
    local file="$1"
    local status="$2"

    local count
    count=$(grep -c '\[NEEDS CLARIFICATION\]' "$file" 2>/dev/null || true)

    if [ "$count" -gt 0 ]; then
        if [[ "$status" == "approved" || "$status" == "implemented" ]]; then
            echo -e "    ${RED}✗${NC} ${RED}$count${NC} [NEEDS CLARIFICATION] em spec com status '$status'"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "    ${YELLOW}⚠${NC} ${YELLOW}$count${NC} [NEEDS CLARIFICATION] (aceitável em status '$status')"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
}

check_gherkin_format() {
    local file="$1"

    if grep -q "Acceptance Criteria" "$file" 2>/dev/null; then
        if ! grep -q "Given\|When\|Then" "$file" 2>/dev/null; then
            echo -e "    ${YELLOW}⚠${NC} Acceptance Criteria sem formato Gherkin (Given/When/Then)"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
}

get_spec_status() {
    local file="$1"

    local status
    status=$(grep -m1 '^\- \*\*Status\*\*:' "$file" 2>/dev/null | \
        sed 's/.*`\(.*\)`.*/\1/' | tr -d '[:space:]' || echo "unknown")

    echo "$status"
}

validate_status_value() {
    local status="$1"
    local file="$2"

    local valid_statuses="draft review approved implemented"
    if [[ ! " $valid_statuses " =~ " $status " ]] && [ "$status" != "unknown" ]; then
        echo -e "    ${RED}✗${NC} Status inválido: '$status' (válidos: draft, review, approved, implemented)"
        ERRORS=$((ERRORS + 1))
    fi
}

validate_spec() {
    local spec_dir="$1"
    local feature_name
    feature_name=$(basename "$spec_dir")
    local spec_file="$spec_dir/spec.md"

    SPECS_CHECKED=$((SPECS_CHECKED + 1))
    echo -e "\n${CYAN}📋 Validando: ${GREEN}$feature_name${NC}"

    # Check if spec.md exists
    if [ ! -f "$spec_file" ]; then
        echo -e "    ${RED}✗${NC} spec.md não encontrado em $spec_dir"
        ERRORS=$((ERRORS + 1))
        return
    fi

    # Get status
    local status
    status=$(get_spec_status "$spec_file")
    echo -e "    Status: ${CYAN}$status${NC}"

    # Validate status value
    validate_status_value "$status" "$spec_file"

    # Check required sections
    check_section_exists "$spec_file" "Header Section\|Header" "Header"
    check_section_exists "$spec_file" "User Scenarios" "User Scenarios"
    check_section_exists "$spec_file" "Requirements" "Requirements"
    check_section_exists "$spec_file" "Success Criteria" "Success Criteria"

    # Check NEEDS CLARIFICATION markers
    check_no_needs_clarification "$spec_file" "$status"

    # Check Gherkin format
    check_gherkin_format "$spec_file"

    # Check companion files
    if [ -f "$spec_dir/plan.md" ]; then
        echo -e "    ${GREEN}✓${NC} plan.md encontrado"
    else
        if [[ "$status" == "approved" || "$status" == "implemented" ]]; then
            echo -e "    ${YELLOW}⚠${NC} plan.md não encontrado (recomendado para status '$status')"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi

    if [ -f "$spec_dir/tasks.md" ]; then
        echo -e "    ${GREEN}✓${NC} tasks.md encontrado"
    else
        if [[ "$status" == "approved" || "$status" == "implemented" ]]; then
            echo -e "    ${YELLOW}⚠${NC} tasks.md não encontrado (recomendado para status '$status')"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
}

# --- Main ---

echo -e "${CYAN}🔍 Spec-Driven Development — Validador de Specs${NC}"
echo -e "   Diretório: $SPECS_DIR"

if [ $# -ge 1 ]; then
    # Validate specific feature
    FEATURE_NAME="$1"
    FEATURE_DIR="$SPECS_DIR/$FEATURE_NAME"

    if [ ! -d "$FEATURE_DIR" ]; then
        echo -e "${RED}Erro: Feature '$FEATURE_NAME' não encontrada em $SPECS_DIR${NC}"
        exit 1
    fi

    validate_spec "$FEATURE_DIR"
else
    # Validate all specs
    if [ ! -d "$SPECS_DIR" ] || [ -z "$(ls -A "$SPECS_DIR" 2>/dev/null)" ]; then
        echo -e "${YELLOW}⚠ Nenhuma spec encontrada em $SPECS_DIR${NC}"
        exit 0
    fi

    for spec_dir in "$SPECS_DIR"/*/; do
        if [ -d "$spec_dir" ]; then
            validate_spec "$spec_dir"
        fi
    done
fi

# --- Summary ---
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Resumo:${NC} $SPECS_CHECKED spec(s) validada(s)"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Tudo OK! Nenhum erro ou aviso encontrado.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS aviso(s) encontrado(s).${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS erro(s) e $WARNINGS aviso(s) encontrado(s).${NC}"
    exit 1
fi
