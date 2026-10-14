#!/usr/bin/env bash
# Babá do agy — mantém uma conversa do Antigravity CLI gerando imagens continuamente.
# Relança em 401 (token de ~1h expira), dorme até o reset em 429 (lê quotaResetTimeStamp do cli.log).
# Uso: ./babysitter.sh -c <conversation-id> -d <project-dir> [-p <prompt>] [-m <max-rounds>]

set -u

CONVERSATION_ID=""
PROJECT_DIR=""
PROMPT="Continue exatamente de onde parou, mesmo escopo e regras visuais desta conversa: gere as imagens pendentes dos capítulos, salve nos caminhos canônicos do projeto e envie cada uma no Telegram (sendPhoto, credenciais no .env) assim que salvar. Não pause para perguntar."
MAX_ROUNDS=100

while getopts "c:d:p:m:" opt; do
  case "$opt" in
    c) CONVERSATION_ID="$OPTARG" ;;
    d) PROJECT_DIR="$OPTARG" ;;
    p) PROMPT="$OPTARG" ;;
    m) MAX_ROUNDS="$OPTARG" ;;
    *) echo "Uso: $0 -c <conversation-id> -d <project-dir> [-p <prompt>] [-m <max-rounds>]" >&2; exit 1 ;;
  esac
done

if [ -z "$CONVERSATION_ID" ] || [ -z "$PROJECT_DIR" ]; then
  echo "Erro: -c <conversation-id> e -d <project-dir> são obrigatórios." >&2
  exit 1
fi

AGY_BIN="${AGY_BIN:-agy}"
CLI_LOG="${HOME}/.gemini/antigravity-cli/cli.log"

cd "$PROJECT_DIR" || exit 1

for ((round=1; round<=MAX_ROUNDS; round++)); do
  echo "[round $round] $(date '+%d/%m %H:%M:%S') lançando agy"
  OUTPUT=$("$AGY_BIN" --conversation "$CONVERSATION_ID" --print "$PROMPT" --dangerously-skip-permissions --print-timeout 10h 2>&1 || true)
  echo "$OUTPUT" | tail -n 3

  TAIL_LOG=""
  if [ -f "$CLI_LOG" ]; then
    TAIL_LOG=$(tail -n 400 "$CLI_LOG" 2>/dev/null || true)
  fi

  IS_429=$(echo "$TAIL_LOG" | grep 'RESOURCE_EXHAUSTED' | tail -n 1 || true)
  IS_401=$(echo "$TAIL_LOG" | grep -E 'UNAUTHENTICATED \(code 401\)' | tail -n 1 || true)
  QUOTA_LINE=$(echo "$TAIL_LOG" | grep 'quotaResetTimeStamp' | tail -n 1 || true)

  if [ -n "$IS_429" ] && [ -n "$QUOTA_LINE" ]; then
    RESET_RAW=$(echo "$QUOTA_LINE" | sed -E 's/.*"quotaResetTimeStamp":[[:space:]]*"([^"]+)".*/\1/')
    RESET_EPOCH=$(date -d "$RESET_RAW" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "${RESET_RAW%%.*}" +%s 2>/dev/null || echo 0)
    NOW_EPOCH=$(date +%s)
    WAIT=$(( RESET_EPOCH - NOW_EPOCH + 300 ))
    [ "$WAIT" -lt 60 ] && WAIT=60
    echo "[round $round] 429 quota — dormindo $(( WAIT / 60 )) min até reset"
    sleep "$WAIT"
  elif [ -n "$IS_401" ]; then
    echo "[round $round] 401 token — relançando em 90s"
    sleep 90
  elif echo "$OUTPUT" | grep -qE 'quota will reset after'; then
    HOURS=$(echo "$OUTPUT" | grep -oE '[0-9]+h' | tr -d 'h' || echo 0)
    MINS=$(echo "$OUTPUT" | grep -oE '[0-9]+m' | tr -d 'm' || echo 0)
    SECS=$(echo "$OUTPUT" | grep -oE '[0-9]+s' | tr -d 's' || echo 0)
    HOURS=${HOURS:-0}
    MINS=${MINS:-0}
    SECS=${SECS:-0}
    WAIT=$(( HOURS * 3600 + MINS * 60 + SECS + 300 ))
    [ "$WAIT" -lt 60 ] && WAIT=60
    echo "[round $round] 429 na prosa — dormindo $(( WAIT / 60 )) min"
    sleep "$WAIT"
  else
    echo "[round $round] saída sem 429/401 (concluiu ou erro novo) - pausa 60min e relança"
    sleep 3600
  fi
done
