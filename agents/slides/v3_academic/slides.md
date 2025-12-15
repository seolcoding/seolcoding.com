---
theme: academic
title: 한국어 공공 도메인 On-premise RAG 최적화 연구
transition: fade
hideInToc: true
coverDate: ""
themeConfig:
  paginationX: r
  paginationY: b
---

# 한국어 공공 도메인을 위한 On-premise RAG 파이프라인 최적화 연구

AutoRAG 프레임워크 기반 파이프라인 탐색

**설동헌**

부경대학교 대학원 ICT교통융합전공

지도교수: 윤상석 | 2025년 12월 11일

---

# 목차

<div class="grid grid-cols-2 gap-8">
<div>

### Part 1: Introduction

1. **Motivation**
   - 문제 상황
   - 연구 공백

2. **Research Questions & Hypotheses**

3. **연구 방법**

</div>
<div>

### Part 2: Results & Conclusion

4. **연구 결과**
   - H1: 검색 성능
   - H2: 리랭커 효과
   - H3: LLM 비교
   - Ablation Study

5. **Contributions & 결론**

6. **부록**: 상세 결과, 예상 Q&A

</div>
</div>

---
layout: center
class: text-center
---

<div class="text-6xl font-bold text-blue-600 mb-4">Part 1</div>
<div class="text-3xl text-gray-600">Motivation & Research Design</div>

---

# Motivation 1

<img src="/llm_limitations.png" class="h-100 mx-auto" />

---

# LLM 한계 극복 접근법 비교 📊

<div class="grid grid-cols-3 gap-4 text-sm">
<div class="border rounded-lg p-3 bg-blue-50">

<div class="font-bold text-sm mb-2">Retrieval-Augmented Generation</div>

<v-clicks>

- ✅ 최신 정보 반영 용이
- ✅ 환각 감소, 출처 제공
- ✅ **중간 비용**
- ⚠️ 검색 품질에 의존

</v-clicks>

</div>
<div class="border rounded-lg p-3 bg-orange-50">

<div class="font-bold text-sm mb-2">Fine-tuning</div>

<v-clicks at="5">

- ✅ 특정 태스크 최고 성능
- ❌ GPU/TPU 재학습 필요
- ❌ **매우 높은 비용**
- ❌ 지식 업데이트 어려움

</v-clicks>

</div>
<div class="border rounded-lg p-3 bg-green-50">

<div class="font-bold text-sm mb-2">Prompt Engineering</div>

<v-clicks at="9">

- ✅ 즉시 적용, **최저 비용**
- ❌ 모델 지식 변경 불가
- ❌ 근본적 정보 부족 해결 한계
- ❌ 설계에 따른 성능 편차

</v-clicks>

</div>
</div>

<v-click at="13">

**공공행정 도메인에서 RAG 선택 이유**

</v-click>

<v-clicks at="14">

1. 실시간 **법령/정책 업데이트** 반영 가능
2. 답변 출처 제공으로 **신뢰성·책임성** 확보
3. 적정 비용으로 **On-premise 구축** 가능

</v-clicks>

---

# Motivation 2

<img src="/public_constraints.png" class="h-100 mx-auto" />

---

# Motivation 3

### 한국어 RAG 선행연구의 공백

<v-clicks>

| 연구 | 도메인 | 한계점 |
|------|--------|--------|
| 정상무(2024) | 행정문서 요약 | LLM 1종만 평가, 검색 비교 없음 |
| 권혁규(2025) | 대학 규정 | 리랭커 비교 없음, 2종 LLM만 |
| 이채원(2025) | 한국어 일반 | 리랭커 비교 없음, 3종 LLM만 |

</v-clicks>

<v-click>

### 본 연구의 차별점

> **한국어 공공 도메인**에서 **검색 3종 × 리랭커 6종 × LLM 6종**을
> **체계적으로 비교**한 **최초**의 연구

</v-click>

---

# Research Question: Main RQ 🎯

<div class="text-center my-8">

### Main Research Question

</div>

<v-click>

<div class="bg-blue-50 p-6 rounded-lg text-center text-xl">

> 한국어 공공 도메인에서, **파이프라인 최적화**를 통해
> **On-premise 오픈소스 LLM**이 상용 API 대비
> **통계적으로 동등한 성능**을 달성할 수 있는가?

</div>

</v-click>

<v-click>

### 세부 연구 질문 (Sub-RQs)

