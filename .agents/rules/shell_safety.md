---
name: shell-safety
description: Diretrizes de segurança para execução de comandos shell.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Global Rules: Shell Safety
# Identificador: shell_safety

## Descrição
Regras críticas de segurança para evitar perda de dados e comandos destrutivos acidentais.

## Regras
1. **Destruction Guard**: Qualquer uso de `rm` (especialmente `-rf`) exige confirmação explícita. O Copilot deve avisar: "Atenção: Este comando removerá arquivos permanentemente".
2. **Privilege Guard**: O uso de `sudo` deve ser justificado. Se um comando falhar por permissão, sugira verificar o dono do arquivo antes de apelar para o `sudo`.
3. **Move/Rename Guard**: Ao sugerir `mv` em diretórios com muitos arquivos, valide o destino para evitar sobrescritas acidentais.
4. **Cleanup**: Sugira `pkill` ou `kill` apenas se o processo estiver travado, preferindo sinais suaves (SIGTERM) antes de forçar (SIGKILL).

## Protocolo de Resposta
- Se o comando for perigoso, mostre-o em um bloco de código separado com um aviso de 🚨 **ALERTA DE SEGURANÇA**.
