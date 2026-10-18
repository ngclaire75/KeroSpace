<script setup lang="ts">
import { communityVideoGames } from '~/data/communityVideos'
import { prepareImage } from '~/utils/responsiveImages'
const imageSection = ref<HTMLElement>()
const videoSizes = '(max-width: 760px) 100vw, 420px'

const active = ref(0)
const page = ref(0)
const playing = ref<string | null>(null)
const game = computed(() => communityVideoGames[active.value]!)
const pageCount = computed(() => Math.ceil(game.value.videos.length / 3))
const visibleVideos = computed(() => game.value.videos.slice(page.value * 3, page.value * 3 + 3))
const tabs = ref<HTMLButtonElement[]>([])
const gameLabels: Record<string, string> = {
  hsr: 'Star Rail', genshin: 'Genshin', hi3: 'Honkai Impact',
  wuwa: 'Wuthering Waves', nte: 'NTE', mlbb: 'Mobile Legends',
}
const categoryLabels = { guide: 'Character guide', gameplay: 'Gameplay', trailer: 'Character trailer' }
const thumbnail = (id: string) => `/images/community/youtube/${id}.jpg`
function prepare(index: number, slide = 0) {
  return Promise.all(communityVideoGames[index]!.videos.slice(slide * 3, slide * 3 + 3)
    .map(video => prepareImage(thumbnail(video.id), videoSizes)))
}
useImageWarmup(imageSection, () => { void prepare(0); void prepare(0, 1) })

let selection = 0
async function select(index: number) {
  const request = ++selection
  playing.value = null
  await prepare(index)
  if (request === selection) {
    active.value = index
    page.value = 0
    void prepare(index, 1)
  }
}
async function selectSlide(index: number) {
  const request = ++selection
  const gameIndex = active.value
  playing.value = null
  await prepare(gameIndex, index)
  if (request !== selection) return
  page.value = index
  void prepare(gameIndex, (index + 1) % pageCount.value)
}
function navigate(event: KeyboardEvent, index: number) {
  let next = index
  if (event.key === 'ArrowRight') next = (index + 1) % communityVideoGames.length
  else if (event.key === 'ArrowLeft') next = (index + communityVideoGames.length - 1) % communityVideoGames.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = communityVideoGames.length - 1
  else return
  event.preventDefault()
  void select(next)
  tabs.value[next]?.focus()
}
</script>

