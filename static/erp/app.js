/* 가온물산 인사·총무 앱 — 공개 시연용 (seolcoding.com/erp) · 교육용 가상 자료
 *
 * 이 파일이 하는 일 (위에서 아래 순서)
 *   0. 설정값            자료 파일 경로, 저장 키, 연차 부여 일수
 *   1. 값 다루기          금액·일수 표시, 이름 찾기, 남은 연차·실지급액 계산
 *   2. 불러오기·저장하기  data/erp-demo-data.json → localStorage → 화면
 *   3. 화면 그리기 공통   HTML 이스케이프, 배지, 탭에 따라 어떤 화면을 그릴지 고르기
 *   4. 직원 화면          목록·검색·부서 필터·직원 상세(휴가·급여·비품 묶어 보기)
 *   5. 비품 화면          배정·반납·중복 배정 차단
 *   6. 휴가 화면          승인·반려·등록·입력 검사
 *   7. 급여 화면          월 합계·목록·입력(덮어쓰기)·가상 명세
 *   8. 초기화 확인 창
 *   9. 툴팁               data-tip 속성을 읽어 마우스 호버·키보드 포커스·설명 보기 모드에서 설명 상자를 띄움
 *  10. 소개 패널·따라해보기 가이드   접기/펼치기, 시나리오 4개, "이 위치 보기"
 *  11. 시작               탭 클릭 연결, 자료 읽기, 첫 화면 그리기
 *
 * 흐름 한 줄 요약
 *   시작하기() 가 localStorage 에 저장본이 있으면 그것을, 없으면 JSON 파일을 읽어 `상태` 에 넣는다
 *   → 그리기() 가 현재 탭에 맞는 화면 함수를 불러 #본문 의 innerHTML 을 통째로 다시 만든다
 *   → 버튼을 누르면 `상태` 를 고치고 저장하기() 로 localStorage 에 쓴 뒤 다시 그리기().
 *   화면은 항상 `상태` 에서 새로 계산해 그리므로, 남은 연차·월 합계 같은 값은 따로 저장하지 않는다.
 *
 * 이 앱의 모든 데이터는 수업용으로 지어낸 가상 값이며 세금·4대보험을 계산하지 않는다.
 * 파일을 더블클릭(file://)으로 열면 브라우저 보안 정책 때문에 JSON 을 읽지 못하니 웹 서버 주소로 열어야 한다.
 */

'use strict';

/* ── 0. 설정값 ─────────────────────────────────────────── */

const 자료주소 = 'data/erp-demo-data.json';   // 처음 자료 (상대경로 — /erp/ 하위에서도 동작)
const 저장키 = 'seolcoding-erp-demo-v1';       // localStorage 키 · 같은 도메인의 다른 앱과 겹치지 않게 시연 전용 이름
const 소개저장키 = 'seolcoding-erp-demo-intro'; // 소개 패널을 접었는지 기억하는 키
const 연차부여 = 10; // 전원 10일 고정 (PRD.md)

let 상태 = null;      // { 직원, 휴가, 급여, 비품 } — 화면에 보이는 모든 값의 원본
let 현재화면 = '직원'; // 지금 선택된 탭
let 줄안내모음 = {};  // 휴가 신청번호 → 그 줄에 띄울 안내 문구 (승인 차단 사유 등)
let 상세사번 = null;  // 직원 화면에서 상세를 펼친 직원의 사번
let 비품안내 = {};    // 비품번호 → 그 줄에 띄울 안내 문구
let 도움말모드 = false; // 설명 보기 모드 (켜면 클릭 대신 툴팁)

/* ── 1. 값 다루기 ──────────────────────────────────────── */

const 금액 = (n) => Number(n).toLocaleString('ko-KR') + '원'; // 3000000 → "3,000,000원"
const 일수 = (n) => n + '일';

/* 오늘 날짜를 "YYYY-MM-DD" 로 — 승인·반려·배정 처리일에 씁니다 */
function 오늘() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* 사번으로 직원 이름 찾기 — 휴가·급여·비품 표에는 사번만 있어서 이름은 여기서 붙입니다 */
function 이름찾기(사번) {
  const e = 상태.직원.find((x) => x.사번 === 사번);
  return e ? e.이름 : 사번;
}

/* 남은 연차 = 부여 − 상태가 '승인'인 건의 사용일수 합계 (PRD.md §2-2)
   저장하지 않고 볼 때마다 다시 셉니다. 대기·반려는 빼지 않습니다. */
function 남은연차(사번) {
  const 직원 = 상태.직원.find((x) => x.사번 === 사번);
  const 부여 = 직원 ? 직원.연차부여일수 : 연차부여;
  const 쓴날 = 상태.휴가
    .filter((r) => r.사번 === 사번 && r.상태 === '승인')
    .reduce((합, r) => 합 + Number(r.사용일수), 0);
  return 부여 - 쓴날;
}

/* 급여 계산식 — 지급 총액 = 기본급 + 수당, 실지급액 = 지급 총액 − 공제 */
const 지급총액 = (g) => Number(g.기본급) + Number(g.수당);
const 실지급액 = (g) => 지급총액(g) - Number(g.공제);

/* ── 2. 불러오기 · 저장하기 ────────────────────────────── */

/* 처음 자료(JSON 파일)를 읽어 앱이 쓰는 모양 { 직원, 휴가, 급여, 비품 } 으로 돌려줍니다 */
async function 초기자료읽기() {
  const 응답 = await fetch(자료주소, { cache: 'no-store' });
  if (!응답.ok) throw new Error(`가상 자료를 읽지 못했습니다 (${응답.status})`);
  const d = await 응답.json();
  return { 직원: d.직원, 휴가: d.휴가, 급여: d.급여, 비품: d.비품 || [] };
}

/* `상태` 전체를 이 브라우저의 localStorage 에 씁니다. 서버로는 아무것도 보내지 않습니다. */
function 저장하기() {
  localStorage.setItem(저장키, JSON.stringify(상태));
}

/* 앱을 열 때: 저장본이 있으면 이어서, 없으면 JSON 파일에서 처음 자료를 읽습니다 */
async function 시작하기() {
  const 저장본 = localStorage.getItem(저장키);
  if (저장본) {
    상태 = JSON.parse(저장본);
    // 이전 버전 저장본에 비품이 없으면 초기 자료에서 비품만 보충합니다.
    if (!Array.isArray(상태.비품)) {
      const 초기 = await 초기자료읽기();
      상태.비품 = 초기.비품;
      저장하기();
    }
  } else {
    상태 = await 초기자료읽기();
    저장하기();
  }
}

/* 가상 데이터 초기화 — 저장본을 버리고 JSON 파일의 처음 자료로 되돌립니다 */
async function 초기화하기() {
  상태 = await 초기자료읽기();
  줄안내모음 = {};
  상세사번 = null;
  비품안내 = {};
  명세대상 = null;
  저장하기();
  그리기();
}

/* ── 3. 화면 그리기 공통 ───────────────────────────────── */

const 본문 = () => document.getElementById('본문');

/* HTML 에 값을 끼워 넣기 전에 특수문자를 바꿉니다 (사용자 입력이 태그로 해석되지 않게) */
const 안전 = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* 상태 배지 설명 — 배지 위에 마우스를 올리면 보입니다 */
const 배지설명 = {
  대기: '아직 처리하지 않은 신청입니다. 승인·반려 버튼이 살아 있고, 남은 연차에서 빼지 않습니다.',
  승인: '승인된 신청입니다. 이 건의 사용일수만큼 남은 연차가 줄었고, 다시 처리할 수 없습니다.',
  반려: '반려된 신청입니다. 기록은 남지만 남은 연차는 줄지 않고, 다시 처리할 수 없습니다.',
  배정: '이 비품은 현재 한 직원에게 배정되어 있습니다. 다른 직원에게 주려면 먼저 반납해야 합니다.',
  미배정: '아직 누구에게도 배정되지 않은 비품입니다. 직원을 고르고 배정을 누르면 배정됩니다.',
};

/* 상태 배지 HTML — 색 점 + 글자, data-tip 으로 설명을 붙입니다 */
function 배지(상태값) {
  const 설명 = 배지설명[상태값] || '';
  return `<span class="배지 배지-${안전(상태값)}" tabindex="0" data-tip="${안전(설명)}"><span class="점"></span>${안전(상태값)}</span>`;
}

