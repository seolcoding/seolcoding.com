<script setup lang="ts">
import { useNav } from '@slidev/client'

const { currentSlideNo } = useNav()
</script>

<template>
  <!-- 첫 슬라이드(표지)에서는 숨김 -->
  <div
    v-if="currentSlideNo > 1"
    class="absolute top-4 right-6 text-xs opacity-60 max-w-[60%] text-right truncate"
  >
    한국어 공공 도메인을 위한 On-premise RAG 파이프라인 최적화 연구
  </div>
</template>
