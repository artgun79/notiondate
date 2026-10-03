# Notion Hybrid Widget (노션 날짜·시계·날씨 위젯)

노션 페이지에 임베드(끼워 넣기)하는 작은 위젯이다. 날짜(YYYY-MM-DD 요일), 12시간제 시계, 실시간 날씨(Gemini + Google 검색)를 보여 준다.
원래 Google AI Studio에서 만든 코드이고, 로컬 PC에서 돌릴 수 있게 Vite(웹 개발 서버) 설정을 붙였다.

## 사용자
- 사용자는 항상 「IAN 대표님」이라고 부른다. 설명은 한국어, 코드·명령어는 영어 그대로.
- 전체 작업 지침: `C:\AI_HUB\00_GLOBAL_RULES\IAN_WORK_RULES.md` (로컬 PC에 있을 때 먼저 읽는다).
- 대표님·선생님이 쓴 내용은 지우거나 덮어쓰지 않는다. 특히 `.env.local`(API 키)은 절대 덮어쓰지 않는다.
- `git push`·삭제·외부 발송은 대표님 승인 후에만 한다.

## 명령어
| 목적 | 명령 |
|---|---|
| 처음 한 번 설치 | `npm install` |
| 개발 서버 (http://localhost:3000) | `npm run dev` |
| 배포용 빌드 → `dist/` | `npm run build` |
| 타입 검사 | `npm run typecheck` |
| Windows 첫 설치 자동화 | `powershell -ExecutionPolicy Bypass -File scripts\setup-local.ps1` |

## 구조
- `index.html` — Tailwind CDN, Noto Serif KR 폰트, importmap(AI Studio용, Vite에서는 무시됨)
- `index.tsx` — React 진입점
- `App.tsx` — 위젯 화면 전체 (날짜·시계·날씨, 설정창, 라이트/다크 테마, 공휴일 빨간색)
- `services/weatherService.ts` — Gemini `gemini-3-flash-preview` + Google 검색으로 날씨 JSON 받기
- `types.ts` — `WeatherData`, `Theme`
- `vite.config.ts` — `.env.local`의 `GEMINI_API_KEY`를 코드 안 `process.env.API_KEY`로 넣어 준다

## 주의
- API 키는 `.env.local`에만 둔다(`.gitignore`에 들어 있음). 예시는 `.env.example`.
- 빌드 결과물에 API 키가 그대로 들어간다. 공개 사이트에 올릴 때는 키 노출 위험을 대표님께 먼저 알린다.
- `App.tsx`의 `variableHolidays2025`는 2025년 음력 공휴일만 들어 있다. 연도가 바뀌면 갱신이 필요하다.
- 위젯 폭은 200px 기준이다. 노션 임베드 크기에 맞춰 확인한다.
