<script setup lang="ts">
import { pulseGames, type PulseSentiment } from '~/data/communityPulse'
import { prepareImage } from '~/utils/responsiveImages'
const imageSection = ref<HTMLElement>()
const pulseSizes = '(max-width: 760px) 100vw, 700px'

const active = ref(0)
const pick = ref(0) // which character the spotlight shows

const game = computed(() => pulseGames[active.value]!)
const star = computed(() => game.value.characters[pick.value] ?? game.value.characters[0]!)

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const fmt = (n: number) => compact.format(n)
const split = (s: PulseSentiment) => [
  { key: 'loved', label: 'Loved', value: s.loved },
  { key: 'mixed', label: 'Mixed', value: s.mixed },
  { key: 'critical', label: 'Critical', value: s.critical },
]

function preloadGame(i: number) {
  const sources = pulseGames[i]!.characters.flatMap(c => [c.art, c.spotArt]).filter((src): src is string => !!src)
  return Promise.all([...new Set(sources)].map(src => prepareImage(src, pulseSizes)))
}
useImageWarmup(imageSection, () => { void preloadGame(0); void preloadGame(1) })

let selection = 0
async function selectGame(i: number) {
  const request = ++selection
  await preloadGame(i)
  if (request !== selection) return
  active.value = i
  pick.value = 0
}

const tabs = ref<HTMLButtonElement[]>([])
function onKey(e: KeyboardEvent, i: number) {
  const n = pulseGames.length
  let next = i
  if (e.key === 'ArrowRight') next = (i + 1) % n
  else if (e.key === 'ArrowLeft') next = (i + n - 1) % n
  else return
  e.preventDefault()
  selectGame(next)
  tabs.value[next]?.focus()
}
</script>

<template>
  <section ref="imageSection" id="community-pulse" class="pulse" aria-labelledby="pulse-title">
    <!-- heading: same rhythm as "Your game. Their playground." -->
    <header class="pulse__head">
      <div>
        <p class="pulse__eyebrow">Community pulse</p>
        <h2 id="pulse-title">The talk of<br /><em>every server.</em></h2>
      </div>
      <p class="pulse__intro">Who players can't stop discussing, the gear everyone's chasing, and what they want fixed next.</p>
    </header>

    <div class="seg" role="tablist" aria-label="Choose a game">
      <button v-for="(g, i) in pulseGames" :id="`pulse-tab-${g.id}`" :key="g.id" ref="tabs" type="button" role="tab"
        :aria-selected="active === i" aria-controls="pulse-stage" :tabindex="active === i ? 0 : -1"
        @click="selectGame(i)" @keydown="onKey($event, i)" @pointerenter="preloadGame(i)" @focus="preloadGame(i)">{{ g.id === 'genshin' || g.id === 'nte' ? g.name : g.short }}</button>
    </div>

    <div id="pulse-stage" class="stage" role="tabpanel" :aria-labelledby="`pulse-tab-${game.id}`">
      <!-- ============ spotlight ============ -->
      <Transition name="fade" mode="out-in">
        <article :key="`${game.id}-${star.name}`" class="spot" :class="{ 'spot--noart': !(star.spotArt || star.art) }">
          <AppImage v-if="star.spotArt || star.art" class="spot__art" :src="star.spotArt || star.art" :sizes="pulseSizes" alt="" :style="{ '--spot-position': star.spotPosition || star.artPosition || 'center top', '--spot-mobile-position': star.spotMobilePosition || star.spotPosition || star.artPosition || 'center top' }" />
          <!-- no official art yet: oversized initial on a soft colour field -->
          <span v-else class="spot__mono" aria-hidden="true">{{ star.name.slice(0, 1) }}</span>

          <div class="glass">
            <p class="glass__label">{{ pick === 0 ? 'Most discussed' : `No. ${pick + 1} most discussed` }} in {{ game.short }}</p>
            <h3 class="glass__name">{{ star.name }}</h3>
            <p class="glass__tag">{{ star.tag }}</p>
            <div class="glass__row">
              <p class="glass__big">{{ fmt(star.comments) }}<small>comments</small></p>
              <dl class="glass__mood">
                <div v-for="s in split(star.sentiment)" :key="s.key" :class="`m m--${s.key}`">
                  <dt>{{ s.label }}</dt><dd>{{ s.value }}%</dd>
                </div>
              </dl>
            </div>
            <div class="meter" aria-hidden="true">
              <span v-for="s in split(star.sentiment)" :key="s.key" :class="`meter__seg meter__seg--${s.key}`" :style="{ flexGrow: s.value }" />
            </div>
          </div>
        </article>
      </Transition>

      <!-- ============ character rail: picks the spotlight ============ -->
      <div class="rail" role="group" aria-label="Most discussed characters">
        <button v-for="(c, i) in game.characters" :key="c.name" type="button" class="rtile" :class="[`rtile--${i + 1}`, { 'is-on': pick === i, 'has-art': c.art }]"
          :aria-pressed="pick === i" @click="pick = i">
          <span class="rtile__surface" aria-hidden="true">
            <AppImage v-if="c.art" class="rtile__art" :src="c.art" :sizes="pulseSizes" alt="" :style="{ objectPosition: c.artPosition || 'center 25%' }" />
          </span>
          <span class="rtile__n" aria-hidden="true">{{ i + 1 }}</span>
          <span class="rtile__who"><b>{{ c.name }}</b><small>{{ c.tag }}</small></span>
          <span class="rtile__v">{{ fmt(c.comments) }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pulse {
  --pk: #ff54bb;
  --pp: #b26bff;
  --rd: #ff183b;
  --surface: #0b0a0f;
  --hair: rgba(255, 255, 255, .08);
  --muted: rgba(255, 255, 255, .6);
  /* smooth "blob" fill: overlapping colour pools rather than hard stops */
  --blob: radial-gradient(70% 160% at 0% 50%, #ff2d55 0%, transparent 70%), radial-gradient(60% 160% at 50% 50%, #ff5fb4 0%, transparent 75%), radial-gradient(70% 160% at 100% 50%, #a05cff 0%, transparent 70%), #ff4f9a;
  width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px));
  margin: 0 auto;
  padding: 0 0 clamp(88px, 10vw, 144px);
}

