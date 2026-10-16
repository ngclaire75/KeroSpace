<script setup lang="ts">
const preventFocusZoom = ref(false)
onMounted(() => {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  // Safari permits pinch zoom independently of this limit, but uses it when
  // focusing small inputs. Keep other browsers' viewport scaling unchanged.
  preventFocusZoom.value = ios && /Version\/[\d.]+.*Safari\//.test(navigator.userAgent)
})
useHead({
  title: 'Top Up — KeroSpace',
  meta: [
    { name: 'description', content: 'Explore Kerosce game top-ups and services. Choose your game and enquire about packages with @koqbisagitu on Instagram.' },
    { name: 'viewport', content: () => `width=device-width, initial-scale=1${preventFocusZoom.value ? ', maximum-scale=1' : ''}` },
  ],
})
const games = [
  { id: 'hsr', name: 'Honkai: Star Rail' },
  { id: 'genshin', name: 'Genshin Impact' },
  { id: 'hi3', name: 'Honkai Impact 3rd' },
  { id: 'wuwa', name: 'Wuthering Waves' },
  { id: 'nte', name: 'Neverness to Everness' },
  { id: 'mlbb', name: 'Mobile Legends: Bang Bang' },
]
const services = [
  { id: 'top-up', name: 'Game top-up', short: 'Top-ups', description: 'Tell us the amount or package you have in mind. Ask about available options for your game and region.' },
  { id: 'accounts', name: 'Account services', short: 'Account services', description: 'Describe the account service you are looking for. Ask which options are available for your game.' },
  { id: 'support', name: 'Game support', short: 'Game support', description: 'Tell us what you need a hand with and what you would like to achieve. Ask about available assistance for your game.' },
]
const selectedGame = ref('hsr')
const selectedService = ref('top-up')
const details = ref('')
const region = ref('')
const copyState = ref<'idle' | 'copied' | 'manual'>('idle')
const enquiryField = ref<HTMLTextAreaElement>()
const game = computed(() => games.find(g => g.id === selectedGame.value)!)
const service = computed(() => services.find(s => s.id === selectedService.value)!)
const enquiry = computed(() => [
  'Hi Kerosce! I would like to enquire about:',
  `Game: ${game.value.name}`, `Service: ${service.value.name}`,
  region.value.trim() && `Server / region: ${region.value.trim()}`,
  details.value.trim() && `Request: ${details.value.trim()}`,
  'Please send me the available options and prices. Thank you!',
].filter(Boolean).join('\n'))
watch([selectedGame, selectedService, details, region], () => { copyState.value = 'idle' })
async function copyEnquiry() {
  try {
    await navigator.clipboard.writeText(enquiry.value)
    copyState.value = 'copied'
  } catch {
    copyState.value = 'manual'
    await nextTick()
    enquiryField.value?.focus()
    enquiryField.value?.select()
  }
}
</script>

