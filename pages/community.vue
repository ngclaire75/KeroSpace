<script setup lang="ts">
import { compatibilityGames, compatibilityModes } from '~/data/playTogether'
import { platformMarks } from '~/data/platforms'
import { communityHubs, communityCreators, moreStreamers, twitchAvatar, teamUpSteps, safetyTips, communityFaq } from '~/data/community'

useHead({ title: 'Community — KeroSpace' })

const gameById = Object.fromEntries(compatibilityGames.map(g => [g.id, g]))
const hubs = communityHubs.map(hub => ({ ...hub, game: gameById[hub.id] }))
// shorter labels where the full title is too long for the tabs
const shortName: Record<string, string> = { mlbb: 'Mobile Legends' }
const creators = communityCreators.map(c => ({ ...c, gameName: shortName[c.game] ?? gameById[c.game]?.name ?? '' }))

// streamers: one tab per game, featured creator + 14 more = 15 each
const activeGame = ref(creators[0].game)
const featured = computed(() => creators.find(c => c.game === activeGame.value)!)
const streamers = computed(() => moreStreamers[activeGame.value] ?? [])
const streamerTotal = creators.length + Object.values(moreStreamers).reduce((n, list) => n + list.length, 0)
const twitchSearch = (name: string) => `https://www.twitch.tv/search?term=${encodeURIComponent(name)}`
// avatars come from /api/twitch-avatar/<handle>, which always redirects to the
// streamer's current Twitch picture. If that request ever fails in the browser,
// load the verified picture directly instead.
function useVerifiedAvatar(event: Event, file: string) {
  const img = event.target as HTMLImageElement
  const direct = twitchAvatar(file)
  if (img.src !== direct) img.src = direct
  else img.style.visibility = 'hidden' // never show the browser's broken-image icon
}

// numbers on the page come straight from the data, nothing invented
const stats = [
  { value: hubs.length, label: 'Games covered' },
  { value: streamerTotal, label: 'Streamers to follow' },
  { value: compatibilityGames.filter(g => g.details.crossplay.tone === 'yes').length, label: 'Games with cross-play' },
  { value: compatibilityGames.filter(g => g.details.crosssave.tone === 'yes').length, label: 'Games with cross-save' },
]

const jumps = [
  { id: 'hubs', label: 'Official hubs' },
  { id: 'creators', label: 'Creators' },
  { id: 'team-up', label: 'Team-up guide' },
  { id: 'play-safe', label: 'Play safe' },
  { id: 'faq', label: 'FAQ' },
]

const pad = (n: number) => String(n).padStart(2, '0')
// one text label per platform (Mac + iOS listed separately, no icons)
const platformLabels = (ids: string[]) => ids.map(id => platformMarks[id as keyof typeof platformMarks].label.replace('¹', ''))
</script>

