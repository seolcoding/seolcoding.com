---
theme: seriph
title: 한국어 공공 도메인 On-premise RAG 최적화 연구
background: https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072&q=80
class: text-center
transition: slide-left
mdc: true
themeConfig:
  primary: '#2563eb'
---

# 한국어 공공 도메인을 위한
# On-premise RAG 파이프라인 최적화 연구

<div class="pt-12">
  <span class="px-2 py-1 rounded">
    설동헌 · 부경대학교 대학원 ICT교통융합전공
  </span>
</div>

<div class="abs-br m-6 flex gap-2 text-sm opacity-50">
  <span>지도교수: 윤상석</span>
  <span>·</span>
  <span>2025.12.11</span>
</div>

<!--
안녕하십니까. 한국어 공공 도메인을 위한 On-premise RAG 파이프라인 최적화 연구로
석사학위 논문 심사를 받게 된 설동헌입니다.
-->

---

# 발표 순서

<div class="grid grid-cols-2 gap-8 mt-12">

<div>

<v-clicks>

### 1. 서론
연구 배경, 목적, 연구 질문 및 가설

### 2. 이론적 배경
LLM과 임베딩, RAG 파이프라인

### 3. 연구 방법
데이터셋 구축, 실험 설계

</v-clicks>

</div>

<div>

<v-clicks>

### 4. 연구 결과
가설 검증 결과, 통계 분석

### 5. 결론
기여, 한계점, 향후 연구

</v-clicks>

</div>

</div>

<!--
발표 순서입니다.
서론에서 연구 배경과 목적, 연구 질문 및 가설을 말씀드리고,
이론적 배경으로 LLM과 임베딩, RAG 파이프라인을 설명드리겠습니다.
연구 방법에서 데이터셋 구축과 실험 설계를 소개하고,
연구 결과로 가설 검증 결과를 제시한 뒤,
결론에서 기여와 한계점, 향후 연구 방향을 말씀드리겠습니다.
-->

---
layout: section
---

# 1. 서론

연구 배경 및 목적

<!--
먼저 서론입니다.
-->

---

# 연구 배경: 공공기관 LLM 도입의 장벽

<div class="grid grid-cols-3 gap-8 mt-12">

<div v-click class="text-center p-6 bg-red-50 rounded-lg">

### 데이터 보안
민감한 행정 데이터를<br>**외부 서버로 전송 불가**

</div>

<div v-click class="text-center p-6 bg-orange-50 rounded-lg">

### 비용 제약
상용 API 사용 시<br>**지속적인 비용 발생**

</div>

<div v-click class="text-center p-6 bg-yellow-50 rounded-lg">

### 환각 문제
LLM이 **틀린 정보** 생성<br>법률/행정 도메인에서 심각

</div>

</div>

<div v-click class="mt-12 text-center text-xl p-4 bg-blue-50 rounded-lg">

**On-premise RAG**: 외부 전송 없이 로컬에서 문서 검색 후 답변 생성

</div>

<!--
공공기관에서 LLM을 도입하려면 세 가지 장벽이 있습니다.

첫째, 데이터 보안입니다. 민감한 행정 데이터를 외부 서버로 전송할 수 없습니다.

둘째, 비용 제약입니다. 상용 API를 사용하면 지속적인 비용이 발생합니다.

셋째, 환각 문제입니다. LLM이 틀린 정보를 생성하는데, 법률/행정 도메인에서는 이것이 매우 심각합니다.

이러한 문제를 해결하기 위해 On-premise RAG가 필요합니다.
외부 전송 없이 로컬에서 문서를 검색한 후 답변을 생성하는 방식입니다.
-->

---

# 선행연구 및 연구 공백

<div class="mt-2">

| 한국어 RAG 연구 | 도메인 | 평가 범위 | 주요 결과 |
|------|--------|----------|----------|
| KBLbenchmark (Kim et al., 2024) | 법률 | 검색+생성 | EM +15%, F1 +12% |
| LRAGE (Park et al., 2024) | 법률 | 검색+생성+정확성 | 다차원 평가 프레임워크 |
| LegalSearchLM (Choi et al., 2024) | 법률 | 검색 | BM25, DPR, ColBERT 비교 |
| SDS KoPub VDR (Samsung, 2024) | 공문서 | 검색 | MRR, NDCG 기반 평가 |
| AdmPModeler (Kim et al., 2024) | 공행정 | 생성 | 업무처리 시간 30% 단축 |

</div>

<div v-click class="mt-4 p-4 bg-gray-100 rounded-lg">

### 연구 공백 (Research Gap)

선행연구들은 **법률 도메인**에 집중되어 있거나, **상용 API**(GPT-3.5/4)에 의존 또는 , RAG의 **개별 모듈**만 평가함

<div class="grid grid-cols-3 gap-4 mt-4">

<div class="p-3 bg-red-100 rounded text-center">

**① 공공행정 벤치마크 부재**<br>
<span class="text-sm">→ 본 연구: 180 QA × 50K corpus 구축</span>

</div>

<div class="p-3 bg-orange-100 rounded text-center">

**② On-premise 검증 부족**<br>
<span class="text-sm">→ 본 연구: 오픈소스 LLM 6종 비교</span>

</div>

<div class="p-3 bg-yellow-100 rounded text-center">

**③ 파이프라인 최적화 부재**<br>
<span class="text-sm">→ 본 연구: 전체 조합 탐색</span>

</div>

</div>

