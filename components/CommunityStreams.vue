<script setup lang="ts">
import rankings from '~/data/communityRankings.json'

const games = [
  { id: 'hsr', name: 'Honkai: Star Rail', short: 'Star Rail' },
  { id: 'genshin', name: 'Genshin Impact', short: 'Genshin' },
  { id: 'hi3', name: 'Honkai Impact 3rd', short: 'Honkai Impact' },
  { id: 'wuwa', name: 'Wuthering Waves', short: 'Wuthering Waves' },
  { id: 'nte', name: 'Neverness to Everness', short: 'NTE' },
  { id: 'mlbb', name: 'Mobile Legends: Bang Bang', short: 'Mobile Legends' },
] as const
const active = ref(0)
const page = ref(0)
const game = computed(() => games[active.value]!)
const ranking = computed(() => rankings[game.value.id])
const visible = computed(() => ranking.value.streamers.slice(page.value * 5, page.value * 5 + 5))
const tabs = ref<HTMLButtonElement[]>([])
const failedAvatars = ref<string[]>([])
const languages: Record<string, string> = { EN: 'English', RU: 'Russian', ES: 'Spanish', PT: 'Portuguese', FR: 'French', JA: 'Japanese', ZH: 'Chinese', DE: 'German', ID: 'Indonesian', KO: 'Korean', TH: 'Thai', AR: 'Arabic', TR: 'Turkish', PL: 'Polish', IT: 'Italian', UK: 'Ukrainian' }
const number = new Intl.NumberFormat('en-US')
function select(index: number) { active.value = index; page.value = 0 }
function navigate(event: KeyboardEvent, index: number) {
  let next = index
  if (event.key === 'ArrowRight') next = (index + 1) % games.length
  else if (event.key === 'ArrowLeft') next = (index + games.length - 1) % games.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = games.length - 1
  else return
  event.preventDefault()
  select(next)
  tabs.value[next]?.focus()
}
</script>

