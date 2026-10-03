# Notion Hybrid Widget — Windows 로컬 첫 설치 스크립트
# 실행: 저장소 폴더에서  powershell -ExecutionPolicy Bypass -File scripts\setup-local.ps1
# 하는 일: Git·Node 확인 → npm install → .env.local 만들기(이미 있으면 건드리지 않음) → 빌드 확인

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo

function Step($n, $msg) { Write-Host "`n[$n/4] $msg" -ForegroundColor Cyan }
function Ok($msg)       { Write-Host "  OK  $msg" -ForegroundColor Green }
function Fail($msg)     { Write-Host "  !!  $msg" -ForegroundColor Red; exit 1 }

Step 1 'Git · Node 설치 확인'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Fail 'Git이 없습니다. 설치: winget install --id Git.Git -e  (설치 후 Claude 앱과 PowerShell을 다시 여세요)'
}
Ok (git --version)
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Fail 'Node.js가 없습니다. 설치: winget install --id OpenJS.NodeJS.LTS -e  (설치 후 PowerShell을 다시 여세요)'
}
$nodeVer = [version]((node -v).TrimStart('v'))
if ($nodeVer -lt [version]'20.19.0') {
    Fail "Node.js $nodeVer 은(는) 너무 오래됐습니다. 20.19 이상이 필요합니다: winget upgrade --id OpenJS.NodeJS.LTS -e"
}
Ok "Node.js $nodeVer"

Step 2 '패키지 설치 (npm install)'
npm install
if ($LASTEXITCODE -ne 0) { Fail 'npm install 실패' }
Ok '패키지 설치 완료'

Step 3 'API 키 파일 (.env.local)'
$envFile = Join-Path $repo '.env.local'
if (Test-Path $envFile) {
    Ok '.env.local 이 이미 있습니다. 내용은 건드리지 않았습니다.'
} else {
    Copy-Item (Join-Path $repo '.env.example') $envFile
    Ok '.env.local 을 만들었습니다. 메모장이 열리면 GEMINI_API_KEY 값을 채우고 저장하세요.'
    Start-Process notepad.exe $envFile
}

Step 4 '빌드 확인 (npm run build)'
npm run build
if ($LASTEXITCODE -ne 0) { Fail '빌드 실패 — Claude 앱 로컬 세션에서 오류 내용을 보여 주세요.' }
Ok '빌드 성공'

Write-Host "`n설치 끝. 위젯 실행: npm run dev  →  http://localhost:3000" -ForegroundColor Green