/* 현재 탭에 맞는 화면 함수를 부릅니다. 화면이 바뀔 때마다 가이드의 대상 안내도 새로 계산합니다. */
function 그리기() {
  if (현재화면 === '직원') 직원화면();
  else if (현재화면 === '휴가') 휴가화면();
  else if (현재화면 === '급여') 급여화면();
  else 비품화면();
  가이드그리기();
}

/* 탭 버튼을 누른 것과 같은 효과 — 가이드의 "이 위치 보기"도 이 함수를 씁니다 */
function 탭전환(화면) {
  현재화면 = 화면;
  줄안내모음 = {};
  document.querySelectorAll('.탭').forEach((t) => {
    const 활성 = t.dataset.화면 === 화면;
    t.classList.toggle('탭-활성', 활성);
    t.setAttribute('aria-selected', 활성 ? 'true' : 'false');
  });
  그리기();
}

/* ── 4. 직원 화면 (조회만) ─────────────────────────────── */

let 직원검색 = '';
let 직원부서 = '전체';

/* 직원 목록 + (이름을 눌렀으면) 그 직원의 상세를 그립니다 */
function 직원화면() {
  const 부서목록 = ['전체', ...new Set(상태.직원.map((e) => e.부서))];
  const 보일목록 = 상태.직원.filter(
    (e) =>
      (직원부서 === '전체' || e.부서 === 직원부서) &&
      (직원검색 === '' || e.이름.includes(직원검색))
  );

  본문().innerHTML = `
    <h2 class="화면제목">직원</h2>
    <p class="설명">가상 임직원 ${상태.직원.length}명입니다. 이름을 누르면 휴가·급여·배정 비품을 함께 볼 수 있습니다.</p>

    <div class="검색줄">
      <input type="search" id="직원검색" placeholder="이름으로 검색" value="${안전(직원검색)}" aria-label="이름으로 검색"
        data-tip="글자를 입력하면 이름에 그 글자가 들어간 직원만 남습니다. 예: '01'을 치면 가상직원01만 보입니다.">
      <select id="직원부서" aria-label="부서 선택"
        data-tip="부서를 고르면 그 부서 직원만 보입니다. 검색어와 함께 적용됩니다.">
        ${부서목록.map((b) => `<option value="${안전(b)}" ${b === 직원부서 ? 'selected' : ''}>${안전(b)}</option>`).join('')}
      </select>
    </div>

    <div class="표감쌈">
      <table>
        <thead>
          <tr>
            <th tabindex="0" data-tip="직원을 구분하는 고유 번호입니다. 휴가·급여·비품 기록은 모두 이 사번으로 직원과 연결됩니다.">사번</th>
            <th tabindex="0" data-tip="이름을 누르면 아래에 그 직원의 휴가·급여·비품 상세가 펼쳐집니다.">이름</th>
            <th>부서</th><th>직급</th>
            <th>입사일</th><th>재직상태</th>
            <th class="수" tabindex="0" data-tip="한 해에 쓸 수 있는 연차 일수입니다. 이 시연에서는 전원 10일로 고정되어 있습니다.">연차 부여</th>
            <th class="수" tabindex="0" data-tip="부여 − 승인된 휴가의 사용일수 합계. 저장된 값이 아니라 볼 때마다 다시 계산합니다. 휴가 탭에서 승인하면 여기 숫자가 바로 줄어듭니다.">남은 연차</th>
          </tr>
        </thead>
        <tbody>
          ${보일목록.length === 0
            ? `<tr><td colspan="8">조건에 맞는 직원이 없습니다.</td></tr>`
            : 보일목록.map((e) => `
              <tr data-직원행="${안전(e.사번)}">
                <td>${안전(e.사번)}</td>
                <td class="강조"><button type="button" class="이름버튼" data-직원상세="${안전(e.사번)}"
                  data-tip="${안전(e.이름)}의 상세를 아래에 펼칩니다. 남은 연차, 최근 지급액, 배정 비품 개수와 세 가지 내역 표가 함께 보입니다.">${안전(e.이름)}</button></td>
                <td>${안전(e.부서)}</td>
                <td>${안전(e.직급)}</td>
                <td>${안전(e.입사일)}</td>
                <td>${안전(e.재직상태)}</td>
                <td class="수">${일수(e.연차부여일수)}</td>
                <td class="수 강조">${일수(남은연차(e.사번))}</td>
              </tr>`).join('')}
        </tbody>
      </table>
    </div>
    ${상세사번 ? 직원상세내용(상세사번) : ''}`;

  // 이름 버튼 → 상세 펼치기
  본문().querySelectorAll('[data-직원상세]').forEach((b) => b.addEventListener('click', () => {
    상세사번 = b.dataset.직원상세;
    직원화면();
    document.getElementById('직원상세제목').focus();
  }));

  // 검색칸 — 글자를 칠 때마다 다시 그리고, 커서를 끝으로 되돌립니다
  const 검색칸 = document.getElementById('직원검색');
  검색칸.addEventListener('input', (ev) => {
    직원검색 = ev.target.value.trim();
    직원화면();
    const 다시 = document.getElementById('직원검색');
    다시.focus();
    다시.setSelectionRange(다시.value.length, 다시.value.length);
  });
  document.getElementById('직원부서').addEventListener('change', (ev) => {
    직원부서 = ev.target.value;
    직원화면();
  });
}

/* 직원 상세 — 사번으로 휴가·급여·비품을 모아 요약 카드 3개 + 표 3개로 보여 줍니다 */
function 직원상세내용(사번) {
  const e = 상태.직원.find((x) => x.사번 === 사번);
  if (!e) return '';
  const 휴가 = 상태.휴가.filter((x) => x.사번 === 사번);
  const 급여 = 상태.급여.filter((x) => x.사번 === 사번).sort((a,b) => b.지급월.localeCompare(a.지급월));
  const 비품 = 상태.비품.filter((x) => x.배정사번 === 사번);
  return `<section class="직원상세" id="직원상세" aria-labelledby="직원상세제목">
    <h3 class="화면제목" id="직원상세제목" tabindex="-1">${안전(e.이름)} 상세</h3>
    <p class="설명">${안전(e.사번)} · ${안전(e.부서)} · ${안전(e.직급)} · ${안전(e.재직상태)}</p>
    <div class="요약카드묶음">
      <div class="요약카드" tabindex="0" data-tip="부여 ${일수(e.연차부여일수)}에서 '승인' 상태인 휴가의 사용일수만 뺀 값입니다. 대기·반려 건은 빼지 않습니다."><span>남은 연차</span><strong id="상세잔여">${일수(남은연차(사번))}</strong><small>부여 ${일수(e.연차부여일수)} · 승인된 일수만 차감</small></div>
      <div class="요약카드" tabindex="0" data-tip="가장 최근 지급월의 실지급액 = 기본급 + 수당 − 공제. 급여 탭에서 수당을 바꾸면 이 값이 바뀝니다."><span>최근 가상 지급액 ${급여[0] ? 안전(급여[0].지급월) : ''}</span><strong id="상세지급">${급여[0] ? 금액(실지급액(급여[0])) : '기록 없음'}</strong><small>기본급 + 수당 − 공제</small></div>
      <div class="요약카드" tabindex="0" data-tip="비품 탭에서 이 직원에게 배정한 비품의 개수입니다. 반납하면 줄어듭니다."><span>배정 비품</span><strong id="상세비품수">${비품.length}개</strong><small>반납하면 이 목록에서 빠집니다</small></div>
    </div>
    <div class="덩어리"><h4 class="카드제목">휴가 내역</h4><div class="표감쌈"><table id="상세휴가표">
      <thead><tr><th>신청번호</th><th>기간</th><th class="수">사용일수</th><th tabindex="0" data-tip="대기·승인·반려 중 하나. 승인만 남은 연차에서 뺍니다.">상태</th></tr></thead><tbody>
      ${휴가.length ? 휴가.map(x=>`<tr><td>${안전(x.신청번호)}</td><td>${안전(x.시작일)} ~ ${안전(x.종료일)}</td><td class="수">${일수(x.사용일수)}</td><td>${배지(x.상태)}</td></tr>`).join('') : '<tr><td colspan="4">휴가 기록이 없습니다.</td></tr>'}
      </tbody></table></div></div>
    <div class="덩어리"><h4 class="카드제목">급여 내역</h4><div class="표감쌈"><table id="상세급여표">
      <thead><tr><th>지급월</th><th class="수">기본급</th><th class="수">수당</th><th class="수">공제</th><th class="수" tabindex="0" data-tip="기본급 + 수당 − 공제. 저장된 값이 아니라 볼 때마다 다시 계산합니다.">실지급액</th></tr></thead><tbody>
      ${급여.length ? 급여.map(x=>`<tr><td>${안전(x.지급월)}</td><td class="수">${금액(x.기본급)}</td><td class="수">${금액(x.수당)}</td><td class="수">${금액(x.공제)}</td><td class="수 강조">${금액(실지급액(x))}</td></tr>`).join('') : '<tr><td colspan="5">급여 기록이 없습니다.</td></tr>'}
      </tbody></table></div></div>
    <div class="덩어리"><h4 class="카드제목">배정 비품</h4><div class="표감쌈"><table id="상세비품표">
      <thead><tr><th>비품번호</th><th>이름</th><th>종류</th><th>배정일</th></tr></thead><tbody>
      ${비품.length ? 비품.map(x=>`<tr><td>${안전(x.비품번호)}</td><td>${안전(x.이름)}</td><td>${안전(x.종류)}</td><td>${안전(x.배정일)}</td></tr>`).join('') : '<tr><td colspan="4">배정된 비품이 없습니다.</td></tr>'}
      </tbody></table></div></div>
  </section>`;
}