</div>

<!--
선행연구를 보면, 한국어 RAG 연구는 주로 법률 도메인에 집중되어 있습니다.
KBLbenchmark, LRAGE, LegalSearchLM 모두 법률 도메인입니다.
삼성SDS의 KoPub VDR은 공문서 검색을, AdmPModeler는 공행정 업무에 적용했지만,
이들은 상용 API에 의존하거나 개별 모듈만 평가했습니다.

따라서 세 가지 연구 공백이 존재합니다.

첫째, 공공행정 도메인의 RAG 벤치마크가 부재합니다.
본 연구에서는 180개 QA와 5만 개 코퍼스로 평가 데이터셋을 구축했습니다.

둘째, On-premise 환경에서 오픈소스 LLM을 검증한 연구가 부족합니다.
본 연구에서는 6개 오픈소스 LLM을 비교합니다.

셋째, 전체 파이프라인 최적화 연구가 없습니다.
본 연구에서는 검색-리랭킹-생성 전체 조합을 탐색합니다.

본 연구는 이러한 세 가지 공백을 메우고자 합니다.
-->

---

# 연구 목적 및 연구 질문

<div class="mt-4 p-4 bg-blue-100 rounded-lg text-center">

### Main RQ: 한국어 공공 도메인에서 최적의 On-premise RAG 파이프라인 조합은 무엇인가?

</div>

<div class="grid grid-cols-3 gap-6 mt-8">

<div v-click class="p-4 border-2 border-blue-300 rounded-lg">

### RQ1. 검색 전략
BM25, Vector, Hybrid 중<br>**최적 검색 방식**은?

<div class="text-sm text-gray-500 mt-2">Retrieval 단계</div>

</div>

<div v-click class="p-4 border-2 border-green-300 rounded-lg">

### RQ2. 리랭커 효과
한국어 특화 리랭커가<br>**유의미한 향상** 제공하는가?

<div class="text-sm text-gray-500 mt-2">Post-Retrieval 단계</div>

</div>

<div v-click class="p-4 border-2 border-purple-300 rounded-lg">

### RQ3. LLM 비교
오픈소스 LLM이<br>**상용 API 수준** 도달 가능한가?

<div class="text-sm text-gray-500 mt-2">Generation 단계</div>

</div>

</div>

<div v-click class="mt-6 text-center text-lg">

**RAG 파이프라인**: 검색(Retrieval) → 후처리(Post-Retrieval) → 생성(Generation)

</div>

<!--
본 연구의 메인 연구 질문은 "한국어 공공 도메인에서 최적의 On-premise RAG 파이프라인 조합은 무엇인가?"입니다.

이를 RAG 파이프라인의 세 단계에 맞춰 세분화했습니다.

RQ1은 Retrieval 단계입니다. BM25, Vector, Hybrid 중 최적의 검색 방식이 무엇인지 알아봅니다.

RQ2는 Post-Retrieval 단계입니다. 한국어 특화 리랭커가 유의미한 성능 향상을 제공하는지 검증합니다.

RQ3는 Generation 단계입니다. 오픈소스 LLM이 상용 API인 GPT-4o-mini 수준에 도달할 수 있는지 확인합니다.

이 세 가지 질문에 대한 답을 종합하여 최적의 파이프라인 조합을 도출합니다.
-->

---

# 연구 가설

<div class="grid grid-cols-3 gap-6 mt-12">

<div v-click class="p-6 bg-blue-50 rounded-lg">

### H1
Hybrid Retrieval이<br>단일 검색 방식보다<br>**높은 F1**을 보인다

</div>

<div v-click class="p-6 bg-green-50 rounded-lg">

### H2
한국어 특화 리랭커가<br>범용 리랭커 대비<br>**유의미한 향상** 제공

</div>

<div v-click class="p-6 bg-purple-50 rounded-lg">

### H3
최적화된 오픈소스 LLM이<br>상용 API와<br>**동등 이상 성능** 달성

</div>

</div>

<!--
연구 질문에 대응하는 가설을 설정했습니다.

H1: Hybrid Retrieval이 단일 검색 방식보다 높은 F1을 보인다.

H2: 한국어 특화 리랭커인 KoReranker가 범용 리랭커 대비 유의미한 성능 향상을 제공한다.

H3: 최적화된 오픈소스 LLM이 상용 API인 GPT-4o-mini와 통계적으로 동등 이상의 성능을 달성한다.
-->

---
layout: section
---

# 2. 이론적 배경

LLM, 임베딩, RAG

<!--
다음은 이론적 배경입니다.
LLM, 임베딩, RAG의 핵심 개념을 설명드리겠습니다.
-->

---

# LLM(Large Language Model)

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

### 대규모 언어 모델

- 수십억~수천억 개의 **파라미터**를 가진 신경망
- 대량의 텍스트 데이터로 **사전학습**
- 문맥을 이해하고 **자연어 생성**

### 주요 LLM

| 모델 | 개발사 | 특징 |
|------|--------|------|
| GPT-4o | OpenAI | 상용 API |
| Gemma-3 | Google | 오픈소스 |
| EXAONE | LG AI | 한국어 특화 |

</div>

<div v-click>

### LLM의 한계: 환각(Hallucination)

<div class="p-4 bg-red-50 rounded-lg mt-4">

**환각**: LLM이 그럴듯하지만 **사실이 아닌** 정보를 생성하는 현상

</div>
<br>

