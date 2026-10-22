<script setup lang="ts">
import { guideGames } from '~/data/guides'
import { catalogImageCandidates } from '~/utils/catalogImages'
import type { BuildGroup, BuildItem } from '~/data/characterBuilds'

const route = useRoute()
const game = computed(() => guideGames.find(game => game.id === route.query.game))
const title = computed(() => String(route.query.title || ''))
if (!game.value || !title.value) throw createError({ statusCode: 404, statusMessage: 'Character not found', fatal: true })
// Rendered on the server, so the build arrives with the page (the API answers from a saved
// copy within ~1.5s when the guide site is slow). A failed source is retried automatically.
const { data: profile, status, refresh } = await useFetch('/api/character-build', {
  query: computed(() => ({ game: game.value!.id, title: title.value })), lazy: true, timeout: 60000,
  retry: 2, retryDelay: 1500, retryStatusCodes: [408, 429, 500, 502, 503, 504],
})
useSeoMeta({
  title: () => `${title.value} best build — ${game.value?.name} | KeroSpace`,
  description: () => `${title.value} build recommendations: equipment, main stats and upgrade priorities from character-build databases.`,
  robots: 'noindex, follow',
})
const selectedBuild = ref(0)
watch(profile, () => { selectedBuild.value = 0 })
const build = computed(() => profile.value?.builds[selectedBuild.value])
const loading = computed(() => status.value === 'pending' || status.value === 'idle')
const rosterLink = computed(() => `/guides/${game.value!.id}/characters`)

const attempts = ref<Record<string, number>>({})
function imageSource(source?: string) {
  if (!source) return undefined
  const wiki = catalogImageCandidates(source)
  const candidates = wiki.length ? wiki : [source.startsWith('//') ? `https:${source}` : source]
  const attempt = attempts.value[source] || 0
  if (attempt < candidates.length) return candidates[attempt]
  if (wiki.length && attempt === candidates.length) return `/api/game-artwork?src=${encodeURIComponent(source)}`
  return undefined
}
function retryImage(source: string) { attempts.value[source] = (attempts.value[source] || 0) + 1 }
// A purchase order is a sequence (buy 1 → 6); every other group is a ranking (best pick first).
const isSequence = (group: BuildGroup) => /purchase order/i.test(group.label)
const groupName = (group: BuildGroup) => group.label.replace(/\s*·\s*purchase order/i, '')
// Hero "top picks": each ranked group's first choice, shown with the item's own art.
const topPicks = computed(() => (build.value?.groups || [])
  .filter(group => !isSequence(group) && group.items.length)
  .map(group => ({ slot: groupName(group), item: group.items[0] as BuildItem })))
const sequence = computed(() => build.value?.groups.find(isSequence))

// "SPD > CRIT RATE = CRIT DMG > ATK%" becomes ordered steps; plain text stays one step.
// "CRIT Rate=CRIT DMG", "ATK%>Speed": sources often omit the spaces around comparisons.
const spaced = (value: string) => value.replace(/\s*(>=|<=|≥|≤|->|→|>|<|=)\s*/g, ' $1 ').replace(/\s{2,}/g, ' ').trim()
// A ">" (but not ">=") or arrow starts the next step; a ">=" stays inside its step.
const steps = (value: string) => value.split(/\s*(?:>(?!=)|→|->)\s*/).map(step => spaced(step)).filter(Boolean)
</script>