/* ---------- heading (matches the Twitch section) ---------- */
.pulse__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 28px; }
.pulse__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .16em; }
.pulse h2 { margin: 0; font: 900 clamp(28px, 3.5vw, 46px)/1.16 var(--display); text-transform: uppercase; letter-spacing: -.025em; }
.pulse h2 em { font-style: normal; background: linear-gradient(100deg, var(--pk), var(--rd) 50%, var(--pp)); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.pulse__intro { max-width: 340px; margin: 0 0 3px; font-size: 16px; line-height: 1.75; color: #c1b9c9; }

/* ---------- game selector ---------- */
.seg { display: flex; gap: 8px; margin-bottom: 18px; overflow-x: auto; scrollbar-width: none; }
.seg::-webkit-scrollbar { display: none; }
.seg button {
  flex-shrink: 0;
  min-height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: #121016;
  box-shadow: inset 0 0 0 1px var(--hair);
  color: rgba(255, 255, 255, .62);
  font: 800 11px/1 var(--display);
  letter-spacing: .06em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: color .2s, background .25s;
}
.seg button[aria-selected="true"] { color: #fff; background: var(--blob); box-shadow: 0 4px 16px rgba(255, 79, 154, .3); }
.seg button:focus-visible { outline: 2px solid #e3a3ff; outline-offset: 2px; }

/* ---------- stage grid ---------- */
.stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.15fr);
  grid-template-areas: 'spot spot rail';
  gap: 14px;
}

/* spotlight */
.spot {
  grid-area: spot;
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: flex-end;
  min-height: 430px;
  padding: 16px;
  overflow: hidden;
  border-radius: 10px;
  background: #000;
}
.spot__art { position: absolute; z-index: -1; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: var(--spot-position, center top); }
.spot--noart {
  background:
    radial-gradient(70% 90% at 85% 15%, rgba(178, 107, 255, .55), transparent 65%),
    radial-gradient(60% 80% at 60% 85%, rgba(255, 24, 59, .45), transparent 65%),
    radial-gradient(60% 70% at 20% 20%, rgba(255, 84, 187, .35), transparent 65%),
    #0b0a0f;
}
.spot__mono {
  position: absolute;
  z-index: -1;
  right: -2%;
  top: 50%;
  translate: 0 -55%;
  font: 900 clamp(240px, 26vw, 380px)/1 var(--display);
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, .16);
  text-transform: uppercase;
  pointer-events: none;
}

/* black glass panel */
.glass {
  width: min(400px, 100%);
  padding: 18px 20px;
  border-radius: 8px;
  background: rgba(0, 0, 0, .78);
  -webkit-backdrop-filter: blur(36px) saturate(110%);
  backdrop-filter: blur(36px) saturate(110%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .12), inset 0 1px 0 rgba(255, 255, 255, .1), 0 24px 60px rgba(0, 0, 0, .35);
}
.glass__label { margin: 0; font-size: 12px; font-weight: 800; color: rgba(255, 255, 255, .62); }
.glass__name { margin: 6px 0 0; font: 900 clamp(24px, 2.3vw, 30px)/1.05 var(--display); text-transform: uppercase; letter-spacing: -.02em; }
.glass__tag { margin: 5px 0 0; font-size: 12px; font-weight: 700; color: #ffb3e1; }
.glass__row { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; margin-top: 14px; }
.glass__big { display: flex; align-items: baseline; gap: 6px; margin: 0; font: 900 clamp(30px, 2.8vw, 38px)/1 var(--display); letter-spacing: -.03em; background: var(--blob); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.glass__big small { font: 800 12px/1 var(--ui); letter-spacing: 0; -webkit-text-fill-color: rgba(255, 255, 255, .7); }
.glass__mood { display: flex; gap: 12px; margin: 0; }
.m dt { font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, .55); }
.m dd { margin: 2px 0 0; font: 900 14px/1 var(--display); }
.m--loved dd { color: #ff8fd0; }
.m--critical dd { color: #ff6b81; }
.meter { display: flex; gap: 3px; height: 5px; margin-top: 12px; }
.meter__seg { min-width: 4px; border-radius: 999px; }
.meter__seg--loved { background: var(--blob); }
.meter__seg--mixed { background: rgba(255, 255, 255, .28); }
.meter__seg--critical { background: #ff3b5c; }

/* character rail: five slim tiles that switch the spotlight */
.rail { grid-area: rail; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.rtile {
  position: relative;
  isolation: isolate;
  flex: 1;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  min-height: 72px;
  padding: 0 18px 0 14px;
  overflow: hidden;
  border: 0;
  border-radius: 10px;
  color: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
  background: linear-gradient(120deg, #ffb3df, #642a96 48%, #353238);
}
.rtile__surface {
  position: absolute;
  z-index: -1;
  inset: 2px;
  isolation: isolate;
  overflow: hidden;
  border-radius: 8px;
  background: var(--tile-background, #121016);
  pointer-events: none;
}
/* each tile carries its own soft colour field */
.rtile--1 { --tile-background: radial-gradient(70% 140% at 100% 50%, rgba(255, 84, 187, .5), transparent 70%), radial-gradient(50% 120% at 70% 100%, rgba(160, 92, 255, .4), transparent 70%), #120e16; }
.rtile--2 { --tile-background: radial-gradient(70% 140% at 100% 50%, rgba(160, 92, 255, .5), transparent 70%), radial-gradient(50% 120% at 70% 0%, rgba(255, 61, 106, .3), transparent 70%), #110e18; }
.rtile--3 { --tile-background: radial-gradient(70% 140% at 100% 50%, rgba(255, 45, 85, .45), transparent 70%), radial-gradient(50% 120% at 70% 100%, rgba(255, 84, 187, .3), transparent 70%), #140d12; }
.rtile--4 { --tile-background: radial-gradient(70% 140% at 100% 50%, rgba(255, 95, 180, .3), transparent 70%), #100e14; }
.rtile--5 { --tile-background: radial-gradient(70% 140% at 100% 50%, rgba(160, 92, 255, .3), transparent 70%), #100e14; }
.rtile__art { position: absolute; z-index: -1; top: 0; right: 0; width: 62%; height: 100%; object-fit: cover; -webkit-mask-image: linear-gradient(90deg, transparent, #000 60%); mask-image: linear-gradient(90deg, transparent, #000 60%); opacity: .85; transition: opacity .25s ease; }
.rtile.has-art .rtile__surface::after { content: ''; position: absolute; z-index: -1; inset: 0; background: linear-gradient(90deg, rgba(0, 0, 0, .2), rgba(0, 0, 0, .55)); transition: opacity .25s ease; }
.rtile.is-on .rtile__art { opacity: 1; }
.rtile.is-on .rtile__surface::after { opacity: 0; }
.rtile__n { font: 900 30px/1 var(--display); color: #fff; text-align: center; }
.rtile__who { display: flex; flex-direction: column; min-width: 0; }
.rtile__who b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 900 14px/1.2 var(--display); text-transform: uppercase; letter-spacing: -.005em; }
.rtile__who small { margin-top: 4px; font-size: 12px; font-weight: 700; color: rgba(255, 255, 255, .6); }
.rtile__v { font: 900 15px/1 var(--display); }
.rtile:focus-visible { outline: 2px solid #e3a3ff; outline-offset: 2px; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .stage { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-areas: 'spot spot' 'rail rail'; }
}
@media (max-width: 900px) { .pulse__head { align-items: flex-start; } .pulse__intro { max-width: 280px; font-size: 14px; } }
@media (max-width: 600px) {
  .pulse__head { display: block; margin-bottom: 22px; }
  .pulse__intro { max-width: 420px; margin-top: 16px; font-size: 15px; }
  .seg { gap: 6px; margin: 0 calc(-1 * clamp(16px, 4vw, 40px)) 14px; padding: 0 clamp(16px, 4vw, 40px); }
  .seg button { padding: 0 14px; }
  .stage { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
  .spot { min-height: 520px; padding: 10px; }
  .spot__art { object-position: var(--spot-mobile-position, var(--spot-position, center top)); }
  .glass { padding: 14px 16px; }
  .glass__row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .rtile { min-height: 64px; }
}
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active, .fade-leave-active, .rtile, .rtile__art, .rtile.has-art .rtile__surface::after { transition: none; }
}
</style>
