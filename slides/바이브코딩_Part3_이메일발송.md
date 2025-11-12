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

**Part 3: 버튼으로 이메일 보내기 📧**

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

## 📑 목차

</grid>

<grid drag="45 70" drop="3 20" pad="3em" bg="#F5F5F5" align="left">

### 바이브 코딩

- 🤖 바이브 코딩이란?
- 🌟 Google Gemini 소개
- 🎓 워크플로우
- ⚠️ 주의사항

</grid>

<grid drag="45 70" drop="52 20" pad="3em" bg="#FAFAFA" align="left">

### 실습

- 📧 나에게 이메일 보내기
- 🔐 권한 승인 과정
- ✅ 테스트 및 확인

</grid>

---

<!-- .slide: data-background-color="#E8F4F8" -->
<grid drag="60 30" drop="center" align="center">

# Part 3

## 버튼으로 이메일 보내기 📧

</grid>

note:
자, 이제 본격적으로 코딩을 시작합니다! Part 3부터는 앱스 스크립트로 실제 코드를 작성해볼 거예요. 코딩 처음이시라고요? 걱정하지 마세요! 오늘은 '바이브 코딩'이라는 방법을 쓸 거거든요. 구글의 AI인 Gemini가 코드를 대신 작성해주는 거죠. 우리는 그냥 Gemini한테 '이거 해줘' 하면 돼요. 진짜 쉽습니다!

---

<grid drag="90 12" drop="5 5" align="left">

## 3.0 🤖 바이브 코딩이란?

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

**AI와 함께하는 코딩! 이제 코딩은 어렵지 않아요** ✨

<!-- .element: style="font-size: 1.3em; margin-bottom: 1.5em;" -->

<split even gap="3">

**전통적인 코딩 😓**

개발자 혼자 고민
→ 문법 찾아보기
→ 에러 해결
→ 몇 시간 소요

**바이브 코딩 😊**

AI에게 질문
→ AI가 코드 작성
→ 복사해서 붙여넣기
→ **1분 완성!**

</split>

</grid>

note:
바이브 코딩이 뭐냐면요, AI한테 '이런 기능 만들어줘' 하고 부탁하면 AI가 코드를 작성해주는 거예요. 우리는 그 코드를 복사해서 붙여넣기만 하면 됩니다. 예전에는 프로그래밍 언어를 완벽하게 공부해야 코딩을 할 수 있었어요. 근데 이제는 AI 시대잖아요? AI한테 한글로 설명하면 AI가 알아서 코드를 짜줘요. 진짜 혁명적인 변화입니다!

---

<grid drag="90 12" drop="5 5" align="left">

## 바이브 코딩의 특징

</grid>

<grid drag="48 40" drop="3 20" pad="2em" bg="#E3F2FD" align="center">

### 🤝 AI가 코드 작성

개발 지식 없어도
코딩 가능!

</grid>

<grid drag="48 40" drop="52 20" pad="2em" bg="#FFF3E0" align="center">

### 💬 자연어 요청

한글로 말하듯이
설명하면 OK!

</grid>

<grid drag="48 40" drop="3 62" pad="2em" bg="#E8F5E9" align="center">

### ⚡ 빠르고 쉬움

원하는 기능을
1분 안에 구현

</grid>

<grid drag="48 40" drop="52 62" pad="2em" bg="#F3E5F5" align="center">

### 🎓 초보자 가능

코딩 경험 없어도
바로 시작!

</grid>

note:
바이브 코딩의 특징을 정리하면 이렇습니다. 첫째, AI가 코드를 대신 작성해줘서 개발 지식이 없어도 코딩이 가능해요. 둘째, 한글로 말하듯이 자연어로 요청하면 돼요. 셋째, 빠르고 쉽게 원하는 기능을 1분 안에 구현할 수 있어요. 넷째, 초보자도 코딩 경험 없이 바로 시작할 수 있습니다!

---

<grid drag="90 12" drop="5 5" align="left">