<template>
  <section id="community-streams" class="streams" aria-labelledby="streams-title">
    <header class="streams__heading">
      <div>
        <p class="streams__eyebrow"><img src="/images/streamers/twitch-glitch.svg" width="18" height="21" alt="Twitch" /> Find your next stream</p>
        <h2 id="streams-title">Your game.<br /><em>Their playground.</em></h2>
      </div>
      <p class="streams__intro">Big plays, new perspectives and a chat to call home. Find the channels bringing your favourite worlds to life.</p>
    </header>

    <div class="streams__layout">
      <figure class="streams__poster">
        <img src="/images/streamers/community-poster.png" width="1086" height="1448" alt="Crimson Neverness to Everness character artwork" loading="lazy" />
      </figure>

      <div class="directory">
        <div class="directory__tabs" role="tablist" aria-label="Choose a game's Twitch channels">
          <button v-for="(item, index) in games" :id="`stream-tab-${item.id}`" :key="item.id" ref="tabs"
            type="button" role="tab" :aria-selected="active === index" aria-controls="stream-directory"
            :tabindex="active === index ? 0 : -1" :aria-label="item.name" @click="select(index)" @keydown="navigate($event, index)">
            <span>{{ item.short }}</span>
          </button>
        </div>

        <div id="stream-directory" class="directory__panel neon-hover-outline" role="tabpanel" :aria-labelledby="`stream-tab-${game.id}`" tabindex="0">
          <header class="directory__heading">
            <div>
              <p><span>Most watched</span></p>
              <h3><span v-for="entry in games" :key="entry.id" :class="{ 'is-active': entry.id === game.id }" :aria-hidden="entry.id !== game.id">{{ entry.name }}</span></h3>
            </div>
          </header>
          <div id="stream-channel-list" class="directory__table-wrap">
            <table>
              <caption class="sr-only">{{ game.name }} channels ranked by viewing hours over 30 days. Page {{ page + 1 }} of 3.</caption>
              <colgroup><col class="rank" /><col /><col class="language" /><col class="hours" /><col class="watch" /></colgroup>
              <thead><tr><th scope="col" class="rank"><svg class="rank-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="m7.784 14l.42-4H4V8h4.415l.525-5h2.011l-.525 5h3.989l.525-5h2.011l-.525 5H20v2h-3.784l-.42 4H20v2h-4.415l-.525 5h-2.011l.525-5H9.585l-.525 5H7.049l.525-5H4v-2zm2.011 0h3.99l.42-4h-3.99z" /></svg><span class="sr-only">Rank</span></th><th scope="col" class="channel-col">Channel</th><th scope="col" class="language">Language</th><th scope="col" class="hours" colspan="2"><span class="hours-label">Hours watched</span></th></tr></thead>
              <tbody :key="`${game.id}-${page}`">
                <tr v-for="(streamer, index) in visible" :key="streamer.handle">
                  <td class="rank"><span>{{ String(page * 5 + index + 1).padStart(2, '0') }}</span></td>
                  <th scope="row" class="channel-col">
                    <a class="channel" :href="`https://www.twitch.tv/${streamer.handle}`" target="_blank" rel="noopener noreferrer" :aria-label="`${streamer.name} on Twitch (opens in a new tab)`">
                      <span class="channel__avatar">
                        <img v-if="streamer.avatar && !failedAvatars.includes(streamer.handle)" :src="streamer.avatar" alt="" width="40" height="40" loading="lazy" @error="failedAvatars.push(streamer.handle)" />
                        <span v-else aria-hidden="true">{{ streamer.name.slice(0, 1) }}</span>
                      </span>
                      <span class="channel__name">{{ streamer.name }}<small>@{{ streamer.handle }}</small></span>
                    </a>
                  </th>
                  <td class="language"><abbr :title="languages[streamer.language] || streamer.language">{{ streamer.language }}</abbr></td>
                  <td class="hours"><span class="hours-value">{{ number.format(streamer.hours) }}</span></td>
                  <td class="watch"><a :href="`https://www.twitch.tv/${streamer.handle}`" target="_blank" rel="noopener noreferrer" :aria-label="`Watch ${streamer.name} on Twitch (opens in a new tab)`"><img src="/images/streamers/twitch-glitch.svg" width="18" height="21" alt="" /><span aria-hidden="true">↗</span></a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer class="directory__pagination">
            <p class="sr-only" aria-live="polite">Showing channels {{ page * 5 + 1 }} to {{ page * 5 + 5 }} of 15.</p>
            <div role="group" aria-label="Channel list pages">
              <button v-for="n in 3" :key="n" type="button"
                :aria-label="`Show channels ${(n - 1) * 5 + 1}–${n * 5}`"
                :aria-current="page === n - 1 ? 'page' : undefined" aria-controls="stream-channel-list"
                @click="page = n - 1"><span aria-hidden="true" /></button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.streams { --pink: #ff54bb; --purple: #b26bff; --red: #ff183b; --muted: #d9c5e5; --edge: #79438e; width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px)); margin: 0 auto; padding: 0 0 clamp(88px, 10vw, 144px); scroll-margin-top: 32px; }
.streams__heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 36px; }
.streams__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .16em; }
.streams__eyebrow img { object-fit: contain; }
.streams h2 { margin: 0; font: 900 clamp(28px, 3.5vw, 46px)/1.16 var(--display); text-transform: uppercase; letter-spacing: -.025em; }
.streams h2 em { font-style: normal; background: linear-gradient(100deg, var(--pink), var(--red) 50%, var(--purple)); background-clip: text; -webkit-text-fill-color: transparent; }
.streams__intro { max-width: 330px; margin: 0 0 3px; font-size: 16px; line-height: 1.75; color: #c1b9c9; }
.streams__layout { display: grid; grid-template-columns: minmax(0, .78fr) minmax(0, 1.22fr); align-items: start; gap: clamp(24px, 3.2vw, 44px); }
.streams__poster { margin: 0; border: 0; border-radius: 0; }
.streams__poster > img { width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: contain; border: 0; border-radius: 0; }
.directory { min-width: 0; }
.directory__tabs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 5px; margin-bottom: 20px; }
.directory__tabs button { position: relative; display: grid; place-items: center; min-width: 0; min-height: 44px; padding: 10px 5px; border: 0; border-bottom: 2px solid var(--edge); background: #000; cursor: pointer; transition: background .2s ease; }
.directory__tabs button::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--red), var(--pink), var(--purple)); opacity: 0; transition: opacity .2s ease; }
.directory__tabs button[aria-selected="true"] { background: #160e1a; }
.directory__tabs button[aria-selected="true"]::after { opacity: 1; }
.directory__tabs span { display: block; font: 900 12px/1.4 var(--display); text-transform: uppercase; white-space: normal; }
.directory__panel { width: 100%; min-width: 0; padding: 2px; border: 0; background: #000; }
.directory__panel.neon-hover-outline::after { opacity: 1; animation: card-outline-turn 3s linear infinite; }
.directory__heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; min-height: 88px; padding: 16px 26px; }
.directory__heading > div { min-width: 0; }
.directory__heading p { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; margin: 0 0 8px; color: #fff; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; }
.directory__heading h3 { margin: 0; font: 900 clamp(20px, 2vw, 26px)/1.15 var(--display); letter-spacing: -.02em; text-transform: uppercase; text-wrap: balance; color: #ff9ad8; background: linear-gradient(100deg, #ff9ad8, #ff6a88, #d2a4ff, #ff9ad8); background-size: 250% 100%; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: directory-title-flow 4s ease-in-out infinite alternate; }
@keyframes directory-title-flow { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
.directory__heading h3 { display: grid; align-items: center; }
.directory__heading h3 > span { grid-area: 1 / 1; min-width: 0; visibility: hidden; }
.directory__heading h3 > span.is-active { visibility: visible; }
.directory__table-wrap { --table-inset: 12px; width: 100%; min-width: 0; }
table { width: 100%; table-layout: fixed; border-collapse: collapse; text-align: left; }
thead { background: #000; border-top: 2px solid #9b65b0; border-bottom: 2px solid #9b65b0; }
thead th { height: 35px; vertical-align: middle; color: #fff; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; }
.rank { width: calc(36px + var(--table-inset)); padding-left: var(--table-inset); color: var(--muted); text-align: center; font-variant-numeric: tabular-nums; }
.language { width: 69px; text-align: center; }
.hours { width: 120px; text-align: right; padding: 0 6px 0 0; white-space: nowrap; font-variant-numeric: tabular-nums; }
thead .rank-icon { display: block; width: 14px; height: 14px; margin: 0 auto; transform: translateY(-0.5px); }
/* cancel the trailing letter-spacing so the label's last letter sits flush with the right edge */
.hours-label { display: inline-block; margin-right: -.04em; }
/* Match the heading's right edge to the watch arrow below. */
thead th.hours { padding-right: calc(6px + var(--table-inset)); }
.watch { width: calc(48px + var(--table-inset)); padding: 0 var(--table-inset) 0 0; }
tbody tr { height: 64px; border: 0; background: #000; }
tbody tr:first-child { height: 70px; }
tbody tr:first-child > :is(td, th) { padding-top: 6px; }
tbody tr:nth-child(even) { background: #000; }
tbody .rank { color: #ffa0d8; }
tbody tr:last-child { border-bottom: 0; }
tbody td { font-size: 13px; font-weight: 700; }
tbody th { padding: 0; }
/* breathing room between the rank number and the channel */
.channel-col { padding-left: 12px; }
.channel-col .channel { padding-left: 0; }
.channel { display: flex; align-items: center; gap: 12px; min-width: 0; height: 62px; padding: 10px 4px; }
.channel__avatar { display: grid; place-items: center; flex: 0 0 40px; width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: #211528; color: var(--pink); }
.channel__avatar img { width: 100%; height: 100%; object-fit: cover; }
.channel__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; font-weight: 800; }
.channel__name small { display: block; margin-top: 3px; font-size: 11px; font-weight: 600; color: var(--muted); overflow: hidden; text-overflow: ellipsis; }
.language abbr { text-decoration: none; font-size: 11px; color: #edcfff; }
.watch a { display: flex; align-items: center; justify-content: flex-end; gap: 5px; min-height: 44px; padding-right: 6px; }
.watch img { width: 15px; height: 18px; object-fit: contain; }
.watch span { font-size: 16px; color: #f0cfff; }
.directory__pagination { display: flex; align-items: center; justify-content: center; height: 69px; padding: 16px 12px; }
.directory__pagination > div { display: flex; gap: 6px; }
.directory__pagination button { display: grid; place-items: center; width: 48px; height: 36px; padding: 0; border: 0; border-radius: 4px; background: transparent; cursor: pointer; }
.directory__pagination button span { width: 40px; height: 3px; border-radius: 2px; background: rgba(255, 255, 255, .55); box-shadow: 0 1px 5px rgba(0, 0, 0, .8); }
.directory__pagination button[aria-current] span { background: linear-gradient(90deg, #ff9bdd, #c69aff); box-shadow: 0 0 7px rgba(221, 154, 255, .65); }
.streams :is(a, button, [tabindex]):focus-visible { outline: 2px solid #e3a3ff; outline-offset: 3px; }
tbody :is(.channel, .rank > span, .language abbr, .hours-value, .watch a) { animation: channels-in .3s ease-out both; }
@keyframes channels-in { from { opacity: 0; } to { opacity: 1; } }
@media (hover: hover) { tbody tr:hover { background: #000; } .channel:hover .channel__name { color: #ffa7dc; } .directory__tabs button:hover { background: #160e1a; } }
@media (min-width: 901px) {
  .streams__layout { align-items: stretch; }
  .streams__poster { position: relative; min-height: 0; }
  .streams__poster > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; object-position: left top; transform: scale(1.0125); transform-origin: left top; }
}
@media (max-width: 1100px) and (min-width: 901px) { .streams__layout { grid-template-columns: minmax(0, .65fr) minmax(0, 1.35fr); } .directory__tabs span { font-size: 11px; } }
@media (max-width: 900px) { .streams__layout { grid-template-columns: minmax(0, 1fr); gap: 28px; } .streams__poster { width: min(100%, 420px); margin-inline: auto; } .streams__heading { align-items: flex-start; } .streams__intro { max-width: 280px; font-size: 14px; } }
@media (max-width: 600px) {
  .streams__heading { display: block; margin-bottom: 26px; }
  .streams__intro { max-width: 420px; margin-top: 18px; font-size: 15px; }
  .directory__tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .directory__tabs button { padding: 8px 6px; }
  .directory__tabs span { font-size: 11px; }
  .directory__table-wrap { --table-inset: 8px; }
  .directory__pagination { padding-inline: 8px; }
  .directory__heading { justify-content: center; min-height: 0; padding: 20px 18px 18px; text-align: center; }
  .directory__heading h3 { font-size: 22px; }
  .directory__heading p { justify-content: center; font-size: 11px; gap: 6px 8px; margin-bottom: 6px; }
  .rank { width: calc(27px + var(--table-inset)); font-size: 10px; }
  .language { width: 39px; }
  thead .language { font-size: 0; }
  thead .language::after { content: 'Lang'; font-size: 9px; }
  .hours { width: 94px; padding-right: 4px; }
  .watch { width: calc(24px + var(--table-inset)); }
  /* mobile: arrow only, no Twitch logo */
  .watch img { display: none; }
  .watch span { font-size: 15px; }
  thead th { font-size: 9px; letter-spacing: 0; }
  thead .rank-icon { width: 12px; height: 12px; }
  tbody td { font-size: 11px; }
  .channel { gap: 7px; padding-inline: 0; }
  .channel-col { padding-left: 8px; }
  .channel__avatar { flex-basis: 34px; width: 34px; height: 34px; }
  .channel__name { max-width: 14ch; font-size: 12px; }
  .channel__name small { font-size: 10px; }
  .language abbr { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) { .directory__panel.neon-hover-outline::after { animation: none; } .directory__heading h3, tbody :is(.channel, .rank > span, .language abbr, .hours-value, .watch a) { animation: none; } .directory__tabs button, .directory__tabs button::after { transition: none; } }
</style>
