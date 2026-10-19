<script setup lang="ts">
import { esportsGames, tournaments } from '~/data/esports'

useHead({ title: 'Esports — Tournament archive | KeroSpace', meta: [{ name: 'description', content: 'Watch Mobile Legends: Bang Bang tournament replays, meet the players and follow official schedules.' }] })
const playing = ref<string | null>(null)
const game = esportsGames.find(item => item.id === 'mlbb')!
const events = tournaments.filter(event => event.game === 'mlbb' && event.video)
  .sort((a, b) => (a.start ?? String(a.year)).localeCompare(b.start ?? String(b.year)))
const scheduleLinks = [
  { name: 'MPL Indonesia schedule', href: 'https://id-mpl.com/schedule' },
  { name: 'MPL Philippines schedule', href: 'https://ph-mpl.com/schedule' },
  { name: 'MLBB broadcasts', href: 'https://www.youtube.com/@MLBBeSports/streams' },
]
function dates(t: typeof tournaments[number]) {
  if (t.dateLabel) return t.dateLabel
  const format = (s: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${s}T00:00:00Z`))
  if (!t.start) return String(t.year)
  return t.end && t.end !== t.start ? `${format(t.start)} — ${format(t.end)}` : format(t.start)
}
</script>

<template>
  <div class="esports-page">
    <SiteNav />
    <main class="esports-wrap">
      <header class="arena-header">
        <div class="arena-copy">
          <p class="eyebrow">KeroSpace esports</p>
          <h1>Every stage.<br /><em>A story to replay.</em></h1>
          <p class="arena-lead">Follow the tournaments. Revisit the finals.<br />Meet the players behind the moments.</p>
        </div>
      </header>

      <div class="arena-banner-frame">
        <AppImage class="arena-banner" src="/images/esports-obsidia-banner-esrgan-2x.webp" sizes="(max-width: 1200px) 100vw, 1200px" alt="Obsidia esports tournament" width="3344" height="1882" fetchpriority="high" loading="eager" decoding="async" />
      </div>

      <section id="tournament-archive" class="archive" aria-labelledby="archive-title">
        <header class="section-heading">
          <div><p class="eyebrow">{{ game.category }}</p><h2 id="archive-title">{{ game.name }}</h2></div>
        </header>
        <p class="game-note">{{ game.note }}</p>
        <nav class="schedule-links" aria-label="Official MLBB schedules and broadcasts">
          <a v-for="link in scheduleLinks" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.name }} <span aria-hidden="true">↗</span></a>
        </nav>
        <div v-if="events.length" class="tournament-grid" aria-live="polite">
          <article v-for="event in events" :key="event.id" class="tournament-card" :class="{ 'tournament-card--video': event.video }">
            <div class="tournament-card__inner">
              <div v-if="event.video" class="event-video">
                <iframe v-if="playing === event.id" :src="`https://www.youtube-nocookie.com/embed/${event.video}?autoplay=1&rel=0`" :title="`${event.name} official video`" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />
                <button v-else @click="playing = event.id" :aria-label="`Play ${event.name} official video`"><img :src="`/images/esports/youtube/${event.video}.jpg`" alt="" width="480" height="360" loading="lazy" /><span class="play-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24"><path d="m9 5 11 7-11 7z" fill="currentColor" /></svg></span></button>
              </div>
              <div v-else class="event-poster" aria-hidden="true"><img :src="`/images/games/${event.game}-logo.webp`" alt="" loading="lazy" /><span>{{ event.year }}</span></div>
              <a v-if="event.externalVideo" class="external-video" :href="event.externalVideo" target="_blank" rel="noopener noreferrer">Watch official video ↗</a>
              <div class="event-body">
                <p class="event-series">{{ event.series }}</p><h3>{{ event.name }}</h3>
                <p class="event-date">{{ dates(event) }}</p><p class="event-location">{{ event.location }}</p>
                <p class="event-summary">{{ event.summary }}</p>
                <p v-if="event.winner" class="winner"><span>Champion</span><strong>{{ event.winner }}</strong></p>
                <a v-if="event.video" class="youtube-link" :href="`https://www.youtube.com/watch?v=${event.video}`" target="_blank" rel="noopener noreferrer">Watch on YouTube <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg></a>
              </div>
            </div>
          </article>
        </div>

      </section>

    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.esports-page {
  --es-red: #ff244f;
  --es-pink: #ff3caf;
  --es-purple: #bd70ff;
  --es-panel: #0b0b0e;
  --es-grad: linear-gradient(100deg, var(--es-red), var(--es-pink), var(--es-purple));
  background: #000;
  min-height: 100svh;
}
.esports-wrap { width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px)); margin: auto; padding-bottom: clamp(88px, 10vw, 144px); }
.eyebrow { margin: 0 0 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .16em; color: var(--es-pink); }
.arena-header { padding: clamp(40px, 6vw, 88px) 0 20px; }
.arena-copy { max-width: 760px; }
h1 { font-family: var(--display); font-size: clamp(30px, 3.8vw, 52px); line-height: 1.3; letter-spacing: -.035em; margin: 0; }
h1 em { font-style: normal; background: var(--es-grad); background-clip: text; -webkit-background-clip: text; color: transparent; }
.arena-lead { font-size: 17px; line-height: 1.75; color: var(--ink-2); margin: 22px 0 0; }
.arena-banner-frame { padding: 2px; margin-bottom: 52px; background: linear-gradient(100deg, var(--es-red), var(--es-pink), var(--es-purple), var(--es-red)); background-size: 300% 100%; animation: arena-banner-sweep 8s linear infinite; }
.arena-banner { display: block; width: 100%; height: auto; }
@keyframes arena-banner-sweep { to { background-position: -300% 0; } }
@media (prefers-reduced-motion: reduce) { .arena-banner-frame, .tournament-card { animation: none; } }
.archive { padding-top: 36px; scroll-margin-top: 24px; }
.schedule-links { display: flex; flex-wrap: wrap; gap: 12px 24px; margin: 20px 0 28px; }
.schedule-links a { display: inline-flex; align-items: center; gap: 12px; min-height: 44px; color: var(--es-pink); font-size: 13px; font-weight: 800; }
.section-heading { display: flex; justify-content: space-between; gap: 20px; align-items: end; }
h2 { font-family: var(--display); font-size: clamp(21px, 2.5vw, 30px); margin: 0; line-height: 1.4; }
.game-note { max-width: 820px; color: var(--ink-2); font-size: 15px; line-height: 1.75; margin: 18px 0 0; }
.tournament-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 20px; }
.tournament-card { min-width: 0; padding: 2px; background: var(--es-pink); }
.tournament-card__inner { display: flex; flex-direction: column; height: 100%; min-width: 0; overflow: hidden; background: var(--es-panel); }
.event-video, .event-poster { position: relative; aspect-ratio: 16/9; }
.event-video { overflow: hidden; background: #100b13; }
.event-video iframe { position: absolute; inset: 0; display: block; width: 100%; height: 100%; border: 0; }
.event-video button { position: absolute; inset: 0; display: block; width: 100%; height: 100%; padding: 0; border: 0; overflow: hidden; background: #100b13; cursor: pointer; }
.event-video img { width: 100%; height: 100%; object-fit: cover; }
.event-video button::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, #000a); pointer-events: none; }
.play-symbol { position: absolute; z-index: 1; left: 50%; top: 50%; display: grid; place-items: center; width: 54px; height: 40px; margin: -20px 0 0 -27px; border: 0; border-radius: 10px; background: var(--es-grad); color: #fff; }
.event-poster { display: flex; align-items: center; justify-content: space-around; gap: 16px; padding: 24px; background: radial-gradient(ellipse at 15% 10%, #50375c, #141019 70%); }
.event-poster img { width: 48%; max-height: 90px; object-fit: contain; }
.event-poster > span { font-family: var(--display); color: #e6ccff; font-size: 28px; }
.external-video { display: block; padding: 12px 22px; color: var(--es-pink); background: #d8baff0d; font-size: 12px; font-weight: 800; }
.event-body { padding: 22px; display: flex; flex-direction: column; flex: 1; }
.event-series { color: var(--es-purple); font-size: 10px; text-transform: uppercase; letter-spacing: .1em; margin: 0 0 10px; }
.event-body h3 { font-family: var(--display); font-size: 17px; line-height: 1.5; margin: 0 0 14px; }
.event-date { font-weight: 800; font-size: 12px; margin: 0 0 6px; }
.event-location { font-size: 12px; color: var(--ink-2); margin: 0; }
.event-summary { font-size: 13px; color: var(--ink-2); line-height: 1.7; margin: 16px 0; flex: 1; }
.winner { display: grid; gap: 5px; border-top: 1px solid var(--line); padding-top: 14px; margin: 0 0 18px; }
.winner span { color: var(--es-pink); font-size: 10px; text-transform: uppercase; letter-spacing: .1em; }
.winner strong { font-size: 14px; }
.source-link, .youtube-link { font-size: 11px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 36px; }
.youtube-link { color: var(--es-pink); }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
button:focus-visible, a:focus-visible { outline: 2px solid var(--es-pink); outline-offset: 4px; }
.event-video button:focus-visible { outline-offset: -3px; }
@media (max-width: 980px) {
  .tournament-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
}
@media (max-width: 600px) {
  .arena-banner-frame { margin-bottom: 40px; }
  .schedule-links { gap: 0 24px; }
  .schedule-links a { min-height: 34px; }
  .arena-lead { font-size: 15px; }
  .section-heading { align-items: start; flex-direction: column; gap: 12px; }
  .archive { padding-top: 36px; }
  .tournament-grid { grid-template-columns: minmax(0,1fr); }
}
</style>