| RQ | 질문 | 평가 대상 |
|----|------|-----------|
| **RQ1** | BM25, VectorDB, Hybrid 검색의 성능 차이는? | 검색 방식 |
| **RQ2** | 한국어 특화 리랭커(KoReranker)가 효과적인가? | 리랭커 |
| **RQ3** | 오픈소스 LLM이 GPT-4o-mini 수준을 달성하는가? | LLM |

</v-click>

---

# Hypotheses: 연구 가설 📊

<v-clicks>

### H1: Hybrid Retrieval의 우위

> Hybrid RRF(BM25+Vector)가 단일 검색 방식 대비 높은 **Retrieval F1**을 달성한다

- **검증 지표**: Precision, Recall, F1
- **근거**: 한국어 행정문서의 고유명사(어휘매칭) + 의미적 유사성 모두 필요

### H2: 한국어 리랭커 효과

> 한국어 특화 리랭커(KoReranker)가 범용 리랭커 대비 **유의미한 성능 향상**을 제공한다

- **검증 지표**: F1, Recall
- **근거**: 한국어 어순, 조사, 형태소 특성 반영

### H3: On-premise LLM 동등성

> 최적 RAG 파이프라인이 적용된 **12B-32B급 오픈소스 LLM**이 GPT-4o-mini와 **통계적으로 동등한 성능**을 달성한다

- **검증 지표**: SemScore, BERTScore

</v-clicks>

---
layout: center
class: text-center
---

<div class="text-6xl font-bold text-green-600 mb-4">Part 2</div>
<div class="text-3xl text-gray-600">Research Method</div>

---

# RAG

<img src="/rag_pipeline.png" class="h-100 mx-auto" />

---

# 데이터셋 구축 🗂️

<div class="grid grid-cols-[1fr_220px] gap-4">
<div>

### 원천 데이터

- **출처**: AI Hub "행정 문서 대상 기계독해 데이터"
- **도메인**: 한국어 공공행정 문서

</div>
<div class="flex items-start">
<img src="/ai_hub_admin_doc_data.png" class="h-36 rounded shadow object-contain" />
</div>
</div>

<v-click>

### 구축된 Golden Dataset

| 항목 | 규모 | 설명 |
|------|------|------|
| QA 쌍 | **180개** | 7가지 질문 유형 |
| 검색 대상 코퍼스 | **50,000개** | 전체 검색 pool |
| 정답 문서 | 204개 | QA가 참조하는 문서 |
| Distractor | 49,796개 | 방해 문서 |
| **정답:Distractor 비율** | **1:244** | 현실적 검색 난이도 |

</v-click>

---

# 질문 유형 분류

### 7가지 질문 유형 (MuSiQue, MultiHop-RAG 참조)

<div class="grid grid-cols-2 gap-4">
<div>

#### 단순형 (72개, 40%)

| 유형 | 개수 | 난이도 |
|------|------|--------|
| Simple Factoid | 36개 | <span class="badge-basic">기본</span> |
| Constraint | 18개 | <span class="badge-basic">기본</span> |
| Reasoning | 18개 | <span class="badge-medium">중급</span> |

</div>
<div>

#### 다단계형 (108개, 60%)

| 유형 | 개수 | 난이도 |
|------|------|--------|
| Multi-doc 1-hop | 36개 | <span class="badge-medium">중급</span> |
| Multi-hop 2-hop | 36개 | <span class="badge-advanced">고급</span> |
| Multi-hop 3-hop | 18개 | <span class="badge-advanced">고급</span> |
| Multi-hop 5-hop | 18개 | <span class="badge-expert">최고급</span> |

</div>
</div>

<v-click>

> **6개 토픽** × 30개 질문 = 180개 (공공행정, 국토관리, 환경기상, 사회복지, 식품건강, 문화관광)

</v-click>

---

# 파이프라인 구성 ⚙️

### AutoRAG 기반 Greedy Modular Approach

| 단계 | 모듈 | 선택지 |
|------|------|--------|
| **Retrieval** | 검색 방식 | BM25, VectorDB, **Hybrid RRF** |
| **Reranking** | 리랭커 | Pass, KoReranker, BGE-v2-m3, BGE-large, ColBERT, MonoT5 |
| **Filtering** | 필터 | Pass, SimilarityThresholdCutoff |
| **Generation** | LLM | GPT-4o-mini, Gemma-3-12B, EXAONE-32B, 외 3종 |

<img src="/auto_rag.jpeg" class="absolute bottom-16 right-8 w-1/4 max-h-32 object-contain rounded" />

<v-click>

### 탐색 공간