<template>
  <div class="gd-page gd-page--wall cb" :class="{ 'cb--mlbb': game!.id === 'mlbb' }">
    <!-- same animated poster wall as the homepage -->
    <GuideWall />
    <SiteNav />
    <main class="gd-wrap">
      <nav class="gd-crumbs" aria-label="Breadcrumb">
        <NuxtLink to="/guides">Guides</NuxtLink><span aria-hidden="true">/</span>
        <NuxtLink :to="rosterLink">{{ game!.short }} characters</NuxtLink><span aria-hidden="true">/</span>
        <span aria-current="page">{{ title }}</span>
      </nav>

      <!-- ===== hero: no character art here; the roster card already showed it ===== -->
      <header class="cb-hero">
        <div class="cb-hero__copy">
          <p class="gd-eyebrow">{{ game!.name }} · Character build</p>
          <h1 class="cb-title">{{ title }}</h1>
        </div>

        <!-- each slot's best pick, using the item's own artwork -->
        <ul v-if="topPicks.length" class="cb-picks" aria-label="Top picks">
          <li v-for="pick in topPicks" :key="pick.slot" class="cb-pick">
            <span v-if="imageSource(pick.item.image)" class="cb-pick__art"><img :key="imageSource(pick.item.image)" :src="imageSource(pick.item.image)" alt="" referrerpolicy="no-referrer" decoding="async" @error="retryImage(pick.item.image!)" /></span>
            <span class="cb-pick__copy">
              <span class="cb-pick__slot">Best {{ pick.slot }}</span>
              <span class="cb-pick__name">{{ pick.item.name }}</span>
            </span>
          </li>
        </ul>
        <ol v-else-if="sequence" class="cb-picks" aria-label="Core items">
          <li v-for="(item, index) in sequence.items.slice(0, 3)" :key="item.name" class="cb-pick">
            <span v-if="imageSource(item.image)" class="cb-pick__art"><img :key="imageSource(item.image)" :src="imageSource(item.image)" alt="" referrerpolicy="no-referrer" decoding="async" @error="retryImage(item.image!)" /></span>
            <span class="cb-pick__copy">
              <span class="cb-pick__slot">Buy {{ index + 1 }}</span>
              <span class="cb-pick__name">{{ item.name }}</span>
            </span>
          </li>
        </ol>
        <div v-else-if="loading" class="cb-picks cb-picks--loading" aria-hidden="true">
          <span v-for="n in 3" :key="n" class="gd-skel" />
        </div>
      </header>

      <!-- ===== loading / empty ===== -->
      <div v-if="loading" class="cb-loading" role="status" aria-label="Loading character build">
        <div v-for="n in 3" :key="n" class="gd-skel" />
        <p>Loading equipment and stat recommendations…</p>
      </div>
      <section v-else-if="!build" class="cb-empty" role="status">
        <h2>{{ profile?.status === 'missing' ? 'No verified build yet.' : 'This build couldn’t be loaded.' }}</h2>
        <p>{{ profile?.status === 'missing' ? 'This character does not have equipment recommendations in the connected build database yet.' : 'The build database is temporarily unavailable. Try loading it again.' }}</p>
        <div class="cb-empty__actions">
          <button v-if="profile?.status !== 'missing'" type="button" class="gd-btn" @click="refresh()">Try again</button>
          <NuxtLink :to="rosterLink" class="gd-btn gd-btn--ghost">Back to characters</NuxtLink>
        </div>
      </section>

      <!-- ===== build ===== -->
      <template v-else>
        <div class="cb-bar">
          <div>
            <p class="gd-eyebrow">Equipment &amp; priorities</p>
            <h2 class="cb-h2">Best <em class="gd-em">build.</em></h2>
          </div>
          <div v-if="profile!.builds.length > 1" class="cb-variants" role="group" aria-label="Choose a build">
            <button v-for="(variant, index) in profile!.builds" :key="variant.name" type="button" :aria-pressed="selectedBuild === index" @click="selectedBuild = index">{{ variant.name }}</button>
          </div>
        </div>

        <p v-if="build.note" class="cb-note">{{ build.note }}</p>

        <div class="cb-layout" :class="{ 'cb-layout--solo': !build.stats.length && !build.priorities.length }">
          <div class="cb-groups">
            <section v-for="group in build.groups" :key="group.label" class="cb-group" :aria-label="group.label">
              <header class="cb-group__head">
                <h3>{{ groupName(group) }}</h3>
                <span class="cb-group__count">{{ isSequence(group) ? 'Purchase order' : `${group.items.length} ${group.items.length === 1 ? 'option' : 'options'}` }}</span>
              </header>

              <!-- purchase order: a numbered sequence -->
              <ol v-if="isSequence(group)" class="cb-sequence">
                <li v-for="(item, index) in group.items" :key="`${item.name}-${index}`" class="cb-step">
                  <span class="cb-step__num">{{ index + 1 }}</span>
                  <span v-if="imageSource(item.image)" class="cb-step__art"><img :key="imageSource(item.image)" :src="imageSource(item.image)" alt="" loading="lazy" referrerpolicy="no-referrer" decoding="async" @error="retryImage(item.image!)" /></span>
                  <span class="cb-step__name" :title="item.name">{{ item.name }}</span>
                  <span v-if="item.detail" class="cb-step__detail">{{ item.detail }}</span>
                </li>
              </ol>

              <!-- ranking: every pick, best first, in one list -->
              <ol v-else class="cb-alts">
                <li v-for="(item, index) in group.items" :key="`${item.name}-${index}`" class="cb-alt">
                  <span class="cb-alt__rank">#{{ index + 1 }}</span>
                  <span v-if="imageSource(item.image)" class="cb-alt__art"><img :key="imageSource(item.image)" :src="imageSource(item.image)" alt="" loading="lazy" referrerpolicy="no-referrer" decoding="async" @error="retryImage(item.image!)" /></span>
                  <span class="cb-alt__copy">
                    <span class="cb-alt__name">{{ item.name }}</span>
                    <span v-if="item.detail" class="cb-alt__detail">{{ item.detail }}</span>
                  </span>
                </li>
              </ol>
            </section>
          </div>

          <aside v-if="build.stats.length || build.priorities.length" class="cb-aside">
            <section v-if="build.stats.length" class="cb-panel" aria-labelledby="cb-stats-title">
              <h3 id="cb-stats-title" class="cb-panel__title">Stats to build</h3>
              <dl class="cb-stats">
                <div v-for="(stat, index) in build.stats" :key="`${stat.label}-${index}`">
                  <dt>{{ stat.label }}</dt>
                  <dd>{{ spaced(stat.value) }}</dd>
                </div>
              </dl>
            </section>
            <section v-if="build.priorities.length" class="cb-panel" aria-labelledby="cb-priority-title">
              <h3 id="cb-priority-title" class="cb-panel__title">Priorities</h3>
              <div v-for="(priority, index) in build.priorities" :key="`${priority.label}-${index}`" class="cb-priority">
                <p class="cb-priority__label">{{ priority.label }}</p>
                <ol class="cb-chain">
                  <li v-for="(step, si) in steps(priority.value)" :key="si"><span class="cb-chain__number">{{ si + 1 }}</span><span class="cb-chain__text">{{ step }}</span></li>
                </ol>
              </div>
            </section>
          </aside>
        </div>
      </template>

      <GuideTeamSynergy :game-id="game!.id" :title="title" :teams="profile?.teams" :loading="loading" :source-url="profile?.source.url" />
    </main>
    <SiteFooter />
  </div>