| 유형 | 설명 | 예시 |
|------|------|------|
| Factual | 사실과 다른 정보  | 존재하지 않는 내용 인용 |
| Faithfulness | 컨텍스트와 모순 | 문서와 다른 답변 생성 |
| Instruction | 지시를 잘못 해석 | 의도와 다른 답변 생성 |

<div class="mt-4 text-sm">

→ 공공 도메인에서 **치명적** 문제

</div>

</div>

</div>

<!--
먼저 LLM, 대규모 언어 모델에 대해 설명드리겠습니다.

LLM은 수십억에서 수천억 개의 파라미터를 가진 신경망 모델입니다.
대량의 텍스트 데이터로 사전학습되어 문맥을 이해하고 자연어를 생성합니다.

대표적으로 GPT-4o, Google의 Gemma, LG의 EXAONE 등이 있습니다.

하지만 LLM은 환각이라는 심각한 한계가 있습니다.
환각이란 그럴듯하지만 사실이 아닌 정보를 생성하는 현상입니다.
존재하지 않는 법률을 인용하거나, 제공된 문서와 다른 답변을 하기도 합니다.
공공/법률 도메인에서는 이것이 치명적인 문제가 됩니다.
-->

---

# 임베딩(Embedding)

<div class="grid grid-cols-2 gap-8 mt-6">

<div>

### 텍스트를 숫자 벡터로 변환

<div class="p-4 bg-gray-100 rounded-lg mt-4 font-mono text-sm">

"부산시 도시철도"<br>
↓ 임베딩 모델<br>
[0.23, -0.15, 0.87, ..., 0.41]<br>
(768~1024차원 벡터)

</div>

### 의미적 유사도 계산 가능

| 문장 A | 문장 B | 유사도 |
|--------|--------|--------|
| "지하철 요금" | "도시철도 운임" | **0.92** |
| "지하철 요금" | "항공권 가격" | 0.45 |

<div class="text-sm mt-2">

→ **같은 의미**의 다른 표현도 유사하게 인식

</div>

</div>

<div v-click>

### 한국어 임베딩 모델 vs OpenAI 비교

<ImageModal
  src="/figs_in_thesis/embedding_comparison.png"
  alt="임베딩 모델 비교"
  caption="그림: 임베딩 모델별 Retrieval Recall 비교"
  width="70%"
/>

<div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm">

**KURE** (Korean Universal Retrieval Embedding)
- 한국어 특화 임베딩 모델
- OpenAI 대비 **Recall +26.1%p** 향상
- 완전 **로컬** 실행 (비용 $0)

</div>

</div>

</div>

<!--
다음은 임베딩에 대해 설명드리겠습니다.

임베딩은 텍스트를 숫자 벡터로 변환하는 기술입니다.
예를 들어 "부산시 도시철도"라는 문장을 768차원의 숫자 벡터로 바꿉니다.

이렇게 변환하면 의미적 유사도를 계산할 수 있습니다.
"지하철 요금"과 "도시철도 운임"은 표현은 다르지만
임베딩 공간에서는 매우 가깝게 위치합니다.

본 연구에서는 한국어 특화 임베딩인 KURE를 사용했습니다.
오른쪽 그래프를 클릭하시면 크게 보실 수 있습니다.
KURE는 OpenAI 임베딩 대비 Recall이 26.1%p 높고,
로컬에서 실행되어 비용이 들지 않습니다.
-->

---

# RAG(Retrieval-Augmented Generation)

<div class="grid grid-cols-2 gap-6 mt-6">

<div>

### 검색 증강 생성

<div class="p-4 bg-blue-50 rounded-lg">

**핵심 아이디어**: LLM이 답변을 생성하기 전에<br>
관련 문서를 **먼저 검색**하여 모델에 컨텍스트로 제공

</div>

### 왜 RAG가 필요한가?

| 문제 | RAG의 해결 |
|------|-----------|
| 환각 | 검색된 **근거**에 기반하여 답변 |
| 최신성 | **지식베이스** 업데이트로 대응 |
| 출처 | 어떤 **문서**를 참조했는지 제공 |

<div class="mt-4 text-sm">

→ 공공기관에서 **신뢰할 수 있는** AI 답변 가능

</div>

</div>

<div v-click>

### RAG 최적화 파이프라인 구조

<ImageModal
  src="/figs_in_thesis/auto_rag_pipeline.png"
  alt="RAG 파이프라인"
  caption="그림: RAG 파이프라인 전체 구조 (논문 Figure 2.2)"
  width="100%"
/>

</div>

</div>

<!--
RAG, 즉 검색 증강 생성에 대해 설명드리겠습니다.

RAG의 핵심 아이디어는 LLM이 답변하기 전에 관련 문서를 먼저 검색하여 제공하는 것입니다.

이를 통해 환각 문제를 해결할 수 있습니다.
LLM이 자기 지식만으로 답변하는 것이 아니라,
검색된 문서라는 근거에 기반하여 답변합니다.

또한 지식베이스를 업데이트하면 최신 정보를 반영할 수 있고,
어떤 문서를 참조했는지 출처도 제공할 수 있습니다.

오른쪽에 RAG 파이프라인의 전체 구조가 있습니다.
클릭하시면 크게 보실 수 있습니다.
-->

---

# 최적화 대상 RAG 파이프라인 구조

<div class="grid grid-cols-3 gap-4 mt-8">

<div v-click class="p-4 bg-blue-50 rounded-lg">

### 1. 검색 (Retrieval)