<template>
  <div class="cm">
    <SiteNav />

    <main>
      <!-- ================= hero ================= -->
      <section class="hero" aria-labelledby="cm-title">
        <div class="wrap hero__grid">
          <div class="hero__copy">
            <p class="eyebrow"><span aria-hidden="true" />KeroSpace community</p>
            <h1 id="cm-title">Find your <em>party</em>.<br />Play it <em>together</em>.</h1>
            <p class="lead">Official hubs, creators worth watching and everything to check before you invite a friend, for every game we cover.</p>
            <nav class="jump" aria-label="On this page">
              <a v-for="(j, i) in jumps" :key="j.id" :href="`#${j.id}`"><b>{{ pad(i + 1) }}</b>{{ j.label }}</a>
            </nav>
          </div>

          <div class="mosaic" aria-hidden="true">
            <div v-for="(c, i) in creators" :key="c.handle" class="mosaic__tile" :class="`mosaic__tile--${i + 1}`">
              <img class="mosaic__bg" :src="c.banner" alt="" width="480" height="270" />
              <span class="mosaic__who">
                <img :src="c.photo" alt="" width="40" height="40" />
                <span><b>{{ c.name }}</b>{{ c.gameName }}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="wrap">
          <ul class="stats">
            <li v-for="s in stats" :key="s.label">
              <strong>{{ pad(s.value) }}</strong>
              <span>{{ s.label }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- ================= official hubs ================= -->
      <section id="hubs" class="block" aria-labelledby="hubs-title">
        <div class="wrap">
          <header class="head">
            <div>
              <p class="eyebrow"><span aria-hidden="true" />Straight from the source</p>
              <h2 id="hubs-title">Official <em>hubs</em></h2>
            </div>
            <p>News, events and patch notes come from these pages first. Bookmark the ones for your games.</p>
          </header>

          <div class="hubs">
            <article v-for="hub in hubs" :key="hub.id" class="hub neon-hover-outline">
              <div class="hub__art">
                <img class="hub__banner" :class="`hub__banner--${hub.id}`" :src="hub.banner" alt="" width="480" height="270" loading="lazy" decoding="async" />
                <img class="hub__logo" :src="`/images/games/${hub.id}-logo.webp`" :alt="hub.game.name" width="140" height="56" loading="lazy" />
              </div>
              <div class="hub__body">
                <p class="hub__meta"><span>{{ hub.developer }}</span><span>{{ hub.game.category }}</span></p>
                <ul class="chips" :aria-label="`${hub.game.name} platforms`">
                  <li v-for="p in platformLabels(hub.game.platforms)" :key="p">{{ p }}</li>
                </ul>
                <dl class="hub__status">
                  <div v-for="m in compatibilityModes" :key="m.id">
                    <dt>{{ m.name }}</dt>
                    <dd><span class="pill" :class="`pill--${hub.game.details[m.id].tone}`">{{ hub.game.details[m.id].status }}</span></dd>
                  </div>
                </dl>
                <div class="hub__links">
                  <a :href="hub.site" target="_blank" rel="noopener noreferrer">Official site <span aria-hidden="true">↗</span></a>
                  <a v-if="hub.community" :href="hub.community.href" target="_blank" rel="noopener noreferrer">{{ hub.community.label }} <span aria-hidden="true">↗</span></a>
                </div>
              </div>
            </article>
          </div>
          <p class="swipe-hint" aria-hidden="true">Swipe for all six games</p>
        </div>
      </section>

      <!-- ================= creators ================= -->
      <section id="creators" class="block" aria-labelledby="creators-title">
        <div class="wrap">
          <header class="head">
            <div>
              <p class="eyebrow"><span aria-hidden="true" />Watch &amp; learn</p>
              <h2 id="creators-title">Streamers <em>to follow</em></h2>
            </div>
            <p>Fifteen Twitch channels for every game we cover. Pick a game to see who’s worth a follow.</p>
          </header>

          <div class="tabs" role="tablist" aria-label="Choose a game">
            <button v-for="c in creators" :key="c.game" type="button" role="tab" class="tabs__tab neon-hover-outline"
              :class="{ 'is-active': c.game === activeGame }" :aria-selected="c.game === activeGame"
              aria-controls="streamers-panel" @click="activeGame = c.game">
              <span>{{ c.gameName }}</span>
            </button>
          </div>

          <div id="streamers-panel" class="streamers" role="tabpanel" :aria-label="`${featured.gameName} streamers`">
            <!-- featured creator, styled like the home page spotlight card -->
            <article class="creator neon-hover-outline" aria-labelledby="featured-name">
              <div class="creator__art">
                <img :src="featured.banner" alt="" width="480" height="270" decoding="async" />
                <span class="creator__pill">Featured</span>
              </div>
              <div class="creator__body">
                <div class="creator__avatar">
                  <img :src="featured.photo" :alt="`${featured.name}, Twitch streamer`" width="80" height="80" />
                </div>
                <p class="creator__category">{{ featured.gameName }} · {{ featured.role }}</p>
                <h3 id="featured-name">{{ featured.name }}</h3>
                <p class="creator__bio">{{ featured.bio }}</p>
                <a class="creator__cta" :href="`https://www.twitch.tv/${featured.handle}`" target="_blank" rel="noopener noreferrer"
                  :aria-label="`Watch ${featured.name} on Twitch (opens in a new tab)`">
                  <span>Watch {{ featured.name }} on Twitch</span><span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>

            <div class="roster">
              <p class="roster__head"><b>{{ streamers.length + 1 }}</b> streamers for {{ featured.gameName }}</p>
              <ol class="roster__list">
                <li v-for="(s, i) in streamers" :key="s.handle">
                  <a :href="`https://www.twitch.tv/${s.handle}`" target="_blank" rel="noopener noreferrer"
                    :aria-label="`${s.name} on Twitch (opens in a new tab)`">
                    <span class="roster__avatar" aria-hidden="true">
                      <img :src="`/api/twitch-avatar/${s.handle}`" alt="" width="42" height="42" loading="lazy" decoding="async"
                        referrerpolicy="no-referrer" @error="useVerifiedAvatar($event, s.avatar)" />
                    </span>
                    <span class="roster__who">
                      <b>{{ s.name }}</b>
                      <small>{{ s.note }}</small>
                    </span>
                    <span class="roster__lang">{{ s.lang }}</span>
                    <span class="roster__go" aria-hidden="true">↗</span>
                  </a>
                </li>
              </ol>
              <a class="roster__more" :href="twitchSearch(featured.gameName)" target="_blank" rel="noopener noreferrer">
                Find more {{ featured.gameName }} streams on Twitch <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= team-up guide ================= -->
      <section id="team-up" class="block block--tint" aria-labelledby="teamup-title">
        <div class="wrap">
          <header class="head">
            <div>
              <p class="eyebrow"><span aria-hidden="true" />Five-step checklist</p>
              <h2 id="teamup-title">Before you <em>team up</em></h2>
            </div>
            <p>Run through this with your friends and you’ll spend less time in menus and more time playing.</p>
          </header>

          <ol class="steps">
            <li v-for="(s, i) in teamUpSteps" :key="s.title">
              <span class="steps__num">{{ pad(i + 1) }}</span>
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- ================= play safe ================= -->
      <section id="play-safe" class="block" aria-labelledby="safe-title">
        <div class="wrap safe">
          <div class="safe__lead">
            <p class="eyebrow eyebrow--light"><span aria-hidden="true" />Play safe</p>
            <h2 id="safe-title">Your account <br />is your progress.</h2>
            <p>Hundreds of hours live in one login. A few habits keep it yours.</p>
            <a href="/top-up" class="btn btn--light">Top up safely <span aria-hidden="true">→</span></a>
          </div>
          <ol class="safe__tips">
            <li v-for="(t, i) in safetyTips" :key="t.title">
              <span>{{ pad(i + 1) }}</span>
              <h3>{{ t.title }}</h3>
              <p>{{ t.text }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- ================= faq ================= -->
      <section id="faq" class="block block--tint" aria-labelledby="faq-title">
        <div class="wrap faq">
          <header class="faq__head">
            <p class="eyebrow"><span aria-hidden="true" />Good questions</p>
            <h2 id="faq-title">Community <em>FAQ</em></h2>
            <p>Quick answers to what players ask most before playing together.</p>
          </header>
          <div class="faq__list">
            <details v-for="(item, i) in communityFaq" :key="item.q" :open="i === 0">
              <summary>{{ item.q }}<i aria-hidden="true" /></summary>
              <p>{{ item.a }}</p>
            </details>
          </div>
        </div>
      </section>

      <!-- ================= cta ================= -->
      <section class="block block--cta" aria-labelledby="cta-title">
        <div class="wrap">
          <div class="cta">
            <div class="cta__copy">
              <h2 id="cta-title">Ready for your <br />next run?</h2>
              <p>Look up an item, check your party and jump back in.</p>
              <div class="cta__actions">
                <a href="/#supported-games" class="btn btn--light">Explore games <span aria-hidden="true">→</span></a>
                <a href="/top-up" class="btn btn--glass">Top up</a>
              </div>
            </div>
            <div class="cta__eggs" aria-hidden="true">
              <img src="/images/egg-2.webp" alt="" width="1400" height="1400" loading="lazy" />
              <img src="/images/egg-4.webp" alt="" width="1400" height="1400" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.cm {
  --c-red: #ff183b;
  --c-pink: #ff54bb;
  --c-purple: #b26bff;
  --c-muted: rgba(255, 255, 255, 0.66);
  --c-line: rgba(255, 255, 255, 0.1);
  --c-card: #0b0a0f;
  --c-grad: linear-gradient(100deg, var(--c-pink), var(--c-red) 50%, var(--c-purple));
  min-height: 100dvh;
  background: #000;
}
.wrap {
  width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px));
  margin: 0 auto;
}
[id] {
  scroll-margin-top: 24px;
}

