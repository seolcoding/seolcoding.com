# Website Agent - 포트폴리오 & 블로그

Hugo 기반 포트폴리오 웹사이트 및 블로그 개발 에이전트.

---

## Quick Start

```bash
cd agents/website
npm install          # Install dependencies (Tailwind CSS)
hugo server -D       # Start dev server at localhost:1313
```

---

## Architecture

- **Framework**: Hugo v0.147+ (Extended)
- **Theme**: CareerCanvas (Git submodule)
- **Styling**: Tailwind CSS 3.4+
- **Language**: Korean (defaultContentLanguage = "ko")
- **Deploy**: GitHub Actions → GitHub Pages
- **Domain**: https://seolcoding.com

---

## 디렉토리 구조

```
agents/website/
├── archetypes/          # 콘텐츠 템플릿
├── assets/              # CSS, JS 소스
│   ├── css/
│   └── js/
├── config/              # 추가 설정
├── config.toml          # Hugo 메인 설정
├── content/ko/          # 한국어 콘텐츠
│   ├── about.md
│   ├── blog/            # 블로그 포스트
│   ├── courses/         # 강의
│   ├── projects/        # 프로젝트
│   └── services/        # 서비스
├── i18n/                # 다국어 번역
├── layouts/             # 레이아웃 오버라이드
├── static/              # 정적 파일 (이미지, 파일)
└── themes/careercanvas/ # 테마 (submodule)
```

---

## Theme Customization Strategy

**⚠️ CRITICAL**: Theme is a Git submodule. NEVER modify `themes/careercanvas/` directly.

### Override Method

Copy theme files to project layouts:

```bash
cp themes/careercanvas/layouts/partials/contact.html layouts/partials/contact.html
```

Hugo priority: `layouts/` > `themes/careercanvas/layouts/`

---

## 콘텐츠 작성 가이드

### Blog Post

```markdown
---
title: "포스트 제목"
date: 2025-01-01
tags: [태그1, 태그2]
categories: [카테고리]
description: "포스트 설명"
featured_image: "/images/blog/image.jpg"
---

본문 내용...
```

### Project

```toml
+++
title = "프로젝트 제목"
date = 2025-01-01
tags = ["AI", "Development"]
featured_image = "/images/projects/image.jpg"
description = "프로젝트 설명"
+++
```

---

## 주요 Commands

```bash
# Development
hugo server -D              # 개발 서버 (draft 포함)

# Production
npm run build               # 전체 빌드

# Theme management
git submodule update --init --recursive
git submodule update --remote
```

---

## 현재 커스터마이징 목록

### Layout Overrides

| 파일                            | 변경 내용                     |
| ------------------------------- | ----------------------------- |
| `layouts/partials/hero.html`    | 서비스 카드 3개 추가          |
| `layouts/partials/about.html`   | LinkedIn 버튼 제거, 로고 추가 |
| `layouts/partials/contact.html` | QR 코드 레이아웃              |
| `layouts/partials/footer.html`  | 간소화                        |
| `layouts/partials/nav.html`     | 드롭다운 메뉴                 |
| `layouts/_default/list.html`    | 이미지 플레이스홀더           |
| `layouts/_default/404.html`     | 이력서 버튼 제거              |

---

## 정적 에셋 구조

```
static/
├── images/
│   ├── awards/           # 수상 이미지
│   ├── certifications/   # 자격증 이미지
│   ├── logos/            # 로고
│   ├── qr/               # QR 코드
│   └── blog/             # 블로그 이미지
├── files/
│   └── seoldonghun_resume.pdf
└── robots.txt
```

---

## 배포

GitHub Actions에서 자동 빌드/배포:

1. Hugo 빌드 (--minify) (Hugo Pipes로 CSS도 함께 빌드)
2. GitHub Pages 배포

빌드 결과물: `public/` → seolcoding.com