**BM25**: 키워드 매칭
- "도시철도" → "도시철도" 포함 문서

**Vector**: 임베딩 유사도
- "지하철" → "도시철도" 문서도 검색

**Hybrid**: 둘의 결합 (RRF)
- 키워드 + 의미 검색 장점 통합

</div>

<div v-click class="p-4 bg-orange-50 rounded-lg">

### 2. 재순위화 (Reranking)

검색된 문서를 **정밀하게 재정렬**

- 1차 검색: 빠르게 후보 추출
- 2차 재순위화: 정확도 향상

**리랭커 모델**:
- BGE-reranker
- KoReranker (한국어)
- MonoT5

</div>

<div v-click class="p-4 bg-green-50 rounded-lg">

### 3. 생성 (Generation)

검색된 문서를 **컨텍스트**로<br>
LLM이 답변 생성

```text
[시스템 프롬프트]
아래 문서를 참고하여 답변...

[검색된 문서]
문서1: ...
문서2: ...

[사용자 질문]
도시철도 요금은?
```

</div>

</div>

<!--
RAG 파이프라인을 좀 더 상세히 설명드리겠습니다.

사용자 질문이 들어오면 먼저 임베딩으로 변환하고,
벡터 DB에서 관련 문서를 검색합니다.
검색된 문서를 재순위화하고, 프롬프트를 구성한 후 LLM이 답변을 생성합니다.

검색 단계에서는 세 가지 방식이 있습니다.
BM25는 키워드 매칭으로, "도시철도"라는 단어가 포함된 문서를 찾습니다.
Vector 검색은 임베딩 유사도를 사용하여, "지하철"로 검색해도 "도시철도" 문서를 찾을 수 있습니다.
Hybrid는 두 방식을 결합하여 장점을 통합합니다.

재순위화 단계에서는 검색된 문서를 정밀하게 재정렬합니다.
1차 검색이 빠르게 후보를 추출하면, 재순위화가 정확도를 높입니다.

마지막으로 생성 단계에서는 검색된 문서를 컨텍스트로 하여 LLM이 답변을 생성합니다.
-->

---
layout: section
---

# 3. 연구 방법

데이터셋 및 실험 설계

<!--
다음은 연구 방법입니다.
-->

---

# 데이터셋 구축

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### 원천 및 최종 데이터셋

| 항목 | 내용 |
|------|------|
| 원천 | AI Hub 행정문서 기계독해 |
| 토픽 | 6개 (공공행정, 국토, 환경 등) |
| **QA 쌍** | **180개** |
| **코퍼스** | **50,000개** |
| 정답 문서 | 204개 (정답률 0.4%) |

<div class="text-xs mt-2 p-2 bg-yellow-50 rounded">

→ 5만 개 중 정답 약 200개: **현실적 검색 난이도**

</div>

</div>

<div>

### 질문 유형 (7종, 난이도별 분류)

<div class="text-xs">

| 구분 | 유형 | 수 | 설명 |
|------|------|---|------|
| 단순형 | Simple Factoid | 36 | 수치·날짜 추출 |
| (72개) | Constraint | 18 | 조건 항목 선택 |
| | Reasoning | 18 | 원인-결과 이해 |
| 다단계 | Multi-doc 1-hop | 36 | 2문서 병렬 종합 |
| (108개) | Multi-hop 2-hop | 36 | 2문서 순차 연결 |
| | Multi-hop 3/5-hop | 36 | 3~5문서 체인 |

</div>

<div class="text-xs mt-2 text-gray-600">

→ RAG **다차원 평가**: 단순 추출 ~ 장거리 추론

</div>

</div>

</div>

<!--
데이터셋은 AI Hub의 행정문서 대상 기계독해 데이터를 활용했습니다.

최종적으로 180개의 QA 쌍과 50,000개의 검색 대상 코퍼스를 구축했습니다.
정답 문서는 204개로, 5만 개 중 정답률이 0.4%입니다.
현실적인 검색 난이도를 반영했습니다.

질문 유형은 7가지로, 단순형 72개와 다단계형 108개입니다.
단순 사실 추출부터 5개 문서를 연결하는 장거리 추론까지 다차원으로 평가합니다.
-->

---

# 실험 설계: Greedy 모듈 탐색

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### 실험 변수 (전체 432개 조합)

| 단계 | 비교 대상 | 개수 |
|------|-----------|------|
| 검색 | BM25, VectorDB, **Hybrid** | 3종 |
| 리랭커 | Pass, KoReranker, **BGE-v2-m3** 등 | 6종 |
| 필터 | Pass, SimilarityThreshold | 2종 |
| 프롬프트 | Fstring, LongContextReorder | 2종 |
| LLM | GPT-4o-mini, **Gemma-3-12B** 등 | 6종 |

<div class="text-xs text-gray-500 mt-1">

※ 필터/프롬프트는 성능 차이 미미하여 핵심 가설 검증에서 제외

</div>

### 통제 변수
- 임베딩: **KURE**, Temperature: 0

</div>

<div>

### Greedy 모듈 탐색 방식

<ImageModal
  src="/figs_in_thesis/greedy_modular_simple.png"
  alt="Greedy 모듈 탐색"
  caption="논문 Figure 3.2"
  width="100%"
/>

<div class="text-xs mt-1">

1. 검색 3종 → **Hybrid** 선택
2. 리랭커 6종 → **BGE-v2-m3** 선택
3. LLM 6종 → **Gemma-3-12B** 선택

