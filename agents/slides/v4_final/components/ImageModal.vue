<template>
  <div class="image-modal-wrapper">
    <!-- 썸네일 이미지 (클릭 가능) -->
    <div class="thumbnail-container" @click="isOpen = true">
      <img
        :src="src"
        :alt="alt"
        class="image-thumbnail"
      />
      <div class="click-hint">클릭하여 확대</div>
    </div>

    <!-- 모달 오버레이 -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isOpen"
          class="modal-backdrop"
          @click="isOpen = false"
          @keydown.esc="isOpen = false"
        >
          <!-- 모달 콘텐츠 -->
          <div class="modal-content" @click.stop>
            <button class="close-btn" @click="isOpen = false">&times;</button>
            <img
              :src="src"
              :alt="alt"
              class="modal-image"
            />
            <p v-if="caption" class="modal-caption">{{ caption }}</p>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  alt?: string
  caption?: string
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Image',
  caption: '',
  width: '100%',
})

const isOpen = ref(false)

// ESC 키로 닫기
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.image-modal-wrapper {
  display: inline-block;
}

.thumbnail-container {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.image-thumbnail {
  max-width: v-bind(width);
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail-container:hover .image-thumbnail {
  opacity: 0.9;
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.click-hint {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.thumbnail-container:hover .click-hint {
  opacity: 1;
}

/* 모달 배경 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* 모달 콘텐츠 */
.modal-content {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 모달 이미지 (원본 비율 유지) */
.modal-image {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* 캡션 */
.modal-caption {
  margin-top: 16px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  max-width: 80%;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 닫기 버튼 */
.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* 페이드 인/아웃 트랜지션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
