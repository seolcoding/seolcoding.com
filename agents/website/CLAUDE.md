# Website Agent - 포트폴리오 & 블로그

Hugo 기반 포트폴리오 웹사이트.

## Quick Start

```bash
cd agents/website
npm install          # Tailwind CSS
hugo server -D       # localhost:1313
```

## Architecture

- **Framework**: Hugo v0.147+ (Extended)
- **Theme**: CareerCanvas (Git submodule)
- **Styling**: Tailwind CSS via Hugo Pipes
- **Language**: Korean (defaultContentLanguage = "ko")
- **Domain**: https://seolcoding.com

## 사이트 구조 (Live)

| 섹션 | URL | 설명 |
|------|-----|------|
| 홈 | `/` | Hero, 소개, 수상, 자격증, 연락처 |
| 프로젝트 | `/projects/` | AI 프로젝트 목록 |
| 강의 | `/courses/` | AI 교육 프로그램 |
| 블로그 | `/blog/` | 기술 블로그 |
| 서비스 | `/services/` | 드롭다운 메뉴 (개발/교육/컨설팅) |
| 부산 평생교육 DB | `/busan_edu_db/` | 외부 서비스 |

## 디렉토리 구조

```
agents/website/
├── config.toml          # Hugo 메인 설정
├── content/ko/          # 한국어 콘텐츠
│   ├── about.md         # 소개 섹션
│   ├── awards.md        # 수상 이력 (6개)
│   ├── certifications.md # 자격증 (8개)
│   ├── blog/            # 블로그 포스트
│   ├── courses/         # 강의
│   ├── projects/        # 프로젝트
│   └── services/        # 서비스 (개발/교육/컨설팅)
├── layouts/             # 테마 오버라이드
│   ├── partials/        # 10개 파셜 오버라이드
│   └── _default/        # 5개 기본 레이아웃
├── static/              # 정적 파일
│   ├── images/          # awards/, certifications/, qr/
│   ├── mini-apps/       # prompt-tutorial 빌드 결과
│   └── apps/            # 기타 앱
└── themes/careercanvas/ # 테마 (submodule - 수정 금지)
```

## Theme Customization

**⚠️ CRITICAL**: `themes/careercanvas/` 직접 수정 금지.

오버라이드 방법:
```bash
cp themes/careercanvas/layouts/partials/contact.html layouts/partials/contact.html
```

### 현재 Layout Overrides

| 파일 | 변경 내용 |
|------|-----------|
| `partials/hero.html` | 서비스 카드 3개, 타이핑 애니메이션 |
| `partials/about.html` | 현재 직책, 학력, 주요 수상, 자격증, 기술, 관심사 |
| `partials/awards.html` | 수상 이력 6개 + 이미지 갤러리 |
| `partials/certifications.html` | 자격증 8개 + 이미지 갤러리 |
| `partials/contact.html` | 구글폼 QR + 카카오톡 QR + 연락처 |
| `partials/nav.html` | 서비스 드롭다운 메뉴 |
| `partials/footer.html` | 간소화 (SNS 링크만) |
| `partials/skills.html` | 기술 스택 시각화 |
| `partials/head.html` | 메타태그, OG 이미지 |
| `partials/experience.html` | 경력 사항 |
| `_default/list.html` | Lorem Picsum 플레이스홀더 |
| `_default/404.html` | 커스텀 404 |
| `_default/baseof.html` | 기본 템플릿 |

## 콘텐츠 작성

### Blog Post (YAML front matter)
```markdown
---
title: "포스트 제목"
date: 2025-01-01
tags: [태그1, 태그2]
description: "포스트 설명"
featured_image: "/images/blog/image.jpg"
---
```

### Project (TOML front matter)
```toml
+++
title = "프로젝트 제목"
date = 2025-01-01
tags = ["AI", "Development"]
featured_image = "/images/projects/image.jpg"
description = "프로젝트 설명"
+++
```

## 주요 설정 (config.toml)

```toml
# 연락처
google_form_url = "https://docs.google.com/forms/d/..."
kakao_openchat_url = "https://open.kakao.com/o/sqQTFSTh"

# 브랜딩 색상
[params.colors]
main_color   = "#095BB0"  # LinkedIn Blue
second_color = "#004182"  # Darker Blue
third_color  = "#8C8C8C"  # Neutral Gray

# 서비스 메뉴 (드롭다운)
[[languages.ko.menu.main]]
name = "서비스"
identifier = "services"
  [[languages.ko.menu.main]]
  name = "AI 솔루션 개발"
  parent = "services"
```

## 배포

GitHub Actions (`push to main`):
1. prompt-tutorial 빌드 → `static/mini-apps/prompt-tutorial/`
2. Hugo 빌드 (`--minify`)
3. GitHub Pages 배포

## 정적 에셋

```
static/
├── images/
│   ├── awards/           # 수상 이미지 (13개)
│   ├── certifications/   # 자격증 이미지 (10개)
│   ├── qr/               # QR 코드
│   └── logos/            # 로고
├── mini-apps/
│   └── prompt-tutorial/  # 빌드된 React 앱
├── apps/                 # 기타 앱
├── busan_edu_db/         # 부산 평생교육 DB
└── files/
    └── seoldonghun_resume.pdf
```
