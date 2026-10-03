# Notion Hybrid Widget (노션 날짜·시계·날씨 위젯)

노션에 끼워 넣는 작은 위젯입니다. 날짜·요일, 12시간제 시계, 실시간 날씨를 보여 줍니다.
날씨는 Open-Meteo(키가 필요 없는 무료 날씨 서비스)를 씁니다.

## 노션에 넣기
1. 노션 페이지에서 `/embed`(또는 `/임베드`) 입력
2. 아래 주소 붙여넣기 → **링크 임베드**

```
https://artgun79.github.io/notiondate/
```

3. 임베드 블록 모서리를 끌어 폭 약 200px 크기로 맞춥니다.

`main` 브랜치에 바뀐 내용이 올라가면 GitHub Actions가 자동으로 다시 배포합니다(1~2분).

## Claude 데스크톱 앱에서 로컬 세션으로 작업하기

### 1. 준비물 (PC에 한 번만)
PowerShell(시작 메뉴 → `PowerShell` 검색)을 열고 붙여넣으세요.

```powershell
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
```

설치가 끝나면 **Claude 앱과 PowerShell을 모두 닫았다가 다시 엽니다.** (Claude 앱은 Git이 있어야 로컬 세션을 엽니다.)

### 2. 저장소 내려받기
아래 명령은 명령 프롬프트(cmd)와 PowerShell 어디서나 됩니다.

```bat
mkdir C:\AI_HUB\04_AI\Projects
cd C:\AI_HUB\04_AI\Projects
git clone https://github.com/artgun79/notiondate.git
cd notiondate
```
- 「이미 있습니다」·「already exists」 메시지는 무시해도 됩니다.
- GitHub 로그인 창이 뜨면 브라우저에서 로그인합니다.
- **이미 `notiondate` 폴더가 있으면** clone 대신 그 폴더에서 최신 내용만 받습니다.

```bat
cd C:\AI_HUB\04_AI\Projects\notiondate
git pull
```

### 3. 첫 설치 자동 실행
```bat
powershell -ExecutionPolicy Bypass -File scripts\setup-local.ps1
```
Git·Node 확인 → `npm install` → 빌드 확인까지 자동으로 합니다. API 키는 필요 없습니다.

### 4. Claude 앱에서 로컬 세션 열기
1. Claude 데스크톱 앱 → 위쪽 **Code** 탭
2. 환경 선택에서 **Local** 선택 (Cloud 아님)
3. **Select folder** → `C:\AI_HUB\04_AI\Projects\notiondate` 선택
4. 요청 입력 (예: `npm run dev 로 위젯 띄워 줘`)

Claude는 이 폴더의 `CLAUDE.md`(프로젝트 설명)와 `.claude/settings.json`(허용 명령)을 자동으로 읽습니다.

## 명령어
| 목적 | 명령 |
|---|---|
| 개발 서버 | `npm run dev` → http://localhost:3000 |
| 배포용 빌드 | `npm run build` → `dist/` 폴더 |
| 배포 | `main`에 push하면 자동 → https://artgun79.github.io/notiondate/ |
| 타입 검사 | `npm run typecheck` |

## Claude 권한 설정 (`.claude/settings.json`)
- 묻지 않고 실행: `npm install`, `npm run …`, `git status/diff/log/add/commit` 등 되돌리기 쉬운 명령
- 항상 물어봄: `git push` 등 나머지 명령
- 막아 둠: `.env` · `.env.local` 읽기, 강제 push, `git reset --hard`
- PC마다 다른 개인 설정은 `.claude/settings.local.json`에 둡니다(Git에 올라가지 않음).