/* ---------- shared type ---------- */
.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.eyebrow > span {
  width: 26px;
  height: 2px;
  background: var(--c-grad);
}
.eyebrow--light > span {
  background: #fff;
}
h1,
h2,
h3 {
  margin: 0;
}
h1 em,
h2 em {
  font-style: normal;
  background: var(--c-grad);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.block {
  padding: clamp(48px, 6vw, 88px) 0;
}
.block--tint {
  background: #000;
}
.head {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: end;
  gap: 20px 48px;
  margin-bottom: clamp(28px, 4vw, 44px);
}
.head h2,
.faq__head h2 {
  font: 800 clamp(28px, 3.4vw, 46px)/1.15 var(--display);
  letter-spacing: -0.01em;
  text-transform: uppercase;
}
.head > p,
.faq__head > p {
  max-width: 460px;
  margin: 0;
  color: var(--c-muted);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.75;
}

/* ---------- pills ---------- */
.pill {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 11px;
  border-radius: 999px;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  white-space: nowrap;
}
.pill--yes {
  background: linear-gradient(100deg, rgba(255, 84, 187, 0.9), rgba(178, 107, 255, 0.9));
  color: #fff;
}
/* "with limits": neon gradient outline instead of a filled pill */
.pill--limited {
  border: 1px solid transparent;
  background:
    linear-gradient(#0b0a0f, #0b0a0f) padding-box,
    linear-gradient(100deg, var(--c-red), var(--c-pink) 50%, var(--c-purple)) border-box;
  color: #ff8fd2;
  box-shadow: 0 0 10px rgba(255, 84, 187, 0.25);
}
.pill--solo {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
}

/* ---------- buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 800;
  transition: transform 0.3s var(--ease), background 0.3s;
}
.btn--light {
  background: #fff;
  color: #d8124a;
}
.btn--glass {
  background: rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

/* ================= hero ================= */
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(40px, 6vw, 88px) 0 clamp(48px, 6vw, 80px);
}
.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(32px, 5vw, 72px);
}
.hero h1 {
  font: 900 clamp(36px, 5.2vw, 72px)/1.05 var(--display);
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
.lead {
  max-width: 480px;
  margin: 22px 0 0;
  color: var(--c-muted);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.7;
}
.jump {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 30px;
}
.jump a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px 0 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 0 1px var(--c-line);
  font-size: 13px;
  font-weight: 800;
  transition: background 0.25s, box-shadow 0.25s;
}
.jump b {
  display: grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--c-grad);
  font: 800 10px/1 var(--display);
}