- **전체 조합**: 3 × 6 × 2 × 2 × 6 = **432개**
- **Greedy 평가**: 3 + 6 + 2 + 2 + 6 = **19개**
- **비용 절감**: **95.6%**

</v-click>

---

# 왜 Greedy Modular인가?

### 세 가지 최적화 전략 비교

| 전략 | 설명 | Generation 호출 | 소요 시간 |
|------|------|-----------------|-----------|
| **Pure Exhaustive** | 모든 432개 조합 평가 | 432 × 180 = **77,760** | ~22시간 |
| **Greedy + Generation** | 단계마다 생성 평가 | 19 × 180 = **3,420** | ~2시간 |
| **Greedy Modular** | 검색 평가 후 생성 1회 | **180** | **~1시간** |

<v-click>

### 핵심: Generation이 병목

```text
Retrieval → Reranking → Filtering → Generation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~
   검색 지표로 평가 (F1, Recall)           LLM 호출
   빠름, 저비용                            느림, 고비용
```

</v-click>

<v-click>

<div class="grid grid-cols-2 gap-4 mt-2">
<div class="bg-blue-50 p-3 rounded text-sm">

**Greedy Modular 전략**
1. Retrieval/Reranking/Filtering → **검색 지표**로 최적 조합 선정
2. 최종 파이프라인에서만 → **Generation 평가** (1회)

</div>
<div class="bg-green-50 p-3 rounded text-sm">

**비용 절감 효과**
- Generation 호출: 77,760 → **180** (**99.8%↓**)
- 총 소요 시간: ~22시간 → **~1시간**
- AutoRAG 공식 권장 방식

</div>
</div>

</v-click>

---

# LLM 선정 근거 🎖️

<div class="grid grid-cols-[1fr_1.2fr] gap-6">
<div>

### 호랑이 리더보드 (W&B)

<img src="/korean_llm_leaderboard.png" class="h-48 rounded shadow" />

<div class="text-xs mt-2 opacity-70">

**출처**: W&B "Horangi Korean LLM Leaderboard 4"
- 한국어 LLM 종합 벤치마크
- Ko-MMLU, Ko-ARC, Ko-HellaSwag 등

</div>

</div>
<div>

### 선정 모델 및 기준

| 모델 | 파라미터 | 선정 이유 |
|------|----------|-----------|
| <img src="/gemma.png" class="h-4 inline-block" /> Gemma-3 | 12B | 리더보드 상위, 다국어 |
| <img src="/exaone.png" class="h-4 inline-block" /> EXAONE | 32B(Q4) | 한국어 특화, LG 개발 |
| <img src="/gpt.svg" class="h-4 inline-block" /> GPT-4o-mini | - | 상용 API 베이스라인 |
| <img src="/a.x.png" class="h-4 inline-block" /> A.X-4.0 | 7.8B | 한국어 특화, SK 개발 |
| <img src="/hyperclova_x_seed.jpeg" class="h-4 inline-block" /> HyperCLOVA X | 1.5B | 경량 한국어, 네이버 |
| <img src="/gptoss.jpg" class="h-4 inline-block" /> GPT-OSS | 20B | 오픈소스 대조군 |

</div>
</div>

<v-click>

> **선정 기준**: ① 24GB VRAM 적합 ② 한국어 지원 ③ 리더보드 성능 ④ 오픈소스 가용성

</v-click>

---

# 평가지표: Retriever 📏

### 검색 성능 평가 (Retrieval Metrics)

<div class="grid grid-cols-2 gap-6">
<div>

| 지표 | 수식 | 의미 |
|------|------|------|
| **Precision@k** | TP / k | 검색된 k개 중 정답 비율 |
| **Recall@k** | TP / 전체 정답 | 전체 정답 중 검색된 비율 |
| **F1@k** | 2·P·R / (P+R) | Precision과 Recall의 조화평균 |

</div>
<div>

### 본 연구 설정

- **k = 5** (top-5 검색)
- **Primary: Recall@5**
  - 정답 문서를 놓치지 않는 것이 중요
- **Secondary: F1@5**
  - 정밀도와 재현율의 균형

</div>
</div>

<v-click>

> **평가 기준**: Golden Dataset의 `retrieval_gt` (정답 문서 ID)와 검색 결과 비교

</v-click>

---

# 평가지표: Reranker 📏

### 재순위화 성능 평가

<div class="grid grid-cols-2 gap-6">
<div>

| 지표 | 의미 |
|------|------|
| **Recall@k** | 재순위 후 상위 k개 내 정답 포함 여부 |
| **F1@k** | 재순위 후 정밀도-재현율 조화평균 |
| MRR | 첫 정답 문서의 역순위 평균 |
| nDCG | 순위 가중 정답 점수 |

