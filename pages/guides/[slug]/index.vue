<script setup lang="ts">
import { guideGames, guides } from '~/data/guides'

// One URL level serves two kinds of page, so existing guide links keep working:
//   /guides/hsr                    -> released characters and best builds
//   /guides/star-rail-first-steps  -> redirect to the character roster
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const game = computed(() => guideGames.find(item => item.id === slug.value))
const guide = computed(() => guides.find(item => item.slug === slug.value))
if (!game.value && !guide.value) throw createError({ statusCode: 404, statusMessage: 'Guide not found', fatal: true })
if (guide.value) await navigateTo(`/guides/${guide.value.game}#database`, { redirectCode: 301, replace: true })
</script>

<template>
  <GuideGameHub v-if="game" :key="game.id" :game-id="game.id" />
</template>