</template>

<style src="../../assets/css/guides.css"></style>
<style scoped>
.cb {
  --cb-line: #2a2a31;
  --cb-edge: #4a4a53;
  --cb-panel: #0a0a0d;
  --cb-head: 44px;
  --cb-head-gap: 18px;
  --cb-grad: linear-gradient(100deg, #ff2a3d, #ff54bb 50%, #b26bff);
  /* small number badges: the full red → purple sweep bands harshly over ~22px, so use a
     shorter, diagonal blend between neighbouring hues */
  --cb-grad-soft: linear-gradient(135deg, #ff4f9a 0%, #e266d6 50%, #b97cff 100%);
  background: transparent;
  color: #fff;
}

/* ============ hero ============ */
.cb-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(28px, 3.4vw, 40px);
  padding: clamp(24px, 3vw, 40px) 0 clamp(16px, 2vw, 28px);
}
.cb-title {
  margin: 0;
  font: 900 clamp(40px, 7vw, 104px) / 0.95 var(--display);
  letter-spacing: -0.045em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
/* top picks sit below the title, one per slot in a row */
.cb-picks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cb-pick {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 12px 16px 12px 12px;
  border: 1px solid var(--cb-edge);
  background: var(--cb-panel);
  transition: border-color 0.2s;
}
/* a pick without art drops the art column but keeps the height of one with art (64px art,
   12px padding top and bottom, 1px borders) */
.cb-pick {
  min-height: 90px;
}
.cb-pick:not(:has(.cb-pick__art)) {
  grid-template-columns: minmax(0, 1fr);
}
.cb-pick__art {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  background: radial-gradient(70% 70% at 50% 60%, rgba(178, 107, 255, 0.22), transparent 70%), #111015;
}
.cb-pick__art img {
  max-width: 54px;
  max-height: 54px;
  object-fit: contain;
}
.cb-pick__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}
.cb-pick__slot {
  color: #ff9fd6;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.cb-pick__name {
  font: 800 15px / 1.35 var(--display);
  overflow-wrap: anywhere;
}
.cb-picks--loading span {
  display: block;
  height: 88px;
}

/* ============ section bar ============ */
.cb-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin: clamp(28px, 3.5vw, 48px) 0 clamp(24px, 3vw, 36px);
}
.cb-note {
  max-width: 760px;
  margin: calc(clamp(24px, 3vw, 36px) * -0.5) 0 clamp(24px, 3vw, 36px);
  color: #c9c2ce;
  font: 600 13px / 1.6 var(--ui);
}
.cb-h2 {
  margin: 0;
  font: 900 clamp(28px, 3.6vw, 48px) / 1.05 var(--display);
  letter-spacing: -0.035em;
  text-transform: uppercase;
}
.cb-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--cb-edge);
}
.cb-variants button {
  padding: 10px 16px;
  border: 0;
  background: transparent;
  color: #fff;
  font: 800 12px / 1.4 var(--ui);
  cursor: pointer;
  transition: background 0.2s;
}
.cb-variants button[aria-pressed='true'] {
  background: var(--cb-grad);
}

