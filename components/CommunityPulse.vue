<script setup lang="ts">
import { pulseGames, pulsePeriod, type PulseSentiment } from '~/data/communityPulse'

const active = ref(0)
const pick = ref(0) // which character the spotlight shows

const game = computed(() => pulseGames[active.value]!)
const star = computed(() => game.value.characters[pick.value] ?? game.value.characters[0]!)

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const fmt = (n: number) => compact.format(n)
const pad = (n: number) => String(n).padStart(2, '0')
const split = (s: PulseSentiment) => [
  { key: 'loved', label: 'Loved', value: s.loved },
  { key: 'mixed', label: 'Mixed', value: s.mixed },
  { key: 'critical', label: 'Critical', value: s.critical },
]

function selectGame(i: number) { active.value = i; pick.value = 0 }

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
  <section id="community-pulse" class="pulse" aria-labelledby="pulse-title">
    <!-- heading: same rhythm as "Your game. Their playground." -->
    <header class="pulse__head">
      <div>
        <p class="pulse__eyebrow"><span aria-hidden="true" />Community pulse</p>
        <h2 id="pulse-title">The talk of<br /><em>every server.</em></h2>
      </div>
      <p class="pulse__intro">Who players can't stop discussing, the gear everyone's chasing, and what they want fixed next.</p>
    </header>

    <div class="seg" role="tablist" aria-label="Choose a game">
      <button v-for="(g, i) in pulseGames" :id="`pulse-tab-${g.id}`" :key="g.id" ref="tabs" type="button" role="tab"
        :aria-selected="active === i" aria-controls="pulse-stage" :tabindex="active === i ? 0 : -1"
        @click="selectGame(i)" @keydown="onKey($event, i)">{{ g.short }}</button>
    </div>

    <div id="pulse-stage" class="stage" role="tabpanel" :aria-labelledby="`pulse-tab-${game.id}`">
      <!-- ============ spotlight ============ -->
      <Transition name="fade" mode="out-in">
        <article :key="`${game.id}-${star.name}`" class="spot" :class="{ 'spot--noart': !star.art }">
          <img v-if="star.art" class="spot__art" :src="star.art" alt="" :style="{ objectPosition: star.artPosition || 'center top' }" />
          <!-- no official art yet: oversized initial on a soft colour field -->
          <span v-else class="spot__mono" aria-hidden="true">{{ star.name.slice(0, 1) }}</span>

          <span class="spot__rank" aria-hidden="true">#{{ pick + 1 }}</span>

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
          <img v-if="c.art" class="rtile__art" :src="c.art" alt="" :style="{ objectPosition: c.artPosition || 'center 25%' }" />
          <span class="rtile__n" aria-hidden="true">{{ i + 1 }}</span>
          <span class="rtile__who"><b>{{ c.name }}</b><small>{{ c.tag }}</small></span>
          <span class="rtile__v">{{ fmt(c.comments) }}</span>
        </button>
      </div>

      <!-- ============ gear ============ -->
      <article class="gear">
        <p class="gear__k">Most talked-about gear <span>{{ pulsePeriod }}</span></p>
        <ol class="gear__list">
          <li v-for="(it, i) in game.items.slice(0, 3)" :key="it.name">
            <span class="gear__n">{{ pad(i + 1) }}</span>
            <span class="gear__who"><b>{{ it.name }}</b><small>{{ it.type }}</small></span>
            <span class="gear__v">{{ fmt(it.comments) }}</span>
          </li>
        </ol>
      </article>

      <!-- ============ verdict ============ -->
      <article class="verdict verdict--love">
        <p class="verdict__k">Players love</p>
        <p class="verdict__big">{{ game.verdict.loved }}<small>% positive</small></p>
        <p class="verdict__s">{{ game.verdict.praise }}</p>
      </article>
      <article class="verdict verdict--fix">
        <p class="verdict__k">Players want fixed</p>
        <p class="verdict__big">{{ game.verdict.critical }}<small>% critical</small></p>
        <p class="verdict__s">{{ game.verdict.complaint }}</p>
      </article>
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
.pulse__eyebrow span { width: 26px; height: 2px; border-radius: 2px; background: var(--blob); }
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
  grid-template-areas: 'spot spot rail' 'love fix gear';
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
.spot__art { position: absolute; z-index: -1; inset: 0; width: 100%; height: 100%; object-fit: cover; }
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
.spot__rank {
  position: absolute;
  top: 16px;
  right: 16px;
  display: grid;
  place-items: center;
  min-width: 46px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, .7);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .14);
  font: 900 12px/1 var(--display);
}

