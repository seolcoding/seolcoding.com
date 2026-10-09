# AGENTS.md

이 저장소는 설코딩 홈페이지(seolcoding.com) 원본이다. 만드는 법과 배포는 `CLAUDE.md`를 따른다. 정본 규칙은 `~/900_System/AGENTS.md`다.

## 관련 저장소 (2026-10-09)

| 저장소 | 로컬 위치 | 공개 | 역할 |
|---|---|---|---|
| seolcoding-agent-os | `~/100_Dev/seolcoding-agent-os` | 비공개 | 운영 중앙. 일을 계획·실행·기록한다. 홈페이지 폴더를 안에 둔다. |
| **seolcoding.com** (이 저장소) | `~/100_Dev/seolcoding-agent-os/seolcoding.com` | 공개 | 홈페이지 원본(Hugo). 따로 깃 저장소다. `main`에 push하면 GitHub Actions가 Cloudflare Pages(`seolcoding`)로 배포한다. |
| seolcoding-agent-toolkit | `~/100_Dev/seolcoding-agent-toolkit` | 비공개 | 스킬 원본. 디자인 시스템 `skills/seolcoding-design`도 여기 있다(결과물을 만드는 도구라서 툴킷에 둔다). |

- **사실은 홈페이지가 원본이다.** 경력·수상·프로젝트는 `seolcoding.com/content/ko/`에 있다. 디자인 시스템의 문구 파일(`content/seolcoding.js`)은 여기서 가져다 쓰고, 근거를 `content/profile.md`에 적는다.
- **디자인은 디자인 시스템이 원본이다.** 색·글꼴·형광펜·로고와 메일 서명·명함 템플릿은 `skills/seolcoding-design`에서 고치고, 홈페이지·메일·인쇄물에 적용한다.
- **큰 파일과 서명 아이콘은 R2에 둔다.** 버킷 `seolcoding-files`, 주소 `https://files.seolcoding.com/` (예: `/assets/icons/`, `/semco/`).
- seolcoding.com은 agent-os 안에 있지만 agent-os 저장소에는 커밋하지 않는다(agent-os `.gitignore`). 각자 자기 저장소에 커밋·push한다.

## 테마 (예정)

- 지금 테마는 외부 테마 `careercanvas`다(`themes/careercanvas`, git 서브모듈, github.com/felipecordero/careercanvas).
- 나중에 설코딩 디자인 시스템 기반 테마로 바꾼다(2026-10-09 사용자 결정, 일정 미정).
  - 규칙: 툴킷 `skills/seolcoding-design/references/apply/web.md`
  - 기준 구현: 툴킷 `dev/design-studio/site/index.html`
  - 바꾸기 전까지 careercanvas는 고치지 않는다.

## 앱·프로젝트 표기 (2026-10-09 사용자 지시)

- 실제로 구동되지 않는 앱은 따로 표기한다. 앱·프로젝트 목록은 항목마다 상태(운영 중 / 체험용 데모 / 준비 중 / 운영 중단)를 글자로 적는다.
- 운영 중단·준비 중인 앱에는 가입·시작 링크를 걸지 않는다. "운영 중"은 실제로 열어 확인한 것만 적는다.
- 현황표는 agent-os `ops/seolcoding.com/README.md`에 있다.
