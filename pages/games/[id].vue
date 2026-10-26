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
    <!-- same animated poster wall as the homepage and guides pages -->
    <GuideWall />
    <SiteNav />
    <div class="story-promo">
      <img
        src="/images/lavender-chibi-banner-esrgan-2x-1920.webp"
        srcset="/images/lavender-chibi-banner-esrgan-2x-640.webp 640w, /images/lavender-chibi-banner-esrgan-2x-1280.webp 1280w, /images/lavender-chibi-banner-esrgan-2x-1920.webp 1920w, /images/lavender-chibi-banner-esrgan-2x-2560.webp 2560w, /images/lavender-chibi-banner-esrgan-2x-3200.webp 3200w, /images/lavender-chibi-banner-esrgan-2x-4344.webp 4344w"
        sizes="100vw"
        width="4344"
        height="1448"
        alt="Chibi Keqing framed by lavender and cream ribbons in a fantasy landscape"
        fetchpriority="high"
        decoding="async"
      >
    </div>
    <div class="blog-ticker" role="region" aria-label="저희 블로그에 오신 것을 환영합니다!">
      <div class="blog-ticker__track" aria-hidden="true">
        <div v-for="copy in 2" :key="copy" class="blog-ticker__group">
          <div v-for="item in 8" :key="item" class="blog-ticker__item">
            <span lang="ko">저희 블로그에 오신 것을 환영합니다!</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                <path d="M19.9801 15C19.9801 18.9062 14.7132 20 12 20C9.28677 20 4.01994 18.9062 4.01994 15C4.01995 13.5815 3.78875 11.9744 4.90066 10.6602M18.384 10C18.6692 10.2094 18.9048 10.4303 19.0993 10.6602C19.7993 11.0634 19.9781 9.55469 19.9801 9.0625V7.18761C19.9801 5.56261 18.8629 5.00011 17.9053 5.00011C16.9477 5.00011 15.0324 6.5625 14.394 6.5625C13.6279 6.5625 13.4804 6.40636 12 6.40636C10.5197 6.40636 10.3721 6.5625 9.60601 6.5625C8.9676 6.5625 7.05236 5 6.09476 5C5.13715 5 4.01995 5.5625 4.01995 7.1875V9.0625C4.02188 9.55469 4.20072 11.0634 4.90066 10.6602M4.90066 10.6602C5.09519 10.4303 5.33082 10.2094 5.61599 10" />
                <path d="M12.826 16C12.826 16.1726 12.465 16.3125 12.0196 16.3125C11.5742 16.3125 11.2131 16.1726 11.2131 16C11.2131 15.8274 11.5742 15.6875 12.0196 15.6875C12.465 15.6875 12.826 15.8274 12.826 16Z" />
                <path d="M15.5 13.5938C15.5 14.0252 15.2834 14.375 15.0161 14.375C14.7489 14.375 14.5323 14.0252 14.5323 13.5938C14.5323 13.1623 14.7489 12.8125 15.0161 12.8125C15.2834 12.8125 15.5 13.1623 15.5 13.5938Z" />
                <path d="M9.5 13.5938C9.5 14.0252 9.28336 14.375 9.01613 14.375C8.74889 14.375 8.53226 14.0252 8.53226 13.5938C8.53226 13.1623 8.74889 12.8125 9.01613 12.8125C9.28336 12.8125 9.5 13.1623 9.5 13.5938Z" />
                <path d="M22.0004 15.4688C21.5165 15.1562 19.4197 14.375 18.6133 14.375M20.3871 17.9688C19.9033 17.6562 18.7742 16.875 17.9678 16.875M2 15.4688C2.48387 15.1562 4.58065 14.375 5.3871 14.375M3.61279 17.9688C4.09667 17.6562 5.2257 16.875 6.03215 16.875" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <main id="story-content" ref="storyRoot" class="story-main" :class="{ 'is-reveal-ready': revealReady }">
      <header class="story-header">
        <div class="story-category" data-heading-reveal>The making of a game</div>
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
.game-story-page { position: relative; isolation: isolate; min-height: 100svh; background: transparent; }
.story-main { --story-radius: 10px; --story-edge: #302638; --story-gradient: linear-gradient(100deg, #c6a7ff, #e2b3f5 50%, #ffb4d7); --ink: #fff; --ink-2: #fff; --ink-3: #fff; color: #fff; width: calc(100% - 2 * clamp(16px, 4vw, 40px)); max-width: 1240px; margin-inline: auto; padding-top: clamp(26px, 3.6vw, 48px); padding-bottom: clamp(72px, 9vw, 120px); }
.story-main ::selection { color: #000; background: #e5c4ff; }
.story-promo { width: 100%; aspect-ratio: 3.5 / 1; overflow: hidden; margin-top: clamp(24px, 3vw, 40px); }
.story-promo img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.blog-ticker { position: relative; display: flex; align-items: center; min-height: 28px; width: 100%; overflow: hidden; padding: 0; background: linear-gradient(100deg, #d8baff, #f9c3e5); color: #000; margin-bottom: clamp(28px, 3vw, 44px); box-shadow: 0 0 18px #cf9eff66, 0 0 40px #edb4e633, inset 0 1px 0 #ffffff59; }
.blog-ticker__track { display: flex; width: max-content; will-change: transform; animation: blog-ticker-scroll 40s linear infinite; }
.blog-ticker__group { display: flex; align-items: center; justify-content: space-around; flex-shrink: 0; min-width: 100vw; }
.blog-ticker__item { display: flex; align-items: center; flex-shrink: 0; gap: clamp(14px, 1.8vw, 24px); padding-right: clamp(14px, 1.8vw, 24px); white-space: nowrap; }
.blog-ticker__item span { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', 'Noto Sans CJK KR', 'Malgun Gothic', var(--ui); font-size: clamp(12px, 1vw, 14px); font-weight: 800; line-height: 1.4; letter-spacing: .02em; color: #000; text-shadow: none; }
.blog-ticker__item svg { display: block; flex-shrink: 0; width: clamp(18px, 1.4vw, 22px); height: auto; margin-block: -5px; color: #000; filter: none; }
@supports (text-box: trim-both cap alphabetic) {
  .blog-ticker__item span { text-box: trim-both cap alphabetic; }
}
.blog-ticker:hover .blog-ticker__track, .blog-ticker:focus-within .blog-ticker__track { animation-play-state: paused; }
@keyframes blog-ticker-scroll { to { transform: translateX(-50%); } }
.story-header { max-width: 1060px; margin: 0 0 64px; text-align: left; }
.story-category, .chapter-label { font-size: 13px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; line-height: 1.6; }
.story-category { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; color: #fff; }
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

@media (min-width: 1024px) {
  .story-promo { aspect-ratio: 4.8 / 1; margin-top: clamp(16px, 2vw, 28px); }
  .story-promo img { height: auto; aspect-ratio: 4.5 / 1; object-position: center; }
}

@media (max-width: 760px) {
  .story-main { padding-top: 22px; }
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
  .blog-ticker__track { width: 100%; animation: none; }
  .blog-ticker__group { min-width: 0; width: 100%; padding-inline: 16px; }
  .blog-ticker__group + .blog-ticker__group, .blog-ticker__item + .blog-ticker__item { display: none; }
  .blog-ticker__item { flex-shrink: 1; gap: 12px; white-space: normal; text-align: center; }
  .story-main [data-heading-reveal],
  .story-main.is-reveal-ready [data-heading-reveal]:not(.is-revealed) { opacity: 1; transition: none; }
}
</style>
