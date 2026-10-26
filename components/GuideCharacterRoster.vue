<script setup lang="ts">
import { guideGames } from '~/data/guides'
import { catalogImageCandidates, hasCatalogArtwork } from '~/utils/catalogImages'
import type { CatalogEntry, CatalogResponse } from '~/data/gameCatalogs'
import rosterSnapshots from '~/data/guideRosterSnapshots.json'
import guideArtwork from '~/data/guideArtwork.json'

// One released character roster for each game's guide page.
const props = withDefaults(defineProps<{ gameId: string; headingLevel?: 'h1' | 'h2' }>(), { headingLevel: 'h2' })
const gameId = computed(() => props.gameId)
const kindId = computed(() => 'characters' as const)
const game = computed(() => guideGames.find(item => item.id === gameId.value)!)
const kind = { id: 'characters', label: 'Characters & heroes' }

const query = ref('')
const mobileSearch = ref(false)
let searchViewport: MediaQueryList | undefined
function updateSearchViewport() {
  mobileSearch.value = searchViewport?.matches ?? false
}
onMounted(() => {
  searchViewport = window.matchMedia('(max-width: 640px)')
  updateSearchViewport()
  searchViewport.addEventListener('change', updateSearchViewport)
})
onBeforeUnmount(() => searchViewport?.removeEventListener('change', updateSearchViewport))
const search = ref('')
const entries = ref<CatalogEntry[]>([])
const cursor = ref<string | null>(null)
const traversalLimited = ref(false)
const loadingMore = ref(false)
const moreError = ref(false)
const imageAttempts = ref<Record<string, number>>({})
const savedRoster = computed(() => (rosterSnapshots as Record<string, CatalogResponse>)[gameId.value])
// Saved portraits are found by character name too, so a renamed image on the wiki still shows
// KeroSpace's own copy.
const savedImages = computed(() => new Map((savedRoster.value?.items || []).map(item => [item.title, item.image || ''])))
function entryImage(entry: CatalogEntry) {
  const artwork = guideArtwork as Record<string, string>
  const local = artwork[entry.image || ''] || artwork[savedImages.value.get(entry.title) || '']
  const candidates = entry.image?.startsWith('/images/') ? [entry.image] : [...(local ? [local] : []), ...catalogImageCandidates(entry.image)]
  const attempt = imageAttempts.value[entry.image || ''] || 0
  // Keep direct CDN delivery fast, then use server delivery if the browser cannot load it.
  if (attempt < candidates.length) return candidates[attempt]
  if (entry.image?.startsWith('https:') && attempt === candidates.length) return `/api/game-artwork?src=${encodeURIComponent(entry.image)}`
  return undefined
}
// Bundled portraits have a phone-sized copy beside them (scripts/sync-guide-rosters.py).
function entrySrcset(entry: CatalogEntry) {
  const source = entryImage(entry)
  return source?.startsWith('/images/guide-roster/') ? `${source.replace(/\.\w+$/, '-360.webp')} 360w, ${source} 640w` : undefined
}
function retryImage(entry: CatalogEntry) {
  const key = entry.image || ''
  imageAttempts.value[key] = (imageAttempts.value[key] || 0) + 1
}

// Render the last verified first page in SSR. Refresh from the live catalogue after
// hydration, without making initial content depend on third-party availability.
const { data, status, error, refresh } = await useFetch<CatalogResponse>('/api/game-catalog', {
  query: computed(() => ({ game: gameId.value, kind: kindId.value, search: search.value })),
  server: false,
  timeout: 45000,
  default: () => search.value ? undefined : (rosterSnapshots as Record<string, CatalogResponse>)[gameId.value],
})
// Characters fetched ahead of time. "Load more" only appears once this holds at least one
// character that isn't on screen yet, so the button can never add nothing.
const buffered = ref<CatalogEntry[]>([])
let prefetchRun = 0
watch(data, value => {
  if ((!value || value.status !== 'available') && !search.value && entries.value.length) return
  // A live list missing saved characters means the wiki changed, not the game: keep ours.
  if (value && value !== savedRoster.value && !search.value && savedRoster.value) {
    const live = new Set(value.items.map(item => item.title))
    if (savedRoster.value.items.filter(item => !live.has(item.title)).length > 2) {
      if (entries.value.length) return
      value = savedRoster.value
    }
  }
  entries.value = value?.items || []
  cursor.value = value?.next || null
  traversalLimited.value = value?.traversalLimited || false
  moreError.value = false
  buffered.value = []
  if (import.meta.client) prefetch()
}, { immediate: true })