</div>

</div>

</div>

<!--
실험 설계입니다. 전체 파이프라인은 검색, 리랭커, 필터, 프롬프트, LLM 5개 단계로 구성되며,
총 432개의 조합이 가능합니다.

다만, 예비 실험에서 필터와 프롬프트 메이커는 성능 차이가 미미하여
핵심 가설 검증 대상에서 제외하고, 검색-리랭커-LLM 3개 단계에 집중했습니다.

Greedy 모듈 탐색 방식으로 각 단계에서 최적 모듈을 순차적으로 선택합니다.
-->

---

# 평가 지표

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

#### 검색 성능 평가

| 지표 | 설명 |
|------|------|
| **Recall** | 정답 문서를 얼마나 찾았는가 |
| **Precision** | 검색된 문서 중 정답 비율 |
| **F1** | Precision과 Recall의 조화평균 |

#### 생성 품질 평가

| 지표 | 설명 |
|------|------|
| **SemScore** ⭐ | 임베딩 기반 **의미 유사도** |
| BERTScore | BERT 기반 토큰 유사도 |
| METEOR/ROUGE | 어휘/n-gram 기반 유사도 |

통계 검정 : **Wilcoxon signed-rank test** (유의성), **Cohen's d** (효과 크기)

</div>

<div>

#### SemScore를 주 지표로 선택한 이유

<div class="p-3 bg-blue-50 rounded-lg text-sm">

**한국어 특성 반영**

| 문제 | ROUGE/METEOR | SemScore |
|------|--------------|----------|
| 어순 변화 | 점수 하락 | 의미 보존 ✓ |
| 동의어 사용 | 점수 하락 | 의미 보존 ✓ |
| 조사 변화 | 점수 하락 | 의미 보존 ✓ |

</div>

<div class="mt-2 p-2 bg-yellow-50 rounded-lg text-xs">

**예시**:
- 정답: "도시철도 요금은 1,400원입니다"
- 생성: "부산 지하철 운임은 천사백원입니다"
- ROUGE: **낮음** (단어 불일치) / SemScore: **높음** (의미 동일)

</div>

</div>

</div>

<!--
평가 지표입니다.

검색 성능은 Recall, Precision, F1으로 측정했습니다.
Recall은 정답 문서를 얼마나 찾았는지,
F1은 Precision과 Recall의 조화평균입니다.

생성 품질은 SemScore를 주 지표로 사용했습니다.
SemScore는 임베딩 기반 의미 유사도로,
한국어의 어순 변화, 동의어 사용, 조사 변화에도 의미를 보존합니다.

예를 들어 "도시철도 요금은 1,400원입니다"와
"부산 지하철 운임은 천사백원입니다"는
ROUGE 점수는 낮지만 SemScore는 높습니다.
의미가 같기 때문입니다.
-->

---

# 하드웨어 및 소프트웨어 환경

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

### 하드웨어

| 항목 | 사양 |
|------|------|
| GPU | **RTX 3090 Ti 24GB** |
| CPU | Intel Core i5-11400 |
| RAM | 32GB DDR4 |
| OS | Ubuntu 24.04 LTS |

<div class="mt-4 p-3 bg-green-50 rounded-lg text-sm">

**24GB VRAM**으로:
- 소형 LLM 로컬 추론 가능
- 임베딩, 리랭커 동시 실행 가능
- 공공기관 도입 가능한 수준

</div>

</div>

<div v-click>

### 소프트웨어

| 항목 | 버전/도구 |
|------|-----------|
| Python | 3.11 |
| CUDA | 12.4 |
| **AutoRAG** | v0.3.21 |
| Ollama | v0.11.7 |

<div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm">

**AutoRAG**: RAG 파이프라인 자동 최적화 프레임워크
- 모듈별 성능 비교 자동화
- 최적 조합 탐색
- 한국어 지원

</div>

</div>

</div>

<!--
하드웨어는 RTX 3090 Ti 24GB GPU를 사용했습니다.
이 정도면 12B 모델을 로컬에서 추론할 수 있고,
공공기관에서도 충분히 도입 가능한 수준입니다.

소프트웨어는 AutoRAG 프레임워크를 활용하여
RAG 파이프라인 최적화를 자동화했습니다.
-->

---
layout: section
---

# 4. 연구 결과

가설 검증

<!--
다음은 연구 결과입니다. 각 가설별로 검증 결과를 말씀드리겠습니다.
-->

---

# H1 검증: 검색 전략 비교

<div class="grid grid-cols-2 gap-8 mt-6">

<div>

### 검색 방식별 성능 (표 32)

| 검색 방식 | Recall | F1 | p-value |
|-----------|--------|-----|---------|
| BM25 | 87.8% | 0.177 | <0.0001 |
| VectorDB | 92.2% | 0.175 | 0.0001 |
| **Hybrid RRF** | **92.8%** | **0.196** | - |

<div class="mt-4 text-sm">
*Hybrid RRF 대비 통계 검정
</div>

<div class="mt-4 p-4 bg-green-100 rounded-lg">

### ✅ H1 채택

Hybrid RRF가 VectorDB 대비<br>
**F1 +12.1%** (p<0.001)

</div>

</div>

<div v-click>

### 검색 방식 비교 시각화

<ImageModal
  src="/figs_in_thesis/h1_retrieval_comparison.png"
  alt="H1 검색 방식 비교"
  caption="그림: 검색 방식별 Recall/F1 비교 (논문 Figure 4.1)"
  width="60%"
