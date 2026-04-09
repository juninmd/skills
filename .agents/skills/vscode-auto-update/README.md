# VS Code Auto Update (templates)

Arquivos de exemplo para configurar atualização automática do Visual Studio Code em Debian/Ubuntu x86_64.

Conteúdo:

- `artifacts/install-vscode-repo.sh` — configura o repositório oficial da Microsoft e instala `code` (idempotente).
- `artifacts/vscode-auto-update.sh` — script que atualiza/instala o pacote `code` e escreve logs em `/var/log/vscode-auto-update.log`.
- `artifacts/vscode-auto-update.service` — unit systemd (oneshot) que executa o script.
- `artifacts/vscode-auto-update.timer` — timer systemd agendado diariamente às 03:10 com `RandomizedDelaySec=1h`.

Instalação (executar como usuário com `sudo`):

```bash
# 1) Configure repositório e instale o pacote (se desejar usar o repositório oficial):
sudo cp .agents/skills/vscode-auto-update/artifacts/install-vscode-repo.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/install-vscode-repo.sh
sudo /usr/local/bin/install-vscode-repo.sh

# 2) Instale o script de atualização
sudo cp .agents/skills/vscode-auto-update/artifacts/vscode-auto-update.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/vscode-auto-update.sh

# 3) Instale unit e timer systemd
sudo cp .agents/skills/vscode-auto-update/artifacts/vscode-auto-update.service /etc/systemd/system/
sudo cp .agents/skills/vscode-auto-update/artifacts/vscode-auto-update.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now vscode-auto-update.timer

# 4) Verificar status e logs
sudo systemctl status vscode-auto-update.timer
sudo journalctl -u vscode-auto-update.service -n 200
tail -n 200 /var/log/vscode-auto-update.log
```

Observações:

- O `systemd timer` é preferível ao `cron` em sistemas Ubuntu modernos porque integra-se melhor ao `systemd` (controle, logs, `RandomizedDelaySec`).
- O agendamento padrão é diário às 12:00 com `RandomizedDelaySec=1h` para evitar picos nos servidores de download.
- Se preferir que o sistema aplique atualizações de pacotes automaticamente (incluindo `code`), considere habilitar `unattended-upgrades` e incluir a origem do repositório Microsoft nas origens autorizadas.