function submitSearch() { search.value = query.value.trim() }
function clearSearch() { query.value = ''; search.value = '' }
// Read ahead until the next new characters are found or the list ends.
async function prefetch() {
  const run = ++prefetchRun
  const requested = { game: gameId.value, kind: kindId.value, search: search.value }
  try {
    for (let page = 0; page < 40 && cursor.value && !buffered.value.length; page++) {
      const result = await $fetch('/api/game-catalog', {
        query: { ...requested, ...(requested.search ? { offset: cursor.value } : { cursor: cursor.value }) },
        timeout: 45000,
      })
      if (run !== prefetchRun || requested.game !== gameId.value || requested.kind !== kindId.value || requested.search !== search.value) return
      if (result.status !== 'available') throw new Error('Source unavailable')
      const seen = new Set(entries.value.map(item => item.id))
      buffered.value = result.items.filter(item => !seen.has(item.id) && seen.add(item.id))
      cursor.value = result.next
      traversalLimited.value = result.traversalLimited
    }
  } catch { if (run === prefetchRun) moreError.value = true }
}
async function loadMore() {
  if (!buffered.value.length || loadingMore.value) return
  loadingMore.value = true
  moreError.value = false
  entries.value.push(...buffered.value)
  buffered.value = []
  loadingMore.value = false
  await prefetch()
}

const visibleEntries = computed(() => entries.value.filter(entry => hasCatalogArtwork(entry) && entryImage(entry)))
const isLoading = computed(() => !visibleEntries.value.length && (status.value === 'pending' || status.value === 'idle'))
</script>

<template>
  <section id="database" class="gx-section character-roster" :class="{ 'character-roster--mlbb': gameId === 'mlbb' }" aria-labelledby="character-roster-title">
      <!-- ===== header ===== -->
      <header class="gk-head">
        <div class="gk-head__copy">
          <p class="gd-eyebrow">{{ game.short }} · Character builds</p>
          <component :is="headingLevel" id="character-roster-title" class="gk-head__title">Characters &amp;<br /><em class="gd-em">best builds.</em></component>
          <p class="gk-head__lede">Choose a released character to see recommended equipment and stat priorities.</p>
          <form class="gk-search" role="search" @submit.prevent="submitSearch">
            <label for="gk-search-input">Search {{ game.short }} characters</label>
            <div class="gk-search__row">
              <svg class="gk-search__icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
              <input id="gk-search-input" v-model="query" type="search" :placeholder="mobileSearch ? 'Search a character' : 'Search a character or hero…'" maxlength="120" />
              <button type="submit">Search</button>
            </div>
          </form>
        </div>
      </header>

      <div class="gk-status">
        <p v-if="search">Results for “{{ search }}” in {{ game.short }} characters <button type="button" class="gk-link" @click="clearSearch">Back to {{ kind.label }}</button></p>
        <p v-else>{{ kind.label }} in {{ game.name }}</p>
        <p v-if="!isLoading && !error" class="gk-status__count" aria-live="polite">{{ visibleEntries.length }} {{ visibleEntries.length === 1 ? 'entry' : 'entries' }}</p>
      </div>

      <!-- loading -->
      <ul v-if="isLoading" class="gk-grid" aria-busy="true" aria-label="Loading entries">
        <li v-for="n in 12" :key="n" class="gk-card gk-card--skeleton">
          <span class="gd-skel gk-card__art" />
          <span class="gk-card__body"><span class="gd-skel gk-skel-line" /></span>
        </li>
      </ul>

      <!-- source unavailable -->
      <div v-else-if="!visibleEntries.length && (error || data?.status === 'unavailable')" class="gk-message" role="status">
        <h2>Characters couldn’t be loaded.</h2>
        <p>The character database didn’t respond. Try again in a moment.</p>
        <button type="button" class="gd-btn" @click="refresh()">Try again</button>
      </div>

      <template v-else>
        <ul v-if="visibleEntries.length" class="gk-grid">
          <li v-for="(entry, index) in visibleEntries" :key="entry.id">
            <NuxtLink :to="{ path: '/guides/database', query: { game: game.id, title: entry.title } }" class="gk-card neon-hover-outline" :title="entry.title">
              <!-- every game's artwork is shown whole, fitted inside the frame -->
              <span class="gk-card__art">
                <img :key="entryImage(entry)" :src="entryImage(entry)" :srcset="entrySrcset(entry)" :sizes="entrySrcset(entry) ? '(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 300px' : undefined" :alt="entry.title" :loading="index < 6 ? 'eager' : 'lazy'" decoding="async" referrerpolicy="no-referrer" @error="retryImage(entry)" />
              </span>
              <span class="gk-card__body">
                <span class="gk-card__title">{{ entry.title }}</span>
                <span class="gk-card__more">View build <span aria-hidden="true">↗</span></span>
              </span>
            </NuxtLink>
          </li>
        </ul>
        <div v-else class="gk-message">
          <h2>{{ search ? 'No illustrated results for that search.' : cursor ? 'No artwork in this batch.' : 'No illustrated entries yet.' }}</h2>
          <p>{{ cursor && !search ? 'Load more entries to continue browsing.' : 'Try searching for another name. Only entries with artwork are shown.' }}</p>
          <button v-if="search" type="button" class="gd-btn gd-btn--ghost" @click="clearSearch">CLEAR SEARCH</button>
        </div>

        <div v-if="buffered.length || moreError" class="gk-more">
          <button v-if="buffered.length" type="button" class="gd-btn" :disabled="loadingMore" @click="loadMore()">{{ loadingMore ? 'LOADING…' : 'LOAD MORE ENTRIES' }}</button>
          <p v-if="moreError" role="status">Couldn’t load the next page. Your entries are kept; try again.</p>
          <button v-if="moreError && !buffered.length" type="button" class="gd-btn" @click="moreError = false; prefetch()">Retry loading more</button>
        </div>
        <p v-if="traversalLimited" class="gk-fine">This section is larger than the browsing limit. Search by name to find more entries.</p>
      </template>
  </section>
