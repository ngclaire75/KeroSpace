<script setup lang="ts">
import { guideGames, guides } from '~/data/guides'

const props = defineProps<{ slug: string }>()
const guide = computed(() => guides.find(item => item.slug === props.slug)!)
const game = computed(() => guideGames.find(item => item.id === guide.value.game)!)
const related = computed(() => guides.filter(item => item.game === game.value.id && item.slug !== guide.value.slug))

useSeoMeta({
  title: () => `${guide.value.title} — ${game.value.name} | KeroSpace`,
  description: () => guide.value.description,
  ogTitle: () => guide.value.title,
  ogDescription: () => guide.value.description,
})
</script>

<template>
  <div class="gd-page">
    <SiteNav />
    <main class="gd-wrap">
      <nav class="gd-crumbs" aria-label="Breadcrumb">
        <NuxtLink to="/guides">Guides</NuxtLink><span aria-hidden="true">/</span>
        <NuxtLink :to="`/guides/${game.id}`">{{ game.name }}</NuxtLink><span aria-hidden="true">/</span>
        <span aria-current="page">{{ guide.category }}</span>
      </nav>

      <header class="ga-head">
        <p class="gd-eyebrow">{{ game.name }} · {{ guide.category }}</p>
        <h1 class="gd-h1 ga-head__title">{{ guide.title }}</h1>
        <p class="gd-lede">{{ guide.description }}</p>
        <p class="ga-head__meta">KeroSpace guide · Reviewed <time datetime="2026-10-19">19 October 2026</time></p>
      </header>

      <figure class="ga-art">
        <div class="gd-frame ga-art__frame">
          <AppImage :src="game.image" :alt="`${game.name} artwork`" sizes="(max-width: 1240px) 100vw, 1240px" width="1024" height="576" loading="eager" fetchpriority="high" />
        </div>
        <figcaption>Official {{ game.name }} community artwork · <a :href="game.artSource" target="_blank" rel="noopener noreferrer">Artwork source ↗</a></figcaption>
      </figure>

      <div class="ga-layout">
        <aside class="ga-toc" aria-label="In this guide">
          <p class="gd-eyebrow">In this guide</p>
          <a v-for="(part, index) in guide.sections" :key="part.title" :href="`#step-${index + 1}`">{{ part.title }}</a>
          <a href="#references"><span aria-hidden="true">→</span>Sources & further reading</a>
          <NuxtLink class="ga-toc__back" :to="`/guides/${game.id}`">← All {{ game.short }} guides</NuxtLink>
        </aside>

        <article class="ga-body">
          <div class="ga-takeaway gd-frame">
            <p class="gd-eyebrow">The key idea</p>
            <p>{{ guide.takeaway }}</p>
          </div>

          <section v-for="(part, index) in guide.sections" :id="`step-${index + 1}`" :key="part.title" class="ga-step">

            <div>
              <h2>{{ part.title }}</h2>
              <p>{{ part.text }}</p>
            </div>
          </section>

          <section id="references" class="ga-refs">
            <p class="gd-eyebrow">Check the details</p>
            <h2>Sources & further reading</h2>
            <p>This guide covers the core mechanics. Builds, availability and balance can change between versions, so use the original source and the current in-game text for character-specific decisions.</p>
            <a v-for="item in guide.sources" :key="item.url" class="gd-card neon-hover-outline ga-ref" :href="item.url" target="_blank" rel="noopener noreferrer">
              <span><b>{{ item.label }}</b><small>Read the original source</small></span><span class="gd-go" aria-hidden="true">↗</span>
            </a>
            <NuxtLink class="gd-card neon-hover-outline ga-ref" :to="`/guides/${game.id}#database`">
              <span><b>{{ game.short }} game database</b><small>Characters, gear, bosses and events</small></span><span class="gd-go" aria-hidden="true">↗</span>
            </NuxtLink>
          </section>
        </article>
      </div>

      <section v-if="related.length" class="gd-section" aria-labelledby="related-title">
        <div class="gd-section-head">
          <div>
            <p class="gd-eyebrow">Keep learning</p>
            <h2 id="related-title" class="gd-h2">Next up in <em class="gd-em">{{ game.short }}.</em></h2>
          </div>
        </div>
        <ul class="ga-related">
          <li v-for="item in related" :key="item.slug">
            <NuxtLink :to="`/guides/${item.slug}`" class="gd-card neon-hover-outline ga-related__card">
              <span class="gd-tag">{{ item.category }}</span>
              <span class="ga-related__title">{{ item.title }}</span>
              <span class="ga-related__desc">{{ item.description }}</span>
              <span class="ga-related__foot"><span>Read guide</span><span class="gd-go" aria-hidden="true">↗</span></span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<style src="../assets/css/guides.css"></style>

