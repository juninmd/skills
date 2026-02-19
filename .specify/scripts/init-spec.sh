#!/usr/bin/env bash
# init-spec.sh — Scaffolding de nova feature para Spec-Driven Development
# Uso: bash .specify/scripts/init-spec.sh <feature-name>

set -euo pipefail

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TEMPLATES_DIR="$PROJECT_ROOT/.specify/templates"
SPECS_DIR="$PROJECT_ROOT/.specify/specs"

usage() {
    echo -e "${CYAN}Uso:${NC} bash .specify/scripts/init-spec.sh <feature-name>"
    echo ""
    echo -e "Cria a estrutura completa de spec para uma nova feature:"
    echo -e "  .specify/specs/<feature-name>/spec.md"
    echo -e "  .specify/specs/<feature-name>/plan.md"
    echo -e "  .specify/specs/<feature-name>/tasks.md"
    echo -e "  .specify/specs/<feature-name>/checklist.md"
    echo ""
    echo -e "Opcionalmente cria a branch: feature/<feature-name>"
    exit 1
}

# Validate arguments
if [ $# -lt 1 ]; then
    echo -e "${RED}Erro: nome da feature é obrigatório.${NC}"
    usage
fi

FEATURE_NAME="$1"
FEATURE_DIR="$SPECS_DIR/$FEATURE_NAME"
DATE=$(date +%Y-%m-%d)

# Check if feature already exists
if [ -d "$FEATURE_DIR" ]; then
    echo -e "${YELLOW}⚠ Diretório já existe: $FEATURE_DIR${NC}"
    echo -e "  Use outro nome ou remova o diretório existente."
    exit 1
fi

# Check if templates exist
if [ ! -f "$TEMPLATES_DIR/spec-template.md" ]; then
    echo -e "${RED}Erro: Template não encontrado em $TEMPLATES_DIR/spec-template.md${NC}"
    exit 1
fi

echo -e "${CYAN}🚀 Inicializando spec para: ${GREEN}$FEATURE_NAME${NC}"
echo ""

# Create directory
mkdir -p "$FEATURE_DIR"
echo -e "  ${GREEN}✓${NC} Diretório criado: .specify/specs/$FEATURE_NAME/"

# Copy and customize spec template
if [ -f "$TEMPLATES_DIR/spec-template.md" ]; then
    sed "s/\[Name of the skill\/agent\/rule\]/$FEATURE_NAME/g; s/\[date created\]/$DATE/g; s/\[descriptive-identifier\]/$FEATURE_NAME/g" \
        "$TEMPLATES_DIR/spec-template.md" > "$FEATURE_DIR/spec.md"
    echo -e "  ${GREEN}✓${NC} spec.md criado (a partir do template)"
fi

# Copy and customize plan template
if [ -f "$TEMPLATES_DIR/plan-template.md" ]; then
    sed "s/\[feature\]/$FEATURE_NAME/g; s/\[date\]/$DATE/g; s/\[descriptive-identifier\]/$FEATURE_NAME/g" \
        "$TEMPLATES_DIR/plan-template.md" > "$FEATURE_DIR/plan.md"
    echo -e "  ${GREEN}✓${NC} plan.md criado (a partir do template)"
fi

# Copy and customize tasks template
if [ -f "$TEMPLATES_DIR/tasks-template.md" ]; then
    sed "s/\[Feature name\]/$FEATURE_NAME/g; s/\[feature\]/$FEATURE_NAME/g; s/\[name\]/$FEATURE_NAME/g" \
        "$TEMPLATES_DIR/tasks-template.md" > "$FEATURE_DIR/tasks.md"
    echo -e "  ${GREEN}✓${NC} tasks.md criado (a partir do template)"
fi

# Copy checklist template if it exists
if [ -f "$TEMPLATES_DIR/checklist-template.md" ]; then
    sed "s/\[Feature Name\]/$FEATURE_NAME/g; s/\[feature\]/$FEATURE_NAME/g" \
        "$TEMPLATES_DIR/checklist-template.md" > "$FEATURE_DIR/checklist.md"
    echo -e "  ${GREEN}✓${NC} checklist.md criado (a partir do template)"
fi

echo ""
echo -e "${CYAN}📝 Estrutura criada:${NC}"
echo -e "  .specify/specs/$FEATURE_NAME/"
echo -e "  ├── spec.md       ← Preencha primeiro"
echo -e "  ├── plan.md       ← Após spec aprovada"
echo -e "  ├── tasks.md      ← Após plan aprovado"
echo -e "  └── checklist.md  ← Para validação final"

# Ask about branch creation
echo ""
echo -e "${CYAN}🌿 Deseja criar a branch feature/$FEATURE_NAME? [s/N]${NC}"
read -r CREATE_BRANCH

if [[ "$CREATE_BRANCH" =~ ^[sS]$ ]]; then
    git checkout -b "feature/$FEATURE_NAME" 2>/dev/null && \
        echo -e "  ${GREEN}✓${NC} Branch criada: feature/$FEATURE_NAME" || \
        echo -e "  ${YELLOW}⚠${NC} Não foi possível criar a branch (já existe ou não é um repo git)"
fi

echo ""
echo -e "${GREEN}✅ Pronto! Próximos passos:${NC}"
echo -e "  1. Preencha .specify/specs/$FEATURE_NAME/spec.md"
echo -e "  2. Resolva todos os [NEEDS CLARIFICATION]"
echo -e "  3. Preencha plan.md e tasks.md"
echo -e "  4. Implemente seguindo o workflow SDD"
echo -e ""
echo -e "  Dica: use o workflow ${CYAN}sdd-new-feature${NC} para guiar o processo completo"
