# Babá do agy — mantém uma conversa do Antigravity CLI gerando imagens continuamente.
# Relança em 401 (token de ~1h expira), dorme até o reset em 429 (lê quotaResetTimeStamp do cli.log).
# Uso: pwsh -File babysitter.ps1 -ConversationId <id> -ProjectDir <pasta> [-Prompt <texto>] [-MaxRounds 100]
param(
  [Parameter(Mandatory = $true)] [string]$ConversationId,
  [Parameter(Mandatory = $true)] [string]$ProjectDir,
  [string]$Prompt = 'Continue exatamente de onde parou, mesmo escopo e regras visuais desta conversa: gere as imagens pendentes dos capítulos, salve nos caminhos canônicos do projeto e envie cada uma no Telegram (sendPhoto, credenciais no .env) assim que salvar. Não pause para perguntar.',
  [int]$MaxRounds = 100
)

$agy = "$env:LOCALAPPDATA\agy\bin\agy.exe"
$cliLog = "$env:USERPROFILE\.gemini\antigravity-cli\cli.log"
Set-Location $ProjectDir

for ($round = 1; $round -le $MaxRounds; $round++) {
  Write-Output "[round $round] $(Get-Date -Format 'dd/MM HH:mm:ss') lançando agy"
  $saida = & $agy --conversation $ConversationId --print $Prompt --dangerously-skip-permissions --print-timeout 10h 2>&1
  $saida | Select-Object -Last 3
  $texto = $saida | Out-String
  $tail = Get-Content $cliLog -Tail 400
  $quota = $tail | Select-String 'quotaResetTimeStamp' | Select-Object -Last 1
  $is429 = $tail | Select-String 'RESOURCE_EXHAUSTED' | Select-Object -Last 1
  $is401 = $tail | Select-String 'UNAUTHENTICATED \(code 401\)' | Select-Object -Last 1
  if ($is429 -and $quota) {
    $ts = [datetime]::Parse(($quota.Line -replace '.*"quotaResetTimeStamp":\s*"([^"]+)".*', '$1')).ToUniversalTime()
    $wait = [int]($ts - (Get-Date).ToUniversalTime()).TotalSeconds + 300
    if ($wait -lt 60) { $wait = 60 }
    Write-Output "[round $round] 429 quota — dormindo $([math]::Round($wait/60)) min ate $($ts.ToLocalTime().ToString('dd/MM HH:mm'))"
    Start-Sleep -Seconds $wait
  } elseif ($is401) {
    Write-Output "[round $round] 401 token — relançando em 90s"
    Start-Sleep -Seconds 90
  } elseif ($texto -match 'quota will reset after\s*(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s)?') {
    # O agy relata o 429 na PROSA da resposta ("Your quota will reset after 1h23m28s")
    # sem que quotaResetTimeStamp apareca no cli.log. Sem ler isto, caia-se no sono
    # fixo de 60min: se o reset era em 1h23, o relance de 60min falhava e so voltava
    # 60min depois — uma hora perdida por rodada.
    $wait = ([int]$Matches[1]) * 3600 + ([int]$Matches[2]) * 60 + ([int]$Matches[3]) + 300
    if ($wait -lt 60) { $wait = 60 }
    $volta = (Get-Date).AddSeconds($wait).ToString('dd/MM HH:mm')
    Write-Output "[round $round] 429 na prosa — dormindo $([math]::Round($wait/60)) min ate $volta"
    Start-Sleep -Seconds $wait
  } else {
    # Quota longa esgotada faz o agy responder em texto ("SEM QUOTA") sem gravar
    # RESOURCE_EXHAUSTED no log: cair aqui a cada 10min relancaria ~360 vezes em dois
    # dias, queimando quota de texto. Uma hora ainda pega o reset rapido o suficiente.
    Write-Output "[round $round] saida sem 429/401 (concluiu ou erro novo) - pausa 60min e relanca"
    Start-Sleep -Seconds 3600
  }
}