## 🌟 Google Gemini 소개

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

**구글이 만든 강력한 AI** 🧠

<!-- .element: style="font-size: 1.5em; margin-bottom: 1em;" -->

- 🆓 **완전 무료**: Gemini 2.5 Flash 모델 사용
- 💻 **코드 생성 특화**: 프로그래밍 언어를 잘 이해해요
- 🇰🇷 **한글 완벽 지원**: 한국어로 편하게 질문
- ⚡ **빠른 응답**: 몇 초 만에 결과 제공
- 🔗 **Google 계정만 있으면 OK**: 별도 가입 불필요

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

---

### 🔗 Gemini 접속하기

**👉 [gemini.google.com](https://gemini.google.com)**

<!-- .element: style="font-size: 1.5em; margin-top: 2em;" class="fragment" -->

</grid>

note:
오늘 우리가 사용할 AI는 Google Gemini예요. 구글이 만든 인공지능인데, ChatGPT 들어보셨죠? 비슷한 거예요. 근데 Gemini의 장점은 완전 무료라는 거죠! 특히 우리가 사용할 Gemini 2.5 Flash 모델은 코드 생성에 특화되어 있어요. 지금 화면에 보이는 링크를 클릭해보세요. gemini.google.com이에요. 클릭하시면 Gemini 페이지가 열릴 거예요. 구글 계정으로 자동 로그인될 겁니다!

---

<grid drag="90 12" drop="5 5" align="left">

## 📱 Gemini 사용 준비

</grid>

<grid drag="85 75" drop="8 20" pad="3em">

### 1단계: Gemini 접속 ✅

1. 🔗 [https://gemini.google.com](https://gemini.google.com) 접속
2. 🔐 구글 계정으로 로그인
3. 🎉 Gemini 메인 화면 확인

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

### 2단계: 화면 구성 이해하기 👀

- 💬 **채팅창**: AI와 대화하는 공간
- ✍️ **입력창**: 프롬프트를 입력하는 곳
- ▶️ **전송 버튼**: 메시지 보내기

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

</grid>

note:
자, Gemini 페이지가 열리셨나요? 화면을 보시면 채팅창처럼 생겼죠? 아래에 '여기에 메시지를 입력하세요'라는 입력창이 있고, 오른쪽에 전송 버튼이 있어요. 우리가 여기에 질문을 쓰면 Gemini가 답변해주는 거예요. 코드를 만들어달라고 하면 코드를 만들어주고요. 간단하죠?

---

<grid drag="90 12" drop="5 5" align="left">

## 🎓 바이브 코딩 워크플로우

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#FFF9E6">

**이 과정을 계속 반복하게 될 거예요!** 🔄

<!-- .element: style="font-size: 1.3em; margin-bottom: 1.5em;" -->

<grid drag="100 65" drop="0 0" align="center">

1️⃣ 📝 **프롬프트 복사**

↓

2️⃣ 🤖 **Gemini에 붙여넣고 전송**

↓

3️⃣ 📋 **생성된 코드 복사**

↓

4️⃣ ⌨️ **Apps Script에 붙여넣기**

↓

5️⃣ ▶️ **실행 및 테스트**

<!-- .element: style="font-size: 1.3em; line-height: 2.5;" -->

</grid>

</grid>

note:
자, 이제부터 우리가 할 작업 과정을 설명드릴게요. 아주 간단합니다. 첫째, 제가 화면에 띄워드리는 프롬프트를 복사해요. 둘째, Gemini 입력창에 붙여넣고 전송 버튼을 눌러요. 셋째, Gemini가 코드를 만들어주면 그 코드를 복사해요. 넷째, Apps Script 편집기로 돌아가서 붙여넣어요. 다섯째, 실행 버튼 눌러서 테스트! 이 다섯 단계를 계속 반복할 거예요.

---

<grid drag="90 12" drop="5 5" align="left">

## ⚠️ 주의사항

</grid>

<grid drag="48 70" drop="3 20" pad="3em" bg="#E8F5E9" align="left">

### ✅ DO (해야 할 것)

- **프롬프트를 정확히** 복사
  (단어 하나도 바꾸지 말고!)

- **생성된 코드 전체** 복사

- **코드 블록(```)만** 복사
  (설명 부분 제외)

- **기존 코드 모두 지우고** 붙여넣기

<!-- .element: style="font-size: 1.1em; line-height: 2;" -->

</grid>

<grid drag="48 70" drop="52 20" pad="3em" bg="#FFE5E5" align="left">

### ❌ DON'T (하지 말 것)

- 코드 중간만 복사

- 여러 버전을 섞어서 사용

- 프롬프트 임의로 수정

- 기존 코드와 새 코드 혼용

<!-- .element: style="font-size: 1.1em; line-height: 2.5;" -->

</grid>

note:
바이브 코딩할 때 주의할 점 몇 가지만 말씀드릴게요. 첫째, 프롬프트를 복사할 때 정확히 복사하세요. 한 글자도 바꾸지 말고 그대로 복사 붙여넣기! 둘째, Gemini가 코드를 만들어주면 보통 설명이랑 코드가 같이 나와요. 코드 부분만 복사하시면 돼요. 보통 코드는 회색 박스 안에 있어요. 셋째, Apps Script에 붙여넣을 때는 기존에 있던 코드를 전부 지우고 새로 붙여넣으세요. 섞어서 쓰면 에러 나요!

---

<grid drag="90 12" drop="5 5" align="left">

## 3.1 🚀 실습: 첫 번째 이메일 발송

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

**드디어 코드를 작성합니다!** 💻

<!-- .element: style="font-size: 1.5em; margin-bottom: 1em;" -->

### 📝 준비 작업

#### 1단계: 두 개의 탭 준비하기

🖥️ **작업 환경 세팅:**
- 🔵 **왼쪽 창**: Apps Script 편집기
- 🟢 **오른쪽 창**: Gemini 채팅

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

**💡 화면 분할 Tip:**
- `Win` + `←` : Apps Script를 왼쪽에
- `Win` + `→` : Gemini를 오른쪽에

<!-- .element: style="font-size: 1.1em; line-height: 2;" class="fragment" -->

</grid>

note:
자, 본격적으로 시작하기 전에 작업 환경을 세팅해볼게요. 화면을 둘로 나눌 거예요. 왼쪽에는 Apps Script 편집기, 오른쪽에는 Gemini 페이지를 띄워놓을 거예요. 아까 배운 Win + 화살표 단축키 기억나시죠? Apps Script 탭을 선택하고 Win + 왼쪽 화살표, 그다음 Gemini 탭을 선택하고 Win + 오른쪽 화살표! 이렇게 하면 양쪽을 동시에 볼 수 있어요.

---

<grid drag="90 12" drop="5 5" align="left">

## 2단계: Apps Script 기본 코드 삭제

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#FFF3E0">

**📄 Code.gs 파일:**

기본으로 이런 코드가 있을 거예요:

```javascript
function myFunction() {

}
```

<!-- .element: style="margin: 2em 0;" -->

---

### ✅ 이 코드를 전부 지워주세요!

- `Ctrl + A` (전체 선택)
- `Delete` 또는 `Backspace`

<!-- .element: style="font-size: 1.3em; line-height: 2; margin-top: 2em;" class="fragment" -->

</grid>

note:
Apps Script 편집기를 보시면 기본으로 코드가 좀 적혀있을 거예요. 'function myFunction' 이런 거요. 우리는 새로 작성할 거니까 이거 전부 지워주세요. Ctrl+A 눌러서 전체 선택하고, Delete 키로 싹 지우면 됩니다. 깔끔하게 빈 화면이 되었죠?

---

<grid drag="90 12" drop="5 5" align="left">

## 📧 Mission 1: 나에게 이메일 보내기

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#E8F4F8">

**가장 간단한 이메일 발송 코드를 만들어봅시다!**

<!-- .element: style="font-size: 1.3em; margin-bottom: 1em;" -->

### 🤖 Step 1: Gemini에게 요청하기

**📋 아래 프롬프트를 복사해서 Gemini에 붙여넣으세요:**

```
Google Apps Script로 이메일을 보내는 함수를 만들어줘.

요구사항:
- 함수 이름: sendEmail
- 받는 사람: 내 이메일 주소를 입력할 수 있게 해줘
- 제목: "테스트 이메일"
- 내용: "안녕하세요! 첫 번째 자동 이메일입니다."
- MailApp.sendEmail 사용

주석을 한글로 자세히 달아주고, 초보자도 이해하기 쉽게 설명해줘.
```

<!-- .element: style="font-size: 0.9em;" -->

</grid>

note:
자, 첫 번째 코드를 만들어볼게요. 화면에 프롬프트가 보이시죠? 이걸 그대로 복사해서 Gemini에 붙여넣을 거예요. 프롬프트 박스 안에 마우스를 올리면 오른쪽 위에 복사 버튼이 나타날 거예요. 클릭하거나, 아니면 드래그해서 Ctrl+C로 복사하세요. 그리고 Gemini 입력창에 Ctrl+V로 붙여넣고, 전송 버튼을 눌러주세요. 엔터 쳐도 돼요. 그럼 Gemini가 코드를 만들어줄 겁니다!

---

<grid drag="90 12" drop="5 5" align="left">

## ⏳ Step 2: 잠깐! 개념 설명

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

**Gemini가 코드 생성하는 동안...** 📚

<!-- .element: style="font-size: 1.3em; margin-bottom: 1em;" -->

### MailApp이란?

- 📧 Google Apps Script의 이메일 발송 서비스
- 🔧 Gmail과 연동되어 작동
- ✉️ `MailApp.sendEmail()` 함수로 이메일 발송

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

### 기본 구조:

```javascript
MailApp.sendEmail({
  to: "받는사람@gmail.com",      // 받는 사람 이메일
  subject: "제목",                 // 이메일 제목
  body: "내용"                     // 이메일 본문
});
```

<!-- .element: class="fragment" -->

</grid>

note:
Gemini가 코드를 만들고 있는 동안 간단히 설명드릴게요. 우리가 사용할 MailApp이라는 건 구글이 미리 만들어놓은 이메일 발송 도구예요. 이걸 사용하면 Gmail로 이메일을 보낼 수 있어요. 기본 구조는 간단해요. 받는 사람 이메일 주소, 제목, 내용 이 세 가지만 넣으면 돼요. 너무 쉽죠?

---

<grid drag="90 12" drop="5 5" align="left">

## 📋 Step 3: 생성된 코드 복사하기

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#FFFAF0">

**💡 Tip: 코드 블록만 복사하세요!**

<!-- .element: style="font-size: 1.3em; margin-bottom: 1em;" -->

- Gemini가 설명과 코드를 함께 제공합니다
- 회색 박스 안의 코드만 복사하세요
- 오른쪽 위 복사 버튼을 클릭하거나
- 드래그해서 `Ctrl + C`

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

## ⌨️ Step 4: Apps Script에 붙여넣기

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#E8F5E9">

1. Apps Script 편집기로 돌아가기
2. 코드 영역에 `Ctrl + V`로 붙여넣기
3. 코드가 제대로 들어갔는지 확인

<!-- .element: style="font-size: 1.3em; line-height: 2.5;" class="fragment" -->

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

## ✏️ Step 5: 이메일 주소 수정하기

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#FFF3E0">

**코드에서 이 부분을 찾으세요:**

```javascript
var recipient = "your-email@gmail.com";
```

<!-- .element: style="margin: 1.5em 0;" -->

**여러분의 실제 이메일 주소로 변경:**

```javascript
var recipient = "hongkildong@gmail.com";  // 여러분 이메일
```

<!-- .element: style="margin: 1.5em 0;" class="fragment" -->

⚠️ **주의**: 따옴표 안의 이메일 주소만 바꾸세요!

<!-- .element: style="font-size: 1.2em; margin-top: 2em;" class="fragment" -->

</grid>

note:
코드를 보시면 'your-email@gmail.com'이라고 적힌 부분이 있을 거예요. 이걸 여러분의 실제 Gmail 주소로 바꿔야 해요. 따옴표는 그대로 두고, 안의 이메일 주소만 바꾸시면 됩니다. 예를 들어 'hongkildong@gmail.com' 이런 식으로요. 다 하셨나요?

---

<grid drag="90 12" drop="5 5" align="left">

## 💾 Step 6: 저장하기

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#E3F2FD">

**코드를 저장합니다:**

- 💾 `Ctrl + S` 누르기
- 또는 상단 💾 저장 버튼 클릭

<!-- .element: style="font-size: 1.3em; line-height: 2.5;" class="fragment" -->

**프로젝트 이름 변경 (선택사항):**

- 왼쪽 위 "제목 없는 프로젝트" 클릭
- "이메일 자동 발송" 등으로 변경

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

## ▶️ Step 7: 실행하기!

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5FFFA">

**드디어 실행할 시간입니다!** 🎉

<!-- .element: style="font-size: 1.5em; margin-bottom: 1em;" -->

### 실행 방법:

1. 상단에 함수 선택 드롭다운 확인
   - `sendEmail` 함수가 선택되어 있는지 확인

2. ▶️ **실행** 버튼 클릭!

3. ⏳ 잠시 기다리기...

<!-- .element: style="font-size: 1.2em; line-height: 2.5;" class="fragment" -->

---

### 🔐 처음 실행 시: 권한 승인 필요

(다음 슬라이드에서 자세히 설명)

<!-- .element: style="font-size: 1.1em; margin-top: 2em;" class="fragment" -->

</grid>

note:
자, 이제 실행할 차례예요! 화면 위쪽을 보시면 함수 선택하는 드롭다운이 있고, 그 옆에 플레이 버튼 모양의 실행 버튼이 있어요. sendEmail 함수가 선택되어 있는지 확인하시고, 실행 버튼을 클릭해보세요! 처음 실행하시면 권한 승인 창이 뜰 거예요. 다음에 그 과정을 설명드릴게요.

---

<grid drag="90 12" drop="5 5" align="left">

## 🔐 권한 승인 과정

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#FFF9E6">

**처음 실행할 때 권한을 허용해야 합니다**

<!-- .element: style="font-size: 1.3em; margin-bottom: 1em;" -->

### 왜 필요한가요?

- 📧 Gmail로 이메일을 보내려면 권한이 필요
- 🔐 구글이 보안을 위해 확인하는 절차
- ✅ 한 번만 허용하면 다음부터는 안 나타남

<!-- .element: style="font-size: 1.2em; line-height: 2;" class="fragment" -->

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

### 승인 단계

</grid>

<grid drag="48 70" drop="3 20" pad="2em" bg="#E3F2FD" align="left">

**1단계: 권한 검토**

- "권한 검토" 버튼 클릭

**2단계: 계정 선택**

- 본인의 구글 계정 선택

<!-- .element: style="font-size: 1.1em; line-height: 2;" -->

</grid>

<grid drag="48 70" drop="52 20" pad="2em" bg="#E8F5E9" align="left">

**3단계: 보안 경고**

- "고급" 클릭
- "안전하지 않은 페이지로 이동" 클릭

**4단계: 권한 허용**

- "허용" 버튼 클릭

<!-- .element: style="font-size: 1.1em; line-height: 2;" -->

</grid>

note:
처음 실행하시면 권한 승인 과정을 거쳐야 해요. 왜냐하면 Gmail로 이메일을 보내는 권한이 필요하거든요. 구글이 보안을 위해 확인하는 절차예요. 걱정하지 마세요, 한 번만 허용하면 다음부터는 안 나타나요. 단계별로 따라하시면 됩니다. '권한 검토' 클릭하고, 계정 선택하고, 보안 경고가 나오면 '고급' 눌러서 '안전하지 않은 페이지로 이동' 하시고, 마지막으로 '허용' 누르시면 끝입니다!

---

<grid drag="90 12" drop="5 5" align="left">

## ✅ 테스트 및 확인

</grid>

<grid drag="85 75" drop="8 20" pad="3em" bg="#F5F5F5">

**이메일이 도착했는지 확인해볼까요?**

<!-- .element: style="font-size: 1.5em; margin-bottom: 1em;" -->

### 확인 방법:

1. 📧 Gmail 열기 (mail.google.com)
2. 📥 받은편지함 확인
3. 🔍 "테스트 이메일" 제목 찾기
4. ✉️ 이메일 열어서 내용 확인

<!-- .element: style="font-size: 1.2em; line-height: 2.5;" class="fragment" -->

---

### 🎉 성공!

이메일이 도착했다면 **첫 번째 자동화 성공**입니다!

<!-- .element: style="font-size: 1.3em; margin-top: 2em;" class="fragment" -->

</grid>

note:
자, 이제 이메일이 도착했는지 확인해볼까요? 새 탭에서 Gmail을 열어보세요. 받은편지함을 보시면 방금 보낸 "테스트 이메일"이라는 제목의 이메일이 와 있을 거예요. 클릭해서 열어보세요. "안녕하세요! 첫 번째 자동 이메일입니다."라는 내용이 보이시나요? 축하합니다! 여러분이 만든 첫 번째 자동화가 성공한 겁니다! 코드 몇 줄로 이메일을 자동으로 보낼 수 있게 됐어요. 정말 대단하죠?

---

<!-- .slide: data-background-color="#4CAF50" -->
<grid drag="70 40" drop="center" align="center">

# 🎉 Part 3 완료!

**축하합니다! 첫 코딩에 성공하셨어요!** 👏

</grid>

---

<grid drag="90 12" drop="5 5" align="left">

## ✅ 지금까지 배운 내용

</grid>

<grid drag="48 70" drop="3 20" pad="3em" bg="#F5F5F5" align="left">

### 개념 학습

- 🤖 바이브 코딩이란?
- 🌟 Google Gemini 활용
- 🎓 워크플로우 이해
- 📧 MailApp 사용법

</grid>

<grid drag="48 70" drop="52 20" pad="3em" bg="#FAFAFA" align="left">

### 🌟 핵심 포인트

1. **AI가 코드 작성**
   → 초보자도 코딩 가능

2. **프롬프트 → 코드**
   → 1분 만에 완성

3. **실제로 작동함**
   → 이메일 자동 발송 성공!

</grid>

---

<!-- .slide: data-background-color="#FF9800" -->
<grid drag="70 50" drop="center" align="center">

## 🚀 다음 단계

**Part 4: 고급 기능**

더 복잡한 자동화를 만들어봅시다!
시트 데이터 활용, 반복문, 조건문 등...

</grid>

---

<!-- .slide: data-background-color="#4A90E2" -->
<grid drag="70 40" drop="center" align="center">

# 수고하셨습니다! 🎊

잠깐 휴식 후 Part 4로 이어집니다.

**질문이 있으시면 지금 해주세요!**

</grid>

note:
여기까지가 Part 3이었습니다! 정말 수고 많으셨어요! 오늘 처음으로 코딩을 해보셨는데, 어떠셨나요? 생각보다 어렵지 않죠? 바이브 코딩 덕분에 AI가 코드를 대신 작성해줘서 우리는 그냥 복사 붙여넣기만 하면 됐어요. 그리고 실제로 이메일이 발송되는 걸 확인했죠? 이게 바로 자동화의 시작입니다! 다음 파트에서는 더 복잡한 기능들을 배워볼 거예요. 10분 쉬고 시작하겠습니다!
