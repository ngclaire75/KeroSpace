<script setup lang="ts">
// Splash / loading screen shown before the dashboard is ready.
const loading = ref(true)
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  // 1.5s cycle = one logo swap every 0.75s; hold for 3 swaps (~2.25s)
  timer = setTimeout(() => {
    loading.value = false
  }, 2400)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Transition name="splash-fade">
    <div v-if="loading" class="splash" aria-hidden="true">
      <div class="splash__logo">
        <img src="/images/logo.webp" alt="" />
        <img src="/images/logo2.webp" alt="" />
      </div>
    </div>
  </Transition>

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

.splash__logo img:nth-child(1) {
  animation: splash-a 1.5s ease-in-out infinite;
}
.splash__logo img:nth-child(2) {
  animation: splash-b 1.5s ease-in-out infinite;
}

@keyframes splash-a {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
@keyframes splash-b {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

/* fade the whole splash out when loading finishes */
.splash-fade-leave-active {
  transition: opacity 0.45s ease;
}
.splash-fade-leave-to {
  opacity: 0;
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