/>

<div class="mt-4 text-sm">

**주요 발견**:
- BM25와 VectorDB의 **상호보완** 효과
- RRF(Reciprocal Rank Fusion)로 점수 통합
- 한국어에서 Hybrid가 특히 효과적

</div>

</div>

</div>

<!--
먼저 H1, 검색 전략 비교입니다.

Hybrid RRF가 Recall 92.8%, F1 0.196으로 가장 높은 성능을 보였습니다.
VectorDB 대비 F1이 12.1% 향상되었고, p-value가 0.001 미만으로 통계적으로 유의합니다.

따라서 H1은 채택되었습니다.
오른쪽 그래프를 클릭하시면 자세히 보실 수 있습니다.
BM25의 키워드 매칭과 VectorDB의 의미 검색이 상호보완적으로 작용한 결과입니다.
-->

---

# H2 검증: 리랭커 효과 분석

<div class="grid grid-cols-2 gap-6 mt-6">

<div>

### 리랭커별 성능 (표 33)

| 리랭커 | Recall | F1 | vs Pass |
|--------|--------|-----|---------|
| **BGE-v2-m3** | **92.2%** | **0.433** | +2.6% |
| PassReranker | 89.4% | 0.422 | 기준 |
| BGE-large | 90.0% | 0.415 | -1.7% |
| KoReranker | 90.6% | 0.411 | -2.5% |
| MonoT5 | 65.0% | 0.266 | -37.1% |
| ColBERT | 42.8% | 0.179 | -57.6% |

</div>

<div v-click>

### 리랭커 비교 시각화

<ImageModal
  src="/figs_in_thesis/h2_reranker_comparison.png"
  alt="H2 리랭커 비교"
  caption="그림: 리랭커별 F1/Recall 비교 (논문 Figure 4.2)"
  width="60%"
/>

<div class="p-3 bg-yellow-100 rounded-lg mt-2">

##### ⚠️ H2 기각

KoReranker 효과 **없음** (p=0.36)

</div>

<div class="p-3 bg-blue-50 rounded-lg mt-2 text-sm">

**원인**: KURE 임베딩의 초기 Recall이 92%로 이미 높아 리랭커 효과 제한적

</div>

</div>

</div>

<!--
H2, 리랭커 효과 분석입니다.

예상과 달리 한국어 특화 리랭커인 KoReranker는 효과가 없었습니다.
p-value 0.36으로 통계적 유의성이 없습니다.

대신 범용 리랭커인 BGE-v2-m3가 marginal한 효과를 보였습니다.

원인을 분석해보면, KURE 임베딩의 초기 Recall이 92%로 이미 매우 높아서
리랭커가 추가로 개선할 여지가 적었던 것으로 보입니다.

따라서 H2는 기각되었으나, 높은 Recall 환경에서는 리랭커를 생략할 수 있다는
의미 있는 발견을 얻었습니다.
-->

---
layout: fact
---
## H3 검증
(최적화된 오픈소스 LLM 기반 RAG 파이프라인이 상용 API 기반 파이프라인을 능가할 수 있는가?)

# +8.32%
Gemma-3-12B OPTIM이 GPT-4o-mini NAIVE 대비 SemScore 향상

<div class="text-2xl mt-4 opacity-75">
p = 0.007 (통계적으로 유의)
</div>

<!--
H3의 핵심 결과입니다.

최적화된 Gemma-3-12B가 Naive GPT-4o-mini 대비
SemScore 8.32% 향상을 달성했습니다.
p-value 0.007로 통계적으로 유의합니다.
-->

---

# H3 검증: LLM 비교

<div class="grid grid-cols-2 gap-6 mt-6">

<div>

### LLM별 생성 성능 (표 35)

| 순위 | 모델 | SemScore | vs GPT NAIVE |
|------|------|----------|--------------|
| 1 | **Gemma-3-12B** | **0.5354** | **+8.32%** |
| 2 | GPT-4o-mini | 0.4994 | +1.0% |
| 3 | EXAONE-32B | 0.4983 | +0.8% |
| 4 | A.X-4.0-Light | 0.4865 | -1.6% |
| 5 | HyperCLOVAX-1.5B | 0.4551 | -7.9% |
| 6 | GPT-OSS-20B | 0.3832 | -22.5% |

<div class="text-sm mt-2">
*GPT-4o-mini NAIVE SemScore = 0.4943 기준
</div>

</div>

<div v-click>

### LLM 성능 비교 시각화

<ImageModal
  src="/figs_in_thesis/h3_llm_comparison.png"
  alt="H3 LLM 비교"
  caption="그림: LLM별 SemScore 비교 (논문 Figure 4.3)"
  width="70%"
/>

<div class="mt-2 p-3 bg-green-100 rounded-lg">

##### ✅ H3 채택

| 비교 | p-value | Cohen's d |
|------|---------|-----------|
| Gemma(OPTIM) vs GPT(NAIVE) | **0.007** | 0.188 |

</div>

</div>

</div>

<!--
H3, LLM 비교 결과입니다.

최적화된 파이프라인에서 Gemma-3-12B가 SemScore 0.5354로 1위를 기록했습니다.
Naive GPT-4o-mini의 0.4943 대비 8.32% 높습니다.

Wilcoxon 검정 결과 p=0.007로 통계적으로 유의하고,
Cohen's d는 0.188로 small effect size입니다.