<style scoped>
.ga-head {
  max-width: 920px;
  padding-top: clamp(28px, 4vw, 48px);
}
.ga-head__title {
  font-size: clamp(28px, 4vw, 52px);
  line-height: 1.2;
}
.ga-head__meta {
  margin: 18px 0 0;
  color: var(--ink-3);
  font-size: 12px;
  font-weight: 700;
}

.ga-art {
  margin: clamp(32px, 4vw, 48px) 0 0;
}
.ga-art__frame {
  aspect-ratio: 21 / 9;
  overflow: hidden;
  background: var(--gd-panel-2);
}
.ga-art__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ga-art figcaption {
  margin-top: 12px;
  color: var(--ink-3);
  font-size: 11px;
  line-height: 1.7;
}
.ga-art figcaption a {
  color: #ff4d5e;
}

.ga-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 760px);
  justify-content: start;
  gap: clamp(32px, 5vw, 64px);
  margin-top: clamp(40px, 5vw, 60px);
}
.ga-toc {
  position: sticky;
  top: 28px;
  align-self: start;
  display: flex;
  flex-direction: column;
}
.ga-toc > a {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-top: 2px solid var(--gd-line);
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  transition: color 0.2s;
}
.ga-toc > a span {
  flex-shrink: 0;
  width: 22px;
  color: var(--gd-pink);
  font-family: var(--display);
  font-size: 11px;
}
.ga-toc .ga-toc__back {
  margin-top: 18px;
  color: #ff4d5e;
}

.ga-takeaway {
  padding: 24px 26px;
  background:
    radial-gradient(120% 120% at 0% 0%, rgba(255, 77, 94, 0.12), transparent 60%),
    var(--gd-panel);
}
.ga-takeaway .gd-eyebrow {
  margin-bottom: 10px;
}
.ga-takeaway > p:last-child {
  margin: 0;
  font-size: clamp(17px, 1.8vw, 20px);
  font-weight: 800;
  line-height: 1.55;
}

.ga-step {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  margin-top: 40px;
  scroll-margin-top: 28px;
}
.ga-body h2 {
  margin: 0 0 12px;
  font: 800 clamp(20px, 2.2vw, 26px) / 1.4 var(--ui);
}
.ga-step p {
  margin: 0;
  color: var(--ink-2);
  font-size: 17px;
  line-height: 1.9;
}

.ga-refs {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 2px solid var(--gd-line);
  scroll-margin-top: 28px;
}
.ga-refs > p:not(.gd-eyebrow) {
  margin: 0 0 18px;
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.8;
}
.ga-ref {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
  padding: 18px 20px;
}
.ga-ref > span:first-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}
.ga-ref b {
  font-size: 14px;
}
.ga-ref small {
  color: var(--ink-2);
  font-size: 12px;
}

.ga-related {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.ga-related > li {
  min-width: 0;
}
.ga-related__card {
  gap: 12px;
  height: 100%;
  padding: 22px;
}
.ga-related__title {
  font-size: 18px;
  font-weight: 800;
  line-height: 1.4;
}
.ga-related__desc {
  flex: 1;
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.65;
}
.ga-related__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 2px solid var(--gd-line);
  color: var(--ink-2);
  font-size: 12px;
  font-weight: 800;
}

@media (hover: hover) {
  .ga-toc > a:hover {
    color: #fff;
  }
}

@media (max-width: 860px) {
  .ga-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  .ga-toc {
    position: static;
    padding-bottom: 8px;
  }
  .ga-art__frame {
    aspect-ratio: 16 / 9;
  }
}

@media (max-width: 560px) {
  .ga-step {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
  .ga-step p {
    font-size: 16px;
  }
  .ga-related {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
