#!/bin/bash
# audit_secrets.sh
echo "🔍 Auditing for exposed secrets..."
git diff --cached --name-only | grep -E ".env|.key|.pem" && echo "🚨 SEVERE: Sensitive files detected in staging!" || echo "✅ No secrets in staging."
grep -E ".env|.key|.pem" .gitignore > /dev/null || echo "⚠️ WARNING: .env patterns not found in .gitignore!"
