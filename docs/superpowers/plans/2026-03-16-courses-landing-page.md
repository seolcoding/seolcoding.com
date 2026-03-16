# 강의 랜딩 페이지 원페이저 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 강의 섹션을 타일/카드 목록이 아닌 차별화 중심 원페이저로 교체해 잠재 고객이 한 번 클릭으로 강의 의뢰까지 이어지도록 한다.

**Architecture:** Hugo `layouts/courses/list.html` 커스텀 오버라이드로 타일 그리드를 제거하고, `content/ko/courses/_index.md`에 A→F 6개 섹션을 전부 작성한다. 기존 개별 강의 파일(ai-education-basics.md)은 유지하되 노출하지 않는다.

**Tech Stack:** Hugo v0.152+, Tailwind CSS (via Hugo Pipes), Markdown + TOML frontmatter, GitHub Pages 자동 배포

---

## Chunk 1: 레이아웃 오버라이드

### Task 1: 강의 리스트 레이아웃 오버라이드 생성

**Files:**
- Create: `layouts/courses/list.html`

타일 그리드를 제거하고 `_index.md` 전체 내용만 렌더링하는 커스텀 레이아웃.

- [ ] **Step 1: layouts/courses/ 디렉토리 생성**

```bash
mkdir -p layouts/courses
```

- [ ] **Step 2: list.html 오버라이드 작성**

`layouts/courses/list.html` 파일 생성:

```html
{{ define "main" }}
<section class="pt-8 pb-12 bg-bg dark:bg-bg" data-animate>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="prose prose-lg markdown-content dark:prose-invert prose-gray max-w-none">
      {{ .Content }}
    </div>
  </div>
</section>
{{ end }}
```

- [ ] **Step 3: hugo server로 렌더링 확인 (localhost:1313/강의/ 접속)**

```bash
hugo server -D
```

기대: 기존 타일 그리드 없이 _index.md 마크다운 내용만 표시됨

- [ ] **Step 4: 커밋**

```bash
git add layouts/courses/list.html
git commit -m "feat: override courses list layout to single landing page"
```

---

## Chunk 2: 강의 원페이저 콘텐츠 작성

### Task 2: `_index.md` 원페이저 콘텐츠 작성

**Files:**
- Modify: `content/ko/courses/_index.md`

A→F 6개 섹션을 순서대로 작성. 소스 자료:
- 화승코퍼레이션 강의: `/Users/sdh/Vaults/Work/20_Projects/화승코퍼레이션_강의/교안/관리직군/`
- 구미대학교 교안: `/Users/sdh/Vaults/Work/40_Areas/403_teaching/구미대학교_교안/`
- jam_pan_toon: `/Users/sdh/10_Dev/102_production/jam_insta_toons/channels/jam_pan_toon/`

- [ ] **Step 1: 강의 소스 자료 읽기**

아래 파일들을 읽어 콘텐츠 작성에 활용:

```bash
# 화승코퍼레이션 5개 세션 목차 확인
head -80 "/Users/sdh/Vaults/Work/20_Projects/화승코퍼레이션_강의/교안/관리직군/강의_교안_관리직군.md"
head -50 "/Users/sdh/Vaults/Work/20_Projects/화승코퍼레이션_강의/교안/관리직군/세션1_프롬프트_핵심기법_및_데이터_구조화.md"
head -50 "/Users/sdh/Vaults/Work/20_Projects/화승코퍼레이션_강의/교안/관리직군/세션2_RAG_작동원리_및_데이터_전처리.md"

# 구미대 교안 목록
ls "/Users/sdh/Vaults/Work/40_Areas/403_teaching/구미대학교_교안/"

# jam_pan_toon 채널 정보
cat "/Users/sdh/10_Dev/102_production/jam_insta_toons/CLAUDE.md" | head -60
```

- [ ] **Step 2: `_index.md` 전체 교체**

아래 구조로 `content/ko/courses/_index.md` 전체 교체:

```toml
+++
title = "강의"
description = "AI 강의 포트폴리오 — 실제 프로덕트를 만들고 운영하는 개발자의 강의"
type = "list"
weight = 52
+++
```

이후 마크다운으로 6개 섹션 작성 (Step 3~8 참조):

**섹션 A: 핵심 차별점 히어로**
```markdown
# 말이 아닌 결과로 증명하는 AI 강의

AI로 직접 프로덕트를 만들고, 공공 부문 문제를 해결하고, 168개의 콘텐츠를 자동화한 사람이 가르칩니다.

- **과기정통부 장관상 (대상)** — AI 컴쌤, 노인 인터넷 교육 AI 어시스턴트
- **행안부 장관상 (최우수상)** — 전입직원 교육 챗봇 + 기관사 역사 서비스
- **수상 6건** — 국가 기관 및 지자체 AI 프로젝트
- **Google Certified Educator** — 공인 AI 교육 전문가
- **공공 부문 10년** — 실무에서 검증된 AI 활용 경험
```

**섹션 B: 강의 가능 주제**
```markdown
## 강의 가능 주제

| 주제 | 대상 | 수준 |
|------|------|------|
| AI 프롬프트 핵심 기법 + 데이터 구조화 | 기업 실무자 | 입문~중급 |
| RAG 작동 원리 + 데이터 전처리 | 기술직 / 개발자 | 중급 |
| RAG 기반 업무 챗봇 설계 및 구현 | 기업 / 공공기관 | 중급 |
| 바이브 코딩 — AI로 웹앱 빠르게 만들기 | 비개발자 실무자 | 입문 |
| AI 에이전트 파이프라인 구축 | 개발자 | 고급 |
| 공공기관 AI 도입 전략 | 관리직 / 기획직 | 입문 |
| 생성형 AI 기초 (Gemini / ChatGPT) | 일반 시민 / 공무원 | 입문 |
```