/* black glass panel */
.glass {
  width: min(440px, 100%);
  padding: 22px 24px;
  border-radius: 8px;
  background: rgba(0, 0, 0, .78);
  -webkit-backdrop-filter: blur(36px) saturate(110%);
  backdrop-filter: blur(36px) saturate(110%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .12), inset 0 1px 0 rgba(255, 255, 255, .1), 0 24px 60px rgba(0, 0, 0, .35);
}
.glass__label { margin: 0; font-size: 12px; font-weight: 800; color: rgba(255, 255, 255, .62); }
.glass__name { margin: 8px 0 0; font: 900 clamp(26px, 2.6vw, 34px)/1.05 var(--display); text-transform: uppercase; letter-spacing: -.02em; }
.glass__tag { margin: 6px 0 0; font-size: 13px; font-weight: 700; color: #ffb3e1; }
.glass__row { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-top: 18px; }
.glass__big { display: flex; align-items: baseline; gap: 8px; margin: 0; font: 900 clamp(34px, 3.2vw, 44px)/1 var(--display); letter-spacing: -.03em; background: var(--blob); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.glass__big small { font: 800 12px/1 var(--ui); letter-spacing: 0; -webkit-text-fill-color: rgba(255, 255, 255, .7); }
.glass__mood { display: flex; gap: 14px; margin: 0; }
.m dt { font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, .55); }
.m dd { margin: 2px 0 0; font: 900 14px/1 var(--display); }
.m--loved dd { color: #ff8fd0; }
.m--critical dd { color: #ff6b81; }
.meter { display: flex; gap: 3px; height: 6px; margin-top: 16px; }
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
  background: #121016;
  transition: transform .25s var(--ease), box-shadow .25s;
}
/* each tile carries its own soft colour field */
.rtile--1 { background: radial-gradient(70% 140% at 100% 50%, rgba(255, 84, 187, .5), transparent 70%), radial-gradient(50% 120% at 70% 100%, rgba(160, 92, 255, .4), transparent 70%), #120e16; }
.rtile--2 { background: radial-gradient(70% 140% at 100% 50%, rgba(160, 92, 255, .5), transparent 70%), radial-gradient(50% 120% at 70% 0%, rgba(255, 61, 106, .3), transparent 70%), #110e18; }
.rtile--3 { background: radial-gradient(70% 140% at 100% 50%, rgba(255, 45, 85, .45), transparent 70%), radial-gradient(50% 120% at 70% 100%, rgba(255, 84, 187, .3), transparent 70%), #140d12; }
.rtile--4 { background: radial-gradient(70% 140% at 100% 50%, rgba(255, 95, 180, .3), transparent 70%), #100e14; }
.rtile--5 { background: radial-gradient(70% 140% at 100% 50%, rgba(160, 92, 255, .3), transparent 70%), #100e14; }
.rtile__art { position: absolute; z-index: -1; top: 0; right: 0; width: 62%; height: 100%; object-fit: cover; -webkit-mask-image: linear-gradient(90deg, transparent, #000 60%); mask-image: linear-gradient(90deg, transparent, #000 60%); opacity: .85; }
.rtile.has-art::after { content: ''; position: absolute; z-index: -1; inset: 0; background: linear-gradient(90deg, rgba(0, 0, 0, .2), rgba(0, 0, 0, .55)); }
.rtile__n { font: 900 30px/1 var(--display); color: transparent; -webkit-text-stroke: 1.5px rgba(255, 255, 255, .35); text-align: center; }
.rtile__who { display: flex; flex-direction: column; min-width: 0; }
.rtile__who b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 900 14px/1.2 var(--display); text-transform: uppercase; letter-spacing: -.005em; }
.rtile__who small { margin-top: 4px; font-size: 12px; font-weight: 700; color: rgba(255, 255, 255, .6); }
.rtile__v { font: 900 15px/1 var(--display); }
.rtile.is-on { box-shadow: inset 0 0 0 1.5px rgba(255, 140, 210, .85), 0 8px 26px rgba(255, 84, 187, .22); }
.rtile.is-on .rtile__n { color: #fff; -webkit-text-stroke: 0; background: var(--blob); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.rtile:focus-visible { outline: 2px solid #e3a3ff; outline-offset: 2px; }
@media (hover: hover) { .rtile:not(.is-on):hover { transform: translateX(-3px); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .16); } }

/* gear */
.gear { grid-area: gear; display: flex; flex-direction: column; min-height: 200px; padding: 20px 22px; border-radius: 10px; background: var(--surface); box-shadow: inset 0 0 0 1px var(--hair); }
.gear__k { display: flex; justify-content: space-between; gap: 10px; margin: 0; font-size: 12px; font-weight: 800; color: rgba(255, 255, 255, .7); }
.gear__k span { font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, .32); }
.gear__list { flex: 1; display: flex; flex-direction: column; justify-content: space-around; margin: 8px 0 0; padding: 0; list-style: none; }
.gear__list li { display: grid; grid-template-columns: 24px minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 8px 0; }
.gear__list li + li { border-top: 1px solid var(--hair); }
.gear__n { font: 900 11px/1 var(--display); color: rgba(255, 255, 255, .35); }
.gear__list li:first-child .gear__n { background: var(--blob); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.gear__who { display: flex; flex-direction: column; min-width: 0; }
.gear__who b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; font-weight: 800; }
.gear__who small { margin-top: 2px; font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, .45); }
.gear__v { font: 900 13px/1 var(--display); }

/* verdict cards: gradient lives on the card surface */
.verdict { display: flex; flex-direction: column; min-height: 200px; padding: 22px 24px; border-radius: 10px; }
.verdict--love {
  grid-area: love;
  background:
    radial-gradient(90% 90% at 0% 100%, rgba(255, 84, 187, .55), transparent 70%),
    radial-gradient(80% 80% at 100% 100%, rgba(178, 107, 255, .5), transparent 70%),
    var(--surface);
}
.verdict--fix {
  grid-area: fix;
  background:
    radial-gradient(90% 90% at 100% 100%, rgba(255, 24, 59, .5), transparent 70%),
    radial-gradient(70% 70% at 0% 100%, rgba(255, 84, 187, .22), transparent 70%),
    var(--surface);
}
.verdict__k { margin: 0; font-size: 12px; font-weight: 800; color: rgba(255, 255, 255, .7); }
.verdict__big { margin: auto 0 0; padding-top: 18px; font: 900 clamp(38px, 3.4vw, 48px)/1 var(--display); letter-spacing: -.03em; }
.verdict__big small { margin-left: 2px; font: 800 13px/1 var(--ui); letter-spacing: 0; color: rgba(255, 255, 255, .65); }
.verdict__s { margin: 10px 0 0; font: 900 clamp(14px, 1.2vw, 16px)/1.3 var(--display); text-transform: uppercase; letter-spacing: -.005em; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .stage { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-areas: 'spot spot' 'rail rail' 'love fix' 'gear gear'; }
}
@media (max-width: 900px) { .pulse__head { align-items: flex-start; } .pulse__intro { max-width: 280px; font-size: 14px; } }
@media (max-width: 600px) {
  .pulse__head { display: block; margin-bottom: 22px; }
  .pulse__intro { max-width: 420px; margin-top: 16px; font-size: 15px; }
  .seg { gap: 6px; margin: 0 calc(-1 * clamp(16px, 4vw, 40px)) 14px; padding: 0 clamp(16px, 4vw, 40px); }
  .seg button { padding: 0 14px; }
  .stage { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
  .spot { min-height: 520px; padding: 10px; }
  .glass { padding: 18px; }
  .glass__row { flex-direction: column; align-items: flex-start; gap: 14px; }
  .rtile { min-height: 64px; }
  .verdict { min-height: 170px; padding: 18px; }
  .verdict__big { font-size: 36px; }
  .verdict__s { font-size: 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active, .fade-leave-active, .rtile { transition: none; }
}
</style>
