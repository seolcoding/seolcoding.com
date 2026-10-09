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
