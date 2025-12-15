# Slidev Presentation Project

Slidev를 활용한 프레젠테이션 제작 프로젝트.

---

## 필수 참조

**슬라이드 작성 전 반드시 참조:**

| 파일 | 설명 | 우선순위 |
|------|------|----------|
| `docs/BEST_PRACTICES.md` | **통합 모범 사례 가이드** | 최우선 |
| `slidev/slides.md` | 공식 Starter Template | 필수 |
| `node_modules/@slidev/theme-{name}/example.md` | 테마별 example | 테마 선택 후 |

### 온라인 리소스

- [sli.dev/resources/showcases](https://sli.dev/resources/showcases) - 공식 Showcase
- [github.com/antfu/talks](https://github.com/antfu/talks) - Slidev 창시자 발표들
- [github.com/george-gca/bracis_2023_srcaps](https://github.com/george-gca/bracis_2023_srcaps) - 학술 발표 예시

### 핵심 원칙

1. `layout: none` + 수동 HTML 금지 - 테마 레이아웃 사용
2. 핵심 수치는 `layout: fact`로 강조
3. ASCII 다이어그램 금지 - Mermaid 사용
4. `v-click`, `v-motion` 애니메이션 적극 활용
5. `grid-cols-2` 반복 금지 - 레이아웃 다양화

---

## 디렉토리 구조

```
slidev/
├── CLAUDE.md                    # 프로젝트 지침 (이 파일)
├── slidev/slides.md             # 공식 Starter Template
│
├── docs/                        # 문서 (핵심 참조)
│   ├── BEST_PRACTICES.md        # 통합 모범 사례 가이드
│   ├── syntax_guide.md          # 마크다운 문법
│   ├── animation.md             # 애니메이션
│   ├── layouts.md               # 레이아웃
│   ├── components.md            # 빌트인 컴포넌트
│   ├── theme_addons.md          # 테마 및 애드온 사용법
│   ├── exporting.md             # PDF/PPTX/PNG 내보내기
│   ├── hosting.md               # 빌드 및 호스팅
│   ├── features.md              # 전체 기능 목록
│   ├── user_interface.md        # UI 가이드
│   ├── writing_layouts.md       # 커스텀 레이아웃 작성
│   ├── getting_started.md       # 시작하기
│   ├── assets_positioning.md    # 에셋 처리 및 위치 지정
│   └── example-slides.md        # 예시 슬라이드
│
└── .claude/skills/creating-slidev-presentations/
    ├── SKILL.md                 # 메인 스킬 (Quick Reference)
    ├── THEMES.md                # 테마 레퍼런스 (8개 테마 상세)
    ├── LAYOUTS.md               # 레이아웃 레퍼런스
    └── ANIMATIONS.md            # 애니메이션 레퍼런스
```

---

## Skill 사용법

스킬이 자동으로 활성화됩니다:
- "슬라이드 만들어줘"
- "발표 자료 작성"
- "Slidev 프레젠테이션"

---

## Quick Reference

### 기본 슬라이드 구조

```markdown
---
theme: seriph
title: Presentation Title
transition: slide-left
---

# First Slide

Content

---

# Second Slide

- Bullet 1
- Bullet 2
```

### 권장 테마

| 용도 | 테마 | 패키지 |
|------|------|--------|
| 일반/기술 | `seriph` | `@slidev/theme-seriph` |
| 비즈니스 | `apple-basic` | `@slidev/theme-apple-basic` |
| 학술 | `academic` | `slidev-theme-academic` |
| Vercel 스타일 | `geist` | `slidev-theme-geist` |

### 주요 레이아웃

| 레이아웃 | 용도 |
|----------|------|
| `cover` | 표지 |
| `default` | 기본 콘텐츠 |
| `center` | 중앙 정렬 |
| `two-cols` | 2열 (`::right::` 사용) |
| `image-right` | 이미지 오른쪽 |
| `section` | 섹션 구분 |
| `quote` | 인용문 |
| `fact` | 통계/사실 강조 |
| `statement` | 선언문 |

### 애니메이션

```html
<v-clicks>

- Item 1
- Item 2

</v-clicks>
```

### 코드 하이라이팅

````markdown
```ts {1|2-3|all}
const a = 1
const b = 2
const c = 3
```
````

### CLI

```bash
pnpm dev                 # 개발 서버 (--open)
pnpm build               # 정적 빌드
pnpm export              # PDF 내보내기
pnpm export --format png # PNG 내보내기
```

---

## 문서 참조 가이드

### 기본 사용법
| 주제 | 문서 |
|------|------|
| 시작하기 | `docs/getting_started.md` |
| 마크다운 문법 | `docs/syntax_guide.md` |
| UI/키보드 | `docs/user_interface.md` |

### 슬라이드 작성
| 주제 | 문서 |
|------|------|
| 레이아웃 | `docs/layouts.md` |
| 애니메이션 | `docs/animation.md` |
| 컴포넌트 | `docs/components.md` |
| 테마/애드온 | `docs/theme_addons.md` |

### 내보내기/배포
| 주제 | 문서 |
|------|------|
| PDF/PNG/PPTX | `docs/exporting.md` |
| 빌드/호스팅 | `docs/hosting.md` |

### 고급
| 주제 | 문서 |
|------|------|
| 에셋/위치 지정 | `docs/assets_positioning.md` |
| 커스텀 레이아웃 | `docs/writing_layouts.md` |
| 전체 기능 | `docs/features.md` |

---

## Skill 상세 문서

더 상세한 레퍼런스가 필요할 때:

| 주제 | 파일 |
|------|------|
| 테마 상세 | `.claude/skills/creating-slidev-presentations/THEMES.md` |
| 레이아웃 상세 | `.claude/skills/creating-slidev-presentations/LAYOUTS.md` |
| 애니메이션 상세 | `.claude/skills/creating-slidev-presentations/ANIMATIONS.md` |
| 종합 가이드 | `.claude/skills/creating-slidev-presentations/SKILL.md` |

---

## 한국어 슬라이드 필수 설정

`styles/index.css` 생성:

```css
/* 단어 단위 줄바꿈 (한국어 필수) */
.slidev-layout {
  word-break: keep-all;
  overflow-wrap: break-word;
}

/* 하단 패딩 확보 */
.slidev-layout {
  padding-bottom: 8% !important;
}
```

---

## 프로젝트 초기화

```bash
# 새 프로젝트
pnpm create slidev

# 또는 수동 설정
mkdir my-slides && cd my-slides
# package.json, .npmrc 생성 후
pnpm install
pnpm dev
```
