<script setup lang="ts">
import { platformMarks, type GamePlatform } from '~/data/platforms'

defineProps<{ platform: GamePlatform }>()
</script>

<template>
  <span class="platform-mark" :title="platformMarks[platform].name" :aria-label="platformMarks[platform].name">
    <span class="platform-mark__icon" aria-hidden="true" :style="{ '--platform-image': `url('/images/platforms/${platformMarks[platform].asset}')` }" />
    <span class="platform-mark__label" aria-hidden="true">{{ platformMarks[platform].label }}</span>
  </span>
</template>

<style scoped>
.platform-mark { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; }
.platform-mark__icon {
  display: block;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #ff183b 5%, #ff183b 55%, #dcdce0 95%);
  -webkit-mask-image: var(--platform-image);
  mask-image: var(--platform-image);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
.platform-mark__label { color: #dedee0; font-size: 10px; font-weight: 800; line-height: 1.4; white-space: nowrap; }
</style>
