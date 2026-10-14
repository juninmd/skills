param(
  [string]$OutDir = (Join-Path (Get-Location) "radar-ia\raw"),
  [string]$Range  = "week"
)

$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
$subs = @(
  "ClaudeAI","LocalLLaMA","OpenAI","singularity","MachineLearning",
  "ChatGPTCoding","GithubCopilot","cursor","LLMDevs","AI_Agents",
  "ArtificialInteligence","codex","ClaudeCode","programming"
)

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force $OutDir | Out-Null }
$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$out = Join-Path $OutDir "reddit_${Range}_$stamp.md"

$lines = @("# Reddit raw dump ($Range) - $(Get-Date -Format 'yyyy-MM-dd HH:mm')","")

foreach ($s in $subs) {
  $url = "https://www.reddit.com/r/$s/top/.rss?t=$Range"
  try {
    $r = $null
    for ($try = 1; $try -le 4; $try++) {
      try { $r = Invoke-WebRequest -Uri $url -Headers @{ "User-Agent"=$ua } -TimeoutSec 25; break }
      catch {
        if ($try -eq 4) { throw }
        Start-Sleep -Seconds (15 * $try)
      }
    }
    [xml]$x = $r.Content
    $lines += "## r/$s"
    $i = 0
    foreach ($e in $x.feed.entry) {
      $i++; if ($i -gt 15) { break }
      $title = ($e.title.'#text', $e.title | Where-Object { $_ -is [string] } | Select-Object -First 1)
      $link  = $e.link.href
      $when  = $e.updated
      $body  = ""
      if ($e.content) {
        $raw = ($e.content.'#text', $e.content | Where-Object { $_ -is [string] } | Select-Object -First 1)
        $body = [System.Net.WebUtility]::HtmlDecode($raw) -replace '<[^>]+>',' ' -replace '\s+',' '
        if ($body.Length -gt 400) { $body = $body.Substring(0,400) + "..." }
      }
      $lines += "$i. **$title** - $when"
      $lines += "   $link"
      if ($body) { $lines += "   > $body" }
    }
    $lines += ""
  } catch {
    $lines += "## r/$s"
    $lines += "ERRO: $($_.Exception.Message)"
    $lines += ""
  }
  Start-Sleep -Seconds 8
}

$lines -join "`n" | Set-Content -Path $out -Encoding UTF8
Write-Output $out