/* creator mosaic */
.mosaic {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.mosaic__tile {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  border-radius: 18px;
  background: #120d18;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 50px rgba(0, 0, 0, 0.6);
}
.mosaic__tile:nth-child(3n + 2) {
  transform: translateY(28px);
}
.mosaic__tile:nth-child(3n + 1) {
  transform: translateY(-10px);
}
.mosaic__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.mosaic__tile::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.85));
}
.mosaic__who {
  position: absolute;
  z-index: 1;
  left: 10px;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.75);
}
.mosaic__who img {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 2px #fff;
}
.mosaic__who b {
  display: block;
  font-size: 12px;
  color: #fff;
}
.mosaic__who > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* stats */
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: clamp(56px, 7vw, 88px) 0 0;
  padding: 0;
  list-style: none;
  border-radius: 20px;
  background: linear-gradient(#0b0a0f, #0b0a0f) padding-box, var(--c-grad) border-box;
  border: 1px solid transparent;
}
.stats li {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px clamp(18px, 2.4vw, 30px);
}
.stats li + li {
  border-left: 1px solid var(--c-line);
}
.stats strong {
  font: 900 clamp(32px, 3.4vw, 46px)/1 var(--display);
  background: var(--c-grad);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stats span {
  font-size: 12px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-muted);
}

