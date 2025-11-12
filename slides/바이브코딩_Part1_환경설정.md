---
# 해상도 및 비율 최적화 (16:10)
width: 1920
height: 1200
margin: 0

# 테마 및 스타일
theme: white
transition: slide
transitionSpeed: default

# 슬라이드 컨트롤
controls: true
progress: true
slideNumber: true
center: false

# 플러그인
enableMenu: true
enableChalkboard: false
---

<!-- .slide: data-background-color="#4A90E2" -->
<grid drag="75 50" drop="center" align="center">

# 업무자동화와 바이브코딩 기초

## 📊 Google Sheet & 🤖 AppsScript

**Part 0-1: 시작하기**

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

## 📑 목차

</grid>

<grid drag="45 70" drop="3 20" pad="3em" bg="#F5F5F5" align="left">

### Part 0: 강의의 목적

- 😫 불편함 → 🎉 자동화
- 🌐 구글 시트 소개
- 🤖 앱스 스크립트 소개
- 🎁 강의 목표

</grid>

<grid drag="45 70" drop="52 20" pad="3em" bg="#FAFAFA" align="left">

### Part 1: 환경 설정

- 💻 윈도우 생산성 단축키
- 📊 구글 스프레드시트
- 🔧 앱스 스크립트 에디터
- 🤝 마스터 시트

</grid>

---

<!-- .slide: data-background-color="#E8F4F8" -->
<grid drag="60 30" drop="center" align="center">

# Part 0

## 강의의 목적 🎯

</grid>

note:
자, 이제 강의 목적을 살펴볼까요? 왜 이 강의를 듣게 되었는지 한번 생각해봅시다!

---

<grid drag="90 12" drop="5 5" align="left">

## 자동화의 4단계

</grid>

<grid drag="48 40" drop="3 20" pad="2em" bg="#FFF3E0" align="center">

### 😫 불편함

"매주 똑같은 이메일
보내기 너무 귀찮아..."

</grid>

<grid drag="48 40" drop="52 20" pad="2em" bg="#E3F2FD" align="center">

### 👀 관찰

"이거 패턴이 있네?
자동화할 수 있을 것 같은데?"

</grid>

<grid drag="48 40" drop="3 62" pad="2em" bg="#E8F5E9" align="center">

### ⌨️ 자동화

코드 몇 줄로
자동화 시스템 만들기

</grid>

<grid drag="48 40" drop="52 62" pad="2em" bg="#F3E5F5" align="center">

### 🎉 해결!

버튼 하나로
모든 작업 완료!

</grid>

note:
여러분, 혹시 업무하시다가 이런 생각 해보신 적 있으세요? '이거 매번 똑같은 작업인데 자동으로 안 될까?' 바로 그겁니다! 오늘 우리가 배울 건 딱 이거예요. 불편한 걸 발견하고, 패턴을 찾아내고, 코드로 자동화해서 시간을 절약하는 거죠.

---

<grid drag="90 12" drop="5 5" align="left">

## 🌐 구글 시트란?

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

**클라우드 기반의 스마트한 엑셀**

<!-- .element: style="font-size: 1.5em; margin-top: 1em;" -->

- 🌍 **어디서나 접속** - 인터넷만 되면 OK!
- 👥 **실시간 협업** - 여러 명이 동시 작업
- 🔄 **자동 저장** - 저장 버튼? 필요 없어요!
- 🤝 **쉬운 공유** - 링크 하나면 끝
- 💻 **무료** - 구글 계정만 있으면 공짜!

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