/* ── 5. 비품 화면 ──────────────────────────────────────── */

/* 비품 6개 목록 — 줄마다 직원 선택칸 + 배정 + 반납 버튼 */
function 비품화면() {
  본문().innerHTML = `<h2 class="화면제목">비품</h2>
    <p class="설명">가상 노트북 3개와 가상 모니터 3개입니다. 한 비품은 한 직원에게만 배정할 수 있습니다.</p>
    <div class="표감쌈"><table id="비품표"><thead><tr>
      <th>비품번호</th><th>이름</th>
      <th tabindex="0" data-tip="배정 = 누군가 쓰고 있음, 미배정 = 비어 있음. 배정된 비품은 반납해야 다른 직원에게 줄 수 있습니다.">상태</th>
      <th tabindex="0" data-tip="비품을 받은 직원의 이름입니다. 자료에는 사번만 저장되고 이름은 직원 표에서 찾아 붙입니다.">배정 직원</th>
      <th>배정일</th>
      <th tabindex="0" data-tip="직원을 고른 뒤 배정을 누르면 그 직원에게 배정되고, 반납을 누르면 비어 있는 상태로 돌아갑니다.">처리</th>
    </tr></thead><tbody>
    ${상태.비품.map(x=>`<tr data-비품행="${안전(x.비품번호)}">
      <td>${안전(x.비품번호)}</td><td class="강조">${안전(x.이름)}</td><td>${배지(x.배정사번 ? '배정' : '미배정')}</td>
      <td>${x.배정사번 ? 안전(이름찾기(x.배정사번)) : '—'}</td><td>${안전(x.배정일) || '—'}</td>
      <td><div class="비품처리"><select aria-label="${안전(x.비품번호)} 배정 직원" data-비품직원="${안전(x.비품번호)}"
          data-tip="이 비품을 받을 직원을 고릅니다. 고르지 않고 배정을 누르면 '직원을 선택해 주세요' 안내가 뜹니다.">
        <option value="">직원을 선택하세요</option>${상태.직원.map(e=>`<option value="${안전(e.사번)}">${안전(e.이름)}</option>`).join('')}
      </select><button type="button" class="버튼" data-배정="${안전(x.비품번호)}"
          data-tip="고른 직원에게 ${안전(x.이름)}을(를) 배정합니다. 배정일은 오늘로 기록되고, 이미 배정된 비품이면 차단 안내가 뜹니다.">배정</button>
      <button type="button" class="버튼 버튼-보조" data-반납="${안전(x.비품번호)}" ${x.배정사번 ? '' : 'disabled'}
          data-tip="${x.배정사번 ? '배정을 풀어 미배정 상태로 되돌립니다. 직원 상세의 배정 비품 개수도 하나 줄어듭니다.' : '아직 배정되지 않은 비품이라 반납할 것이 없습니다. 배정한 뒤에 눌러 보세요.'}">반납</button></div>
      <p class="줄안내" role="status">${안전(비품안내[x.비품번호] || '')}</p></td>
    </tr>`).join('')}</tbody></table></div>`;
  본문().querySelectorAll('[data-배정]').forEach(b=>b.addEventListener('click',()=>비품배정하기(b.dataset.배정)));
  본문().querySelectorAll('[data-반납]').forEach(b=>b.addEventListener('click',()=>비품반납하기(b.dataset.반납)));
}

/* 배정 — 이미 배정된 비품·직원 미선택은 막고, 아니면 배정사번·배정일을 채워 저장합니다 */
function 비품배정하기(번호) {
  const x = 상태.비품.find(x=>x.비품번호===번호);
  if (!x) return;
  const 사번 = [...본문().querySelectorAll('[data-비품직원]')].find(e=>e.dataset.비품직원===번호).value;
  비품안내 = {};
  if (x.배정사번) 비품안내[번호] = '이미 배정된 비품입니다. 먼저 반납해 주세요.';
  else if (!상태.직원.some(e=>e.사번===사번)) 비품안내[번호] = '배정할 직원을 선택해 주세요.';
  else { x.배정사번 = 사번; x.배정일 = 오늘(); 저장하기(); }
  그리기();
}

/* 반납 — 배정사번·배정일을 비워 미배정으로 되돌립니다 */
function 비품반납하기(번호) {
  const x = 상태.비품.find(x=>x.비품번호===번호);
  if (!x || !x.배정사번) return;
  x.배정사번 = null; x.배정일 = null;
  비품안내 = {}; 저장하기(); 그리기();
}

/* ── 6. 휴가 화면 ──────────────────────────────────────── */

const 상태순서 = { 대기: 0, 승인: 1, 반려: 2 }; // 대기 건이 위로 오도록 정렬

