<script setup lang="ts">
// Splash / loading screen shown before the dashboard is ready.
const loading = ref(true)
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  // 0.7s cycle, hard-cut swap at 50% (every 0.35s); hold for ~5 swaps
  timer = setTimeout(() => {
    loading.value = false
  }, 1900)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div v-if="loading" class="splash" aria-hidden="true">
    <div class="splash__logo">
      <img src="/images/logo.webp" alt="" />
      <img src="/images/logo2.webp" alt="" />
    </div>
  </div>

  <NuxtPage />
</template>

<style>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: #de1320;
}

.splash__logo {
  position: relative;
  width: 130px;
  height: 130px;
}

@media (max-width: 560px) {
  .splash__logo {
    width: 96px;
    height: 96px;
  }
}

.splash__logo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* hard cut between the two logos — no cross-fade */
.splash__logo img:nth-child(1) {
  animation: splash-a 0.7s step-end infinite;
}
.splash__logo img:nth-child(2) {
  animation: splash-b 0.7s step-end infinite;
}

@keyframes splash-a {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
@keyframes splash-b {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .splash__logo img:nth-child(1) {
    animation: none;
    opacity: 1;
  }
  .splash__logo img:nth-child(2) {
    animation: none;
    opacity: 0;
  }
}
</style>
