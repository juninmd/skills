---
name: netskope-config
description: Configurações de certificados SSL/CA para garantir conectividade em ambientes protegidos pelo Netskope na Luizalabs.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Netskope Configuration

Esta skill resolve problemas de conectividade SSL em redes corporativas protegidas.

## Instructions
- Aplique apenas se encontrar erros de validação SSL (`SSLCertVerificationError`).
- Utilize o script `scripts/setup_netskope.sh` para configurar as variáveis de ambiente.

## Safety Guidelines
- NUNCA aplique sem necessidade.