/* ================= hubs ================= */
.hubs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.hub {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 18px;
  background: var(--c-card);
  box-shadow: inset 0 0 0 1px var(--c-line);
}
.hub__art {
  position: relative;
  aspect-ratio: 16 / 8;
  overflow: hidden;
}
.hub__banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease);
}
.hub__banner--mlbb {
  object-position: center 22%;
}
.hub__art::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(11, 10, 15, 0) 35%, var(--c-card));
}
.hub__logo {
  position: absolute;
  z-index: 1;
  left: 20px;
  bottom: 10px;
  width: 128px;
  height: 52px;
  object-fit: contain;
  object-position: left bottom;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8));
}
.hub__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px 20px;
}
.hub__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--c-muted);
}
.hub__meta span:first-child {
  color: var(--c-pink);
}
.hub__meta span + span::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  margin: 0 12px 2px 0;
  border-radius: 50%;
  background: currentColor;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.chips li {
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}
.hub__status {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 14px 0;
  border-block: 1px solid var(--c-line);
}
.hub__status div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.hub__status dt {
  font-size: 13px;
  font-weight: 700;
  color: var(--c-muted);
}
.hub__status dd {
  margin: 0;
}
.hub__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}
.hub__links a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: background 0.25s, box-shadow 0.25s;
}
.hub__links a:first-child {
  background: #fff;
  color: #0b0a0f;
  box-shadow: none;
}
.hub__links a span {
  color: var(--c-pink);
}

.swipe-hint {
  display: none;
  align-items: center;
  gap: 8px;
  margin: 14px 0 0;
  font-size: 12px;
  font-weight: 800;
  color: var(--c-muted);
}
.swipe-hint::before {
  content: '';
  width: 26px;
  height: 2px;
  background: var(--c-grad);
}

/* ================= streamers ================= */
/* game selector: a fixed grid (never scrolls sideways, so nothing is clipped).
   The selected game gets the same 2px animated neon ring as the home page cards
   (global .neon-hover-outline::after, inset 0). */
.tabs {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}
.tabs__tab {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 60px;
  padding: 10px 14px;
  border: 0;
  border-radius: 14px;
  background: var(--c-card);
  box-shadow: inset 0 0 0 1px var(--c-line);
  color: rgba(255, 255, 255, 0.62);
  font: 800 14px/1.3 var(--ui);
  text-align: center;
  cursor: pointer;
  transition: color 0.25s, background 0.25s;
}
.tabs__tab span {
  min-width: 0;
  overflow-wrap: anywhere;
}
.tabs__tab.is-active {
  color: #fff;
  box-shadow: none;
}
.tabs__tab.is-active::after {
  opacity: 1;
  animation: card-outline-turn 3s linear infinite;
}
.streamers {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.6fr);
  gap: 18px;
  align-items: stretch;
}
/* featured card: same look as the home page creator card, stretched to the
   full height of the streamer list next to it */
