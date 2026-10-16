<script setup lang="ts">
import { pulseGames, pulsePeriod, type PulseSentiment } from '~/data/communityPulse'

const active = ref(0)
const game = computed(() => pulseGames[active.value]!)
const lead = computed(() => game.value.characters[0]!)
const others = computed(() => game.value.characters.slice(1))

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const fmt = (n: number) => compact.format(n)
const pad = (n: number) => String(n).padStart(2, '0')
const toneLabel = { praised: 'Praised', mixed: 'Mixed', criticised: 'Needs work' } as const
const split = (s: PulseSentiment) => [
  { key: 'loved', label: 'loved', value: s.loved },
  { key: 'mixed', label: 'mixed', value: s.mixed },
  { key: 'critical', label: 'critical', value: s.critical },
]

/* ---- segmented control keyboard support ---- */
const tabs = ref<HTMLButtonElement[]>([])
function onKey(e: KeyboardEvent, i: number) {
  const n = pulseGames.length
  let next = i
  if (e.key === 'ArrowRight') next = (i + 1) % n
  else if (e.key === 'ArrowLeft') next = (i + n - 1) % n
  else return
  e.preventDefault()
  select(next)
  tabs.value[next]?.focus()
}

/* ---- character gallery ---- */
const rail = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
function onRail() {
  const el = rail.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
}
function page(dir: 1 | -1) {
  const el = rail.value
  if (!el) return
  const card = el.querySelector<HTMLElement>('.gcard')
  el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: 'smooth' })
}
function select(i: number) {
  active.value = i
  nextTick(() => { rail.value?.scrollTo({ left: 0 }); onRail() })
}
onMounted(onRail)
</script>

<template>
  <section id="community-pulse" class="ap" aria-labelledby="pulse-title">
    <!-- ============ intro ============ -->
    <header id="pulse-top" class="intro">
      <p class="intro__kicker">Community pulse</p>
      <h2 id="pulse-title">What everyone's<br />talking about.</h2>
      <p class="intro__sub">The characters, gear and feedback driving the most conversation in each game's community.</p>

      <div class="seg" role="tablist" aria-label="Choose a game">
        <button v-for="(g, i) in pulseGames" :id="`pulse-tab-${g.id}`" :key="g.id" ref="tabs" type="button" role="tab"
          :aria-selected="active === i" aria-controls="pulse-panel" :tabindex="active === i ? 0 : -1"
          @click="select(i)" @keydown="onKey($event, i)">{{ g.short }}</button>
      </div>
      <p class="intro__note">{{ pulsePeriod }}</p>
    </header>

    <Transition name="fade" mode="out-in">
      <div id="pulse-panel" :key="game.id" role="tabpanel" :aria-labelledby="`pulse-tab-${game.id}`">
        <!-- ============ hero tile ============ -->
        <article class="hero">
          <img class="hero__art" :src="lead.art || game.art" alt="" :style="{ objectPosition: lead.artPosition || game.artPosition || 'center top' }" />
          <div class="hero__copy">
            <p class="hero__label">Most discussed in {{ game.name }}</p>
            <h3 class="hero__name">{{ lead.name }}</h3>
            <p class="hero__big"><span class="grad">{{ fmt(lead.comments) }}</span></p>
            <p class="hero__cap">comments this month</p>

            <dl class="stats">
              <div v-for="s in split(lead.sentiment)" :key="s.key" :class="`stats__item stats__item--${s.key}`">
                <dt>{{ s.label }}</dt>
                <dd>{{ s.value }}<small>%</small></dd>
              </div>
            </dl>
          </div>
        </article>

        <!-- ============ highlights bento ============ -->
        <div class="bento">
          <article class="tile tile--items">
            <p class="tile__kicker">Most talked-about gear</p>
            <ol class="spec">
              <li v-for="(it, i) in game.items" :key="it.name">
                <span class="spec__n">{{ i + 1 }}</span>
                <span class="spec__name">{{ it.name }}<small>{{ it.type }}</small></span>
                <span class="spec__v">{{ fmt(it.comments) }}</span>
              </li>
            </ol>
          </article>

          <article class="tile tile--stat">
            <p class="tile__kicker">Overall mood</p>
            <p class="tile__huge"><span class="grad">{{ game.verdict.loved }}%</span></p>
            <p class="tile__text"><b>of the conversation is positive.</b> {{ game.verdict.mixed }}% is mixed and {{ game.verdict.critical }}% is critical.</p>
          </article>

          <article class="tile tile--love">
            <p class="tile__kicker">Players love</p>
            <p class="tile__statement">{{ game.verdict.praise }}.</p>
          </article>

          <article class="tile tile--fix">
            <p class="tile__kicker">Players want fixed</p>
            <p class="tile__statement">{{ game.verdict.complaint }}.</p>
          </article>

          <article class="tile tile--feedback">
            <p class="tile__kicker">Hot topics</p>
            <ul class="topics">
              <li v-for="f in game.feedback" :key="f.topic">
                <p><b>{{ f.topic }}.</b> {{ f.summary }}</p>
                <span :class="`tone tone--${f.tone}`">{{ toneLabel[f.tone] }}</span>
              </li>
            </ul>
          </article>
        </div>

        <!-- ============ character gallery ============ -->
        <div class="gallery">
          <h3 class="gallery__title">More characters in the conversation.</h3>
          <ol ref="rail" class="rail" @scroll.passive="onRail">
            <li v-for="(c, i) in others" :key="c.name" class="gcard" :class="[`gcard--${i + 1}`, { 'has-art': c.art }]">
              <img v-if="c.art" class="gcard__art" :src="c.art" alt="" loading="lazy" :style="{ objectPosition: c.artPosition || 'center top' }" />
              <p class="gcard__n">{{ pad(i + 2) }}</p>
              <h4 class="gcard__name">{{ c.name }}</h4>
              <p class="gcard__tag">{{ c.tag }}</p>
              <div class="gcard__foot">
                <p class="gcard__big">{{ fmt(c.comments) }}<small>comments</small></p>
                <p class="gcard__mood"><b>{{ c.sentiment.loved }}%</b> loved</p>
              </div>
            </li>
          </ol>
          <div class="paddles">
            <button type="button" class="paddle paddle--prev" :disabled="atStart" aria-label="Previous characters" @click="page(-1)" />
            <button type="button" class="paddle paddle--next" :disabled="atEnd" aria-label="More characters" @click="page(1)" />
          </div>
        </div>
      </div>
    </Transition>

  </section>
