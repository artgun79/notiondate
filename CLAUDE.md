# Notion Hybrid Widget (노션 날짜·시계·날씨 위젯)

노션 페이지에 임베드(끼워 넣기)하는 작은 위젯이다. 날짜(YYYY-MM-DD 요일), 12시간제 시계, 실시간 날씨(Open-Meteo, API 키 불필요)를 보여 준다.
원래 Google AI Studio에서 만든 코드다. Vite(웹 개발 서버) 설정을 붙였고, 날씨는 키 노출을 막으려고 Gemini에서 Open-Meteo로 바꿨다.

- 배포 주소(노션 임베드용): https://artgun79.github.io/notiondate/
- `main`에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로 빌드·배포한다.

## 사용자
- 사용자는 항상 「IAN 대표님」이라고 부른다. 설명은 한국어, 코드·명령어는 영어 그대로.
- 전체 작업 지침: `C:\AI_HUB\00_GLOBAL_RULES\IAN_WORK_RULES.md` (로컬 PC에 있을 때 먼저 읽는다).
- 대표님·선생님이 쓴 내용은 지우거나 덮어쓰지 않는다. 예전에 만든 `.env.local`(Gemini 키)이 PC에 남아 있어도 지우지 않는다.
- `git push`·삭제·외부 발송은 대표님 승인 후에만 한다.

## 명령어
| 목적 | 명령 |
|---|---|
| 처음 한 번 설치 | `npm install` |
| 개발 서버 (http://localhost:3000) | `npm run dev` |
| 배포용 빌드 → `dist/` (주소 하위 경로 `/notiondate/`) | `npm run build` |
| 타입 검사 | `npm run typecheck` |
| Windows 첫 설치 자동화 | `powershell -ExecutionPolicy Bypass -File scripts\setup-local.ps1` |

## 구조
- `index.html` — Tailwind CDN, Noto Serif KR 폰트, importmap(AI Studio용, Vite에서는 무시됨)
- `index.tsx` — React 진입점
- `App.tsx` — 위젯 화면 전체 (날짜·시계·날씨, 설정창, 라이트/다크 테마, 공휴일 빨간색)
- `services/weatherService.ts` — Open-Meteo 지오코딩(지역명→좌표) + 현재 날씨, WMO 날씨 코드를 한국어로 바꾼다. `인천 서구`는 좌표를 직접 둔다
- `types.ts` — `WeatherData`, `Theme`
- `vite.config.ts` — 개발 서버 포트 3000, 빌드 시 `base: '/notiondate/'`(GitHub Pages 하위 경로)
- `.github/workflows/deploy.yml` — `main` push 때 타입 검사 → 빌드 → GitHub Pages 배포

## 주의
- 저장소와 배포 사이트는 공개다. API 키·비밀번호를 코드에 넣지 않는다. 키가 필요한 기능을 넣을 때는 먼저 대표님께 방식을 묻는다.
- Open-Meteo는 CC BY 4.0이라 출처 표기가 필요하다(`sources`에 Open-Meteo 링크). 무료 이용은 비영리 기준이므로 문제가 되면 기상청 API로 바꾼다.
- `App.tsx` 날씨 아이콘은 한국어 상태 글자(맑음·비·눈·구름·흐림·뇌우·안개)로 고른다. 날씨 문구를 바꾸면 아이콘 조건도 맞춘다.
- `App.tsx`의 `variableHolidays2025`는 2025년 음력 공휴일만 들어 있다. 연도가 바뀌면 갱신이 필요하다.
- 위젯 폭은 200px 기준이다. 노션 임베드 크기에 맞춰 확인한다.