.creator {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 2px solid var(--c-line);
  border-radius: 14px;
  background: #0b0b0e;
}
.creator__art {
  position: relative;
  flex-shrink: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #08080c;
}
/* the image never sizes the card: it fills whatever box the layout gives it */
.creator__art img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}
.creator__art::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, transparent 28%);
}
.creator__pill {
  position: absolute;
  z-index: 1;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(10, 6, 8, 0.6);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.creator__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: clamp(22px, 2.6vw, 30px);
}
.creator__avatar {
  position: relative;
  flex-shrink: 0;
  width: 84px;
  height: 84px;
  padding: 3px;
  border-radius: 50%;
  background: var(--c-grad);
}
.creator__avatar img {
  width: 100%;
  height: 100%;
  border: 4px solid #0b0b0e;
  border-radius: 50%;
  object-fit: cover;
  background: #0b0b0e;
}
.creator__category {
  margin: 20px 0 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #cf9bff;
}
.creator h3 {
  font: 800 clamp(26px, 2.6vw, 34px)/1.15 var(--display);
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
.creator__bio {
  margin: 12px 0 22px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--ink-2);
}
/* pinned to the bottom so the card fills the full height cleanly */
.creator__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: auto;
  padding: 14px 20px;
  border: 1px solid transparent;
  border-radius: 10px;
  background:
    linear-gradient(115deg, rgba(178, 107, 255, 0.18), rgba(255, 24, 59, 0.14)) padding-box,
    linear-gradient(100deg, var(--c-purple), var(--c-red) 52%, var(--c-pink)) border-box;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-align: center;
  text-transform: uppercase;
  transition: background 0.3s var(--ease);
}
.roster {
  padding: 20px;
  border-radius: 18px;
  background: var(--c-card);
  box-shadow: inset 0 0 0 1px var(--c-line);
}
.roster__head {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 700;
  color: var(--c-muted);
}
.roster__head b {
  font: 900 18px/1 var(--display);
  color: #fff;
}
.roster__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.roster__list a {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: background 0.25s, box-shadow 0.25s;
}
.roster__avatar {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #120d18;
}
.roster__avatar {
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 2px rgba(178, 107, 255, 0.55);
}
.roster__avatar img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background: #120d18;
}
.roster__who {
  flex: 1;
  min-width: 0;
}
.roster__who b,
.roster__who small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.roster__who b {
  font-size: 14px;
  font-weight: 800;
}
.roster__who small {
  margin-top: 2px;
  font-size: 12px;
  color: var(--c-muted);
}
.roster__lang {
  flex-shrink: 0;
  padding: 3px 7px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.07);
  font: 800 10px/1.2 var(--display);
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.8);
}
.roster__go {
  flex-shrink: 0;
  color: var(--c-pink);
  font-weight: 800;
}
.roster__more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 13px;
  font-weight: 800;
}
.roster__more span {
  color: var(--c-pink);
}

/* ================= steps ================= */
.steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.steps::before {
  content: '';
  position: absolute;
  top: 27px;
  left: 28px;
  /* stop at the centre of the last circle */
  right: calc((100% - 4 * 16px) / 5 - 32px);
  height: 2px;
  background: var(--c-grad);
  opacity: 0.6;
}
.steps li {
  position: relative;
  padding: 0 4px;
}
.steps__num {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 20px;
  border-radius: 50%;
  background: #000;
  box-shadow: inset 0 0 0 2px var(--c-pink), 0 0 24px rgba(255, 84, 187, 0.45);
  font: 900 16px/1 var(--display);
}
.steps h3 {
  font-size: 17px;
  font-weight: 800;
  line-height: 1.3;
}
.steps p {
  margin: 8px 0 0;
  color: var(--c-muted);
  font-size: 14px;
  line-height: 1.65;
}

