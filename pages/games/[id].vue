<script setup lang="ts">
import { games } from '~/data/games'
import { gameStories } from '~/data/gameStories'

const route = useRoute()
const game = computed(() => games.find(item => item.id === route.params.id))
const story = computed(() => gameStories[String(route.params.id)])
if (!game.value || !story.value) throw createError({ statusCode: 404, statusMessage: 'Game story not found' })
const storyRoot = ref<HTMLElement>()
const revealReady = ref(false)
let headingObserver: IntersectionObserver | undefined

function observeHeadings() {
  headingObserver?.disconnect()
  revealReady.value = false
  if (!storyRoot.value || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const headings = storyRoot.value.querySelectorAll<HTMLElement>('[data-heading-reveal]')
  headingObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-revealed')
      headingObserver?.unobserve(entry.target)
    }
  }, { threshold: 0.01, rootMargin: '0px 0px 96px 0px' })
  headings.forEach(heading => {
    heading.classList.remove('is-revealed')
    headingObserver!.observe(heading)
  })
  revealReady.value = true
}
onMounted(observeHeadings)
onBeforeUnmount(() => headingObserver?.disconnect())
watch(() => route.params.id, async () => {
  await nextTick()
  observeHeadings()
})

const articleText = computed(() => story.value.chapters.flatMap(chapter => chapter.paragraphs.map(p => p.text)).join(' '))
const readTime = computed(() => Math.max(1, Math.ceil(articleText.value.split(/\s+/).length / 200)))
const sources = computed(() => {
  const used = new Set(story.value.chapters.flatMap(chapter => chapter.paragraphs.map(p => p.source)))
  return story.value.sources.filter(source => used.has(source[1]))
})
const title = computed(() => `${game.value?.name}: Development, Team & Company | KeroSpace`)
const description = computed(() => `The making of ${game.value?.name}: why development began, the process, the team and the company behind it, including its origins and studio background.`)
const requestUrl = useRequestURL()
const config = useRuntimeConfig()
const origin = new URL(config.public.siteUrl || requestUrl.origin).origin
const canonical = computed(() => new URL(`/games/${game.value?.id}`, origin).href)
useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogType: 'article',
  ogUrl: () => canonical.value,
  twitterCard: 'summary',
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
  robots: 'index, follow, max-image-preview:large',
  articleModifiedTime: () => story.value.updated,
})
useHead(() => ({
  htmlAttrs: { 'data-blog-scroll': 'native' },
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [{ key: 'game-article-schema', type: 'application/ld+json', innerHTML: JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting', '@id': `${canonical.value}#article`,
        headline: `${game.value?.name}: Development, Team and Company`,
        description: description.value, url: canonical.value,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical.value },
        author: { '@type': 'Organization', name: 'KeroSpace', url: `${origin}/` },
        publisher: { '@type': 'Organization', name: 'KeroSpace', url: `${origin}/` },
        dateModified: story.value.updated, inLanguage: 'en', articleSection: 'Game development history',
        about: { '@type': 'VideoGame', name: game.value?.name },
        wordCount: articleText.value.split(/\s+/).length,
        citation: sources.value.map(source => source[1]),
      },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Games', item: `${origin}/#supported-games` },
        { '@type': 'ListItem', position: 3, name: game.value?.name, item: canonical.value },
      ] },
    ],
  }).replace(/</g, '\u003c') }],
}))
</script>

