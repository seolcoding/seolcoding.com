# Mini Apps Agent - 미니 웹앱 개발

독립적인 미니 웹 애플리케이션 개발 에이전트.

---

## 현재 앱 목록

| 앱              | 경로               | 배포 URL         | 기술 스택    |
| --------------- | ------------------ | ---------------- | ------------ |
| Prompt Tutorial | `prompt-tutorial/` | `/prompt/`       | React + Vite |
| Busan Edu DB    | `busan-edu-db/`    | `/busan-edu-db/` | TBD          |

---

## 디렉토리 구조

```
agents/mini-apps/
├── CLAUDE.md              # 이 파일
├── prompt-tutorial/       # 프롬프트 엔지니어링 튜토리얼
│   ├── web/               # React 웹앱 소스
│   ├── Anthropic 1P/      # 원본 노트북/마크다운
│   ├── AmazonBedrock/     # AWS 버전
│   └── README.md
└── busan-edu-db/          # 부산 평생교육 DB (예정)
```

---

## Prompt Tutorial App

### Quick Start

```bash
cd agents/mini-apps/prompt-tutorial/web
pnpm install
pnpm dev        # 개발 서버
pnpm build      # 프로덕션 빌드
```

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS (추정)

### 빌드 출력

```bash
pnpm build
# dist/ 폴더에 정적 파일 생성
# → seolcoding.com/prompt/ 로 배포
```

---

## 새 미니 앱 추가 가이드

### 1. 폴더 생성

```bash
mkdir -p agents/mini-apps/new-app
cd agents/mini-apps/new-app
```

### 2. 프로젝트 초기화 (예: Vite + React)

```bash
pnpm create vite . --template react-ts
pnpm install
```

### 3. vite.config.ts 설정

```typescript
export default defineConfig({
  base: "/new-app/", // 배포 URL 경로
  // ...
});
```

### 4. CI 워크플로우 업데이트

`.github/workflows/deploy.yml`에 빌드 단계 추가:

```yaml
- name: Build New App
  run: |
    cd agents/mini-apps/new-app
    pnpm install
    pnpm build
    mkdir -p ../../../public/new-app
    cp -r dist/* ../../../public/new-app/
```

---

## 공통 개발 가이드

### 빌드 base 경로

각 앱은 seolcoding.com의 서브 경로로 배포되므로, 빌드 설정에서 base 경로를 지정해야 합니다:

- Vite: `base: '/app-name/'`
- Create React App: `homepage: "/app-name"`
- Next.js: `basePath: '/app-name'`

### 정적 에셋

이미지 등 에셋은 상대 경로 또는 base 경로 기준으로 참조:

```html
<!-- Good -->
<img src="./images/logo.png" />
<img src="/prompt/images/logo.png" />

<!-- Bad (루트 기준) -->
<img src="/images/logo.png" />
```

---

## 배포 URL 매핑

| 앱              | 빌드 출력 | 배포 URL                       |
| --------------- | --------- | ------------------------------ |
| prompt-tutorial | `dist/`   | `seolcoding.com/prompt/`       |
| busan-edu-db    | TBD       | `seolcoding.com/busan-edu-db/` |
