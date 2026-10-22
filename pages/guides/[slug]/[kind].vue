<script setup lang="ts">
import { guideGames } from '~/data/guides'
import '~/assets/css/guides.css'

const route = useRoute()
const game = computed(() => guideGames.find(game => game.id === String(route.params.slug)))
if (!game.value) throw createError({ statusCode: 404, statusMessage: 'Game not found', fatal: true })
if (route.params.kind !== 'characters') {
  await navigateTo(`/guides/${game.value.id}#database`, { redirectCode: 301, replace: true })
}
useSeoMeta({
  title: () => `${game.value?.name} characters & best builds | KeroSpace`,
  description: () => `Browse released ${game.value?.name} characters and heroes with artwork, recommended equipment and build priorities.`,
})
</script>

<template>
  <div v-if="game && route.params.kind === 'characters'" class="gd-page gd-page--wall character-roster-page">
    <!-- same animated poster wall as the homepage -->
    <GuideWall />
    <SiteNav />
    <main class="gd-wrap">
      <nav class="gd-crumbs" aria-label="Breadcrumb">
        <NuxtLink to="/guides">Guides</NuxtLink><span aria-hidden="true">/</span>
        <NuxtLink :to="`/guides/${game.id}`">{{ game.short }}</NuxtLink><span aria-hidden="true">/</span>
        <span aria-current="page">Characters &amp; best builds</span>
      </nav>
      <GuideCharacterRoster :key="game.id" :game-id="game.id" heading-level="h1" />
    </main>
    <SiteFooter />
  </div>
</template>
