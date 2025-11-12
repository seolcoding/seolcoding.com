---
title: 최종 파이프라인 테스트
date: 2025-09-17
tags: [파이프라인, 테스트, 최종검증]
categories: [Testing, Final]
---

# 🚀 최종 파이프라인 테스트

이 포스트는 **중앙화된 Obsidian-Hexo 자동화 시스템**의 최종 테스트를 위한 글입니다.

## 테스트 시나리오

### 1. Cross-Repository 동기화
- MainVault에서 작성 ✍️
- GitHub Actions가 자동 감지 🔍
- seolcoding.com으로 동기화 🔄

### 2. 중앙화된 변환 시스템
모든 변환 로직이 seolcoding.com에서 처리됩니다:

```javascript
// scripts/convert-obsidian-to-hexo.js에서 실행됨
node scripts/convert-obsidian-to-hexo.js --input temp-posts --output source/_posts
```

### 3. WikiLinks 변환 테스트
- [[GitHub Actions]] 워크플로우
- [[Obsidian|옵시디언]] 마크다운
- [[Hexo]] 정적 사이트 생성기

### 4. 해시태그 자동 변환
#automation #pipeline #hexo #obsidian #github-actions

### 5. 이미지 처리 테스트
![[architecture-diagram.png]]

## 예상 결과

✅ MainVault push → seolcoding.com sync
✅ Obsidian 문법 → Hexo 문법 변환
✅ GitHub Pages 자동 배포
✅ https://seolcoding.com에서 확인 가능

---

**타임스탬프**: {{ date | date('YYYY-MM-DD HH:mm:ss') }}
**테스트 상태**: 🔄 진행중...

이 포스트가 성공적으로 배포되면 전체 자동화 시스템이 완성된 것입니다! 🎉