따라서 H3은 채택되었습니다.
12B 오픈소스 LLM에 최적화된 RAG 파이프라인을 적용하면
상용 API를 상회하는 성능을 달성할 수 있습니다.
-->

---

# G-Eval을 통한 추가 검증

<div class="grid grid-cols-2 gap-8 mt-6">

<div>

### RAG 효과 검증

| 모델 | 조건 | Consistency 향상 |
|------|------|------------------|
| GPT-4o-mini | NAIVE | +108.5% |
| GPT-4o-mini | OPTIM | +116.7% |
| Gemma-3-12B | NAIVE | +131.8% |
| Gemma-3-12B | OPTIM | +131.1% |

<div class="text-sm mt-2">
*Non-RAG 대비 향상률 (G-Eval 1-5점 척도)
</div>

<div class="mt-4 p-3 bg-yellow-50 rounded-lg text-sm">

**G-Eval(LLM-as-Judge)**  
GPT-4.1를 평가자로 사용하여 프롬프트를 활용해 1-5점 사이의<br>
Consistency(일관성), Relevance(관련성) 측정

</div>

</div>

<div v-click>

#### H3 검증 추가 - G-Eval

| 지표 | Gemma OPTIM | GPT NAIVE | p-value |
|------|-------------|-----------|---------|
| Consistency | 4.378 | 4.367 | 0.898 |
| Relevance | 4.050 | 4.044 | 0.942 |

<div class="mt-4 p-4 bg-blue-50 rounded-lg">

#### 종합 결론

| 평가 | 결과 |
|------|------|
| **SemScore** | Gemma **유의하게 우수** (+8.32%, p=0.007) |
| **G-Eval** | **통계적으로 동등** |

→ H3 최종 **채택 가능**

</div>

</div>

</div>

<!--
G-Eval을 통해 추가 검증을 수행했습니다.

G-Eval은 GPT-4를 평가자로 사용하여 Consistency와 Relevance를 측정합니다.
RAG 적용 시 Consistency가 Non-RAG 대비 100% 이상 향상되어
RAG의 환각 감소 효과를 확인했습니다.

H3 검증에서 G-Eval 결과는 두 모델이 통계적으로 동등했습니다.
SemScore에서는 Gemma가 유의하게 우수하고,
G-Eval에서는 동등하므로,
전체적으로 H3은 채택됩니다.
-->

---

# Ablation Study: RAG 단계별 효과

<div class="grid grid-cols-2 gap-6 mt-6">

<div>

### No-RAG → Optimized 향상률 (표 41)

| Model | No-RAG | Optim | 향상률 |
|-------|--------|-------|--------|
| **Gemma-3-12B** | 0.370 | **0.535** | **+44.7%** |
| GPT-4o-mini | 0.394 | 0.499 | +26.6% |
| EXAONE-32B | 0.415 | 0.498 | +20.0% |
| A.X-4.0-Light | 0.391 | 0.486 | +24.3% |
| HyperCLOVAX-1.5B | 0.348 | 0.455 | +30.7% |
| GPT-OSS-20B | 0.323 | 0.383 | +18.6% |

</div>

<div v-click>

#### 주목: 역전 현상

<div class="p-2 bg-yellow-50 rounded-lg">

**No-RAG 상태**<br>
GPT (0.394) > Gemma (0.370)

</div>

<div class="mt-2 p-2 bg-green-50 rounded-lg">

**RAG 적용 후**<br>
Gemma (0.535) > GPT (0.499)

</div>

<div class="mt-2 p-2 bg-blue-50 rounded-lg text-sm">

**해석**: Gemma가 **컨텍스트 활용 능력**이 더 우수

- LLM 자체 지식: GPT > Gemma
- 검색 결과 활용: Gemma > GPT
- RAG 환경에서는 컨텍스트 활용이 더 중요

</div>

</div>

</div>

<!--
Ablation Study로 RAG의 단계별 효과를 분석했습니다.

흥미로운 점은 역전 현상입니다.
No-RAG 상태에서는 GPT가 Gemma보다 높았는데,
RAG를 적용하면 Gemma가 역전합니다.

이는 Gemma가 검색된 컨텍스트를 더 잘 활용한다는 것을 의미합니다.
RAG 환경에서는 LLM 자체의 지식보다
컨텍스트 활용 능력이 더 중요할 수 있습니다.
-->

---

# 질문 유형별 성능 분석

<div class="grid grid-cols-2 gap-6 mt-6">

<div>

### 모델 × 질문 유형 Heatmap

<ImageModal
  src="/figs_in_thesis/model_qtype_heatmap.png"
  alt="모델별 질문 유형 성능"
  caption="그림: 모델-질문유형별 SemScore 히트맵 (논문 Figure 4.5)"
  width="100%"
/>

</div>

<div v-click>

### 주요 발견

<div class="p-2 bg-blue-50 rounded-lg">

**Gemma-3-12B 강점**
- Simple Factoid: **0.62** (최고)
- Constraint: **0.58** (최고)
- Reasoning: **0.51** (최고)

</div>

<div class="mt-2 p-2 bg-yellow-50 rounded-lg">

**Multi-hop 한계**
- 5-hop에서 모든 모델 **성능 저하**
- 복잡한 추론에서 RAG 한계 노출
- → GraphRAG 등 대안 필요

</div>

</div>

</div>

<!--
질문 유형별로 성능을 분석했습니다.