**섹션 C: 실제 강의안 미리보기**
```markdown
## 실제 강의안 미리보기

### 화승코퍼레이션 — AI 실무 활용 집중과정 (7시간 1일)

관리직군 30명 대상, 팀스파르타 협력 진행 (2026년 3월)

| 세션 | 주제 | 시간 |
|------|------|------|
| 1 | 프롬프트 핵심 기법 + 맞춤형 데이터 구조화 | 2시간 |
| 2 | RAG 작동 원리 + 실무 데이터 전처리 | 1시간 |
| 3 | RAG 기반 업무 챗봇 시스템 프롬프트 설계 | 2시간 |
| 4 | 페인포인트 해결형 챗봇 직접 구현 | 1시간 |
| 5 | AI Studio 캔버스로 데이터 웹앱 구축 | 1시간 |

**수강 후 가져가는 것**: 본인 업무 데이터로 만든 RAG 챗봇, 재사용 가능한 프롬프트 템플릿

---

### 구미대학교 — AI 실습 과정 (2026년 1~2월)

학생 대상 AI 도구 실습:
- 프롬프트 엔지니어링 기초
- Gemini 활용 실습
- 바이브 코딩 프로젝트 (갤러리 앱, 플래시카드 앱)
- Google AI Studio 연동
- 딥리서치 실습
```

**섹션 D: jam_pan_toon 사례**
```markdown
## 직접 만들고 운영하는 AI 콘텐츠 파이프라인

### 잼판툰 (jam_pan_toon)

법원 판결문을 읽기 쉬운 6컷 인스타그램 웹툰으로 자동 변환하는 AI 파이프라인.

"어려운 법률 지식을 20~40대가 공감하는 이야기로."

- **168개** 판결 사건 처리 완료
- Google Gemini API + LangGraph로 완전 자동화
- PDF 입력 → 6컷 웹툰 스토리 + 캡션 → Instagram 자동 게시
- 3단계 LLM 검수 (생성 → 리뷰 → 감사)

[인스타그램 팔로우하기 →](https://instagram.com/jam_pan_toon)

> **왜 이게 강의 역량의 증거인가?**
> 복잡한 개념을 쉽게 풀어내는 것 — AI 교육의 본질과 같습니다.
> 판결문을 웹툰으로 만드는 것과 RAG 챗봇을 실무자에게 가르치는 것은 같은 능력입니다.
```

**섹션 E: 강의 이력**
```markdown
## 강의 이력

| 기관 | 과정 | 대상 | 시기 |
|------|------|------|------|
| 화승코퍼레이션 (팀스파르타) | AI 실무 활용 집중과정 | 관리직군 30명 | 2026.03 |
| 구미대학교 | AI 실습 과정 | 학생 | 2026.01~02 |
| 대구 동구 디지털 역량강화센터 | AI 기초 교육 | 시민 | 진행중 |
| 대구 북구 디지털 역량강화센터 | AI 기초 교육 | 시민 | 진행중 |
| 대구 청년 센터 | AI 활용 교육 | 청년 | 진행중 |
| 양산시 | AI 교육 | 시민 / 공무원 | 2026.03 |
| 부니콘 | AI 교육 | - | 2026.02 |
```

**섹션 F: CTA**
```markdown
## 강의 문의

맞춤형 커리큘럼 제안부터 1일 집중과정까지, 조직의 상황에 맞춰 설계합니다.

**[강의 문의하기 →](/contact)**

- 기업 / 기관 대상 강의 가능
- 입문~고급 모든 수준
- 온/오프라인 모두 가능
- 1회 특강 ~ 정규 과정 모두 협의 가능
```

- [ ] **Step 3: hugo server로 전체 페이지 확인 (localhost:1313/강의/)**

기대: A→F 6개 섹션이 순서대로 표시, 타일 그리드 없음

- [ ] **Step 4: 모바일 뷰 확인 (브라우저 개발자도구 320px)**

- [ ] **Step 5: 커밋**

```bash
git add content/ko/courses/_index.md
git commit -m "feat: rewrite courses page as differentiation-focused single landing page"
```

---

## Chunk 3: 배포 및 확인

### Task 3: main 브랜치 푸시 및 배포 확인

**Files:** 없음 (git push only)

- [ ] **Step 1: 현재 브랜치 확인**

```bash
git status && git branch
```

기대: main 브랜치, clean working directory

- [ ] **Step 2: 원격 푸시**

```bash
git push origin main
```

- [ ] **Step 3: GitHub Actions 배포 확인**

```bash
gh run list --limit 5
```

Actions 탭에서 빌드 완료 확인 (보통 2~3분 소요)

- [ ] **Step 4: 실제 배포 결과 확인**

브라우저에서 `https://seolcoding.com/강의/` 접속하여 최종 확인

---

## 참고: 소스 자료 경로

| 자료 | 경로 |
|------|------|
| 화승코퍼레이션 교안 | `/Users/sdh/Vaults/Work/20_Projects/화승코퍼레이션_강의/교안/관리직군/` |
| 구미대학교 교안 | `/Users/sdh/Vaults/Work/40_Areas/403_teaching/구미대학교_교안/` |
| jam_pan_toon CLAUDE.md | `/Users/sdh/10_Dev/102_production/jam_insta_toons/CLAUDE.md` |
| 현재 강의 페이지 | `/Users/sdh/10_Dev/102_production/seolcoding.com/content/ko/courses/_index.md` |
| 테마 레이아웃 원본 | `/Users/sdh/10_Dev/102_production/seolcoding.com/themes/careercanvas/layouts/_default/list.html` |