<template>
  <div class="shop-page">
    <SiteNav />
    <main class="shop-wrap">
      <header class="shop-hero">
        <div class="shop-hero__intro">
          <div><p class="shop-eyebrow">KeroSpace / Top Up</p><h1>Your next<br /><em>power-up.</em></h1></div>
          <div class="shop-hero__aside">
            <p>For the worlds you keep coming back to.</p>
            <p>Explore game top-ups and services with Kerosce. Choose your game, tell us what you need and ask for a package that fits.</p>
            <a href="#shop-games" class="text-link">Find your game</a>
          </div>
        </div>
        <figure class="shop-banner">
          <img src="/images/KeroSce%20Pastel%20Anime%20Welcome%20Banner.png" alt="KeroSce welcome banner with pastel pink and purple artwork" width="1672" height="941" fetchpriority="high" />
          <figcaption><span>Kerosce gaming services</span><a href="https://www.instagram.com/koqbisagitu/" target="_blank" rel="noopener noreferrer">@koqbisagitu <span aria-hidden="true">↗</span></a></figcaption>
        </figure>
      </header>

      <section id="shop-games" class="shop-catalog" aria-labelledby="catalog-title">
        <header class="catalog-heading">
          <div><p class="shop-eyebrow">A little more for your next adventure</p><h2 id="catalog-title">Your game.<br /><em>Your next move.</em></h2></div>
          <p>Start with your game and the service you’re looking for. Packages, availability and prices are confirmed through Instagram.</p>
        </header>
        <div class="service-picker" role="group" aria-label="Choose a service">
          <button v-for="option in services" :key="option.id" type="button" :aria-pressed="selectedService === option.id" @click="selectedService = option.id">{{ option.short }}<span aria-hidden="true">↗</span></button>
        </div>
        <div class="catalog-layout">
          <div class="game-picker" role="group" aria-label="Choose your game">
            <button v-for="entry in games" :key="entry.id" type="button" class="shop-game" :class="{ 'is-selected': selectedGame === entry.id }" :aria-pressed="selectedGame === entry.id" @click="selectedGame = entry.id">
              <span class="shop-game__surface">
                <span class="shop-game__logo" :class="`shop-game__logo--${entry.id}`"><img :src="`/images/games/${entry.id}-logo.webp`" alt="" width="200" height="100" loading="lazy" /></span>
                <span class="shop-game__bottom"><span>{{ entry.name }}</span><span class="shop-game__check" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="m3 8 3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" /></svg></span></span>
              </span>
            </button>
          </div>
          <aside class="enquiry" aria-labelledby="enquiry-title">
            <div class="enquiry__inner">
              <div class="enquiry__heading"><p class="shop-eyebrow">Let’s talk details</p><span aria-hidden="true">↗</span></div>
              <h3 id="enquiry-title">Your selection.<br /><em>Let’s talk.</em></h3>
              <div class="enquiry__selection" aria-live="polite"><img :src="`/images/games/${game.id}-logo.webp`" alt="" width="84" height="52" /><div><span>{{ service.name }}</span><strong>{{ game.name }}</strong></div></div>
              <p class="enquiry__description">{{ service.description }}</p>
              <label class="shop-field">Server / region <span>Optional</span><input v-model="region" type="text" maxlength="80" placeholder="e.g. Asia" autocomplete="off" /></label>
              <label class="shop-field">What do you have in mind? <span>Optional</span><textarea v-model="details" rows="3" maxlength="500" placeholder="A package, amount or a few details…" /></label>
              <div class="enquiry__actions">
                <button class="copy-button" type="button" @click="copyEnquiry">{{ copyState === 'copied' ? 'Enquiry copied ✓' : 'Copy your enquiry' }}<svg v-if="copyState !== 'copied'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg></button>
                <a class="instagram-button" href="https://www.instagram.com/koqbisagitu/" target="_blank" rel="noopener noreferrer">Enquire on Instagram<span aria-hidden="true">↗</span></a>
              </div>
              <p class="enquiry__status" role="status">{{ copyState === 'copied' ? 'Ready to paste. Send your enquiry to @koqbisagitu on Instagram.' : copyState === 'manual' ? 'Select and copy the message below, then send it on Instagram.' : 'Copy your selection, then send it to @koqbisagitu for options and prices.' }}</p>
              <label v-if="copyState === 'manual'" class="shop-field">Your enquiry<textarea ref="enquiryField" :value="enquiry" readonly rows="7" /></label>
            </div>
          </aside>
        </div>
      </section>

    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.shop-page { --shop-pink: #ffb3df; --shop-purple: #d8b4ff; --shop-muted: #c8bdcf; background: #000; min-height: 100svh; }
.shop-wrap { width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px)); margin-inline: auto; padding-bottom: clamp(64px, 8vw, 110px); }
.shop-hero { padding-top: clamp(52px, 7vw, 96px); }
.shop-hero__intro { display: grid; grid-template-columns: 1.1fr 1fr; gap: 60px; align-items: end; margin-bottom: 38px; }
.shop-eyebrow { margin: 0 0 18px; color: var(--shop-pink); font-size: 11px; line-height: 1.6; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; }
h1, h2, h3, p, figure { margin-top: 0; }
h1 { margin-bottom: 0; font: 900 clamp(38px, 5.2vw, 70px)/1.13 var(--display); letter-spacing: -.035em; text-transform: uppercase; }
em { font-style: normal; background: linear-gradient(105deg, #ffb3df, #bd83ff 55%, #ff4e78); background-clip: text; -webkit-background-clip: text; color: transparent; }
.shop-hero__aside { max-width: 450px; justify-self: end; }
.shop-hero__aside > p:first-child { color: #fff; font-weight: 800; font-size: 15px; margin-bottom: 12px; }
.shop-hero__aside > p:nth-child(2) { color: var(--shop-muted); font-size: 15px; line-height: 1.75; margin-bottom: 18px; }
.text-link { font-weight: 800; font-size: 15px; color: var(--shop-pink); }
.shop-banner { margin: 0; }
.shop-banner > img { width: 100%; height: auto; }
.shop-banner figcaption { display: flex; justify-content: space-between; gap: 16px; padding-block: 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: var(--shop-muted); }
.shop-banner figcaption a { color: var(--shop-pink); }
.shop-catalog { padding-top: clamp(60px, 8vw, 100px); scroll-margin-top: 28px; }
.catalog-heading { display: flex; justify-content: space-between; align-items: end; gap: 36px; margin-bottom: 28px; }
h2 { margin-bottom: 0; font: 900 clamp(26px, 3.1vw, 40px)/1.2 var(--display); letter-spacing: -.025em; text-transform: uppercase; }
.catalog-heading > p { max-width: 360px; margin-bottom: 4px; font-size: 15px; line-height: 1.75; color: var(--shop-muted); }
.service-picker { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-bottom: 26px; }
.service-picker button { display: flex; justify-content: space-between; align-items: center; gap: 8px; min-width: 0; min-height: 58px; padding: 14px 18px; border: 1px solid #493350; border-radius: 0; background: #0d0910; font: 800 11px/1.5 var(--display); text-transform: uppercase; cursor: pointer; transition: background-color .2s ease, border-color .2s ease; }
.service-picker button span { color: var(--shop-purple); font: 400 20px/1 var(--ui); }
.service-picker button[aria-pressed='true'] { border-color: var(--shop-pink); background: linear-gradient(110deg, #4a2040, #312048); }
.catalog-layout { display: grid; grid-template-columns: minmax(0, 1fr) 355px; gap: 28px; align-items: stretch; }
.game-picker { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.shop-game { position: relative; isolation: isolate; padding: 2px; border: 0; border-radius: 4px; min-width: 0; background: conic-gradient(from var(--card-outline-angle), var(--shop-pink), #7b3eb4, #302735, var(--shop-pink)); animation: card-outline-turn 6s linear infinite; cursor: pointer; text-align: left; }
.shop-game.is-selected { background: conic-gradient(from var(--card-outline-angle), var(--shop-pink), var(--shop-purple), var(--shop-pink)); }
.shop-game__surface { display: flex; flex-direction: column; position: relative; min-height: 254px; height: 100%; overflow: hidden; border-radius: 2px; background: #000; }
/* fills the space above the name bar and centres the logo in it, both ways */
.shop-game__logo { position: relative; display: flex; flex: 1; align-items: center; justify-content: center; min-height: 0; padding: 20px; }
.shop-game__logo img { display: block; width: auto; height: auto; max-width: 100%; max-height: 90px; object-fit: contain; }
/* Star Rail's mark is wide-and-short and NTE's is near-square, so both read small at 90px */
.shop-game__logo--hsr img { width: 100%; max-height: 130px; }
.shop-game__logo--nte img { height: 124px; max-height: 124px; }
.shop-game__bottom { display: flex; justify-content: space-between; align-items: center; gap: 10px; position: relative; min-height: 70px; padding: 14px; }
.shop-game__bottom > span:first-child { font-size: 13px; font-weight: 800; line-height: 1.5; }
.shop-game__check { display: grid; place-items: center; width: 22px; height: 22px; flex-shrink: 0; border: 1px solid #8f779c; border-radius: 50%; color: transparent; }
.is-selected .shop-game__check { background: var(--shop-pink); border-color: var(--shop-pink); color: #241227; }
.enquiry { padding: 2px; background: conic-gradient(from var(--card-outline-angle), var(--shop-pink), var(--shop-purple), #745295, var(--shop-pink)); animation: card-outline-turn 6s linear infinite; }
.enquiry__inner { padding: 24px; background: #09060d; }
.enquiry__heading { display: flex; align-items: start; justify-content: space-between; gap: 16px; }
.enquiry__heading > span { font-size: 24px; color: var(--shop-pink); }
.enquiry h3 { margin-bottom: 24px; font: 800 23px/1.3 var(--display); text-transform: uppercase; }
.enquiry__selection { display: flex; align-items: center; gap: 14px; min-height: 82px; padding: 14px 0; border-block: 1px solid #3a2844; }
.enquiry__selection img { width: 74px; height: 48px; object-fit: contain; flex-shrink: 0; }
.enquiry__selection div { min-width: 0; }
.enquiry__selection span { display: block; margin-bottom: 5px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--shop-pink); }
.enquiry__selection strong { display: block; font-size: 14px; line-height: 1.45; }
.enquiry__description { min-height: 5.1em; margin: 16px 0 20px; color: var(--shop-muted); font-size: 13px; line-height: 1.7; }
.shop-field { display: block; font-size: 12px; font-weight: 800; margin-bottom: 16px; }
.shop-field > span { color: #a396ad; font-size: 10px; font-weight: 600; margin-left: 5px; }
.shop-field input, .shop-field textarea { display: block; width: 100%; min-width: 0; margin-top: 8px; border: 1px solid #493350; border-radius: 0; padding: 11px 12px; color: #fff; background: #100b16; font: 500 14px/1.6 var(--ui); }
.shop-field textarea { resize: none; min-height: 90px; overflow-y: auto; scrollbar-width: none; }
.shop-field textarea::-webkit-scrollbar { display: none; }
.shop-field :is(input, textarea)::placeholder { color: #a99bb3; opacity: 1; }
.shop-field :is(input, textarea):focus { outline: none; box-shadow: none; border-color: var(--shop-pink); }
.enquiry__actions { display: grid; gap: 10px; }
.copy-button, .instagram-button { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; padding: 12px; font-size: 13px; font-weight: 800; cursor: pointer; }
.copy-button { border: 1px solid #a87ac4; color: #f5e3ff; background: #23152e; }
.instagram-button { background: linear-gradient(105deg, #ff9fd6, #c397ff); color: #211026; }
.instagram-button > span { margin-left: auto; font-size: 20px; }
.enquiry__status { margin: 14px 0 0; min-height: 3.3em; font-size: 11px; line-height: 1.65; color: var(--shop-muted); }
.shop-page :is(a, button):focus-visible { outline: 2px solid var(--shop-pink); outline-offset: 4px; }
@media (hover: hover) { .service-picker button:hover { border-color: var(--shop-purple); } }
@media (max-width: 1100px) { .catalog-layout { grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; } .game-picker { grid-template-columns: repeat(2, minmax(0, 1fr)); } .shop-game__surface { min-height: 230px; } .enquiry__inner { padding: 20px; } .shop-hero__intro { gap: 32px; } }
@media (max-width: 760px) {
  .shop-hero__intro { grid-template-columns: 1fr; gap: 24px; margin-bottom: 26px; }
  .shop-hero__aside { justify-self: start; max-width: 540px; }
  .catalog-heading { display: block; }
  .catalog-heading > p { margin: 18px 0 0; max-width: 460px; }
  .catalog-layout { grid-template-columns: 1fr; gap: 28px; }
  .service-picker { gap: 7px; }
  .service-picker button { justify-content: center; text-align: center; min-height: 58px; padding: 10px; font-size: 9px; }
  .service-picker button span { display: none; }
  .shop-game__surface { min-height: 230px; }
  .shop-game__logo { padding: 14px; }
  .shop-game__logo img { max-height: 72px; }
  .shop-game__logo--hsr { padding-inline: 8px; }
  .shop-game__logo--hsr img { max-height: 96px; }
  .shop-game__logo--nte img { height: 96px; max-height: 96px; }
  .enquiry__inner { padding: 24px; }
  .enquiry__description { min-height: 0; }
  .shop-banner figcaption { font-size: 9px; letter-spacing: .03em; gap: 10px; }
}
@media (max-width: 380px) { .game-picker { gap: 10px; } .shop-game__surface { min-height: 205px; } .shop-game__logo { padding: 10px; } .shop-game__logo img { max-height: 62px; } .shop-game__logo--hsr img { max-height: 84px; } .shop-game__logo--nte img { height: 84px; max-height: 84px; } .shop-game__bottom { padding: 10px; gap: 7px; } .shop-game__bottom > span:first-child { font-size: 11px; } .enquiry__inner { padding: 20px; } }
@media (prefers-reduced-motion: reduce) { .shop-game, .enquiry { animation: none; } .service-picker button { transition: none; } }
</style>
