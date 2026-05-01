#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Execute como root: sudo $0"
  exit 1
fi

ARCH=$(dpkg --print-architecture)
if [ "$ARCH" != "amd64" ]; then
  echo "Arquitetura não suportada: $ARCH"
  exit 1
fi

KEYRING="/usr/share/keyrings/microsoft.gpg"
TMPGPG="/tmp/microsoft.gpg"

if [ ! -f "$KEYRING" ]; then
  echo "Importando chave da Microsoft..."
  if ! command -v gpg >/dev/null 2>&1; then
    apt-get update -y
    apt-get install -y gnupg wget ca-certificates
  fi
  wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > "$TMPGPG"
  install -o root -g root -m 644 "$TMPGPG" "$KEYRING"
  rm -f "$TMPGPG"
fi

LIST="/etc/apt/sources.list.d/vscode.list"
if [ ! -f "$LIST" ]; then
  echo "Adicionando repositório do VS Code..."
  echo "deb [arch=amd64 signed-by=$KEYRING] https://packages.microsoft.com/repos/code stable main" > "$LIST"
fi

echo "Atualizando cache do apt..."
apt-get update -y

if ! dpkg -s code >/dev/null 2>&1; then
  echo "Instalando pacote 'code'..."
  apt-get install -y code
fi

echo "Repositório configurado e pacote instalado (se necessário)."