/* 휴가 목록(대기 → 승인 → 반려 순) + 신청 등록 폼 */
function 휴가화면() {
  const 목록 = [...상태.휴가].sort(
    (a, b) => 상태순서[a.상태] - 상태순서[b.상태] || a.신청번호.localeCompare(b.신청번호)
  );

  본문().innerHTML = `
    <h2 class="화면제목">휴가</h2>
    <p class="설명">휴가 종류는 연차 하나뿐입니다. 대기 건을 승인하거나 반려할 수 있습니다.</p>

    <div class="덩어리">
      <div class="표감쌈">
        <table id="휴가표">
          <thead>
            <tr>
              <th tabindex="0" data-tip="신청을 구분하는 번호입니다. 새로 등록하면 LV-연도-순번으로 자동 매겨집니다.">신청번호</th>
              <th>직원</th><th>기간</th>
              <th class="수" tabindex="0" data-tip="이 신청이 쓰는 연차 일수입니다. 승인되면 이만큼 남은 연차에서 빠집니다.">사용일수</th>
              <th class="수" tabindex="0" data-tip="그 직원의 현재 남은 연차 (부여 − 승인 합계). 사용일수가 이 값보다 크면 승인이 차단됩니다.">남은 연차</th>
              <th>사유</th>
              <th tabindex="0" data-tip="대기 → 승인 또는 반려로 한 번만 바뀝니다. 처리된 건은 버튼이 잠깁니다.">상태</th>
              <th tabindex="0" data-tip="승인·반려 버튼을 누른 날짜입니다. 대기 건은 비어 있습니다.">처리일</th>
              <th tabindex="0" data-tip="대기 건에만 승인·반려 버튼이 살아 있습니다. 차단되면 버튼 아래 붉은 안내가 뜹니다.">처리</th>
            </tr>
          </thead>
          <tbody>
            ${목록.map((r) => 휴가줄(r)).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="덩어리 폼" id="휴가등록폼">
      <h3 class="카드제목">휴가 신청 등록</h3>
      <p class="설명">등록하면 상태는 <strong>대기</strong>로 시작합니다.</p>
      <div class="칸모음">
        <div class="칸" data-칸="직원">
          <label for="휴가직원">직원</label>
          <select id="휴가직원" data-tip="휴가를 신청할 직원입니다. 비워 두고 등록하면 붉은 안내가 뜨고 저장되지 않습니다.">
            <option value="">선택하세요</option>
            ${상태.직원.map((e) => `<option value="${안전(e.사번)}">${안전(e.이름)} (${안전(e.사번)})</option>`).join('')}
          </select>
          <p class="안내문구" data-안내="직원"></p>
        </div>
        <div class="칸" data-칸="시작일">
          <label for="휴가시작일">시작일</label>
          <input type="date" id="휴가시작일" data-tip="휴가 첫날입니다. 종료일보다 늦으면 등록이 막힙니다.">
          <p class="안내문구" data-안내="시작일"></p>
        </div>
        <div class="칸" data-칸="종료일">
          <label for="휴가종료일">종료일</label>
          <input type="date" id="휴가종료일" data-tip="휴가 마지막 날입니다. 시작일보다 빠르면 '종료일이 시작일보다 빠릅니다' 안내가 뜹니다.">
          <p class="안내문구" data-안내="종료일"></p>
        </div>
        <div class="칸" data-칸="사용일수">
          <label for="휴가사용일수">사용일수 (직접 입력)</label>
          <input type="number" id="휴가사용일수" step="0.5" min="0.5" placeholder="예: 2"
            data-tip="실제로 쓰는 연차 일수를 직접 적습니다(주말·공휴일 계산은 하지 않습니다). 0 이하면 등록이 막힙니다.">
          <p class="안내문구" data-안내="사용일수"></p>
        </div>
        <div class="칸" data-칸="사유">
          <label for="휴가사유">사유</label>
          <input type="text" id="휴가사유" placeholder="가상 사유" data-tip="비워 두면 '가상 사유'로 저장됩니다. 실제 사유는 적지 마세요.">
          <p class="안내문구" data-안내="사유"></p>
        </div>
      </div>
      <div class="버튼줄">
        <button type="button" class="버튼" id="휴가등록"
          data-tip="입력값을 검사한 뒤 문제가 없으면 새 신청을 '대기' 상태로 목록 맨 위쪽에 추가합니다. 빈칸·0 이하·날짜 역전은 붉은 안내로 알려 줍니다.">등록</button>
      </div>
    </div>`;

  본문().querySelectorAll('[data-승인]').forEach((b) =>
    b.addEventListener('click', () => 승인하기(b.dataset.승인))
  );
  본문().querySelectorAll('[data-반려]').forEach((b) =>
    b.addEventListener('click', () => 반려하기(b.dataset.반려))
  );
  document.getElementById('휴가등록').addEventListener('click', 휴가등록하기);
}

/* 휴가 한 줄 — 대기 건만 버튼이 살아 있고, 차단 안내가 있으면 버튼 아래 붉게 표시 */
function 휴가줄(r) {
  const 대기중 = r.상태 === '대기';
  const 안내 = 줄안내모음[r.신청번호];
  const 잔여 = 남은연차(r.사번);
  const 승인설명 = 대기중
    ? (Number(r.사용일수) > 잔여
        ? `이 건은 사용일수 ${r.사용일수}일이 남은 연차 ${잔여}일보다 많아서 눌러도 승인되지 않고 차단 안내가 뜹니다.`
        : `${이름찾기(r.사번)}의 이 신청을 승인합니다. 남은 연차가 ${잔여}일에서 ${잔여 - Number(r.사용일수)}일로 줄고 처리일이 오늘로 기록됩니다.`)
    : '이미 처리된 신청이라 다시 승인할 수 없습니다.';
  const 반려설명 = 대기중
    ? '이 신청을 반려합니다. 기록은 남지만 남은 연차는 줄지 않습니다.'
    : '이미 처리된 신청이라 다시 반려할 수 없습니다.';
  return `
    <tr data-휴가행="${안전(r.신청번호)}">
      <td>${안전(r.신청번호)}</td>
      <td class="강조">${안전(이름찾기(r.사번))}</td>
      <td>${안전(r.시작일)} ~ ${안전(r.종료일)}</td>
      <td class="수">${일수(r.사용일수)}</td>
      <td class="수">${일수(잔여)}</td>
      <td>${안전(r.사유)}</td>
      <td>${배지(r.상태)}</td>
      <td>${안전(r.처리일) || '—'}</td>
      <td>
        <div class="버튼줄">
          <button type="button" class="버튼" data-승인="${안전(r.신청번호)}" ${대기중 ? '' : 'disabled'} data-tip="${안전(승인설명)}">승인</button>
          <button type="button" class="버튼 버튼-보조" data-반려="${안전(r.신청번호)}" ${대기중 ? '' : 'disabled'} data-tip="${안전(반려설명)}">반려</button>
        </div>
        ${대기중 ? '' : '<p class="설명" style="margin:4px 0 0">이미 처리된 신청입니다</p>'}
        ${안내 ? `<p class="줄안내">${안전(안내)}</p>` : ''}
      </td>
    </tr>`;
}

/* 승인 — R1(처리된 건 재처리 차단), R2(잔여 초과 차단)를 지나면 상태를 '승인'으로 바꾸고 저장 */
function 승인하기(신청번호) {
  const 건 = 상태.휴가.find((r) => r.신청번호 === 신청번호);
  if (!건) return;
  줄안내모음 = {};

  // R1 — 이미 처리된 건은 다시 처리하지 않습니다
  if (건.상태 !== '대기') {
    줄안내모음[신청번호] = '이미 처리된 신청입니다';
    그리기();
    return;
  }

  // R2 — 잔여를 넘는 승인은 막습니다
  const 잔여 = 남은연차(건.사번);
  if (Number(건.사용일수) > 잔여) {
    const 넘침 = Number(건.사용일수) - 잔여;
    줄안내모음[신청번호] = `남은 연차 ${잔여}일보다 ${넘침}일 많습니다`;
    그리기();
    return;
  }

  건.상태 = '승인';
  건.처리일 = 오늘();
  저장하기();
  그리기();
}

/* 반려 — 처리된 건은 막고, 아니면 상태를 '반려'로 (연차는 차감하지 않음) */
function 반려하기(신청번호) {
  const 건 = 상태.휴가.find((r) => r.신청번호 === 신청번호);
  if (!건) return;
  줄안내모음 = {};

  // R1 — 반려도 처리된 건에는 다시 적용하지 않습니다
  if (건.상태 !== '대기') {
    줄안내모음[신청번호] = '이미 처리된 신청입니다';
    그리기();
    return;
  }

  건.상태 = '반려'; // 차감하지 않습니다
  건.처리일 = 오늘();
  저장하기();
  그리기();
}

/* 등록 — 입력 검사(V1 빈칸, V2 0 이하, V3 날짜 역전)를 통과하면 '대기' 신청을 추가 */
function 휴가등록하기() {
  const 값 = {
    사번: document.getElementById('휴가직원').value,
    시작일: document.getElementById('휴가시작일').value,
    종료일: document.getElementById('휴가종료일').value,
    사용일수: document.getElementById('휴가사용일수').value,
    사유: document.getElementById('휴가사유').value.trim(),
  };

  const 안내 = {};

  // V1 — 필수값이 비어 있음
  if (!값.사번) 안내.직원 = '직원을 선택해 주세요';
  if (!값.시작일) 안내.시작일 = '시작일을 입력해 주세요';
  if (!값.종료일) 안내.종료일 = '종료일을 입력해 주세요';
  if (값.사용일수 === '') 안내.사용일수 = '사용일수를 입력해 주세요';

  // V2 — 사용일수가 0 이하
  if (값.사용일수 !== '' && Number(값.사용일수) <= 0) {
    안내.사용일수 = '사용일수는 0보다 커야 합니다';
  }

  // V3 — 종료일이 시작일보다 앞섬
  if (값.시작일 && 값.종료일 && 값.종료일 < 값.시작일) {
    안내.종료일 = '종료일이 시작일보다 빠릅니다';
  }

  if (Object.keys(안내).length > 0) {
    안내표시(안내);
    return; // 저장하지 않습니다
  }

  const 번호 = 새신청번호();
  상태.휴가.push({
    신청번호: 번호,
    사번: 값.사번,
    휴가종류: '연차',
    시작일: 값.시작일,
    종료일: 값.종료일,
    사용일수: Number(값.사용일수),
    사유: 값.사유 || '가상 사유',
    상태: '대기',
    처리일: null,
  });
  저장하기();
  그리기();
}