히트맵을 클릭하시면 크게 보실 수 있습니다.
Gemma-3-12B가 Simple Factoid, Constraint, Reasoning에서 모두 최고 성능을 보였습니다.

하지만 5-hop 같은 복잡한 Multi-hop 추론에서는 모든 모델이 성능이 저하됩니다.
이는 RAG의 한계를 보여주며, GraphRAG 같은 대안이 필요합니다.
-->

---

# 가설 검증 요약

<div class="mt-6">

| 가설 | 내용 | 결과 | 근거 |
|------|------|------|------|
| **H1** | Hybrid > 단일 검색 | **채택** | p<0.001 (vs VectorDB, BM25) |
| **H2** | KoReranker > 범용 | **기각** | KoReranker 효과 없음 (p=0.36) |
| **H2'** | 리랭커 효과 | **부분 채택** | BGE-v2-m3만 marginal (p=0.06) |
| **H3** | On-premise ≥ 상용 API | **채택** | SemScore +8.32% (p=0.007) |

</div>

<div v-click class="mt-8 p-4 bg-blue-50 rounded-lg">

1. **Hybrid 검색**이 한국어 공공 도메인에서 최적
2. 높은 초기 Recall 환경에서 **리랭커 효과 제한적** → 생략 가능
3. **완전 로컬 RAG로 상용 API 수준 달성 가능** (비용 $0)

</div>

<!--
가설 검증 결과를 요약하면,

H1은 채택되어 Hybrid 검색이 최적임을 확인했습니다.
H2는 기각되었으나 BGE-v2-m3가 marginal 효과를 보였습니다.
H3은 채택되어 완전 로컬 RAG로 상용 API 수준을 달성했습니다.

핵심 발견은 세 가지입니다.
Hybrid 검색이 한국어 공공 도메인에서 최적이고,
높은 초기 Recall 환경에서는 리랭커를 생략할 수 있으며,
완전 로컬 RAG로 상용 API 수준 달성이 가능합니다.
-->

---
layout: section
---

# 5. 결론

기여 및 한계

<!--
마지막으로 결론입니다.
-->

---

# 연구 기여

<div class="grid grid-cols-2 gap-8 mt-6">

<div>

#### 학술적 기여

<v-clicks>

1. **한국어 공공도메인 RAG 벤치마크**<br>
   180 QA × 50,000 corpus 구축

2. **KURE 임베딩 효과 실증**<br>
   OpenAI 대비 Recall +26.1%p

3. **오픈소스 LLM 경쟁력 입증**<br>
   p=0.007 통계적 유의성

</v-clicks>

</div>

<div v-click>

#### 실무적 기여: 최적 파이프라인 청사진

<ImageModal
  src="/figs_in_thesis/optim_pipeline.png"
  alt="최적 파이프라인"
  caption="그림: 최적 파이프라인 구성 (논문 Figure 4.6)"
  width="80%"
/>

| 모듈 | 권장 선택 | 비용 |
|------|----------|------|
| 임베딩 | KURE | $0 |
| 검색 | Hybrid RRF | $0 |
| 리랭커 | 생략 가능 | $0 |
| LLM | Gemma-3-12B | $0 |

</div>

</div>

<!--
연구 기여입니다.

학술적으로는 한국어 공공도메인 RAG 벤치마크를 구축했고,
KURE 임베딩의 효과를 실증했으며,
오픈소스 LLM의 경쟁력을 통계적으로 입증했습니다.

실무적으로는 완전 로컬 파이프라인 청사진을 제시했습니다.
KURE 임베딩, Hybrid 검색, Gemma-3-12B를 조합하면
API 비용 없이 상용 수준의 성능을 달성할 수 있습니다.
-->

---

# 연구의 한계 및 향후 연구

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

### 연구의 한계

<v-clicks>

1. **데이터 규모**<br>
   180개 QA는 탐색적 연구 수준

2. **리랭커 환경 제한**<br>
   높은 초기 Recall에서만 검증

3. **평가 방법**<br>
   자동화 지표만 사용 (사람 평가 미실시)

4. **탐색 방식**<br>
   Greedy 방식으로 전역 최적해 미보장

</v-clicks>

</div>

<div v-click>

### 향후 연구 방향

<v-clicks>

1. **대규모 확장**<br>
   500+ QA, 100K+ 코퍼스

2. **리랭커 재검증**<br>
   낮은 Recall 환경에서 테스트

3. **GraphRAG 비교**<br>
   Multi-hop 성능 개선 가능성

4. **전문가 직접 평가**<br>
   공공기관 현업 전문가에 의한 직접 평가

</v-clicks>

</div>

</div>

<!--
연구의 한계와 향후 연구 방향입니다.

한계점으로는 180개 QA의 데이터 규모가 탐색적 연구 수준이라는 점,
높은 초기 Recall 환경에서만 리랭커를 검증했다는 점,
자동화 지표만 사용했다는 점이 있습니다.

향후 연구로는 대규모 데이터셋 확장,
낮은 Recall 환경에서의 리랭커 재검증,
GraphRAG 비교, 그리고 실제 공공기관 파일럿 적용을 계획하고 있습니다.
-->

---
layout: center
class: text-center
---

# 감사합니다


<div class="mt-12 text-sm opacity-50">
설동헌 · 부경대학교 대학원 ICT교통융합전공
</div>

<!--
이상으로 발표를 마치겠습니다.
질문 있으시면 말씀해 주세요.
감사합니다.
-->