</template>

<style scoped>
/* ============ header ============ */
.gk-head {
  padding: clamp(24px, 3vw, 40px) 0 28px;
  border-bottom: 1px solid var(--gd-edge);
}
.gk-head__title {
  margin: 0;
  font: 900 clamp(30px, 4.4vw, 60px) / 1.05 var(--display);
  letter-spacing: -0.035em;
  text-transform: uppercase;
  text-wrap: balance;
}
.gk-head__lede {
  max-width: 700px;
  margin: 16px 0 0;
  color: var(--ink-2);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.65;
}
.gk-search {
  max-width: 700px;
  margin-top: 22px;
}
.gk-search label {
  display: block;
  margin-bottom: 10px;
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.gk-search__row {
  position: relative;
  display: flex;
  border: 2px solid transparent;
  border-image: linear-gradient(110deg, #ff183b, #ff183b 55%, #dcdce0) 1;
  background: var(--gd-panel);
}
.gk-search__icon {
  position: absolute;
  left: 13px;
  top: 50%;
  translate: 0 -50%;
  color: #fff;
  opacity: 1;
  pointer-events: none;
}
.gk-search input {
  flex: 1;
  min-width: 0;
  min-height: 40px;
  padding: 8px 12px 8px 42px;
  border: 0;
  background: transparent;
  color: #fff;
  font: 600 14px / 1.4 var(--ui);
  /* shown in caps; the search itself still matches any case */
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.gk-search input::placeholder {
  color: #fff;
  opacity: 1;
}
.gk-search input:focus {
  outline: none;
}
.gk-search button {
  flex-shrink: 0;
  padding: 0 22px;
  border: 0;
  background: linear-gradient(110deg, #ff183b 0%, #ff183b 55%, #dcdce0 100%) border-box no-repeat;
  color: #fff;
  /* keeps the white label readable where the gradient fades to light grey */
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter 0.2s;
}

.gk-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 28px 0 20px;
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 700;
}
.gk-status p {
  margin: 0;
}
.gk-status__count {
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.gk-status .gk-link {
  /* "Back to …" sits on its own line under the results line */
  display: block;
  margin-top: 6px;
}
.gk-link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--gd-pink);
  font: inherit;
  cursor: pointer;
}

/* ============ grid: even rows, one artwork shape per section ============ */
.gk-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.gk-grid > li {
  min-width: 0;
}
.gk-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 2px solid var(--gd-line);
  background: var(--gd-panel);
  color: inherit;
}
.gk-card__art {
  aspect-ratio: 17 / 20;
  flex-shrink: 0;
  position: relative;
  display: block;
  overflow: hidden;
  background:
    radial-gradient(90% 70% at 50% 100%, rgba(255, 77, 94, 0.22), transparent 70%),
    #000000;
}
.gk-card__art img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  object-fit: contain;
  object-position: center;
}
.gk-card__body {
  display: flex;
  height: 132px;
  flex: 0 0 132px;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px 18px;
}
.gk-card__title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  font: 800 15px / 1.35 var(--display);
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}
.gk-card__more {
  margin-top: auto;
  color: #ff4d5e;
  font-size: 12px;
  font-weight: 800;
}
.gk-card--skeleton {
  pointer-events: none;
}
.gk-skel-line {
  display: block;
  width: 70%;
  height: 14px;
}

.gk-message {
  max-width: 640px;
  padding: 32px;
  border: 2px solid var(--gd-line);
  background: var(--gd-panel);
}
.gk-message h2 {
  margin: 0 0 8px;
  font: 800 18px / 1.4 var(--display);
}
.gk-message p {
  margin: 0 0 18px;
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.7;
}
.gk-more {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 14px;
  margin-top: 32px;
}
.gk-more .gd-btn {
  font-family: var(--display);
}
.gk-more p,
.gk-fine {
  margin: 0;
  color: var(--ink-2);
  font-size: 13px;
  text-align: center;
}
.gk-fine {
  margin-top: 16px;
}
.gd-btn:disabled {
  opacity: 0.55;
  cursor: wait;
}

@media (hover: hover) {
  .gk-search button:hover {
    filter: brightness(1.08);
  }
  .gk-sections a:not([aria-current='page']):hover {
    border-color: var(--gd-edge);
    color: #fff;
  }
  .gk-card:hover .gk-card__more {
    color: #fff;
  }
}

@media (max-width: 1100px) {
  .gk-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .gk-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}
@media (max-width: 560px) {
  .gk-search input { font-size: 16px; }
  .gk-search button { padding-inline: 14px; }
  .gk-card__body {
    padding: 12px 12px 14px;
  }
  .gk-card__title {
    font-size: 13px;
  }
  .gk-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gk-card__art img {
    transition: none;
  }
}
</style>
