#!/usr/bin/env bash
# Core Environment Verification for shadcn/ui

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Verifying shadcn/ui core environment..."

[ -f "components.json" ] && echo -e "${GREEN}✓${NC} components.json found" || { echo -e "${RED}✗${NC} components.json missing"; exit 1; }

if [ -f "package.json" ]; then
    echo "📦 Checking core dependencies..."
    for dep in "react" "tailwindcss"; do
        grep -q "\"$dep\"" package.json && echo -e "${GREEN}✓${NC} $dep installed" || echo -e "${RED}✗${NC} $dep missing"
    done
fi

if [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ]; then
    echo -e "${GREEN}✓${NC} Tailwind config found"
else
    echo -e "${RED}✗${NC} Tailwind config missing"; exit 1
fi

echo -e "\n${GREEN}✓${NC} Core environment check complete. Running project checks..."
./skills/shadcn-ui/scripts/verify-project.sh