</div>
<div>

### 본 연구 설정

- **Primary: Recall@3, F1@3**
  - top-5 → top-3 재순위
- MRR, nDCG는 **보조 지표**로 활용

### 리랭커의 역할

- 검색된 문서의 **순위 재조정**
- 정답 문서를 **상위로 끌어올림**

</div>
</div>

<v-click>

> **주의**: 초기 Recall이 높으면(85%) 리랭커 효과가 제한적 → 본 연구 H2 결과

</v-click>

---

# 평가지표: Generator 📏

<div class="grid grid-cols-2 gap-6">
<div>

### 생성 품질 평가

| 지표 | 유형 | 본 연구 |
|------|------|---------|
| **SemScore** | 의미 유사도 | ⭐ **Primary** |
| BERTScore | 의미 유사도 | Secondary |
| ROUGE-L | n-gram | Secondary |
| METEOR | n-gram | Secondary |

<v-click>

### 왜 SemScore가 Primary인가?

1. **한국어 특성**: 어순 자유, 조사 변화
2. **의미 보존**: 다른 표현도 높은 점수
3. **RAG 목적**: 정보 전달이 핵심

</v-click>

</div>
<div>

<v-click>

### G-EVAL (LLM-as-Judge)

- GPT 기반 품질 평가
- **일부 모델에만 적용**
  - Gemma, EXAONE, GPT-4o-mini
- 제약: API 비용, 시간 소요

</v-click>

<v-click>

> SemScore를 Primary로 사용하여 **전 모델 일관된 비교** 수행

</v-click>

</div>
</div>

---

# 실험 환경 🖥️

<div class="grid grid-cols-2 gap-8">
<div>

### 하드웨어

| 항목 | 사양 |
|------|------|
| GPU | **NVIDIA RTX 3090 Ti (24GB)** |
| CPU | Intel Core i5-11400 |
| RAM | 32GB DDR4 |
| OS | Ubuntu 24.04 LTS |

</div>
<div>

### 통계 검정

- **Paired t-test**: 쌍체 비교
- **Wilcoxon signed-rank**: 비모수 검정
- **Cohen's d**: 효과 크기
- **Bonferroni 보정**: 다중 비교 보정

</div>
</div>

---
layout: center
class: text-center
---

<div class="text-6xl font-bold text-orange-600 mb-4">Part 3</div>
<div class="text-3xl text-gray-600">Results & Hypothesis Verification</div>

---
layout: figure
figureUrl: /fig4_4_retrieval_comparison_kure.png
figureCaption: "그림 1. KURE 임베딩 기반 검색 성능 비교"
backgroundSize: contain
---

# 결과: 검색 성능 (H1)

---

# H1 검증: KURE 임베딩 검색 성능 🔎

### 검색 방식별 성능 (KURE 임베딩)

| 검색 방식 | Precision | Recall | F1 |
|-----------|-----------|--------|-----|
| **KURE Naive** (Semantic) | 0.239 | **85.6%** | 0.363 |
| **KURE Optim** (Hybrid+Reranker) | 0.113 | **92.8%** | 0.196 |

<v-click>

### KURE 임베딩의 특징

- **한국어 특화**: nlpai-lab/KURE-v1 (한국어 전용 임베딩)
- **완전 로컬**: API 비용 $0
- **높은 초기 Recall**: Naive에서 85.6% 달성

</v-click>

<v-click>

> **H1 검증**: KURE 임베딩이 한국어 공공 도메인에서 **우수한 검색 성능** 달성

</v-click>

---

# H1 해석: KURE 임베딩의 강점

### 한국어 특화 임베딩의 효과

<v-clicks>

1. **높은 초기 Recall**
   - KURE Naive: **85.6%** (OpenAI 63.3% 대비 +22.3%p)
   - 한국어 의미 이해에 최적화

2. **비용 효율성**
   - 완전 로컬 실행 (API 비용 $0)
   - On-premise 환경에 적합

3. **Optim 파이프라인 효과**
   - Recall: 85.6% → **92.8%** (+7.2%p)
   - Hybrid RRF + BGE-v2-m3 Reranker 조합

</v-clicks>

<v-click>

> **실무적 시사점**: 한국어 특화 임베딩으로 **API 비용 없이** 높은 검색 성능 달성 가능

</v-click>

---
layout: figure
figureUrl: /fig4_5_reranker_comparison_kure.png
figureCaption: "그림 2. 리랭커별 성능 비교 (KURE Optim)"
backgroundSize: contain
---