/* ================= play safe ================= */
.safe {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
}
.safe__lead {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 380px;
  padding: clamp(24px, 3vw, 40px);
  border-radius: 24px;
  background:
    radial-gradient(60% 60% at 100% 0%, rgba(178, 107, 255, 0.85), transparent 70%),
    linear-gradient(135deg, #ff183b, #ff3d8b 60%, #c04dff);
}
.safe__lead h2 {
  font: 900 clamp(28px, 3.2vw, 44px)/1.1 var(--display);
  text-transform: uppercase;
}
.safe__lead > p:not(.eyebrow) {
  max-width: 380px;
  margin: 14px 0 24px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.92);
}
.safe__lead .btn {
  align-self: flex-start;
}
.safe__tips {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.safe__tips li {
  padding: 24px;
  border-radius: 20px;
  background: var(--c-card);
  box-shadow: inset 0 0 0 1px var(--c-line);
}
.safe__tips span {
  display: block;
  margin-bottom: 18px;
  font: 900 30px/1 var(--display);
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 84, 187, 0.9);
}
.safe__tips h3 {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
}
.safe__tips p {
  margin: 8px 0 0;
  color: var(--c-muted);
  font-size: 14px;
  line-height: 1.6;
}

/* ================= faq ================= */
.faq {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(28px, 5vw, 72px);
}
.faq__head > p {
  margin-top: 18px;
}
.faq__list {
  display: grid;
  gap: 10px;
}
.faq details {
  border-radius: 16px;
  background: var(--c-card);
  box-shadow: inset 0 0 0 1px var(--c-line);
  transition: box-shadow 0.25s;
}
.faq details[open] {
  box-shadow: inset 0 0 0 1px rgba(255, 84, 187, 0.55);
}
.faq summary {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 60px;
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 800;
  list-style: none;
  cursor: pointer;
}
.faq summary::-webkit-details-marker {
  display: none;
}
/* plus / minus drawn with CSS */
.faq summary i {
  position: relative;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}
.faq summary i::before,
.faq summary i::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 2px;
  margin: -1px 0 0 -6px;
  border-radius: 2px;
  background: #fff;
  transition: transform 0.3s var(--ease);
}
.faq summary i::after {
  transform: rotate(90deg);
}
.faq details[open] summary i {
  background: var(--c-grad);
}
.faq details[open] summary i::after {
  transform: rotate(0deg);
}
.faq details p {
  margin: 0;
  padding: 0 20px 20px;
  color: var(--c-muted);
  font-size: 14px;
  line-height: 1.7;
}

/* ================= cta ================= */
.block--cta {
  padding-top: 0;
}
.cta {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: center;
  gap: 24px;
  padding: clamp(28px, 4vw, 56px);
  border-radius: 28px;
  background:
    radial-gradient(50% 80% at 90% 50%, rgba(178, 107, 255, 0.55), transparent 70%),
    linear-gradient(120deg, #1a0710, #2a0b30 60%, #1b0b3a);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
.cta h2 {
  font: 900 clamp(28px, 3.6vw, 50px)/1.08 var(--display);
  text-transform: uppercase;
}
.cta p {
  margin: 14px 0 0;
  color: var(--c-muted);
  font-size: 16px;
  font-weight: 600;
}
.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}
.cta__eggs {
  position: relative;
  height: 240px;
}
.cta__eggs img {
  position: absolute;
  width: 200px;
  height: auto;
  border-radius: 28px;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5);
}
.cta__eggs img:first-child {
  right: 34%;
  top: 0;
  transform: rotate(-8deg);
}
.cta__eggs img:last-child {
  right: 4%;
  top: 30px;
  transform: rotate(7deg);
}

