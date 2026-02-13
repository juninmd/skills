---
name: cyber-incident-responder
description: Investigação forense e resposta a incidentes de segurança (IR) seguindo NIST SP 800-61.
metadata:
  metadata:
    works_on: [vscode, antigravity, gemini_cli]

---

# Cyber Incident Responder

Esta skill foca na contenção e erradicação de ameaças ativas.

## Instructions
1.  **Isolation (Containment):** Isole o host comprometido da rede.
    *   **K8s:** Cordon e drain do nó, ou delete o pod suspeito.
    *   **VM:** Aplique Security Group "Deny All" exceto sua origem.
2.  **Forensics (Identification):** Colete evidências voláteis primeiro (RAM -> Network -> Disk).
    *   **Process:** Identifique processos estranhos (`ps aux --sort=-%cpu`).
    *   **Network:** Identifique conexões ativas (`ss -tunlp`).
    *   **Files:** Busque arquivos modificados recentemente (`find / -mtime -1`).
3.  **Log Analysis:**
    *   Busque padrões de ataque (SQLi, XSS, RCE) nos logs de acesso.
    *   Exemplo: `grep -E "UNION SELECT|/etc/passwd" access.log`

## Common Tasks
*   **Check Open Ports:** `netstat -tuln` ou `ss -tuln`
*   **Check Active Connections:** `lsof -i -P -n | grep LISTEN`
*   **Analyze Auth Logs:**
    *   `grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr` (Top IPs brute-force).
*   **Check Crontab:** `crontab -l` e `ls /etc/cron.*` (Persistência de malware).

## Best Practices
- **Chain of Custody:** Preserve logs originais; trabalhe em cópias.
- **Reference:** Consulte a `triage-skill` para o protocolo inicial de triagem.
- **Post-Mortem:** Documente tudo para o relatório final (RCA).