🔗 [sheets.google.com](https://sheets.google.com)

<!-- .element: style="margin-top: 2em;" -->

</grid>

note:
구글 시트, 많이 들어보셨죠? 쉽게 말하면 '인터넷에 있는 엑셀'이라고 생각하시면 돼요. 엑셀은 내 컴퓨터에 저장되잖아요? 근데 구글 시트는 클라우드에 저장돼서 언제 어디서나 접속할 수 있어요. 카페에서 노트북으로 작업하다가, 집에 가서 데스크톱으로 이어서 하고, 출근길에 핸드폰으로도 확인할 수 있죠.

---

<grid drag="90 15" drop="5 5" align="left">

## 🤖 앱스 스크립트란?

**구글 시트에 마법을 부리는 도구** ✨

<!-- .element: style="font-size: 1.3em;" -->

</grid>

<grid drag="45 60" drop="3 23" pad="3em" bg="#F5F5F5" align="left">

### 기본 기능

- 📝 JavaScript 기반
- 🔗 구글 서비스 연동
- ⚡ 자동화의 핵심

<!-- .element: style="font-size: 1.2em; line-height: 2;" -->

</grid>

<grid drag="45 60" drop="52 23" pad="3em" bg="#FAFAFA" align="left">

### 장점

- 🆓 무료
- 🎓 배우기 쉬움
- 💪 강력한 기능

<!-- .element: style="font-size: 1.2em; line-height: 2;" -->

</grid>

<grid drag="90 10" drop="5 86">

🔗 [script.google.com](https://script.google.com)

<!-- .element: style="margin-top: 1em;" -->

</grid>

note:
앱스 스크립트는 구글 시트에 '프로그래밍 능력'을 부여하는 거라고 생각하시면 돼요. 예를 들어 구글 시트에서 버튼 하나 만들어서, 그 버튼을 누르면 자동으로 이메일이 쫙 발송되게 할 수 있어요. 혹은 매주 월요일 오전 9시마다 자동으로 보고서가 작성되게 할 수도 있고요. 이게 다 앱스 스크립트로 가능합니다.

---

<grid drag="90 12" drop="5 5" align="left">

## 🎁 이 강의를 통해 여러분은...

</grid>

<grid drag="45 65" drop="3 20" pad="3em" bg="#F5F5F5" align="left">

### 배우게 될 것들

✅ 구글 시트와 앱스 스크립트 활용

✅ **바이브 코딩**으로 코드 작성

✅ **Gemini API** 발급 및 활용

✅ **고객 맞춤형 이메일** 전송 앱

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

</grid>

<grid drag="45 65" drop="52 20" pad="3em" bg="#E8F4F8" align="center">

### 🚀 최종 목표

**코드 한 줄 몰라도**

↓

**자동화 시스템 만들기!**

<!-- .element: style="font-size: 1.3em; line-height: 1.8;" class="fragment grow" -->

</grid>

note:
오늘 강의가 끝나면 여러분은 이런 걸 할 수 있게 됩니다. 첫째, 구글 시트에서 앱스 스크립트를 실제로 작성해보고 실행해볼 거예요. 둘째, 바이브 코딩이라는 방법으로 코드를 작성하는데, 이게 뭐냐면... AI한테 도움을 받으면서 코딩하는 거예요. 코딩을 한 번도 안 해보신 분들도 오늘 끝나면 '어, 나도 할 수 있네?'라고 느끼실 겁니다!

---

<grid drag="90 12" drop="5 5" align="left">

## 📦 준비물 체크리스트

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

1. ✅ **구글 계정** (gmail.com)
2. ✅ **노트북** (태블릿도 가능하지만 노트북 추천!)
3. ✅ **안정적인 인터넷 연결** 🌐
4. ✅ **배우고 싶은 열정** 💪

<!-- .element: style="font-size: 1.3em; line-height: 2.5;" class="fragment" -->

---

## ⚠️ 참고사항

태블릿이나 스마트폰으로도 가능하지만,
코드 작성할 때 **노트북이 훨씬 편해요!**

<!-- .element: style="font-size: 1.2em; line-height: 2; margin-top: 2em;" -->

</grid>

note:
시작하기 전에 준비물 확인해볼게요. 첫째, 구글 계정 있으시죠? Gmail 주소요. 없으시면 지금 바로 만들어주세요. 둘째, 노트북 준비하셨나요? 태블릿으로도 할 수는 있는데, 솔직히 노트북이 훨씬 편해요. 화면도 크고 키보드로 코드 타이핑하기도 쉽고요. 마지막으로 가장 중요한 건... 배우고 싶은 마음! 이것만 있으면 됩니다. 준비 되셨나요?

---

<!-- .slide: data-background-color="#FFF9E6" -->
<grid drag="70 40" drop="center" align="center">

# 💻 시작하기 전에

## 윈도우즈 잘 쓰기 ⚡

**생산성 2배 올리는 필수 단축키**

</grid>

note:
본격적으로 시작하기 전에 잠깐! 윈도우 단축키 몇 가지만 알려드릴게요. 이거 알고 모르고가 작업 속도가 엄청 차이나거든요. 특히 오늘처럼 여러 창을 왔다 갔다 하면서 작업할 때 진짜 유용합니다. 5분만 투자해서 배워두시면 앞으로 몇 시간을 아낄 수 있어요!

---

<grid drag="90 15" drop="5 5" align="left">

## 📋 클립보드 매니저

### ⌨️ `Win` + `V`

</grid>

<grid drag="45 65" drop="3 23" pad="3em" bg="#F5F5F5" align="left">

### 기능

- 📝 여러 복사 내용 저장
- ⏮️ 이전 복사 내용 재사용
- 🎯 자주 쓰는 텍스트 고정

<!-- .element: style="font-size: 1.2em; line-height: 2;" -->

</grid>

<grid drag="45 65" drop="52 23" pad="3em" bg="#E8F5E9" align="left">

### 실습해보기

1. 텍스트 복사 (`Ctrl+C`)
2. 다른 텍스트도 복사
3. `Win+V` 눌러보기
4. 이전 내용 선택! 🎉

<!-- .element: style="font-size: 1.2em; line-height: 2;" -->

</grid>

note:
자, 첫 번째 단축키! Win 키랑 V를 같이 눌러보세요. Win 키는 키보드 왼쪽 아래에 윈도우 로고가 그려진 키예요. 눌러보셨어요? 클립보드 히스토리가 뜨죠? 이게 뭐냐면, 우리가 평소에 Ctrl+C로 복사하잖아요? 근데 보통은 마지막에 복사한 것만 Ctrl+V로 붙여넣기 할 수 있어요. 그런데 이 클립보드 매니저를 쓰면 이전에 복사했던 내용들을 전부 다 볼 수 있어요. 진짜 유용해요!

---

<grid drag="90 15" drop="5 5" align="left">

## 📸 캡쳐 도구

### ⌨️ `Win` + `Shift` + `S`

</grid>

<grid drag="45 65" drop="3 23" pad="3em" bg="#F5F5F5" align="left">

**기능**

- ✂️ 원하는 영역만 선택 캡쳐
- 📋 자동으로 클립보드에 복사
- 🖼️ 바로 붙여넣기 가능

</grid>

<grid drag="45 65" drop="52 23" pad="3em" bg="#FAFAFA" align="left">

**활용 예시**

- 🐛 에러 메시지 공유
- 📊 차트 일부 캡쳐
- 💬 즉시 공유

</grid>

note:
두 번째, 캡쳐 도구요! Win + Shift + S를 눌러보세요. 화면이 살짝 어두워지면서 십자가 모양 커서가 나타나죠? 이제 마우스로 드래그해서 캡쳐하고 싶은 영역을 선택하면 돼요. 놓으면 자동으로 클립보드에 복사되니까, 어디든 Ctrl+V로 붙여넣을 수 있어요. 이거 진짜 자주 쓸 거예요. 예를 들어 오늘 코딩하다가 에러 나면, 이 단축키로 에러 메시지 캡쳐해서 선생님한테 보여주시면 되거든요.

---

<grid drag="90 12" drop="5 5" align="left">

## 🖥️ 가상 데스크톱

</grid>

<grid drag="85 75" drop="8 20" pad="3em">

### ⌨️ `Win` + `Tab`

**기능**

- 🗂️ 데스크톱을 여러 개 만들어 사용
- 🔄 작업별로 창 정리 가능

**이동 단축키**

- ➡️ `Ctrl` + `Win` + `→` : 다음 데스크톱
- ⬅️ `Ctrl` + `Win` + `←` : 이전 데스크톱

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

### 💡 활용 예시

</grid>

<grid drag="30 70" drop="5 20" pad="2em" bg="#E3F2FD" align="center">

🖥️ **데스크톱 1**

구글 시트
\+
앱스 스크립트

</grid>

<grid drag="30 70" drop="35 20" pad="2em" bg="#FFF3E0" align="center">

🖥️ **데스크톱 2**

문서 자료
\+
브라우저

</grid>

<grid drag="30 70" drop="65 20" pad="2em" bg="#F3E5F5" align="center">

🖥️ **데스크톱 3**

개인 용도
(음악, 메신저)

</grid>

note:
세 번째, 가상 데스크톱! 이건 좀 신기한 기능인데요. Win + Tab을 눌러보세요. 위쪽에 '새 데스크톱' 버튼이 보이시죠? 클릭하면 완전히 새로운 작업 공간이 하나 더 생겨요. 오늘 실습할 때 데스크톱 1에는 구글 시트만, 데스크톱 2에는 자료나 참고 문서 띄워놓으면 화면이 안 복잡해져서 좋아요!

---

<grid drag="90 12" drop="5 5" align="left">

## 📐 창 정렬하기

### ⌨️ `Win` + `←` / `→`

</grid>

<split even gap="3">

**왼쪽 절반**

`Win` + `←`

화면 왼쪽 절반에 창 배치

**오른쪽 절반**

`Win` + `→`

화면 오른쪽 절반에 창 배치

</split>

---

<grid drag="90 12" drop="5 5" align="left">

### 💡 오늘의 활용법

</grid>

<grid drag="48 70" drop="3 20" pad="3em" border="3px solid #4A90E2" bg="#F0F7FF" align="center">

⬅️ **왼쪽**

구글 시트

</grid>

<grid drag="48 70" drop="52 20" pad="3em" border="3px solid #E8833A" bg="#FFF5F0" align="center">

➡️ **오른쪽**

앱스 스크립트 편집기

</grid>

note:
마지막으로 창 정리하기! 이거 정말 꿀팁인데요. 여러분, 지금 아무 창이나 하나 선택하고 Win + 왼쪽 화살표를 눌러보세요. 창이 화면 왼쪽 절반을 딱 차지하죠? 오늘 실습할 때 왼쪽에는 구글 시트를 띄워놓고, 오른쪽에는 앱스 스크립트 편집기를 띄워놓으면 양쪽을 동시에 볼 수 있거든요. 일일이 창을 번갈아가며 클릭할 필요가 없어요. 이 네 가지 단축키만 기억하셔도 작업 속도가 엄청 빨라집니다!

---

<!-- .slide: data-background-color="#E8F4F8" -->
<grid drag="60 30" drop="center" align="center">

# Part 1

## 시작하기 - 환경 설정 🚀

</grid>

note:
자, 이제 본격적으로 시작합니다! Part 1에서는 우리가 사용할 도구들을 세팅하고, 환경을 준비할 거예요. 차근차근 따라오시면 됩니다!

---

<grid drag="90 12" drop="5 5" align="left">

## 1.1 📊 구글 스프레드시트

</grid>

<grid drag="85 75" drop="8 20" pad="3em">

**엑셀보다 더 똑똑한 선택** 💡

### ✨ 주요 장점

<split even gap="3">

**편의성**
- ☁️ 클라우드 저장
- 👥 실시간 협업
- 📱 멀티 디바이스

**효율성**
- 🔄 자동 저장
- 🆓 완전 무료
- 🔗 간편한 공유

</split>

</grid>

note:
먼저 구글 스프레드시트에 대해 좀 더 자세히 알아볼게요. 여러분 중에 엑셀 써보신 분 많으시죠? 구글 시트는 엑셀과 거의 비슷하게 생겼어요. 그런데 몇 가지 큰 차이점이 있습니다. 첫째, 구글 시트는 완전 무료예요. 둘째, 협업이 엄청 편합니다. 실시간으로 여러 명이 동시에 작업할 수 있어요. 셋째, 자동 저장! 구글 시트는 그럴 걱정이 없어요. 타이핑하는 즉시 자동으로 저장되거든요.

---

<grid drag="90 12" drop="5 5" align="left">

## 🆚 엑셀 vs 구글 시트

</grid>

<grid drag="90 75" drop="5 20" pad="3em">

| 특징 | 구글 시트 | 엑셀 |
|------|-----------|------|
| 💰 가격 | **무료** | 유료 (Office 365) |
| 👥 협업 | **실시간 동시 작업** | 제한적 |
| 💾 저장 | **자동 (클라우드)** | 수동 (로컬) |
| 🔗 공유 | **링크만 전달** | 파일 전송 필요 |
| 🤖 자동화 | **앱스 스크립트** | VBA |

<!-- .element: style="font-size: 0.9em;" -->

</grid>

note:
구글 시트의 가장 큰 장점은 무료이면서도 협업이 정말 편하다는 거예요. 링크 하나만 보내면 누구나 접속할 수 있고, 실시간으로 함께 작업할 수 있습니다.

---

<grid drag="90 12" drop="5 5" align="left">

## 🤝 클라우드 협업의 이점

</grid>

<grid drag="48 40" drop="3 20" pad="2em" bg="#E3F2FD" align="center">

### 💬 소통

실시간 채팅과
댓글로 소통

</grid>

<grid drag="48 40" drop="52 20" pad="2em" bg="#FFF3E0" align="center">

### 👀 투명성

누가 어디를
수정하는지 즉시 확인

</grid>

<grid drag="48 40" drop="3 62" pad="2em" bg="#E8F5E9" align="center">

### 📝 안전성

버전 히스토리로
이전 상태 복원

</grid>

<grid drag="48 40" drop="52 62" pad="2em" bg="#F3E5F5" align="center">

### 🔗 편리함

링크 하나로
간편하게 공유

</grid>

note:
클라우드 협업의 장점을 잘 이해하셨나요? 실시간 채팅과 댓글로 소통하고, 누가 어디를 수정하는지 즉시 확인할 수 있고, 버전 히스토리로 이전 상태도 복원할 수 있어요. 그리고 링크 하나로 간편하게 공유할 수 있습니다!

---

<grid drag="90 12" drop="5 5" align="left">

## 1.2 🤖 앱스 스크립트 소개

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

**구글 시트의 숨겨진 슈퍼파워** ⚡

### 📌 핵심 개념

- 🔧 구글 시트를 프로그래밍할 수 있는 도구
- 💻 JavaScript 언어 기반 (웹 개발의 표준)
- 🎯 목적: 반복 작업 자동화, 기능 확장
- 🏢 구글이 직접 만들고 관리하는 공식 도구

</grid>

note:
앱스 스크립트에 대해 좀 더 깊이 알아볼게요. 앱스 스크립트는 JavaScript라는 프로그래밍 언어를 사용하는데, 걱정하지 마세요. 처음부터 JavaScript를 완벽하게 알 필요는 없어요. 기본 개념 몇 가지만 이해하면 충분합니다.

---

<grid drag="90 12" drop="5 5" align="left">

## 🔤 JavaScript 기초

</grid>

<grid drag="90 50" drop="5 20" pad="0 4em">

```javascript
// 주석: 이 줄은 실행되지 않아요
var name = "홍길동";  // 변수: 데이터를 담는 상자
var age = 25;         // 숫자도 담을 수 있어요

// 함수: 특정 작업을 수행하는 코드 묶음
function sayHello() {
  Logger.log("안녕하세요!");  // 로그에 메시지 출력
}
```

</grid>

<grid drag="90 20" drop="5 72" pad="2em" bg="#E8F4F8">

### 🎓 기본 개념

- 📦 **변수 (Variable)**: 데이터를 저장하는 상자
- 🔁 **함수 (Function)**: 재사용 가능한 코드 블록
- 📝 **주석 (Comment)**: `//` 뒤의 설명 (실행 안 됨)

</grid>

note:
변수라는 건 데이터를 담는 상자라고 생각하시면 돼요. 예를 들어 '이름'이라는 상자에 '홍길동'을 넣는 거죠. 함수는 특정 작업을 수행하는 코드 묶음이고요. 예를 들어 '이메일 보내기'라는 함수를 만들면, 나중에 그 함수를 호출하기만 하면 이메일이 발송되는 거예요.

---

<grid drag="90 12" drop="5 5" align="left">

## ✨ 앱스 스크립트로 할 수 있는 것

</grid>

<grid drag="48 40" drop="3 20" pad="2em" bg="#E3F2FD" align="left">

### 1️⃣ 데이터 처리

- 📊 정렬, 필터링, 계산
- 🔄 데이터 가져오기
- 📈 자동 차트 생성

</grid>

<grid drag="48 40" drop="52 20" pad="2em" bg="#FFF3E0" align="left">

### 2️⃣ 구글 연동

- 📧 Gmail 이메일 발송
- 📅 Calendar 일정 추가
- 📁 Drive 파일 관리

</grid>

<grid drag="48 40" drop="3 62" pad="2em" bg="#E8F5E9" align="left">

### 3️⃣ 외부 API

- 🌐 날씨 정보
- 💱 환율 자동 업데이트
- 🤖 AI 텍스트 생성

</grid>

<grid drag="48 40" drop="52 62" pad="2em" bg="#F3E5F5" align="left">

### 4️⃣ UI 만들기

- 🔘 커스텀 버튼
- 📋 사용자 메뉴
- ⚠️ 알림 창 표시

</grid>

note:
앱스 스크립트로 할 수 있는 게 진짜 많아요. 구글 시트의 데이터를 자동으로 정리할 수도 있고, Gmail로 이메일을 자동 발송할 수도 있고, Google Calendar에 일정을 추가할 수도 있어요. 심지어 외부 API, 예를 들어 날씨 정보 API나 AI API 같은 것도 연결할 수 있습니다. 오늘 우리는 Gemini라는 구글의 AI API를 연결해서 개인화된 메시지를 자동으로 만들어볼 거예요!

---

<grid drag="90 12" drop="5 5" align="left">

## 1.3 🛠️ 실습 환경 준비

</grid>

<grid drag="80 20" drop="10 20" align="center" bg="#E3F2FD">

**이제 손으로 직접 해봅시다!** 👐

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

### 1단계: 구글 계정 확인 ✅

</grid>

<grid drag="85 70" drop="8 20" pad="3em" bg="#F5F5F5">

1. 🌐 브라우저 주소창에 `mail.google.com` 입력 <!-- .element: class="fragment" -->
2. 로그인 되어있는지 확인 <!-- .element: class="fragment" -->
3. 안 되어있다면 구글 계정으로 로그인 <!-- .element: class="fragment" -->

</grid>

note:
자, 이제 실제로 환경을 세팅해봅시다! 먼저 구글에 로그인되어 있는지 확인해볼게요. 브라우저 주소창에 mail.google.com 이라고 쳐보세요. Gmail이 바로 열리면 로그인 된 거고, 로그인 화면이 나오면 여러분의 구글 계정으로 로그인해주세요. 구글 계정이 아예 없으신 분은 지금 만들어주셔야 해요!

---

<grid drag="90 12" drop="5 5" align="left">

### 2단계: 스프레드시트 생성 📝

</grid>

<grid drag="90 28" drop="5 20" pad="2em" bg="#FFF3E0">

**방법 1: 가장 빠른 방법** ⚡

주소창에 `sheets.new` 입력 → 엔터!

</grid>

<grid drag="90 28" drop="5 51" pad="2em" bg="#E3F2FD">

**방법 2: Google Drive에서**

Drive 접속 → 새로 만들기 → Google Sheets

</grid>

<grid drag="90 18" drop="5 82" pad="2em" bg="#E8F5E9">

**방법 3: 검색해서**

구글에서 "구글 시트" 검색 → 첫 번째 링크

</grid>

note:
이제 구글 시트를 만들어볼게요. 가장 빠른 방법은 브라우저 주소창에 'sheets.new'라고 치는 거예요. s-h-e-e-t-s-점-n-e-w. 쳐보세요. 엔터 누르면 새 스프레드시트가 자동으로 만들어집니다! 진짜 간단하죠? 다른 방법도 있는데, Google Drive에 들어가서 '새로 만들기' 버튼 누르고 Google Sheets를 선택하셔도 되고요. 어떤 방법이든 상관없어요. 중요한 건 새 스프레드시트를 하나 만드는 거예요. 다들 만들어지셨나요?

---

<grid drag="90 12" drop="5 5" align="left">

### 3단계: 앱스 스크립트 편집기 열기 🔧

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

1. 📊 구글 시트가 열린 상태에서
2. 🔝 상단 메뉴 **확장 프로그램** 클릭
3. ⚙️ **Apps Script** 선택
4. 🆕 새 탭에서 앱스 스크립트 편집기 열림!

💡 **Tip**: 이 탭을 북마크해두면 나중에 바로 접속 가능!

</grid>

note:
좋아요, 이제 앱스 스크립트 편집기를 열어볼게요. 구글 시트 화면 위쪽 메뉴를 보시면 '확장 프로그램'이라는 메뉴가 있어요. 클릭해보세요. 그럼 드롭다운 메뉴가 나오는데, 거기서 'Apps Script'를 선택하시면 됩니다. 새 탭이 열리면서 앱스 스크립트 편집기가 나타날 거예요. 이게 바로 우리가 코드를 작성할 공간입니다!

---

<grid drag="90 12" drop="5 5" align="left">

### 4단계: 편집기 UI 둘러보기 👀

</grid>

<grid drag="90 80" drop="5 20">

```
┌─────────────────────────────────────────┐
│  📁 프로젝트 이름: "제목 없는 프로젝트"  │
├─────────────────────────────────────────┤
│  📂 파일                                 │
│    └─ 📄 Code.gs                        │
├─────────────────────────────────────────┤
│  [코드 편집 영역]                        │
│                                          │
│  function myFunction() {                 │
│    // 여기에 코드를 작성합니다           │
│  }                                       │
└─────────────────────────────────────────┘
```

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

### 🎯 주요 구성 요소

</grid>

<grid drag="85 75" drop="8 20" pad="3em">

<split even gap="3">

**왼쪽**
- 📂 파일 목록
- 📄 Code.gs 파일

**가운데**
- 📝 코드 편집기
- ✏️ 코드 작성 공간

**위쪽**
- ▶️ 실행 버튼
- 💾 저장 버튼
- 🔍 로그 보기

</split>

</grid>

note:
자, 화면을 한번 살펴볼게요. 위쪽에 '제목 없는 프로젝트'라고 되어 있죠? 여기 클릭하면 프로젝트 이름을 바꿀 수 있어요. 나중에 여러 프로젝트를 만들면 이름으로 구분하기 편하니까, 의미있는 이름을 붙이는 게 좋아요. 왼쪽에는 파일 목록이 있어요. 기본으로 'Code.gs'라는 파일이 하나 만들어져 있을 거예요. 여기에 우리가 코드를 작성하게 됩니다. 가운데 큰 공간이 코드 편집기인데, 여기서 실제로 코드를 타이핑하는 거고요. 위에 있는 플레이 버튼 같은 게 실행 버튼이에요. 코드 작성하고 이 버튼 누르면 코드가 실행됩니다!

---

<grid drag="90 12" drop="5 5" align="left">

## 1.4 📋 마스터 시트

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

**함께 작업할 공용 시트** 🤝

### 🎯 마스터 시트의 목적

- 👥 모든 수강생이 함께 작업하는 공간
- 🔗 각자의 시트 링크를 공유하는 장소
- 💬 댓글과 메모로 소통하는 연습장
- 📝 실습 예제와 참고 자료 보관

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

### 🔗 마스터 시트 접속

</grid>

<grid drag="70 40" drop="15 25" align="center" bg="#E8F4F8">

> **📊 [마스터 시트 바로가기](#)**
> _(강사님이 실제 링크를 제공합니다)_

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

### ✅ 접속 확인

</grid>

<grid drag="85 70" drop="8 20" pad="3em" bg="#F5F5F5">

1. 위 링크 클릭 <!-- .element: class="fragment" -->
2. 구글 시트가 열리는지 확인 <!-- .element: class="fragment" -->
3. 편집 권한이 있는지 확인
   (셀을 클릭해서 수정 가능한지) <!-- .element: class="fragment" -->
4. ⭐ 즐겨찾기(북마크) 추가 추천! <!-- .element: class="fragment" -->

</grid>

note:
마지막으로 마스터 시트를 소개할게요. 제가 미리 만들어놓은 구글 시트가 하나 있어요. 여기가 우리의 공용 작업 공간이 될 거예요. 화면에 링크가 보이시죠? 이 링크를 클릭해서 마스터 시트에 접속해주세요. 들어가지시면 구글 시트가 하나 열릴 거예요. 이 시트는 모든 수강생이 동시에 접속해서 편집할 수 있어요. 여기서 우리가 실습도 하고, 각자 만든 시트의 링크를 공유하기도 하고, 댓글로 소통도 할 거예요. 자주 쓸 거니까 북마크에 추가해두시면 편하겠죠? 다들 접속되셨나요? 셀을 한번 클릭해보세요. 수정할 수 있으면 제대로 접속된 겁니다!

---

<!-- .slide: data-background-color="#4CAF50" -->
<grid drag="70 40" drop="center" align="center">

# 🎉 Part 0-1 완료!

**축하합니다! 기초 준비가 끝났어요!** 🎊

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

## ✅ 지금까지 배운 내용

</grid>

<grid drag="45 70" drop="3 20" pad="3em" bg="#F5F5F5" align="left">

### 개념 학습

- 📚 강의 목적과 목표
- 📊 구글 시트 이해
- 🤖 앱스 스크립트 개념

</grid>

<grid drag="45 70" drop="52 20" pad="3em" bg="#FAFAFA" align="left">

### 실습 완료

- ⌨️ 윈도우 단축키
- 🛠️ 환경 세팅
- 🔗 마스터 시트 접속

</grid>

---

<!-- .slide: data-background-color="#FF9800" -->
<grid drag="70 50" drop="center" align="center">

## 🚀 다음 단계

**Part 2: 공동 편집**

마스터 시트를 활용해서
실시간 협업을 실습해볼 거예요!

</grid>

---

<!-- .slide: data-background-color="#4A90E2" -->
<grid drag="70 40" drop="center" align="center">

# 수고하셨습니다! 🎊

잠깐 휴식 후 Part 2로 이어집니다.

**질문이 있으시면 지금 해주세요!**

</grid>

note:
자, 여기까지가 Part 0과 Part 1이었습니다! 수고하셨어요! 우리가 뭘 했냐면, 강의 목적을 확인하고, 윈도우 단축키도 배우고, 구글 시트와 앱스 스크립트가 뭔지 이해하고, 실제로 환경도 세팅했어요. 다들 앱스 스크립트 편집기까지 열어보셨고, 마스터 시트에도 접속하셨죠? 완벽합니다! 이제 준비는 끝났어요. 다음 Part부터는 본격적으로 실습에 들어갑니다. 잠깐 쉬었다가 Part 2로 넘어갈게요. 궁금한 거 있으시면 지금 질문해주세요!
