#!/usr/bin/env python3
"""
모든 슬라이드를 통일된 구조로 변환하는 스크립트
헤더 / 본문 / 푸터 구조 적용
"""

import re

def wrap_slide_content(html_content):
    """슬라이드 내용을 통일된 구조로 감싸기"""

    # 이미 변환된 슬라이드는 건너뛰기
    if 'slide-container' in html_content:
        return html_content

    # section 태그를 찾아서 처리
    def process_section(match):
        section_attrs = match.group(1)  # data-background-color 등
        section_content = match.group(2)

        # aside notes 분리
        notes_match = re.search(r'(<aside class="notes">.*?</aside>)', section_content, re.DOTALL)
        notes = notes_match.group(1) if notes_match else ''
        content_without_notes = re.sub(r'<aside class="notes">.*?</aside>', '', section_content, flags=re.DOTALL).strip()

        # 타이틀 슬라이드나 Part 구분 슬라이드는 그대로 유지 (center: true 사용)
        if 'data-background-color' in section_attrs and ('<h1>' in content_without_notes or 'Part' in content_without_notes):
            return match.group(0)

        # h2 태그 찾기 (헤더로 사용)
        h2_match = re.search(r'<h2[^>]*>(.*?)</h2>', content_without_notes, re.DOTALL)
        if not h2_match:
            # h2가 없으면 그대로 반환
            return match.group(0)

        header_text = h2_match.group(1)
        body_content = re.sub(r'<h2[^>]*>.*?</h2>', '', content_without_notes, count=1, flags=re.DOTALL).strip()

        # 새로운 구조로 재구성
        new_section = f'''<section{section_attrs}>
        <div class="slide-container">
          <div class="slide-header">
            <h2>{header_text}</h2>
          </div>
          <div class="slide-body">
            {body_content}
          </div>
          <div class="slide-footer"></div>
        </div>
        {notes}
      </section>'''

        return new_section

    # 모든 section 태그 처리
    pattern = r'<section([^>]*)>(.*?)</section>'
    result = re.sub(pattern, process_section, html_content, flags=re.DOTALL)

    return result


def main():
    input_file = '/Users/sdh/SynologyDrive/Vaults/MainVault/50_publish/52_presentations/시강용_강의안_v2.html'
    output_file = '/Users/sdh/SynologyDrive/Vaults/MainVault/50_publish/52_presentations/시강용_강의안_v3.html'

    # 파일 읽기
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 슬라이드 변환
    converted = wrap_slide_content(content)

    # 파일 쓰기
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(converted)

    print(f'✅ 변환 완료: {output_file}')
    print(f'📊 변환된 슬라이드 수: {content.count("<section")}개')


if __name__ == '__main__':
    main()