/* 새 신청번호 — LV-연도-순번, 기존 번호 중 가장 큰 순번 + 1 */
function 새신청번호() {
  const 해 = new Date().getFullYear();
  const 쓰인번호 = 상태.휴가
    .map((r) => Number(String(r.신청번호).split('-').pop()))
    .filter((n) => !Number.isNaN(n));
  const 다음 = (쓰인번호.length ? Math.max(...쓰인번호) : 0) + 1;
  return `LV-${해}-${String(다음).padStart(3, '0')}`;
}

/* 입력 오류 안내 — 문제 있는 칸은 붉은 테두리 + 문구, 나머지는 지움 */
function 안내표시(안내) {
  document.querySelectorAll('.칸').forEach((칸) => {
    const 이름 = 칸.dataset.칸;
    const 문구칸 = 칸.querySelector('.안내문구');
    if (안내[이름]) {
      칸.classList.add('칸-막힘');
      문구칸.textContent = 안내[이름];
    } else {
      칸.classList.remove('칸-막힘');
      문구칸.textContent = '';
    }
  });
}

/* ── 7. 급여 화면 ──────────────────────────────────────── */

let 명세대상 = null; // 가상 명세를 보여 줄 직원 사번

/* 월 합계 → 급여 목록 → 급여 입력 → 가상 명세 순서로 그립니다 */
function 급여화면() {
  if (!명세대상 && 상태.직원.length) 명세대상 = 상태.직원[0].사번;

  // 지급월별로 묶어 합계를 냅니다
  const 달별 = {};
  상태.급여.forEach((g) => {
    (달별[g.지급월] = 달별[g.지급월] || []).push(g);
  });
  const 달목록 = Object.keys(달별).sort();

  본문().innerHTML = `
    <h2 class="화면제목">급여</h2>
    <p class="설명">
      실지급액 = 기본급 + 수당 − 공제. 세금과 4대보험은 계산하지 않습니다.
      전체 ${상태.급여.length}건입니다.
    </p>

    <div class="덩어리" id="월합계덩어리">
      <h3 class="카드제목">월 합계</h3>
      <div class="표감쌈">
        <table id="월합계표">
          <thead>
            <tr>
              <th>지급월</th>
              <th class="수" tabindex="0" data-tip="그 달에 급여 기록이 있는 직원 수입니다.">건수</th>
              <th class="수">기본급 합계</th>
              <th class="수" tabindex="0" data-tip="그 달 모든 직원의 수당을 더한 값입니다. 아래 급여 입력에서 한 사람의 수당을 올리면 이 합계도 같은 만큼 오릅니다.">수당 합계</th>
              <th class="수">공제 합계</th>
              <th class="수" tabindex="0" data-tip="그 달 모든 직원의 실지급액(기본급 + 수당 − 공제)을 더한 값입니다. 저장된 숫자가 아니라 볼 때마다 다시 계산합니다.">실지급액 합계</th>
            </tr>
          </thead>
          <tbody>
            ${달목록.map((월) => {
              const 건들 = 달별[월];
              const 합 = (뽑기) => 건들.reduce((s, g) => s + Number(뽑기(g)), 0);
              return `
                <tr class="합계줄" data-월합계="${안전(월)}">
                  <td>${안전(월)}</td>
                  <td class="수">${건들.length}건</td>
                  <td class="수">${금액(합((g) => g.기본급))}</td>
                  <td class="수">${금액(합((g) => g.수당))}</td>
                  <td class="수">${금액(합((g) => g.공제))}</td>
                  <td class="수">${금액(합(실지급액))}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="덩어리">
      <h3 class="카드제목">급여 목록</h3>
      <div class="표감쌈">
        <table class="급여표" id="급여목록표">
          <thead>
            <tr>
              <th class="접힘" tabindex="0" data-tip="급여 기록 번호입니다. PY-지급월-순번으로 자동 매겨집니다.">급여번호</th><th>직원</th><th class="접힘">지급월</th>
              <th class="수 접힘">기본급</th><th class="수 접힘">수당</th>
              <th class="수 접힘">공제</th>
              <th class="수" tabindex="0" data-tip="기본급 + 수당 − 공제. 좁은 화면에서는 직원과 이 열만 남깁니다.">실지급액</th>
            </tr>
          </thead>
          <tbody>
            ${상태.급여.map((g) => `
              <tr data-급여행="${안전(g.급여번호)}">
                <td class="접힘">${안전(g.급여번호)}</td>
                <td class="강조">${안전(이름찾기(g.사번))}</td>
                <td class="접힘">${안전(g.지급월)}</td>
                <td class="수 접힘">${금액(g.기본급)}</td>
                <td class="수 접힘">${금액(g.수당)}</td>
                <td class="수 접힘">${금액(g.공제)}</td>
                <td class="수 강조">${금액(실지급액(g))}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="덩어리 폼" id="급여입력폼">
      <h3 class="카드제목">급여 입력</h3>
      <p class="설명" id="덮어쓰기안내">
        같은 직원·같은 지급월에 이미 급여가 있으면 새로 만들지 않고 기존 건을 수정합니다.
      </p>
      <div class="칸모음">
        <div class="칸" data-칸="직원">
          <label for="급여직원">직원</label>
          <select id="급여직원" data-tip="직원과 지급월을 고르면 이미 있는 급여가 아래 칸에 자동으로 채워집니다. 그 상태에서 숫자를 고쳐 저장하면 기존 건이 수정됩니다.">
            <option value="">선택하세요</option>
            ${상태.직원.map((e) => `<option value="${안전(e.사번)}">${안전(e.이름)} (${안전(e.사번)})</option>`).join('')}
          </select>
          <p class="안내문구" data-안내="직원"></p>
        </div>
        <div class="칸" data-칸="지급월">
          <label for="급여지급월">지급월</label>
          <input type="month" id="급여지급월" value="2026-08" data-tip="급여가 속한 달입니다. 같은 직원·같은 달은 한 건만 있어서, 이미 있으면 수정하고 없으면 새로 만듭니다.">
          <p class="안내문구" data-안내="지급월"></p>
        </div>
        <div class="칸" data-칸="기본급">
          <label for="급여기본급">기본급</label>
          <input type="number" id="급여기본급" min="0" step="1000" placeholder="0" data-tip="원 단위 기본급입니다. 0 미만이나 빈칸은 저장이 막힙니다.">
          <p class="안내문구" data-안내="기본급"></p>
        </div>
        <div class="칸" data-칸="수당">
          <label for="급여수당">가상 수당</label>
          <input type="number" id="급여수당" min="0" step="1000" placeholder="0" data-tip="기본급에 더해지는 금액입니다. 여기를 10만원 올리면 그 직원의 실지급액과 그 달의 월 합계가 각각 10만원 오릅니다.">
          <p class="안내문구" data-안내="수당"></p>
        </div>
        <div class="칸" data-칸="공제">
          <label for="급여공제">가상 공제</label>
          <input type="number" id="급여공제" min="0" step="1000" placeholder="0" data-tip="지급 총액에서 빼는 금액입니다. 기본급 + 수당보다 크면 '공제가 지급 총액보다 큽니다' 안내가 뜨고 저장되지 않습니다.">
          <p class="안내문구" data-안내="공제"></p>
        </div>
      </div>
      <div class="버튼줄">
        <button type="button" class="버튼" id="급여저장"
          data-tip="입력값을 검사한 뒤 같은 직원·같은 달 급여가 있으면 그 건을 수정하고, 없으면 새 건을 만듭니다. 저장 즉시 월 합계·목록·명세가 다시 계산됩니다.">저장</button>
      </div>
    </div>

    <div class="덩어리" id="명세덩어리">
      <h3 class="카드제목">가상 명세</h3>
      <div class="검색줄">
        <select id="명세직원" aria-label="명세를 볼 직원" data-tip="명세를 볼 직원을 고릅니다. 지급·공제·실지급액을 명세서 모양으로 보여 줍니다.">
          ${상태.직원.map((e) => `<option value="${안전(e.사번)}" ${e.사번 === 명세대상 ? 'selected' : ''}>${안전(e.이름)}</option>`).join('')}
        </select>
      </div>
      ${명세그리기(명세대상)}
    </div>`;

  document.getElementById('급여저장').addEventListener('click', 급여저장하기);
  document.getElementById('명세직원').addEventListener('change', (ev) => {
    명세대상 = ev.target.value;
    급여화면();
  });
  // 직원·지급월을 고르면 기존 급여를 칸에 미리 채웁니다
  ['급여직원', '급여지급월'].forEach((id) =>
    document.getElementById(id).addEventListener('change', 기존급여채우기)
  );
}

/* 직원·지급월에 해당하는 급여가 이미 있으면 입력칸에 채우고 "수정된다"는 안내를 보여 줍니다 */
function 기존급여채우기() {
  const 사번 = document.getElementById('급여직원').value;
  const 월 = document.getElementById('급여지급월').value;
  const 안내 = document.getElementById('덮어쓰기안내');
  if (!사번 || !월) return;

  const 기존 = 상태.급여.find((g) => g.사번 === 사번 && g.지급월 === 월);
  if (기존) {
    document.getElementById('급여기본급').value = 기존.기본급;
    document.getElementById('급여수당').value = 기존.수당;
    document.getElementById('급여공제').value = 기존.공제;
    안내.textContent = `${이름찾기(사번)}의 ${월} 급여가 이미 있습니다. 저장하면 기존 건을 수정합니다.`;
  } else {
    안내.textContent = '같은 직원·같은 지급월에 이미 급여가 있으면 새로 만들지 않고 기존 건을 수정합니다.';
  }
}

/* 저장 — 입력 검사(V4 금액, V5 공제 > 총액)를 지나면 기존 건 수정 또는 새 건 추가 */
function 급여저장하기() {
  const 값 = {
    사번: document.getElementById('급여직원').value,
    지급월: document.getElementById('급여지급월').value,
    기본급: document.getElementById('급여기본급').value,
    수당: document.getElementById('급여수당').value,
    공제: document.getElementById('급여공제').value,
  };

  const 안내 = {};
  if (!값.사번) 안내.직원 = '직원을 선택해 주세요';
  if (!값.지급월) 안내.지급월 = '지급월을 입력해 주세요';

  // V4 — 금액이 비었거나 음수
  [['기본급', 값.기본급], ['수당', 값.수당], ['공제', 값.공제]].forEach(([이름, v]) => {
    if (v === '' || Number.isNaN(Number(v)) || Number(v) < 0) {
      안내[이름] = '금액은 0 이상이어야 합니다';
    }
  });

  // V5 — 공제가 지급 총액보다 큼
  if (!안내.기본급 && !안내.수당 && !안내.공제) {
    const 총액 = Number(값.기본급) + Number(값.수당);
    if (Number(값.공제) > 총액) {
      안내.공제 = '공제가 지급 총액보다 큽니다';
    }
  }

  if (Object.keys(안내).length > 0) {
    안내표시(안내);
    return; // 저장하지 않습니다
  }

  // 덮어쓰기 — 같은 직원·같은 월은 한 건뿐
  const 기존 = 상태.급여.find((g) => g.사번 === 값.사번 && g.지급월 === 값.지급월);
  if (기존) {
    기존.기본급 = Number(값.기본급);
    기존.수당 = Number(값.수당);
    기존.공제 = Number(값.공제);
    기존.실지급액 = 실지급액(기존);
  } else {
    const 새건 = {
      급여번호: 새급여번호(값.지급월),
      사번: 값.사번,
      지급월: 값.지급월,
      기본급: Number(값.기본급),
      수당: Number(값.수당),
      공제: Number(값.공제),
    };
    새건.실지급액 = 실지급액(새건);
    상태.급여.push(새건);
  }

  명세대상 = 값.사번;
  저장하기();
  그리기();
}

/* 새 급여번호 — PY-지급월-순번 */
function 새급여번호(월) {
  const 같은달 = 상태.급여.filter((g) => g.지급월 === 월);
  const 쓰인번호 = 같은달
    .map((g) => Number(String(g.급여번호).split('-').pop()))
    .filter((n) => !Number.isNaN(n));
  const 다음 = (쓰인번호.length ? Math.max(...쓰인번호) : 0) + 1;
  return `PY-${월}-${String(다음).padStart(3, '0')}`;
}

/* 가상 명세 — 지급 / 공제 / 실지급액 3단 */
function 명세그리기(사번) {
  const 건들 = 상태.급여.filter((g) => g.사번 === 사번);
  if (건들.length === 0) {
    return `<div class="명세"><p class="설명" style="margin:0">${안전(이름찾기(사번))}의 급여 기록이 없습니다.</p></div>`;
  }
  return 건들.map((g) => `
    <div class="명세">
      <div class="명세단">
        <h4>${안전(이름찾기(g.사번))} · ${안전(g.지급월)}</h4>
        <p class="설명" style="margin:0">${안전(g.급여번호)}</p>
      </div>
      <div class="명세단">
        <h4>지급</h4>
        <div class="명세줄"><span>기본급</span><span>${금액(g.기본급)}</span></div>
        <div class="명세줄"><span>가상 수당</span><span>${금액(g.수당)}</span></div>
        <div class="명세줄"><span class="강조">지급 총액</span><span class="강조">${금액(지급총액(g))}</span></div>
      </div>
      <div class="명세단">
        <h4>공제</h4>
        <div class="명세줄"><span>가상 공제</span><span>${금액(g.공제)}</span></div>
      </div>
      <div class="명세합" tabindex="0" data-tip="지급 총액(기본급 + 수당)에서 공제를 뺀 값입니다."><span>실지급액</span><span>${금액(실지급액(g))}</span></div>
    </div>`).join('');
}

/* ── 8. 초기화 확인 창 ─────────────────────────────────── */

function 확인창열기() {
  const 덮개 = document.getElementById('확인덮개');
  덮개.hidden = false;
  document.getElementById('확인취소').focus(); // 기본은 취소
}

function 확인창닫기() {
  document.getElementById('확인덮개').hidden = true;
  document.getElementById('초기화버튼').focus();
}

/* ── 9. 툴팁 ───────────────────────────────────────────────
   화면의 요소에 data-tip="설명" 만 붙이면 됩니다.
   · 마우스를 올리거나(mouseover) 키보드로 초점이 가면(focusin) #툴팁 상자에 글을 넣고 요소 아래에 띄웁니다.
   · 아래 공간이 모자라면 위로 뒤집고, 좌우는 화면 가장자리에서 잘리지 않게 자리를 조정합니다.
   · 설명 보기 모드(도움말모드)가 켜져 있으면 클릭(터치)해도 동작 대신 툴팁만 보입니다. */

const 툴팁상자 = () => document.getElementById('툴팁');
let 툴팁대상 = null;

function 툴팁보이기(요소) {
  const 글 = 요소.getAttribute('data-tip');
  if (!글) return;
  const 상자 = 툴팁상자();
  툴팁대상 = 요소;
  상자.textContent = 글;
  상자.hidden = false;
  요소.setAttribute('aria-describedby', '툴팁');

  // 위치 계산 — 기본은 요소 바로 아래 가운데
  const 여백 = 8;
  const r = 요소.getBoundingClientRect();
  const w = 상자.offsetWidth;
  const h = 상자.offsetHeight;
  const 화면폭 = document.documentElement.clientWidth;
  const 화면높이 = window.innerHeight;

  let left = r.left + r.width / 2 - w / 2;
  left = Math.max(여백, Math.min(left, 화면폭 - w - 여백)); // 좌우 잘림 방지

  let top = r.bottom + 여백;
  let 위쪽 = false;
  if (top + h > 화면높이 - 여백 && r.top - h - 여백 >= 여백) { // 아래가 모자라면 위로
    top = r.top - h - 여백;
    위쪽 = true;
  }
  상자.style.left = `${Math.round(left + window.scrollX)}px`;
  상자.style.top = `${Math.round(top + window.scrollY)}px`;
  상자.classList.toggle('툴팁-위', 위쪽);
}

function 툴팁숨기기() {
  const 상자 = 툴팁상자();
  상자.hidden = true;
  if (툴팁대상) 툴팁대상.removeAttribute('aria-describedby');
  툴팁대상 = null;
}

function 툴팁연결() {
  // 마우스 — 요소에 들어오면 보이고 나가면 숨김 (이벤트 위임: 다시 그린 요소에도 자동 적용)
  document.addEventListener('mouseover', (ev) => {
    const 요소 = ev.target.closest('[data-tip]');
    if (요소 && 요소 !== 툴팁대상) 툴팁보이기(요소);
  });
  document.addEventListener('mouseout', (ev) => {
    const 요소 = ev.target.closest('[data-tip]');
    // 지금 툴팁을 띄운 바로 그 요소에서 나갈 때만 숨김 (초점 이동으로 화면이 스크롤돼 생기는 mouseout 은 무시)
    if (요소 && 요소 === 툴팁대상 && !요소.contains(ev.relatedTarget)) 툴팁숨기기();
  });
  // 키보드 — Tab 으로 초점이 가면 보이고, 초점이 떠나거나 Esc 를 누르면 숨김
  document.addEventListener('focusin', (ev) => {
    const 요소 = ev.target.closest('[data-tip]');
    if (요소) 툴팁보이기(요소);
  });
  document.addEventListener('focusout', (ev) => {
    const 요소 = ev.target.closest('[data-tip]');
    if (요소 && 요소 === 툴팁대상) 툴팁숨기기();
  });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') 툴팁숨기기(); });
  // 스크롤·크기 변경 시에는 자리를 다시 계산 (Tab 이동으로 화면이 스크롤돼도 툴팁이 사라지지 않게)
  const 다시놓기 = () => { if (툴팁대상 && document.contains(툴팁대상)) 툴팁보이기(툴팁대상); else 툴팁숨기기(); };
  window.addEventListener('scroll', () => requestAnimationFrame(다시놓기), { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(다시놓기));

  // 설명 보기 모드 — 켜져 있으면 클릭을 가로채 툴팁만 보이고 동작은 막음 (터치 기기용)
  document.addEventListener('click', (ev) => {
    if (!도움말모드) return;
    const 요소 = ev.target.closest('[data-tip]');
    if (!요소 || 요소.id === '도움말모드') return;
    ev.preventDefault();
    ev.stopPropagation();
    툴팁보이기(요소); // 누른 요소의 설명만 보여 주고 원래 동작은 막음 (빈 곳을 누르면 닫힘)
  }, true);
  // 모드가 켜진 상태에서 빈 곳을 누르면 툴팁을 닫음
  document.addEventListener('click', (ev) => {
    if (도움말모드 && !ev.target.closest('[data-tip]')) 툴팁숨기기();
  });

  const 모드버튼 = document.getElementById('도움말모드');
  모드버튼.addEventListener('click', () => {
    도움말모드 = !도움말모드;
    모드버튼.setAttribute('aria-pressed', String(도움말모드));
    모드버튼.classList.toggle('버튼-켜짐', 도움말모드);
    document.body.classList.toggle('도움말모드', 도움말모드);
    툴팁숨기기();
  });
}

/* ── 10. 소개 패널 · 따라해보기 가이드 ─────────────────────
   소개 패널은 첫 방문 시 펼쳐져 있고, 접으면 그 상태를 localStorage(소개저장키)에 기억합니다.
   가이드는 시나리오 4개를 그리는데, 대상(어느 신청번호·어느 비품)은 현재 `상태` 에서 찾아 넣습니다.
   "이 위치 보기"를 누르면 탭을 바꾸고 해당 요소로 스크롤한 뒤 2초간 강조합니다. */

function 패널접기연결(토글id, 내용id, 저장키이름) {
  const 토글 = document.getElementById(토글id);
  const 내용 = document.getElementById(내용id);
  const 적용 = (펼침) => {
    내용.hidden = !펼침;
    토글.textContent = 펼침 ? '접기' : '펼치기';
    토글.setAttribute('aria-expanded', String(펼침));
  };
  let 펼침 = true;
  if (저장키이름) {
    try { 펼침 = localStorage.getItem(저장키이름) !== '접힘'; } catch (e) { /* 저장소를 못 쓰면 항상 펼침 */ }
  }
  적용(펼침);
  토글.addEventListener('click', () => {
    펼침 = 내용.hidden; // 지금 숨겨져 있으면 펼침
    적용(펼침);
    if (저장키이름) {
      try { localStorage.setItem(저장키이름, 펼침 ? '펼침' : '접힘'); } catch (e) { /* 무시 */ }
    }
  });
}

/* 현재 자료에서 시나리오별 대상을 찾습니다 — 자료가 바뀌면(승인·초기화 등) 결과도 바뀝니다 */
function 가이드대상찾기() {
  const 대기 = 상태.휴가.filter((r) => r.상태 === '대기');
  const 승인가능 = 대기.find((r) => Number(r.사용일수) <= 남은연차(r.사번));
  const 초과 = 대기.find((r) => Number(r.사용일수) > 남은연차(r.사번));
  const 급여대상 = 상태.급여.find((g) => g.사번 === (상태.직원[0] && 상태.직원[0].사번)) || 상태.급여[0];
  const 미배정 = 상태.비품.find((x) => !x.배정사번);
  const 배정됨 = 상태.비품.find((x) => x.배정사번);
  return { 승인가능, 초과, 급여대상, 미배정, 배정됨 };
}

/* 시나리오 4개를 HTML 로 만들어 #가이드목록 에 넣습니다 */
function 가이드그리기() {
  const 목록 = document.getElementById('가이드목록');
  if (!목록 || !상태) return;
  const t = 가이드대상찾기();
  const 열림 = [...목록.querySelectorAll('details')].map((d) => d.open); // 다시 그려도 펼친 상태 유지

  const 단계 = (글, 화면, 선택자, 라벨 = '이 위치 보기') =>
    `<li>${글}${선택자 ? ` <button type="button" class="버튼 버튼-보조 작은버튼 위치버튼" data-가이드화면="${안전(화면)}" data-가이드선택자="${안전(선택자)}" data-tip="${안전(화면)} 탭으로 이동해 이 단계의 자리를 잠깐 강조합니다.">${라벨}</button>` : ''}</li>`;

  const 시나리오 = [];

  // ① 대기 휴가 승인 → 남은 연차 감소
  if (t.승인가능) {
    const r = t.승인가능; const 잔여 = 남은연차(r.사번);
    시나리오.push({
      제목: '① 대기 휴가 승인 → 남은 연차가 줄어든다',
      요약: `현재 대상: ${r.신청번호} (${이름찾기(r.사번)}, ${r.사용일수}일 · 남은 연차 ${잔여}일)`,
      단계: [
        단계(`휴가 탭에서 <strong>${안전(r.신청번호)}</strong> 줄을 찾습니다. 상태 배지가 <em>대기</em>입니다.`, '휴가', `[data-휴가행="${r.신청번호}"]`),
        단계(`그 줄의 <strong>승인</strong>을 누릅니다. 상태가 승인으로 바뀌고 처리일이 오늘로 찍힙니다.`, '휴가', `[data-승인="${r.신청번호}"]`, '승인 버튼 보기'),
        단계(`같은 줄의 <strong>남은 연차</strong>가 ${잔여}일 → ${잔여 - Number(r.사용일수)}일로 줄어든 것을 확인합니다.`, '휴가', `[data-휴가행="${r.신청번호}"] td:nth-child(5)`),
        단계(`직원 탭의 ${안전(이름찾기(r.사번))} 줄에서도 같은 값이 보입니다 — 저장된 숫자가 아니라 매번 계산하기 때문입니다.`, '직원', `[data-직원행="${r.사번}"]`),
      ],
    });
  } else {
    시나리오.push({ 제목: '① 대기 휴가 승인 → 남은 연차가 줄어든다', 요약: '지금 자료에는 승인 가능한 대기 건이 없습니다. 휴가 탭에서 새 신청을 등록하거나 가상 데이터 초기화를 누르면 다시 생깁니다.', 단계: [단계('휴가 신청 등록 폼으로 이동', '휴가', '#휴가등록폼')] });
  }

  // ② 잔여 초과 휴가 승인 시 차단
  if (t.초과) {
    const r = t.초과; const 잔여 = 남은연차(r.사번);
    시나리오.push({
      제목: '② 남은 연차보다 많은 휴가는 승인이 막힌다',
      요약: `현재 대상: ${r.신청번호} (${이름찾기(r.사번)}, ${r.사용일수}일 신청 · 남은 연차 ${잔여}일)`,
      단계: [
        단계(`휴가 탭에서 <strong>${안전(r.신청번호)}</strong> 줄을 봅니다. 사용일수 ${r.사용일수}일이 남은 연차 ${잔여}일보다 큽니다.`, '휴가', `[data-휴가행="${r.신청번호}"]`),
        단계(`<strong>승인</strong>을 눌러 봅니다. 상태는 그대로 <em>대기</em>이고 버튼 아래에 "남은 연차 ${잔여}일보다 ${Number(r.사용일수) - 잔여}일 많습니다" 안내가 뜹니다.`, '휴가', `[data-승인="${r.신청번호}"]`, '승인 버튼 보기'),
        단계(`대신 <strong>반려</strong>를 누르면 처리는 되지만 남은 연차는 줄지 않습니다.`, '휴가', `[data-반려="${r.신청번호}"]`, '반려 버튼 보기'),
      ],
    });
  } else {
    시나리오.push({ 제목: '② 남은 연차보다 많은 휴가는 승인이 막힌다', 요약: '지금 자료에는 잔여를 넘는 대기 건이 없습니다. 휴가 등록에서 사용일수를 크게(예: 20) 넣어 등록한 뒤 승인해 보거나, 가상 데이터 초기화를 누르면 LV-2026-002 가 다시 생깁니다.', 단계: [단계('휴가 신청 등록 폼으로 이동', '휴가', '#휴가등록폼'), 단계('가상 데이터 초기화 버튼', '휴가', '#초기화버튼')] });
  }

  // ③ 급여 수당 10만원 증액
  if (t.급여대상) {
    const g = t.급여대상;
    const 새수당 = Number(g.수당) + 100000;
    시나리오.push({
      제목: '③ 수당 10만원 증액 → 개인 지급액과 월 합계가 함께 오른다',
      요약: `현재 대상: ${이름찾기(g.사번)} · ${g.지급월} (수당 ${금액(g.수당)}, 실지급액 ${금액(실지급액(g))})`,
      단계: [
        단계(`급여 탭 <strong>월 합계</strong>에서 ${안전(g.지급월)} 의 실지급액 합계를 기억해 둡니다.`, '급여', `[data-월합계="${g.지급월}"]`),
        단계(`<strong>급여 입력</strong>에서 직원 <strong>${안전(이름찾기(g.사번))}</strong>, 지급월 ${안전(g.지급월)} 을 고릅니다. 기존 금액이 칸에 자동으로 채워집니다.`, '급여', '#급여직원'),
        단계(`<strong>가상 수당</strong>을 ${금액(g.수당)} → ${금액(새수당)} 으로 고치고 <strong>저장</strong>을 누릅니다.`, '급여', '#급여수당', '수당 칸 보기'),
        단계(`월 합계의 수당 합계·실지급액 합계가 각각 10만원 오르고, 목록의 ${안전(이름찾기(g.사번))} 실지급액도 ${금액(실지급액(g) + 100000)} 이 됩니다.`, '급여', `[data-급여행="${g.급여번호}"]`),
      ],
    });
  }

  // ④ 비품 배정 → 직원 상세 → 반납
  if (t.미배정 || t.배정됨) {
    const x = t.미배정 || t.배정됨;
    const 직원 = 상태.직원[0];
    시나리오.push({
      제목: '④ 비품 배정 → 직원 상세에서 확인 → 반납',
      요약: t.미배정
        ? `현재 대상: ${x.비품번호} ${x.이름} (미배정) → ${직원.이름}에게 배정`
        : `현재 미배정 비품이 없습니다. ${x.비품번호} ${x.이름} 을 반납한 뒤 다시 배정해 보세요.`,
      단계: [
        단계(`비품 탭에서 <strong>${안전(x.비품번호)} ${안전(x.이름)}</strong> 줄의 직원 선택칸에서 <strong>${안전(직원.이름)}</strong>을 고르고 <strong>배정</strong>을 누릅니다. 상태가 배정으로 바뀌고 배정일이 오늘로 찍힙니다.`, '비품', `[data-배정="${x.비품번호}"]`, '배정 버튼 보기'),
        단계(`같은 줄에서 다른 직원을 고르고 다시 배정을 눌러 봅니다 — "이미 배정된 비품입니다" 안내가 뜨며 막힙니다.`, '비품', `[data-비품행="${x.비품번호}"]`),
        단계(`직원 탭에서 <strong>${안전(직원.이름)}</strong> 이름을 누르면 상세의 "배정 비품"이 1개로 보이고 표에 ${안전(x.이름)} 이 나타납니다.`, '직원', `[data-직원상세="${직원.사번}"]`, '이름 버튼 보기'),
        단계(`비품 탭으로 돌아와 <strong>반납</strong>을 누르면 미배정으로 돌아가고, 직원 상세의 개수도 0개가 됩니다.`, '비품', `[data-반납="${x.비품번호}"]`, '반납 버튼 보기'),
      ],
    });
  }

  목록.innerHTML = 시나리오.map((s, i) => `
    <details class="가이드" ${열림[i] ? 'open' : ''}>
      <summary><span class="가이드제목">${s.제목}</span><span class="가이드요약">${안전(s.요약)}</span></summary>
      <ol class="가이드단계">${s.단계.join('')}</ol>
    </details>`).join('');

  목록.querySelectorAll('[data-가이드선택자]').forEach((b) =>
    b.addEventListener('click', () => 위치보기(b.dataset.가이드화면, b.dataset.가이드선택자))
  );
}

/* "이 위치 보기" — 탭을 바꾸고, 요소로 스크롤한 뒤 2초간 강조 */
function 위치보기(화면, 선택자) {
  if (도움말모드) return; // 설명 보기 모드에서는 이동하지 않음
  if (현재화면 !== 화면) 탭전환(화면);
  let 요소 = document.querySelector(선택자);
  if (!요소) return;
  // 표 셀이나 버튼이면 줄 전체도 함께 강조해 눈에 잘 띄게
  const 줄 = 요소.closest('tr');
  const 강조들 = [요소, 줄].filter(Boolean);
  요소.scrollIntoView({ behavior: 'smooth', block: 'center' });
  강조들.forEach((el) => el.classList.add('가이드강조'));
  setTimeout(() => 강조들.forEach((el) => el.classList.remove('가이드강조')), 2200);
  if (typeof 요소.focus === 'function' && 요소.matches('button, input, select')) {
    setTimeout(() => 요소.focus({ preventScroll: true }), 400);
  }
}

/* ── 11. 시작 ──────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', async () => {
  // 탭 버튼
  document.querySelectorAll('.탭').forEach((탭) => {
    탭.addEventListener('click', () => 탭전환(탭.dataset.화면));
  });

  // 초기화 버튼과 확인 창
  document.getElementById('초기화버튼').addEventListener('click', 확인창열기);
  document.getElementById('확인취소').addEventListener('click', 확인창닫기);
  document.getElementById('확인실행').addEventListener('click', async () => {
    확인창닫기();
    await 초기화하기();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !document.getElementById('확인덮개').hidden) 확인창닫기();
  });

  // 툴팁 · 소개 패널 · 가이드 패널
  툴팁연결();
  패널접기연결('소개토글', '소개내용', 소개저장키);
  패널접기연결('가이드토글', '가이드내용', null);

  try {
    await 시작하기();
    그리기();
  } catch (오류) {
    본문().innerHTML = `
      <h2 class="화면제목">가상 자료를 불러오지 못했습니다</h2>
      <p class="줄안내">${안전(오류.message)}</p>
      <p class="설명">
        파일을 더블클릭해 열지 말고 웹 서버 주소로 여세요.<br>
        예: <code>python3 -m http.server 8000 --bind 127.0.0.1</code> → <code>http://127.0.0.1:8000/</code>
      </p>`;
  }
});
