<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed } from 'vue'

const { currentSlideNo, total } = useNav()

// 섹션 정의 (슬라이드 번호 범위 → 섹션 이름)
// 실제 슬라이드 구조에 맞게 조정 필요 (pnpm dev 실행 후 확인)
const sections = [
  { start: 1, end: 1, name: '' },  // 표지
  { start: 2, end: 2, name: '' },  // 목차
  { start: 3, end: 10, name: 'Part 1: Motivation & Research Design' },
  { start: 11, end: 21, name: 'Part 2: Research Method' },  // +3 (평가지표 3개 추가)
  { start: 22, end: 34, name: 'Part 3: Results & Hypothesis Verification' },
  { start: 35, end: 42, name: 'Part 4: Conclusion & Contributions' },
  { start: 43, end: 999, name: 'Appendix' },
]

const currentSection = computed(() => {
  const slideNo = currentSlideNo.value
  const section = sections.find(s => slideNo >= s.start && slideNo <= s.end)
  return section?.name || ''
})

const progress = computed(() => {
  return Math.round((currentSlideNo.value / total.value) * 100)
})
</script>

<template>
  <!-- 첫 슬라이드(표지)에서는 숨김 -->
  <div v-if="currentSlideNo > 1" class="absolute bottom-4 left-6 right-24">
    <!-- 섹션 이름 -->
    <div class="text-xs opacity-50 mb-1">
      {{ currentSection }}
    </div>
    <!-- Progress Bar -->
    <div class="h-0.5 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-blue-500 transition-all duration-300"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>