</template>

<style scoped>
.ap {
  --sf: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Helvetica Neue', Arial, sans-serif;
  --fg: #f5f5f7;
  --fg-2: #86868b;
  --tile: #161617;
  --tile-2: #1d1d1f;
  --hair: rgba(255, 255, 255, .1);
  /* smooth, blobby brand gradient: overlapping colour pools rather than hard stops */
  --mesh: radial-gradient(80% 140% at 0% 20%, #ff9bd9 0%, transparent 65%), radial-gradient(70% 140% at 100% 80%, #a874ff 0%, transparent 65%), radial-gradient(70% 120% at 55% 110%, #ff4467 0%, transparent 65%), #ff6db3;
  width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px));
  margin: 0 auto;
  padding: clamp(40px, 6vw, 80px) 0 clamp(110px, 12vw, 180px);
  font-family: var(--sf);
  color: var(--fg);
  -webkit-font-smoothing: antialiased;
}
.grad { background: var(--mesh); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

/* ============ intro ============ */
.intro { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: clamp(40px, 5vw, 64px); scroll-margin-top: 24px; }
.intro__kicker { margin: 0 0 14px; font-size: clamp(19px, 1.7vw, 24px); font-weight: 600; letter-spacing: -.01em; background: var(--mesh); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.intro h2 { margin: 0; font-size: clamp(44px, 6.4vw, 88px); font-weight: 700; line-height: 1.04; letter-spacing: -.045em; }
.intro__sub { max-width: 640px; margin: 22px 0 0; font-size: clamp(17px, 1.6vw, 21px); font-weight: 500; line-height: 1.45; letter-spacing: -.01em; color: var(--fg-2); }

.intro__note { margin: 14px 0 0; font-size: 12px; font-weight: 500; color: var(--fg-2); }
.seg { display: inline-flex; gap: 2px; max-width: 100%; margin-top: 36px; padding: 4px; border-radius: 999px; background: var(--tile-2); overflow-x: auto; scrollbar-width: none; }
.seg::-webkit-scrollbar { display: none; }
.seg button { flex-shrink: 0; min-height: 36px; padding: 0 18px; border: 0; border-radius: 999px; background: transparent; color: var(--fg-2); font: 500 14px/1 var(--sf); letter-spacing: -.01em; white-space: nowrap; cursor: pointer; transition: color .2s, background .25s; }
.seg button[aria-selected="true"] {
  color: #fff;
  font-weight: 600;
  /* soft red → pink → purple pools */
  background:
    radial-gradient(70% 160% at 0% 50%, #ff2d55 0%, transparent 70%),
    radial-gradient(60% 160% at 50% 50%, #ff5fb4 0%, transparent 75%),
    radial-gradient(70% 160% at 100% 50%, #a05cff 0%, transparent 70%),
    #ff4f9a;
  box-shadow: 0 4px 16px rgba(255, 79, 154, .3);
}
.seg button:focus-visible, .paddle:focus-visible { outline: 2px solid #0a84ff; outline-offset: 2px; }

/* ============ hero tile ============ */
.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  min-height: clamp(520px, 46vw, 640px);
  padding: clamp(16px, 2vw, 24px);
  overflow: hidden;
  border-radius: 30px;
  background: #000;
}
/* full-bleed art, no fade */
.hero__art { position: absolute; z-index: -1; inset: 0; width: 100%; height: 100%; object-fit: cover; }
/* black glass panel holding the copy */
.hero__copy {
  width: min(500px, 100%);
  padding: clamp(28px, 3.5vw, 48px);
  border-radius: 24px;
  background: rgba(0, 0, 0, .78);
  -webkit-backdrop-filter: blur(36px) saturate(110%);
  backdrop-filter: blur(36px) saturate(110%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .12), inset 0 1px 0 rgba(255, 255, 255, .1), 0 24px 60px rgba(0, 0, 0, .35);
}
.hero__label { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -.01em; color: rgba(245, 245, 247, .7); }
.hero__name { margin: 10px 0 0; font-size: clamp(40px, 4.4vw, 64px); font-weight: 700; line-height: 1.02; letter-spacing: -.04em; }
.hero__big { margin: clamp(28px, 3.5vw, 44px) 0 0; font-size: clamp(72px, 9vw, 128px); font-weight: 700; line-height: .9; letter-spacing: -.055em; }
.hero__cap { margin: 10px 0 0; font-size: 19px; font-weight: 600; letter-spacing: -.01em; color: var(--fg); }
.stats { display: flex; gap: 0; margin: clamp(28px, 3.5vw, 44px) 0 0; }
.stats__item { padding: 0 22px; border-left: 1px solid rgba(255, 255, 255, .16); }
.stats__item:first-child { padding-left: 0; border-left: 0; }
.stats dt { font-size: 14px; font-weight: 500; color: rgba(245, 245, 247, .7); }
.stats dd { margin: 4px 0 0; font-size: 32px; font-weight: 700; letter-spacing: -.03em; }
.stats dd small { font-size: 18px; font-weight: 600; color: var(--fg-2); }
.stats__item--loved dd { background: var(--mesh); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

/* ============ bento ============ */
.bento {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-areas: 'items items stat' 'love fix feedback';
  gap: 20px;
  margin-top: 20px;
}
.tile { min-width: 0; padding: clamp(28px, 3vw, 40px); border-radius: 30px; background: var(--tile); }
.tile__kicker { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -.01em; color: var(--fg-2); }
.tile--items { grid-area: items; }
.tile--stat { grid-area: stat; display: flex; flex-direction: column; }
.tile--love { grid-area: love; }
.tile--fix { grid-area: fix; }
.tile--feedback { grid-area: feedback; }

.spec { margin: 18px 0 0; padding: 0; list-style: none; }
.spec li { display: grid; grid-template-columns: 28px minmax(0, 1fr) auto; align-items: baseline; gap: 14px; padding: 18px 0; border-top: 1px solid var(--hair); }
.spec li:first-child { border-top: 0; }
.spec__n { font-size: 15px; font-weight: 600; color: var(--fg-2); }
.spec__name { display: flex; flex-direction: column; min-width: 0; font-size: 21px; font-weight: 600; letter-spacing: -.02em; }
.spec__name small { margin-top: 3px; font-size: 14px; font-weight: 500; letter-spacing: 0; color: var(--fg-2); }
.spec__v { font-size: 21px; font-weight: 600; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.spec li:first-child .spec__v { background: var(--mesh); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.tile__huge { margin: auto 0 0; padding-top: 24px; font-size: clamp(80px, 8vw, 112px); font-weight: 700; line-height: .9; letter-spacing: -.06em; }
.tile__text { margin: 16px 0 0; font-size: 17px; font-weight: 500; line-height: 1.45; color: var(--fg-2); }
.tile__text b { font-weight: 600; color: var(--fg); }

/* statement tiles carry the gradient on the tile itself */
.tile--love, .tile--fix { display: flex; flex-direction: column; justify-content: space-between; min-height: 300px; }
.tile--love {
  background:
    radial-gradient(90% 80% at 0% 100%, rgba(255, 109, 179, .55), transparent 70%),
    radial-gradient(80% 70% at 100% 100%, rgba(168, 116, 255, .5), transparent 70%),
    var(--tile);
}
.tile--fix {
  background:
    radial-gradient(90% 80% at 100% 100%, rgba(255, 68, 103, .45), transparent 70%),
    radial-gradient(70% 60% at 0% 100%, rgba(255, 140, 90, .22), transparent 70%),
    var(--tile);
}
.tile--love .tile__kicker, .tile--fix .tile__kicker { color: rgba(245, 245, 247, .7); }
.tile__statement { margin: 40px 0 0; font-size: clamp(30px, 2.8vw, 40px); font-weight: 700; line-height: 1.08; letter-spacing: -.035em; }

.topics { margin: 14px 0 0; padding: 0; list-style: none; }
.topics li { padding: 16px 0; border-top: 1px solid var(--hair); }
.topics li:first-child { border-top: 0; }
.topics p { margin: 0; font-size: 16px; font-weight: 500; line-height: 1.45; color: var(--fg-2); }
.topics b { font-weight: 600; color: var(--fg); }
.tone { display: inline-block; margin-top: 8px; font-size: 13px; font-weight: 600; }
.tone--praised { background: var(--mesh); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tone--mixed { color: #a1a1a6; }
.tone--criticised { color: #ff6b81; }

/* ============ gallery ============ */
.gallery { margin-top: clamp(80px, 9vw, 130px); }
.gallery__title { margin: 0 0 28px; font-size: clamp(32px, 3.6vw, 48px); font-weight: 700; line-height: 1.08; letter-spacing: -.04em; }
.rail {
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0 0 4px;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  border-radius: 28px;
}
.rail::-webkit-scrollbar { display: none; }
.gcard {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 clamp(270px, 28vw, 372px);
  aspect-ratio: 372 / 500;
  padding: 30px;
  border-radius: 28px;
  scroll-snap-align: start;
  overflow: hidden;
  background: var(--tile);
}
/* each card gets its own smooth colour field */
.gcard--1 { background: radial-gradient(110% 80% at 0% 0%, #ff5fb0 0%, transparent 60%), radial-gradient(100% 80% at 100% 100%, #6d36ff 0%, transparent 62%), radial-gradient(70% 50% at 100% 10%, #ff3355 0%, transparent 60%), #1a0e1c; }
.gcard--2 { background: radial-gradient(110% 80% at 100% 0%, #b26bff 0%, transparent 60%), radial-gradient(100% 80% at 0% 100%, #ff4f9e 0%, transparent 62%), radial-gradient(60% 50% at 30% 30%, #3b1d7a 0%, transparent 70%), #150e22; }
.gcard--3 { background: radial-gradient(110% 80% at 0% 100%, #ff2a4f 0%, transparent 60%), radial-gradient(100% 80% at 100% 0%, #ff8ad0 0%, transparent 60%), radial-gradient(70% 60% at 80% 90%, #7a2bff 0%, transparent 65%), #1d0c14; }
.gcard--4 { background: radial-gradient(110% 80% at 100% 100%, #ff6db3 0%, transparent 60%), radial-gradient(100% 80% at 0% 0%, #5a2cff 0%, transparent 62%), radial-gradient(60% 50% at 70% 40%, #ff4467 0%, transparent 70%), #120c1f; }
/* gentle shade so text always reads on the colour field */
.gcard::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, .35), transparent 35%, transparent 55%, rgba(0, 0, 0, .45)); pointer-events: none; }
.gcard > *:not(.gcard__art) { position: relative; }
/* official character art fills the card; the colour field stays as a soft tint at the edges */
.gcard__art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .8s var(--ease); }
.gcard.has-art::before { z-index: 1; background: linear-gradient(180deg, rgba(0, 0, 0, .55) 0%, transparent 30%, transparent 50%, rgba(0, 0, 0, .8) 100%); }
.gcard.has-art > *:not(.gcard__art) { z-index: 2; }
@media (hover: hover) { .gcard.has-art:hover .gcard__art { transform: scale(1.04); } }
.gcard__n { margin: 0; font-size: 15px; font-weight: 600; color: rgba(255, 255, 255, .7); }
.gcard__name { margin: 8px 0 0; font-size: clamp(30px, 2.8vw, 40px); font-weight: 700; line-height: 1.04; letter-spacing: -.04em; }
.gcard__tag { margin: 8px 0 0; font-size: 17px; font-weight: 500; color: rgba(255, 255, 255, .78); }
.gcard__foot { margin-top: auto; }
.gcard__big { display: flex; align-items: baseline; gap: 8px; margin: 0; font-size: clamp(44px, 4.2vw, 60px); font-weight: 700; line-height: 1; letter-spacing: -.05em; }
.gcard__big small { font-size: 17px; font-weight: 600; letter-spacing: -.01em; color: rgba(255, 255, 255, .8); }
.gcard__mood { margin: 10px 0 0; font-size: 15px; font-weight: 500; color: rgba(255, 255, 255, .8); }
.gcard__mood b { color: #fff; font-weight: 700; }

.paddles { display: flex; justify-content: flex-end; gap: 14px; margin-top: 24px; }
.paddle { position: relative; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 50%; background: #333336; cursor: pointer; transition: background .2s, opacity .2s; }
/* chevrons drawn with borders */
.paddle::before { content: ''; position: absolute; top: 50%; left: 50%; width: 8px; height: 8px; border-top: 2px solid #d6d6d6; border-right: 2px solid #d6d6d6; }
.paddle--prev::before { transform: translate(-30%, -50%) rotate(-135deg); }
.paddle--next::before { transform: translate(-70%, -50%) rotate(45deg); }
.paddle:disabled { opacity: .36; cursor: default; }
@media (hover: hover) { .paddle:not(:disabled):hover { background: #424245; } }

/* tab change */
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ============ responsive ============ */
@media (max-width: 1068px) {
  .bento { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-areas: 'items items' 'stat feedback' 'love fix'; }
}
@media (max-width: 734px) {
  .seg { margin-top: 28px; }
  .seg button { padding: 0 14px; }
  .hero { flex-direction: column; align-items: stretch; justify-content: flex-end; min-height: 660px; padding: 12px; border-radius: 24px; }
  .hero__art { object-position: center top; }
  .hero__copy { width: 100%; padding: 24px 22px 26px; border-radius: 18px; }
  .hero__label { font-size: 15px; }
  .hero__big { margin-top: 18px; }
  .hero__cap { font-size: 17px; }
  .stats { margin-top: 24px; }
  .stats__item { padding: 0 16px; }
  .stats dd { font-size: 26px; }
  .bento { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'items' 'stat' 'love' 'fix' 'feedback'; gap: 14px; margin-top: 14px; }
  .tile { padding: 26px 24px; border-radius: 24px; }
  .tile--love, .tile--fix { min-height: 220px; }
  .spec__name, .spec__v { font-size: 18px; }
  .gcard { flex-basis: 82%; padding: 26px; border-radius: 24px; }
  .rail { gap: 14px; border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) { .fade-enter-active, .fade-leave-active { transition: none; } }
</style>
