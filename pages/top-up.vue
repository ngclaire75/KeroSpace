<script setup lang="ts">
useHead({ title: 'Top Up — KeroSpace' })
</script>

<template>
  <div class="blank-page">
    <SiteNav />
    <main class="blank-page__content" aria-label="Top Up" />
    <SiteFooter />
  </div>
</template>

<style scoped>
.blank-page {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
.blank-page__content {
  flex: 1;
  min-height: 60svh;
}
</style>