# 결과: 리랭커 효과 (H2)

---

# H2 검증: 리랭커 효과 ↕️

### 5개 리랭커 성능 비교 (KURE)

| 리랭커 | Recall | F1 |
|--------|--------|-----|
| **PassReranker** | **89.4%** | **0.422** |
| KoReranker | 90.6% | 0.411 |
| FlagEmbeddingReranker | 90.0% | 0.415 |
| ColBERT | 42.8% | 0.179 |
| MonoT5 | 65.0% | 0.266 |

<v-click>

### 결론

> **H2 부분 기각**: 상위 3개 리랭커 **유사 성능**, ColBERT/MonoT5는 **부적합**

</v-click>

---

# H2 해석: 리랭커 선택 가이드

### KURE 환경에서의 리랭커 효과

<v-clicks>

1. **PassReranker 최적 선택**
   - F1: 0.422 (최고), Recall: 89.4%
   - 추가 연산 비용 없음 (비용 효율적)

2. **한국어 리랭커 (KoReranker)**
   - 예상보다 낮은 효과 (F1: 0.411)
   - KURE의 높은 초기 Recall로 인해 추가 이득 제한

3. **ColBERT/MonoT5 부적합**
   - Recall 급락 (42.8%, 65.0%)
   - 한국어 도메인에서 성능 저하

</v-clicks>

<v-click>

> **실무적 시사점**: 높은 초기 Recall 환경에서는 **PassReranker (리랭킹 생략)**이 최적

</v-click>

---
layout: figure
figureUrl: /fig4_2_h3_key_comparison.png
figureCaption: "그림 3. H3 검증: Open Source Optim vs GPT-4o-mini Naive"
backgroundSize: contain
---

# 결과: LLM 비교 (H3)

---

# H3 검증: GPT-4o-mini Naive vs Open Source Optim 🤖

### 핵심 비교: GPT Naive 기준선 초과 여부

| LLM (Optim) | SemScore | vs GPT Naive (0.495) |
|-----|----------|----------------|
| <img src="/gemma.png" class="h-5 inline-block mr-1" />**Gemma-3-12B** | **0.535** | <span class="badge-success">+8.3% ✓</span> |
| <img src="/gpt.svg" class="h-5 inline-block mr-1" />GPT-4o-mini | 0.499 | <span class="badge-info">+0.8%</span> |
| <img src="/exaone.png" class="h-5 inline-block mr-1" />EXAONE-32B (Q4) | 0.498 | +0.6% |
| <img src="/a.x.png" class="h-5 inline-block mr-1" />A.X-4.0-Light-7B | 0.487 | -1.7% |
| <img src="/hyperclova_x_seed.jpeg" class="h-5 inline-block mr-1" />HyperCLOVAX-1.5B | 0.455 | -8.1% |
| <img src="/gptoss.jpg" class="h-5 inline-block mr-1" />GPT-OSS-20B | 0.383 | <span class="badge-fail">-22.6%</span> |

<v-click>

### 통계 검정 결과: Gemma Optim vs GPT Naive

| 지표 | 차이 | p-value | Cohen's d | 판정 |
|------|------|---------|-----------|------|
| **SemScore** | **+8.3%** | **0.0007** | 0.188 | <span class="badge-success">Gemma 우위</span> |
| **BERTScore** | +3.8% | 0.0007 | 0.248 | <span class="badge-success">Gemma 우위</span> |
| METEOR | +19.6% | 0.042 | 0.158 | <span class="badge-success">Gemma 우위</span> |

</v-click>

---

# H3 결론 🏆

<div class="text-center my-8">

> **H3 부분 채택**: Gemma-3-12B만 GPT Naive 기준선 초과

</div>

<v-clicks>

### 핵심 발견

1. **Gemma-3-12B Optim**: GPT-4o-mini **Naive**보다 **통계적으로 유의하게 우수**
   - SemScore +8.3%, p=0.0007, 4개 메트릭 중 **3개에서 우위**

2. **EXAONE-32B, A.X-4.0-Light**: GPT Naive와 **동등 수준**
   - 기준선 초과하지 못함

3. **GPT-OSS-20B**: 과도한 토큰 생성(평균 5,500개)으로 **최하위**

</v-clicks>

<v-click>

> **12B급 오픈소스 LLM + Optim 파이프라인**이 **상용 API Naive를 능가**할 수 있음을 실증

</v-click>