<template>
  <section ref="imageSection" id="community-youtube" class="video-library" aria-labelledby="videos-title">
    <header class="video-library__heading">
      <div>
        <p class="video-library__eyebrow"><svg viewBox="0 0 28 20" width="23" height="17" aria-hidden="true"><defs><linearGradient id="community-youtube-brand-gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b26bff" /><stop offset="1" stop-color="#ff9bd9" /></linearGradient></defs><rect width="28" height="20" rx="5" fill="url(#community-youtube-brand-gradient)" /><path d="m11 5 9 5-9 5z" fill="#fff" /></svg> On YouTube</p>
        <h2 id="videos-title">Watch them play.<br /><em>Find your next main.</em></h2>
      </div>
      <p class="video-library__intro">Character guides, gameplay and official trailers. Pick a game and see its characters in action.</p>
    </header>

    <div class="video-tabs" role="tablist" aria-label="Choose a game's YouTube videos">
      <button v-for="(entry, index) in communityVideoGames" :id="`video-tab-${entry.id}`" :key="entry.id" ref="tabs"
        type="button" role="tab" :aria-selected="active === index" :tabindex="active === index ? 0 : -1"
        :aria-label="entry.name" aria-controls="video-library-panel" @click="select(index)" @keydown="navigate($event, index)" @pointerenter="prepare(index)" @focus="prepare(index)">
        <span>{{ gameLabels[entry.id] || entry.name }}</span>
      </button>
    </div>

    <div id="video-library-panel" class="video-grid" role="tabpanel" :aria-labelledby="`video-tab-${game.id}`">
      <article v-for="video in visibleVideos" :key="video.id" class="video-card" :aria-labelledby="`video-title-${video.id}`">
        <div class="video-card__inner">
          <header class="video-card__category"><span>{{ categoryLabels[video.category] }}</span></header>
          <div class="video-card__media">
            <iframe v-if="playing === video.id" :src="`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`"
              :title="`${video.title} — ${video.creator}`" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />
            <button v-else class="video-card__preview" type="button" :aria-label="`Play ${video.title} by ${video.creator}`" @click="playing = video.id">
              <AppImage :src="thumbnail(video.id)" :sizes="videoSizes" alt="" width="1280" height="720" decoding="async" />
              <span class="video-card__play" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24"><path d="m9 5 11 7-11 7z" fill="currentColor" /></svg></span>
              <span class="video-card__preview-label" aria-hidden="true">Play video</span>
            </button>
          </div>
          <div class="video-card__body">
            <p class="video-card__context">{{ video.context }}</p>
            <h3 :id="`video-title-${video.id}`">{{ video.title }}</h3>
            <p class="video-card__description">{{ video.description }}</p>
            <footer class="video-card__footer">
              <a class="video-card__creator" :href="video.channel" target="_blank" rel="noopener noreferrer" :aria-label="`${video.creator}'s YouTube channel (opens in a new tab)`">{{ video.creator }}</a>
              <a class="video-card__watch" :href="`https://www.youtube.com/watch?v=${video.id}`" target="_blank" rel="noopener noreferrer"
                :aria-label="`Watch ${video.title} on YouTube (opens in a new tab)`">YouTube <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg></a>
            </footer>
          </div>
        </div>
      </article>
    </div>
    <nav class="video-pagination" :aria-label="`${game.name} video slides`">
      <button v-for="slide in pageCount" :key="slide" type="button" :aria-current="page === slide - 1 ? 'page' : undefined"
        :aria-label="`Show slide ${slide} of ${pageCount} for ${game.name}`" aria-controls="video-library-panel" @click="selectSlide(slide - 1)"><span aria-hidden="true" /></button>
    </nav>
    <p class="video-library__status" role="status">Slide {{ page + 1 }} of {{ pageCount }} for {{ game.name }}</p>
  </section>
</template>

