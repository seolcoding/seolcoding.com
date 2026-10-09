관련 저장소와 원본 관계는 `AGENTS.md`를 본다.

# CLAUDE.md

이 저장소에서 일하는 에이전트를 위한 안내다.

## 한눈에

설코딩 홈페이지(seolcoding.com) 원본이다. **Hugo 하나로 만든다.** 외부 테마도, CSS 도구도, 빌드 전 설치 단계도 없다(2026-10-09 설코딩 디자인 시스템으로 개편).

| 부분 | 위치 | 만드는 법 |
|---|---|---|
| 홈페이지 | `/` (저장소 뿌리) | Hugo v0.155.3 extended |
| 프롬프트 튜토리얼 | `apps/prompt-tutorial/` → `static/mini-apps/prompt-tutorial/` | CI가 Bun으로 빌드해 넣는다(커밋하지 않음) |

## 명령

```bash
hugo server -p 1314      # 미리보기 (http://localhost:1314)
hugo --gc --minify       # 배포용 빌드 (public/ 에 나옴)
```

## 구조

```
seolcoding.com/
├── layouts/                 # 모양 전부 (이 저장소 것만 쓴다)
│   ├── baseof.html          # 모든 페이지의 뼈대: 본문 건너뛰기, 머리말, <main>, 꼬리말
│   ├── home.html            # 홈
│   ├── page.html            # 글 한 편
│   ├── list.html            # 목록 기본
│   ├── 404.html             # 없는 주소
│   ├── homepage/about.html  # 소개 페이지
│   ├── projects/section.html  # 프로젝트 목록
│   ├── courses/section.html   # 강의 목록
│   ├── _partials/           # head, header, footer, theme-toggle, rich(문구의 [대괄호]를 형광펜으로)
│   └── _markup/             # 마크다운을 HTML로 바꾸는 규칙
├── assets/css/site/         # 이 사이트의 CSS
│   └── base → home → about → list → article 순서로 이어 붙여 site.css 하나로 만든다(head.html)
├── static/
│   ├── seolcoding/          # 디자인 시스템 복사본(색·글꼴·로고). 여기서 고치지 않는다
│   ├── files/               # 이력서 PDF 등 내려받기
│   ├── images/              # 수상·자격·QR 그림 등
│   ├── _redirects           # Cloudflare Pages 주소 넘기기
│   └── mini-apps/           # CI가 만든 튜토리얼 빌드본 (git에 넣지 않는다)
├── content/ko/              # 글(한국어만, 주소에 /ko/ 없음)
├── apps/prompt-tutorial/    # 프롬프트 튜토리얼 원본
├── workers/                 # Cloudflare Workers (홈페이지 배포와 따로)
├── docs/                    # 참고 문서
└── config.toml              # Hugo 설정, 메뉴, 이름·직함·연락처 값
```

## 디자인 규칙

- **색은 `var(--c-*)` 변수로만 쓴다.** 밝은 화면과 어두운 화면이 그 변수로 저절로 바뀐다. CSS에 색 값을 직접 적지 않는다.
- **`static/seolcoding/`은 디자인 시스템 복사본이다.** 직접 고치지 않는다. 원본은 툴킷 `skills/seolcoding-design/assets/`이고, 다음 명령으로 다시 복사한다.
  ```bash
  ~/100_Dev/seolcoding-agent-toolkit/skills/seolcoding-design/scripts/sync-web.sh static/seolcoding          # 복사 + 확인
  ~/100_Dev/seolcoding-agent-toolkit/skills/seolcoding-design/scripts/sync-web.sh --check static/seolcoding  # 비교만
  ```
- 규칙 원문: 툴킷 `skills/seolcoding-design/references/DESIGN.md`, `references/apply/web.md`. 기준 구현: 툴킷 `dev/design-studio/site/index.html`.
- 한국어 줄바꿈은 `word-break: keep-all`(base.css에 이미 있음).

## 배포

`main`에 push하면 `.github/workflows/hugo.yml`이 돈다. **push는 사용자 승인을 받고 한다.**

1. Hugo extended v0.155.3 설치
2. `apps/prompt-tutorial/`을 Bun으로 빌드해 `static/mini-apps/prompt-tutorial/`에 넣기
3. `hugo --gc --minify`
4. `public/`에 API 키가 들어갔는지 검사(있으면 멈춤)
5. `public/`을 Cloudflare Pages 프로젝트 `seolcoding`에 올리기 (`seolcoding.com`, `www.seolcoding.com`)

필요한 GitHub 시크릿 이름: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
운영 기록은 Agent OS 저장소(`seolcoding/seolcoding-agent-os`, `ops/seolcoding.com/`)에 있다.

## 지킬 것

- 사실(경력·수상·숫자·날짜)은 `content/ko/`에 있는 것만 쓴다. 지어내지 않는다.
- 메뉴의 블로그·앱은 바깥 주소(`blog.seolcoding.com`, `apps.seolcoding.com`)로 간다.
- `public/`, `resources/`, `static/mini-apps/`는 git에 넣지 않는다.