/* ---------- hover ---------- */
@media (hover: hover) {
  .btn:hover,
  .creator__cta:hover {
    transform: translateY(-2px);
  }
  .jump a:hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 0 0 1px rgba(255, 84, 187, 0.6);
  }
  .hub:hover .hub__banner {
    transform: scale(1.05);
  }
  .tabs__tab:not(.is-active):hover {
    color: #fff;
  }
  .roster__list a:hover {
    background: rgba(255, 255, 255, 0.07);
    box-shadow: inset 0 0 0 1px rgba(255, 84, 187, 0.5);
  }
  .hub__links a:not(:first-child):hover {
    background: rgba(255, 255, 255, 0.08);
  }
  .creator__cta:hover {
    background:
      linear-gradient(115deg, rgba(178, 107, 255, 0.3), rgba(255, 24, 59, 0.24)) padding-box,
      linear-gradient(100deg, var(--c-purple), var(--c-red) 52%, var(--c-pink)) border-box;
  }
}

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .tabs {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .hubs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .streamers {
    grid-template-columns: minmax(0, 1fr);
  }
  /* tablet: banner beside the profile, exactly like the home page card */
  .creator {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  }
  .creator__art {
    aspect-ratio: auto;
    min-height: 280px;
  }
  .steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 36px;
  }
  .steps::before {
    display: none;
  }
}

@media (max-width: 960px) {
  .hero__grid,
  .head,
  .safe,
  .faq,
  .cta {
    grid-template-columns: minmax(0, 1fr);
  }
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .stats li:nth-child(3) {
    border-left: 0;
  }
  .stats li:nth-child(n + 3) {
    border-top: 1px solid var(--c-line);
  }
  .safe__lead {
    min-height: 300px;
  }
  .cta__eggs {
    height: 180px;
  }
  .cta__eggs img {
    width: 150px;
  }
  .cta__eggs img:first-child {
    right: auto;
    left: 0;
  }
  .cta__eggs img:last-child {
    right: auto;
    left: 130px;
  }
}

@media (max-width: 700px) {
  .mosaic {
    gap: 8px;
  }
  .mosaic__tile {
    border-radius: 12px;
  }
  .mosaic__who > span {
    display: none;
  }
  .mosaic__who img {
    width: 26px;
    height: 26px;
  }
  /* hubs: swipe sideways */
  .hubs {
    display: flex;
    gap: 12px;
    margin-inline: calc(-1 * clamp(16px, 4vw, 40px));
    padding: 0 clamp(16px, 4vw, 40px) 4px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: clamp(16px, 4vw, 40px);
    scrollbar-width: none;
    overscroll-behavior-x: contain;
  }
  .hubs::-webkit-scrollbar {
    display: none;
  }
  .hub {
    flex: 0 0 84%;
    scroll-snap-align: start;
  }
  .swipe-hint {
    display: flex;
  }
  .tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  .tabs__tab {
    min-height: 54px;
    padding: 8px 10px;
    font-size: 13px;
  }
  .creator {
    display: flex;
  }
  .creator__art {
    aspect-ratio: 16 / 9;
    min-height: 0;
  }
  .roster {
    padding: 14px;
  }
  .roster__list {
    grid-template-columns: minmax(0, 1fr);
  }
  .safe__tips {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
  .safe__tips li {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr);
    column-gap: 12px;
    padding: 18px;
  }
  .safe__tips span {
    grid-row: span 2;
    margin: 0;
    font-size: 24px;
  }
  .steps {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
  }
  .steps::before {
    display: block;
    top: 28px;
    bottom: 28px;
    left: 27px;
    right: auto;
    width: 2px;
    height: auto;
    background: linear-gradient(180deg, var(--c-pink), var(--c-red), var(--c-purple));
  }
  .steps li {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    column-gap: 18px;
    padding: 0 0 26px;
  }
  .steps__num {
    grid-row: span 2;
    margin: 0;
  }
  .steps h3 {
    align-self: end;
    padding-top: 6px;
  }
  .stats li {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tabs__tab.is-active::after {
    animation: none;
  }
  .btn,
  .creator__cta,
  .hub__banner,
  .faq summary i::before,
  .faq summary i::after {
    transition: none;
  }
}
</style>