<template>
  <div v-if="game && story" class="game-story-page">
    <a class="skip-link" href="#story-content">Skip to article</a>
    <SiteNav />
    <div class="story-promo">
      <img
        src="/images/teal-chibi-banner-esrgan-2x-1920.webp"
        srcset="/images/teal-chibi-banner-esrgan-2x-640.webp 640w, /images/teal-chibi-banner-esrgan-2x-960.webp 960w, /images/teal-chibi-banner-esrgan-2x-1280.webp 1280w, /images/teal-chibi-banner-esrgan-2x-1920.webp 1920w, /images/teal-chibi-banner-esrgan-2x-2560.webp 2560w, /images/teal-chibi-banner-esrgan-2x-3200.webp 3200w"
        sizes="100vw"
        width="3200"
        height="1066"
        alt="Chibi character with dark teal-streaked hair on a teal and cream blog banner with Korean lettering"
        fetchpriority="high"
        decoding="async"
      >
    </div>
    <main id="story-content" ref="storyRoot" class="story-main" :class="{ 'is-reveal-ready': revealReady }">
      <header class="story-header">
        <div class="story-category" data-heading-reveal><span class="category-rule" aria-hidden="true" />The making of a game</div>
        <h1 data-heading-reveal style="--heading-delay: 80ms">{{ game.name }}</h1>
        <p class="story-deck" data-heading-reveal style="--heading-delay: 160ms">{{ story.headline }}</p>
        <p class="story-description">{{ story.summary }}</p>
        <div class="story-byline"><span>By KeroSpace</span><span>{{ readTime }} min read</span><time :datetime="story.updated">Updated 17 October 2026</time></div>
      </header>

      <div class="reading-layout">
        <article class="story-article" :aria-label="`The making of ${game.name}`">
          <section v-for="chapter in story.chapters" :id="chapter.id" :key="chapter.id" class="story-chapter" :aria-labelledby="`${chapter.id}-title`">
            <div class="chapter-heading" data-heading-reveal>
              <p class="chapter-label">{{ chapter.label }}</p>
              <h2 :id="`${chapter.id}-title`">{{ chapter.title }}</h2>
            </div>
            <div class="chapter-body">
              <div class="chapter-paragraphs">
                <p v-for="paragraph in chapter.paragraphs" :key="paragraph.text" class="chapter-copy">{{ paragraph.text }}</p>
              </div>
            </div>

          </section>
        </article>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.game-story-page { min-height: 100svh; background: #000; }
.story-main { --story-radius: 10px; --story-edge: #302638; --story-gradient: linear-gradient(100deg, #c6a7ff, #e2b3f5 50%, #ffb4d7); --ink: #fff; --ink-2: #fff; --ink-3: #fff; color: #fff; width: calc(100% - 2 * clamp(16px, 4vw, 40px)); max-width: 1240px; margin-inline: auto; padding-top: clamp(44px, 6vw, 80px); padding-bottom: clamp(72px, 9vw, 120px); }
.story-main ::selection { color: #000; background: #e5c4ff; }
.story-promo { width: 100%; aspect-ratio: 3 / 1; overflow: hidden; margin-top: clamp(24px, 3vw, 40px); margin-bottom: clamp(28px, 3vw, 44px); }
.story-promo img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.story-header { max-width: 1060px; margin: 0 0 64px; text-align: left; }
.story-category, .chapter-label { font-size: 13px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; line-height: 1.6; }
.story-category { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; color: #fff; }
.category-rule { width: 32px; height: 3px; background: var(--story-gradient); }
h1 { max-width: 1060px; font-family: var(--display); font-size: clamp(34px, 5.2vw, 70px); font-weight: 800; letter-spacing: -.045em; line-height: 1.2; margin: 0; text-wrap: balance; overflow-wrap: anywhere; }
h1, .story-chapter h2 { color: #d7b7ff; }
@supports (background-clip: text) or (-webkit-background-clip: text) {
  h1, .story-chapter h2 { background: var(--story-gradient); background-clip: text; -webkit-background-clip: text; color: transparent; }
}
.story-deck { max-width: 880px; font-size: clamp(23px, 2.8vw, 34px); font-weight: 800; letter-spacing: -.025em; line-height: 1.45; margin: 24px 0 16px; text-wrap: balance; }
.story-description { max-width: 720px; font-size: 17px; line-height: 1.85; margin: 0; }
.story-byline { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 28px; margin-top: 28px; font-size: 12px; line-height: 1.8; }
.story-byline > span:first-child { font-weight: 800; }
.reading-layout { width: 100%; max-width: 1000px; }
.story-article { min-width: 0; display: grid; gap: 52px; }
.story-chapter { min-width: 0; padding-top: 40px; scroll-margin-top: 28px; }
.chapter-heading { max-width: 860px; margin-bottom: 24px; }
.chapter-label { display: block; width: fit-content; margin: 0 0 16px; padding-bottom: 4px; color: #fff; background: linear-gradient(90deg, #c6a7ff, #ffb4d7) left bottom / 100% 2px no-repeat; }
.story-chapter h2 { font-family: var(--display); font-size: clamp(23px, 2.5vw, 32px); letter-spacing: -.035em; line-height: 1.5; margin: 0; text-wrap: balance; }
.chapter-body, .chapter-paragraphs { min-width: 0; }
.chapter-paragraphs { max-width: 780px; }
.chapter-copy { font-size: 18px; line-height: 1.95; margin: 0; }
.chapter-copy + .chapter-copy { margin-top: 24px; }
.story-main a:hover { text-decoration: underline; text-underline-offset: 4px; }
.story-main :focus-visible { outline: 2px solid #e5c4ff; outline-offset: 5px; }
.skip-link { position: fixed; top: -100px; left: 16px; z-index: 30; background: #e5c4ff; color: #000; border-radius: 8px; padding: 14px; }
.skip-link:focus { top: 16px; }

@media (max-width: 760px) {
  .story-main { padding-top: 36px; }
  .story-header { margin-bottom: 40px; }
  .story-category { font-size: 12px; margin-bottom: 22px; }
  .story-deck { margin-top: 20px; }
  .story-description { font-size: 16px; }
  .story-byline { gap: 8px 18px; font-size: 11px; margin-top: 24px; }
  .story-article { gap: 36px; }
  .story-chapter { padding-top: 28px; }
  .chapter-label { font-size: 12px; margin-bottom: 14px; }
  .chapter-heading { margin-bottom: 20px; }
  .chapter-copy { font-size: 16px; line-height: 1.95; }
}

[data-heading-reveal].is-revealed { transition: opacity 400ms ease-out; transition-delay: var(--heading-delay, 0ms); }
.story-main.is-reveal-ready [data-heading-reveal]:not(.is-revealed) { opacity: 0; transition: none; }
@media (prefers-reduced-motion: reduce) {
  .story-main [data-heading-reveal],
  .story-main.is-reveal-ready [data-heading-reveal]:not(.is-revealed) { opacity: 1; transition: none; }
}
</style>
