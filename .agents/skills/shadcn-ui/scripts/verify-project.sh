#!/usr/bin/env bash
# Project-specific Verification for shadcn/ui

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📂 Checking project structure..."

# Path Aliases
if [ -f "tsconfig.json" ] && grep -q '"@/\*"' tsconfig.json; then
    echo -e "${GREEN}✓${NC} Path aliases OK"
fi

# Global CSS & Tailwind Directives
CSS_FILE=$(find . -name "globals.css" -o -name "index.css" | head -n 1)
if [ -n "$CSS_FILE" ] && grep -q "@tailwind base" "$CSS_FILE"; then
    echo -e "${GREEN}✓${NC} CSS & Tailwind directives OK"
fi

# Components & Utils
if [ -d "src/components/ui" ] || [ -d "components/ui" ]; then
    echo -e "${GREEN}✓${NC} components/ui directory exists"
fi

if [ -f "src/lib/utils.ts" ] || [ -f "lib/utils.ts" ]; then
    echo -e "${GREEN}✓${NC} lib/utils.ts found"
fi

echo -e "\n${GREEN}✓${NC} Project verification complete!"