<style scoped>
.video-library { --video-pink: #ffb3df; --video-purple: #d8b4ff; width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px)); margin: 0 auto; padding-bottom: clamp(88px, 10vw, 144px); scroll-margin-top: 32px; }
.video-library__heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; margin-bottom: 32px; }
.video-library__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.video-library h2 { margin: 0; font: 900 clamp(28px, 3.5vw, 46px)/1.16 var(--display); text-transform: uppercase; letter-spacing: -.025em; }
.video-library h2 em { font-style: normal; background: linear-gradient(100deg, #ff9bd9, #ff3859 50%, #bd91ff); background-clip: text; -webkit-text-fill-color: transparent; }
.video-library__intro { max-width: 310px; margin: 0 0 3px; color: #c1b9c9; font-size: 16px; line-height: 1.75; }
.video-tabs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 5px; margin-bottom: 20px; }
.video-tabs button { position: relative; display: grid; place-items: center; min-width: 0; min-height: 44px; padding: 10px 5px; border: 0; border-bottom: 2px solid #79438e; background: #000; color: #fff; cursor: pointer; transition: background .2s ease; }
.video-tabs button::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #ff183b, #ff54bb, #b26bff); opacity: 0; transition: opacity .2s ease; }
.video-tabs button[aria-selected="true"] { background: #160e1a; }
.video-tabs button[aria-selected="true"]::after { opacity: 1; }
.video-tabs span { display: block; font: 900 12px/1.4 var(--display); text-transform: uppercase; white-space: normal; }
.video-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.video-card { min-width: 0; padding: 2px; background: conic-gradient(from var(--card-outline-angle), var(--video-pink), var(--video-purple), var(--video-pink)); animation: card-outline-turn 3s linear infinite; }
.video-card__inner { display: flex; flex-direction: column; height: 100%; min-width: 0; background: #000; }
.video-card__category { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 14px 18px; color: var(--video-pink); font: 800 10px/1.4 var(--display); text-transform: uppercase; letter-spacing: .04em; }
.video-card__media { position: relative; width: 100%; aspect-ratio: 16 / 9; flex-shrink: 0; overflow: hidden; background: #100b13; }
.video-card__media iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.video-card__preview { position: absolute; inset: 0; display: block; width: 100%; height: 100%; padding: 0; border: 0; overflow: hidden; background: #100b13; cursor: pointer; }
.video-card__preview img { width: 100%; height: 100%; object-fit: cover; }
.video-card__preview::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, #000a); pointer-events: none; }
.video-card__play { position: absolute; z-index: 1; left: 50%; top: 50%; display: grid; place-items: center; width: 54px; height: 40px; margin: -20px 0 0 -27px; border: 0; border-radius: 10px; background: linear-gradient(120deg, #b26bff, #ff9bd9); color: #fff; }
.video-card__preview-label { position: absolute; z-index: 1; left: 18px; bottom: 12px; color: #fff; font-size: 11px; font-weight: 800; }
.video-card__body { display: flex; flex: 1; flex-direction: column; min-width: 0; padding: 18px 18px 8px; }
.video-card__context { margin: 0 0 10px; color: #d8baff; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; }
.video-card h3 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; min-height: 2.7em; overflow: hidden; margin: 0; color: #fff; font: 800 16px/1.35 var(--display); }
.video-card__description { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; min-height: 3.4em; overflow: hidden; margin: 12px 0 18px; color: #cbbfd3; font-size: 13px; line-height: 1.7; }
.video-card__footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: auto; border-top: 1px solid #332337; }
.video-card__creator { display: flex; align-items: center; min-width: 0; min-height: 44px; overflow: hidden; color: #e9dfee; font-size: 11px; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; }
.video-card__watch { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; flex-shrink: 0; color: var(--video-pink); font-size: 11px; font-weight: 800; }
.video-pagination { display: flex; justify-content: center; gap: 6px; margin-top: 18px; }
.video-pagination button { display: grid; place-items: center; width: 48px; height: 36px; padding: 0; border: 0; background: transparent; cursor: pointer; }
.video-pagination button span { display: block; width: 38px; height: 3px; border-radius: 2px; background: #77717c; }
.video-pagination button[aria-current] span { background: linear-gradient(90deg, var(--video-pink), var(--video-purple)); }
.video-library__status { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.video-library :is(a, button):focus-visible { outline: 2px solid var(--video-purple); outline-offset: 3px; }
.video-card__preview:focus-visible { outline-offset: -3px; }
@media (hover: hover) { .video-card__watch:hover, .video-card__creator:hover { color: #fff; } }
@media (max-width: 1050px) { .video-library__heading { display: block; } .video-library__intro { max-width: 520px; margin-top: 20px; } .video-grid { gap: 14px; } .video-card__body { padding-inline: 14px; } .video-card h3 { font-size: 14px; } }
@media (max-width: 760px) { .video-grid { grid-template-columns: minmax(0, 1fr); gap: 20px; } .video-card__body { padding-inline: 18px; } .video-card h3 { font-size: 17px; } .video-library__intro { font-size: 15px; } }
@media (hover: hover) { .video-tabs button:hover { background: #160e1a; } }
@media (max-width: 600px) {
  .video-tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .video-tabs button { padding: 8px 6px; }
  .video-tabs span { font-size: 11px; }
}
@media (prefers-reduced-motion: reduce) { .video-card { animation: none; } .video-tabs button, .video-tabs button::after, .video-card__play { transition: none; } }
</style>