/* ============ layout ============ */
.cb-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: clamp(28px, 3.4vw, 48px);
}
.cb-layout--solo {
  grid-template-columns: minmax(0, 1fr);
}
.cb-groups {
  display: grid;
  min-width: 0;
  gap: clamp(36px, 4vw, 52px);
}
.cb-group__head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  /* fixed height so the sidebar can line up with the first card below it */
  box-sizing: border-box;
  height: var(--cb-head);
  margin-bottom: var(--cb-head-gap);
  padding-bottom: 14px;
  border-bottom: 1px solid var(--cb-line);
}
.cb-group__head h3 {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: 900 clamp(18px, 1.8vw, 24px) / 1.2 var(--display);
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
.cb-group__count {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cb-alts {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cb-alt {
  display: grid;
  grid-template-columns: 34px 52px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 10px 14px 10px 10px;
  border: 1px solid var(--cb-edge);
  background: var(--cb-panel);
  transition: border-color 0.2s;
}
/* likewise for ranked rows: 52px art, 10px padding top and bottom, 1px borders */
.cb-alt {
  min-height: 74px;
}
.cb-alt:not(:has(.cb-alt__art)) {
  grid-template-columns: 34px minmax(0, 1fr);
}
.cb-alt__rank {
  font: 800 13px / 1 var(--display);
  text-align: center;
}
.cb-alt__art {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  background: #111015;
}
.cb-alt__art img {
  max-width: 44px;
  max-height: 44px;
  object-fit: contain;
}
.cb-alt__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}
.cb-alt__name {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.cb-alt__detail {
  font-size: 12px;
  line-height: 1.5;
}

/* purchase order: numbered steps */
.cb-sequence {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cb-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  gap: 10px;
  padding: 18px 14px 16px;
  border: 1px solid var(--cb-edge);
  background: var(--cb-panel);
  text-align: center;
}
.cb-step__num {
  position: absolute;
  top: 10px;
  left: 10px;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  background: var(--cb-grad-soft);
  font: 800 12px / 1 var(--display);
}
.cb-step__art {
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
}
.cb-step__art img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.cb-step__name {
  display: block;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}
.cb-step__detail {
  font-size: 12px;
  line-height: 1.5;
}

/* MLBB: balanced purchase-order rows and a centered stack in each card. */
.cb--mlbb .cb-sequence {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.cb--mlbb .cb-step {
  min-width: 0;
  justify-content: center;
  align-items: center;
  padding: 18px 12px;
}

/* ============ aside ============ */
.cb-aside {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  min-width: 0;
}
.cb-panel {
  padding: 22px;
  border: 1px solid var(--cb-edge);
  background: var(--cb-panel);
}
.cb-panel__title {
  margin: 0 0 16px;
  padding-bottom: 14px;
  border-bottom: 2px solid transparent;
  border-image: var(--cb-grad) 1;
  font: 900 15px / 1.3 var(--display);
  letter-spacing: -0.01em;
  text-transform: uppercase;
}
.cb-stats {
  display: grid;
  margin: 0;
}
.cb-stats > div {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 12px;
  padding: 11px 0;
  border-top: 1px solid var(--cb-line);
}
.cb-stats > div:first-child {
  border-top: 0;
  padding-top: 0;
}
.cb-stats dt {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  line-height: 1.7;
  text-transform: uppercase;
}
.cb-stats dd {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.cb-priority + .cb-priority {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--cb-line);
}
.cb-priority__label {
  margin: 0 0 10px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.cb-chain {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cb-chain li {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.cb-chain__number {
  display: grid;
  place-items: center;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  border: 1px solid var(--cb-edge);
  font: 800 10px / 1 var(--display);
}
.cb-chain__text {
  display: flex;
  align-items: center;
  min-height: 24px;
  min-width: 0;
  line-height: 24px;
}
.cb-chain li:first-child .cb-chain__number {
  border-color: transparent;
  background: var(--cb-grad-soft);
}

/* ============ states & credit ============ */
.cb-loading {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 40px;
}
.cb-loading > div {
  height: 220px;
}
.cb-loading > p {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 13px;
}
.cb-empty {
  max-width: 680px;
  margin-top: 40px;
  padding: 28px;
  border: 1px solid var(--cb-edge);
  background: var(--cb-panel);
}
.cb-empty h2 {
  margin: 0 0 12px;
  font: 800 22px / 1.4 var(--display);
}
.cb-empty p {
  margin: 0 0 20px;
  line-height: 1.8;
}
.cb-empty__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.cb :is(a, button):focus-visible {
  outline: 2px solid #ffc0e8;
  outline-offset: 4px;
}

@media (hover: hover) {
  .cb-variants button:not([aria-pressed='true']):hover {
    background: #1a1a20;
  }
}

@media (max-width: 1100px) {
  .cb-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .cb-aside {
    grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
    margin-top: 0;
  }
}
@media (max-width: 860px) {
  .cb-hero {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
  }
}
@media (max-width: 560px) {
  .cb-loading {
    grid-template-columns: minmax(0, 1fr);
  }
  .cb-sequence, .cb--mlbb .cb-sequence {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .cb-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}

</style>