---
layout: figure
figureUrl: /fig4_7_gpt_vs_gemma_detail.png
figureCaption: "그림 4. GPT-4o-mini vs Gemma-3-12B 상세 비교"
backgroundSize: contain
---

# 핵심 모델 심층 비교

---
layout: figure
figureUrl: /fig4_1_llm_vs_gpt_baselines.png
figureCaption: "그림 5. 모든 LLM vs GPT-4o-mini 3개 기준선"
backgroundSize: contain
---

# Ablation Study: GPT 기준선 비교

---

# Ablation Study 결과 📈

### GPT-4o-mini 3개 기준선 vs Open Source Optim

| Model | No-RAG | Naive | Optimized | 총 향상 |
|-------|--------|-------|-----------|---------|
| <img src="/gemma.png" class="h-4 inline-block mr-1" />**Gemma-3-12B** | 0.370 | 0.526 | **0.535** | **+44.6%** |
| <img src="/exaone.png" class="h-4 inline-block mr-1" />EXAONE-32B | - | 0.499 | 0.498 | - |
| <img src="/gpt.svg" class="h-4 inline-block mr-1" />GPT-4o-mini | 0.394 | 0.495 | 0.499 | +26.6% |

<v-click>

### 핵심 발견: 역전 현상

```
No-RAG:    GPT-4o (0.394) > Gemma (0.370)
             ↓ RAG 적용 후 ↓
Optimized: Gemma (0.535) > GPT-4o (0.499)
```

</v-click>

<v-click>

> **Gemma-3-12B**가 RAG로부터 **가장 큰 이득**을 얻음 → 컨텍스트 활용 능력 우수

</v-click>

---
layout: center
class: text-center
---

<div class="text-6xl font-bold text-purple-600 mb-4">Part 4</div>
<div class="text-3xl text-gray-600">Conclusion & Contributions</div>

---

# 가설 검증 요약 ✅

| 가설 | 결과 | 근거 |
|------|------|------|
| **H1** | <span class="badge-success">✅ 채택</span> | KURE Recall 85.6% → 92.8% (Optim) |
| **H2** | <span class="badge-fail">❌ 부분 기각</span> | 상위 리랭커 유사, ColBERT/MonoT5 부적합 |
| **H3** | <span class="badge-success">✅ 부분 채택</span> | Gemma Optim > GPT Naive (+8.3%, p=0.0007) |

<v-click>

### Main RQ 답변

> **예, KURE 임베딩 + Optim 파이프라인으로 On-premise LLM이 상용 API Naive를 능가할 수 있다**

</v-click>

---

# 최적 파이프라인 도출 🎯

### 도출된 최적 구성 (KURE 기반)

| 모듈 | 선택 | 성능/근거 |
|------|------|-----------|
| **Embedding** | **KURE** (nlpai-lab/KURE-v1) | 한국어 특화, 완전 로컬 |
| Retrieval | **Hybrid RRF** | Recall 92.8% |
| Reranker | **PassReranker** | F1 0.422 (비용 효율) |
| Generator | <img src="/gemma.png" class="h-4 inline-block mr-1" />**Gemma-3-12B** | SemScore 0.535 |

<v-click>

### GPT-4o-mini Naive 대비 향상

| 지표 | GPT Naive | Gemma Optim | 향상 |
|------|-----------|-------------|------|
| SemScore | 0.495 | **0.535** | **+8.3%** |
| BERTScore | 0.697 | **0.723** | **+3.8%** |
| API 비용 | ₩₩₩ | **0원** | **100% 절감** |

</v-click>

---

# Contributions: 연구 기여 💡

<v-clicks>

### C1. 한국어 공공도메인 RAG 벤치마크 구축
- 180 QA × 50,000 corpus (정답:Distractor = 1:245)
- 7가지 질문 유형, 6개 토픽

### C2. KURE 임베딩 효과 실증
- **OpenAI 대비 +22.3%p Recall 향상** (63.3% → 85.6%)
- 완전 로컬, API 비용 $0

### C3. 오픈소스 LLM 경쟁력 정량적 실증
- **Gemma-3-12B Optim > GPT-4o-mini Naive** (+8.3%, p=0.0007)
- 4개 메트릭 중 3개에서 통계적으로 유의한 우위

### C4. 완전 로컬 RAG 청사진 제공
- RTX 3090Ti 24GB 환경에서 구현 가능
- 데이터 주권 유지 + 상용 API **Naive 수준 능가**

</v-clicks>

---

# 한계 및 향후 연구 🔮

### 연구의 한계

<v-clicks>

