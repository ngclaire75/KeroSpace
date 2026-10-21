<script setup lang="ts">
useHead({ title: 'KeroSpace — Explore Every Game Item' })
</script>

<template>
  <div class="home">
    <!-- same animated poster wall as the guides pages; the hero keeps its own art on top -->
    <GuideWall />
    <main class="page">
      <HeroSection />
      <GamesSection />
      <StreamerSpotlightSection />
      <PlayTogetherSection />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.home {
  position: relative;
  isolation: isolate;
}
.home .page {
  background: transparent;
}
</style>
