<script setup lang="ts">
useHead({ title: 'Community — KeroSpace' })
</script>

<template>
  <div class="blank-page">
    <SiteNav />
    <main class="blank-page__content" aria-label="Community" />
    <SiteFooter />
  </div>
</template>

<style scoped>
.blank-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.blank-page__content {
  flex: 1;
  min-height: 60vh;
}
</style>