1. **데이터 규모**: 180개 QA → 토픽별 세부 분석에서 검정력 부족
2. **리랭커 효과**: 높은 초기 Recall 환경에서만 검증
3. **평가 방법**: 자동화 지표만 사용 (인간 평가 없음)
4. **Greedy 탐색**: 전역 최적해 보장 못함

</v-clicks>

<v-click>

### 향후 연구 방향

1. **대규모 확장**: 500+ QA, 100K+ 코퍼스
2. **리랭커 재검증**: 낮은 초기 Recall 환경에서
3. **GraphRAG 비교**: Multi-hop 질문 성능 개선
4. **실제 적용**: 공공기관 파일럿 프로젝트

</v-click>

---
layout: center
---

# 감사합니다 🙏

<div class="text-center mt-8">

**설동헌**

부경대학교 대학원 ICT교통융합전공

</div>

---

# 참고문헌

<div class="text-sm">

1. Lewis, P., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *NeurIPS*.
2. Fan, W., et al. (2024). A Survey on RAG Meeting LLMs. *KDD 2024*.
3. Sharma, C. (2025). Retrieval-Augmented Generation: A Comprehensive Survey. *arXiv*.
4. Kim, B., et al. (2024). AutoRAG: Automated Framework for Optimization of RAG Pipeline. *arXiv*.
5. Liu, Y., et al. (2023). G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment. *EMNLP*.
6. 정상무 (2024). sLLM기반 행정 전자문서 요약 생성 RAG 시스템 설계에 관한 연구.
7. 권혁규 (2025). 검색 증강 생성(RAG) 기반 대학 규정집 질의응답 챗봇 시스템 구축.
8. 이채원 (2025). 한국어 Hybrid RAG 기반 질의응답 시스템 구축에 관한 연구.

</div>

---
layout: center
class: text-center
---

<div class="text-6xl font-bold text-gray-500 mb-4">Appendix</div>
<div class="text-3xl text-gray-600">부록: 상세 결과 및 Q&A</div>

---

# 부록 A: 상세 실험 결과 📋

### A-1. LLM별 전체 지표 (KURE Optim Pipeline)

| LLM | SemScore | BERTScore | ROUGE-L | METEOR |
|-----|----------|-----------|---------|--------|
| <img src="/gemma.png" class="h-4 inline-block mr-1" />**Gemma-3-12B** | **0.535** | **0.723** | 0.346 | **0.241** |
| <img src="/gpt.svg" class="h-4 inline-block mr-1" />GPT-4o-mini | 0.499 | 0.701 | **0.380** | 0.208 |
| <img src="/exaone.png" class="h-4 inline-block mr-1" />EXAONE-32B (Q4) | 0.498 | 0.693 | 0.296 | 0.183 |
| <img src="/a.x.png" class="h-4 inline-block mr-1" />A.X-4.0-Light-7B | 0.487 | 0.653 | 0.282 | 0.163 |
| <img src="/hyperclova_x_seed.jpeg" class="h-4 inline-block mr-1" />HyperCLOVAX-1.5B | 0.455 | 0.670 | 0.285 | 0.132 |
| <img src="/gptoss.jpg" class="h-4 inline-block mr-1" />GPT-OSS-20B | 0.383 | 0.571 | 0.067 | 0.071 |

> **Primary Metric: SemScore** (의미 기반 유사도)

---

# 부록 A-2: 질문 유형별 성능

| 질문 유형 | Recall | SemScore | 난이도 |
|-----------|--------|----------|------|
| Simple Factoid | 94.4% | 0.547 | <span class="badge-basic">기본</span> |
| Constraint | 91.7% | 0.539 | <span class="badge-basic">기본</span> |
| Reasoning | 88.9% | 0.521 | <span class="badge-medium">중급</span> |
| Multi-doc 1-hop | 83.3% | 0.512 | <span class="badge-medium">중급</span> |
| Multi-hop 2-hop | 80.6% | 0.498 | <span class="badge-advanced">고급</span> |
| Multi-hop 3-hop | 72.2% | 0.473 | <span class="badge-advanced">고급</span> |
| **Multi-hop 5-hop** | **55.6%** | **0.421** | <span class="badge-expert">최고급</span> |

<v-click>

> **Multi-hop 5-hop**에서 급격한 성능 하락 → 벡터 RAG의 한계, GraphRAG 필요성 시사

</v-click>

---

# 부록 B: 통계 검정 상세 📊

### B-1. H1 검증 (검색)

| 비교 | t-statistic | p-value | Cohen's d | 95% CI |
|------|-------------|---------|-----------|--------|
| Hybrid vs VectorDB | 8.57 | <0.0001 | 0.639 | [0.098, 0.167] |
| Hybrid vs BM25 | 1.68 | 0.095 | 0.072 | [-0.003, 0.035] |

### B-2. H3 검증 (LLM) - Bonferroni 보정 α'=0.01

| 비교 (vs GPT-4o-mini) | p-value | Cohen's d | 판정 |
|----------------------|---------|-----------|------|
| <img src="/gemma.png" class="h-4 inline-block mr-1" />Gemma-3-12B | **0.0007** | 0.169 | <span class="badge-success">✅ 유의하게 우수</span> |
| <img src="/exaone.png" class="h-4 inline-block mr-1" />EXAONE-32B | 0.344 | 0.045 | <span class="badge-info">동등</span> |
| <img src="/a.x.png" class="h-4 inline-block mr-1" />A.X-4.0-Light | 0.189 | 0.063 | <span class="badge-info">동등</span> |
| <img src="/gptoss.jpg" class="h-4 inline-block mr-1" />GPT-OSS-20B | <0.0001 | -0.582 | <span class="badge-fail">✅ 유의하게 열등</span> |

---

# 부록 C: 예상 Q&A (1/3) ❓

### Q1: 180개 QA가 너무 적지 않은가?

**A**: 본 연구는 **탐색적 연구(Pilot Study)**로서 방법론적 타당성 검증이 목표입니다.
- 비교 대상 연구: KBL benchmark 1,000 QA, SDS VDR 600 QA
- 주요 결론(H1, H3)에서 **통계적으로 유의미한 결과** 도출
- 향후 500-1,000개로 확장 예정

### Q2: Greedy 방식의 한계는?

**A**:
- 전역 최적해 보장 못함 (지역 최적해 가능성)
- 구성요소 간 상호작용 효과 미포착

**완화 방안**:
1. Ablation Study로 각 구성요소 기여도 검증
2. 결론에서 한계 명시

---

# 부록 C: 예상 Q&A (2/3) ❓

### Q3: 리랭커가 효과 없다는 것이 일반화 가능한가?

**A**: **아닙니다.** 본 연구 결과는 특정 조건에서의 결과입니다.
- 50,000개 코퍼스, Hybrid RRF, 초기 Recall 85%

**대규모 환경에서는**:
- 코퍼스 수십만~수백만 개 → 초기 Recall 저하
- 리랭커 효과가 유의미하게 나타날 가능성

### Q4: Gemma가 GPT-4o-mini보다 우수한 이유는?

**A**: 명확한 인과관계 규명은 어렵지만, 두 가지 가능성:
1. **컨텍스트 활용 능력**: No-RAG에서 GPT가 우수 → RAG 후 Gemma 역전
2. **한국어 처리 능력**: Gemma-3의 다국어 학습에서 한국어 비중 높을 가능성

---

# 부록 C: 예상 Q&A (3/3) ❓

### Q5: EXAONE-32B 양자화(Q4)로 성능 저하?

**A**: 가능성 있습니다. 24GB VRAM 제약으로 4비트 양자화 적용.
- 그럼에도 GPT-4o-mini와 **통계적으로 동등한 성능** 달성
- 실제 공공기관도 VRAM 제약 존재 → 현실적 조건에서의 평가로 의의

### Q6: GraphRAG와의 비교는?

**A**: 본 연구는 **벡터 기반 RAG**에 초점.
- Multi-hop 5-hop에서 성능 급락(Recall 55.6%) → 벡터 RAG 한계
- GraphRAG는 문서 간 관계 명시적 모델링 → 다단계 추론에 효과적 기대
- **향후 연구 과제**: 한국어 공공 도메인 GraphRAG vs VectorRAG 비교

---

# 부록 D: 핵심 숫자 정리 🔢

| 항목 | 숫자 | 의미 |
|------|------|------|
| **+22.3%p** | KURE vs OpenAI Naive Recall | 한국어 임베딩의 효과 |
| **+8.3%** | Gemma Optim vs GPT Naive SemScore | 오픈소스 LLM의 경쟁력 |
| **+44.6%** | Gemma No-RAG → Optimized 향상 | RAG의 효과 |
| **85.6%** | KURE Naive Recall | 높은 초기 검색 품질 |
| **92.8%** | KURE Optim Recall | Hybrid+Reranker 효과 |
| **1:23.5** | 정답:Distractor 비율 | 현실적 검색 난이도 |
| **0원** | 완전 로컬 RAG 비용 | 경제적 이점 |

