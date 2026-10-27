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
    { name: 'description', content: 'Explore Kerosce game top-ups and services. Choose your game and enquire about packages with @koqbisagtu on Instagram.' },
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
  { id: 'top-up', name: 'Game top-up', short: 'Top up services', lines: ['Top up ', 'services'], description: 'Tell us the amount or package you have in mind. Ask about available options for your game and region.' },
  { id: 'accounts', name: 'Account services', short: 'Account services', lines: ['Account ', 'services'], description: 'Describe the account service you are looking for. Ask which options are available for your game.' },
  { id: 'support', name: 'Game support', short: 'Game support', lines: ['Game ', 'support'], description: 'Tell us what you need a hand with and what you would like to achieve. Ask about available assistance for your game.' },
  { id: 'rank-up', name: 'Mobile Legends rank-up', short: 'Rank up', lines: ['Rank ', 'up'], description: 'Share your current rank, target rank and budget. Let’s discuss the scope, price and service details for your climb.' },
]
const selectedGame = ref('hsr')
const selectedService = ref('top-up')
const availableServices = computed(() => services.filter(option => option.id !== 'rank-up' || selectedGame.value === 'mlbb'))
watch(selectedGame, value => {
  if (value !== 'mlbb' && selectedService.value === 'rank-up') selectedService.value = 'top-up'
})
const details = ref('')
const region = ref('')
const copyState = ref<'idle' | 'copied' | 'manual'>('idle')
const enquiryField = ref<HTMLTextAreaElement>()
const copiedDialog = ref<HTMLDialogElement>()
const instagramAction = ref<HTMLAnchorElement>()
let copyResetTimer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(copyResetTimer))

function closeCopiedDialog() {
  copiedDialog.value?.close()
}

function onDialogBackdrop(event: MouseEvent) {
  const dialog = copiedDialog.value
  if (!dialog || event.target !== dialog) return
  const bounds = dialog.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeCopiedDialog()
}

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
  clearTimeout(copyResetTimer)
  try {
    await navigator.clipboard.writeText(enquiry.value)
    copyState.value = 'copied'
    copyResetTimer = setTimeout(() => {
      if (copyState.value === 'copied') copyState.value = 'idle'
    }, 2500)
    copiedDialog.value?.showModal()
    instagramAction.value?.focus()
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
    <!-- same animated poster wall as the homepage -->
    <GuideWall />
    <SiteNav />
    <main class="shop-wrap">
      <header class="shop-hero">
        <div class="shop-hero__intro">
          <div><p class="shop-eyebrow shop-eyebrow--line">KeroSpace / Top Up</p><h1>Your next<br /><em>power-up.</em></h1></div>
          <div class="shop-hero__aside">
            <p>For the worlds you keep coming back to.</p>
            <p>Explore game top-ups and services with Kerosce. Choose your game, tell us what you need and ask for a package that fits.</p>
          </div>
        </div>
        <div class="shop-showcase">
          <figure class="shop-banner">
            <AppImage src="/images/top-up-store-banner.webp" sizes="(max-width: 860px) 100vw, 740px" alt="Welcome to KeroSce Store banner" width="3072" height="2048" fetchpriority="high" />
          </figure>
          <section class="shop-promo" aria-labelledby="promo-title">
            <div class="shop-promo__lead">
              <h2 id="promo-title">Your next skin.<br /><em>Starts here.</em></h2>
              <p class="shop-promo__intro">Top up without the guesswork. Tell us what you need, get a clear price and get back to playing.</p>
            </div>
            <ul class="shop-promo__points">
              <li><strong>Mobile Legends</strong><span>From a quick top-up to a big diamond bundle. Ask for the latest prices and get a clear quote upfront.</span></li>
              <li><strong>Other games</strong><span>Genshin, Star Rail, Wuthering Waves and more. Share your package and budget and agree on a price together.</span></li>
              <li><strong>One direct conversation</strong><span>Every order starts with one message to @koqbisagtu. Ask anything and confirm the details before you pay.</span></li>
            </ul>
          </section>
        </div>
      </header>

      <section id="shop-games" class="shop-catalog" aria-labelledby="catalog-title">
        <header class="catalog-heading">
          <div><p class="shop-eyebrow shop-eyebrow--line">A little more for your next adventure</p><h2 id="catalog-title">Your game.<br /><em>Your next move.</em></h2></div>
          <p>Start with your game and the service you’re looking for. Packages, availability and prices are confirmed through Instagram.</p>
        </header>
        <div class="service-picker" :class="{ 'service-picker--rank-up': selectedGame === 'mlbb' }" role="group" aria-label="Choose a service">
          <button v-for="option in availableServices" :key="option.id" type="button" :aria-pressed="selectedService === option.id" @click="selectedService = option.id"><b class="sel-label"><template v-for="(part, i) in option.lines" :key="i"><br v-if="i" class="sel-br" />{{ part }}</template></b><span aria-hidden="true">↗</span></button>
        </div>
        <div class="catalog-layout">
          <div class="game-picker" role="group" aria-label="Choose your game">
            <button v-for="entry in games" :key="entry.id" type="button" class="shop-game" :class="{ 'is-selected': selectedGame === entry.id }" :aria-pressed="selectedGame === entry.id" @click="selectedGame = entry.id">
              <span class="shop-game__surface">
                <span class="shop-game__logo" :class="`shop-game__logo--${entry.id}`"><AppImage :src="`/images/games/${entry.id}-logo.webp`" alt="" width="200" height="100" loading="lazy" /></span>
                <span class="shop-game__bottom"><span>{{ entry.name }}</span><span class="shop-game__check" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="m3 8 3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" /></svg></span></span>
              </span>
            </button>
          </div>
          <aside id="rank-up-enquiry" class="enquiry" aria-labelledby="enquiry-title">
            <div class="enquiry__inner">
              <div class="enquiry__heading"><p class="shop-eyebrow">Let’s talk in detail</p></div>
              <h3 id="enquiry-title">Your selection.<br /><em>Let’s talk.</em></h3>
              <div class="enquiry__selection" aria-live="polite"><AppImage :src="`/images/games/${game.id}-logo.webp`" alt="" width="84" height="52" /><div><span>{{ service.name }}</span><strong>{{ game.name }}</strong></div></div>
              <p class="enquiry__description">{{ service.description }}</p>
              <label class="shop-field">Server / region<input v-model="region" type="text" maxlength="80" placeholder="e.g. Asia" autocomplete="off" /></label>
              <label class="shop-field">What do you have in mind?<textarea v-model="details" rows="3" maxlength="500" placeholder="A package, amount or a few details…" /></label>
              <div class="enquiry__actions">
                <button class="copy-button" type="button" @click="copyEnquiry">{{ copyState === 'copied' ? 'Enquiry copied ✓' : 'Copy your enquiry' }}<svg v-if="copyState !== 'copied'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg></button>
                <a class="instagram-button" href="https://www.instagram.com/koqbisagtu/" target="_blank" rel="noopener noreferrer">Enquire on Instagram<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="17" height="17" viewBox="0 0 48 48"><defs><mask id="top-up-enquiry-chat"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path fill="#555" d="M44 7H4v30h7v5l10-5h23z" /><path d="M31 16v1m-14-1v1m14 8s-2 4-7 4s-7-4-7-4" /></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#top-up-enquiry-chat)" /></svg></a>
              </div>
              <p v-if="copyState === 'manual'" class="enquiry__status" role="status">Select and copy the message below, then send it on Instagram.</p>
              <label v-if="copyState === 'manual'" class="shop-field">Your enquiry<textarea ref="enquiryField" :value="enquiry" readonly rows="7" /></label>
            </div>
          </aside>
        </div>
      </section>

    </main>
    <SiteFooter />
    <dialog ref="copiedDialog" class="copied-dialog" aria-labelledby="copied-title" aria-describedby="copied-description" @click="onDialogBackdrop">
      <div class="copied-banner">
        <div class="copied-banner__art" aria-hidden="true">
          <img src="/images/enquiry-character-cutout.png" alt="" width="1024" height="1536" />
        </div>
        <div class="copied-banner__content">
          <button class="copied-banner__close" type="button" aria-label="Close notification" @click="closeCopiedDialog">×</button>
          <p class="copied-banner__status"><span aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6" /></svg></span> Enquiry copied</p>
          <h2 id="copied-title">One last step.<br /><em>Send us a DM.</em></h2>
          <p id="copied-description">Your enquiry is on your clipboard. Paste it into an Instagram message to <strong>@koqbisagtu</strong> and hit send.</p>
          <div class="copied-banner__selection"><span>{{ game.name }}</span><span>{{ service.name }}</span></div>
          <a ref="instagramAction" class="instagram-button" href="https://www.instagram.com/koqbisagtu/" target="_blank" rel="noopener noreferrer">Open Instagram</a>
          <p class="copied-banner__note">Your enquiry hasn’t been sent yet. We’ll confirm options and prices in your DM.</p>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.shop-page { --shop-pink: #ff4d5e; --shop-purple: #ff4d5e; --shop-red: #ff3858; --shop-muted: #c8c8cc; --shop-outline: linear-gradient(110deg, #ff183b, #ff183b 55%, #dcdce0); --shop-outline-dim: linear-gradient(110deg, rgba(255, 24, 59, .5), rgba(255, 24, 59, .5) 55%, rgba(220, 220, 224, .4)); position: relative; isolation: isolate; background: transparent; min-height: 100svh; }
.shop-wrap { width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px)); margin-inline: auto; padding-bottom: clamp(88px, 10vw, 144px); }
.shop-hero { padding-top: clamp(40px, 6vw, 88px); }
.shop-hero__intro { display: grid; grid-template-columns: 1.1fr 1fr; gap: 60px; align-items: last baseline; margin-bottom: 38px; }
.shop-eyebrow { margin: 0 0 18px; color: var(--shop-pink); font-size: 11px; line-height: 1.6; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; }
.shop-eyebrow--line { display: flex; align-items: center; gap: 10px; color: #fff; }
h1, h2, h3, p, figure { margin-top: 0; }
h1 { margin-bottom: 0; font: 900 clamp(32px, 5vw, 64px)/1.12 var(--display); letter-spacing: -.035em; text-transform: uppercase; }
em { font-style: normal; background: linear-gradient(105deg, #ff183b, #ff183b 55%, #dcdce0); background-clip: text; -webkit-background-clip: text; color: transparent; }
.shop-hero__aside { max-width: 450px; justify-self: end; }
.shop-hero__aside > p:first-child { color: #fff; font-weight: 800; font-size: 15px; margin-bottom: 12px; }
.shop-hero__aside > p:nth-child(2) { color: var(--shop-muted); font-size: 15px; line-height: 1.75; margin-bottom: 0; }
/* banner (3:2) with the promo box beside it, stretched to the banner's height */
.shop-showcase { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 16px; align-items: stretch; }
.shop-banner { margin: 0; min-width: 0; }
.shop-banner > img { display: block; width: 100%; height: auto; }
.shop-promo { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-content: center; min-width: 0; padding: 24px; border: 2px solid transparent; background: linear-gradient(#000, #000) padding-box, var(--shop-outline) border-box; }
.shop-promo .shop-eyebrow { margin-bottom: 12px; }
/* type scale matches the rank-up "Why KeroSpace" box */
.shop-promo h2 { font: 900 clamp(22px, 2.4vw, 30px)/1.25 var(--display); letter-spacing: -.02em; text-wrap: balance; }
.shop-promo__intro { margin: 16px 0 0; color: var(--shop-muted); font-size: 15px; line-height: 1.75; }
.shop-promo__points { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; margin: 0; padding: 0; list-style: none; }
.shop-promo__points li { display: grid; gap: 6px; }
.shop-promo__points strong { color: var(--shop-pink); font: 800 15px/1.5 var(--display); }
.shop-promo__points span { color: #fff; font-size: 14px; line-height: 1.7; }
.shop-catalog { padding-top: clamp(60px, 8vw, 100px); scroll-margin-top: 28px; }
.catalog-heading { display: flex; justify-content: space-between; align-items: end; gap: 36px; margin-bottom: 28px; }
h2 { margin-bottom: 0; font: 900 clamp(26px, 3.1vw, 40px)/1.2 var(--display); letter-spacing: -.025em; text-transform: uppercase; }
.catalog-heading > p { max-width: 360px; margin-bottom: 4px; font-size: 15px; line-height: 1.75; color: var(--shop-muted); }
.service-picker { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-bottom: 26px; }
.service-picker--rank-up { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.service-picker button { display: flex; justify-content: space-between; align-items: center; gap: 8px; min-width: 0; min-height: 58px; padding: 14px 18px; border: 1px solid transparent; border-radius: 0; background: linear-gradient(#000, #000) padding-box, var(--shop-outline-dim) border-box; color: #fff; font: 800 11px/1.5 var(--display); text-transform: uppercase; cursor: pointer; }
.service-picker button span { color: var(--shop-purple); font: 400 20px/1 var(--ui); }
@media (min-width: 761px) { .sel-br { display: none; } }
/* the button is a flex container, so the label lives in ONE wrapper (otherwise each text run,
   and the <br> would become separate flex items and scatter across the button) */
.sel-label { display: block; font: inherit; }
.service-picker button[aria-pressed='true'] { background: linear-gradient(#000, #000) padding-box, var(--shop-outline) border-box; }
.catalog-layout { display: grid; grid-template-columns: minmax(0, 1fr) 355px; gap: 28px; align-items: stretch; }
.game-picker { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.shop-game { position: relative; isolation: isolate; padding: 2px; border: 0; border-radius: 0; min-width: 0; background: var(--shop-outline-dim); cursor: pointer; text-align: left; }
.shop-game.is-selected { background: var(--shop-outline); }
.shop-game__surface { display: flex; flex-direction: column; position: relative; min-height: 254px; height: 100%; overflow: hidden; border-radius: 0; background: #000; }
/* fills the space above the name bar and centres the logo in it, both ways */
.shop-game__logo { position: relative; display: flex; flex: 1; align-items: center; justify-content: center; min-height: 0; padding: 20px; }
.shop-game__logo img { display: block; width: auto; height: auto; max-width: 100%; max-height: 90px; object-fit: contain; }
/* Star Rail's mark is wide-and-short and NTE's is near-square, so both read small at 90px */
.shop-game__logo--hsr img { width: 100%; max-height: 130px; }
.shop-game__logo--nte img { height: 124px; max-height: 124px; }
.shop-game__bottom { display: flex; justify-content: space-between; align-items: center; gap: 10px; position: relative; min-height: 70px; padding: 14px; }
.shop-game__bottom > span:first-child { font-size: 13px; font-weight: 800; line-height: 1.5; }
.shop-game__check { display: grid; place-items: center; width: 22px; height: 22px; flex-shrink: 0; border: 1px solid #8a8a8e; border-radius: 50%; color: transparent; }
.is-selected .shop-game__check { background: var(--shop-pink); border-color: var(--shop-pink); color: #000; }
.enquiry__heading .shop-eyebrow { color: #fff; }
.enquiry { padding: 2px; scroll-margin-top: 24px; background: var(--shop-outline); }
.enquiry__inner { padding: 24px; background: #000; }
.enquiry__heading { display: flex; align-items: start; justify-content: space-between; gap: 16px; }
.enquiry h3 { margin-bottom: 24px; font: 800 23px/1.3 var(--display); text-transform: uppercase; }
.enquiry__selection { display: flex; align-items: center; gap: 14px; min-height: 82px; padding: 14px 0; border-block: 1px solid #2a2a2e; }
.enquiry__selection img { width: 74px; height: 48px; object-fit: contain; flex-shrink: 0; }
.enquiry__selection div { min-width: 0; }
.enquiry__selection span { display: block; margin-bottom: 5px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--shop-pink); }
.enquiry__selection strong { display: block; font-size: 14px; line-height: 1.45; }
.enquiry__description { min-height: 5.1em; margin: 16px 0 20px; color: var(--shop-muted); font-size: 13px; line-height: 1.7; }
.shop-field { display: block; font-size: 12px; font-weight: 800; margin-bottom: 16px; }
.shop-field > span { color: #a3a3a8; font-size: 10px; font-weight: 600; margin-left: 5px; }
.shop-field input, .shop-field textarea { display: block; width: 100%; min-width: 0; margin-top: 8px; border: 1px solid #3a3a3e; border-radius: 0; padding: 11px 12px; color: #fff; background: #000; font: 500 14px/1.6 var(--ui); }
.shop-field textarea { resize: none; min-height: 90px; overflow-y: auto; scrollbar-width: none; }
.shop-field textarea::-webkit-scrollbar { display: none; }
.shop-field :is(input, textarea)::placeholder { color: #a9a9ad; opacity: 1; }
.shop-field :is(input, textarea):focus { outline: none; box-shadow: none; border-color: var(--shop-pink); }
.enquiry__actions { display: grid; gap: 10px; }
.copy-button, .instagram-button { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; padding: 12px; font-size: 13px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
.copy-button { border: 1px solid transparent; background: linear-gradient(#000, #000) padding-box, var(--shop-outline) border-box; color: #fff; }
.instagram-button { background: linear-gradient(105deg, #ff183b, #6e0614); color: #fff; }
.enquiry__actions svg { flex-shrink: 0; }
.enquiry__status { margin: 14px 0 0; min-height: 3.3em; font-size: 11px; line-height: 1.65; color: var(--shop-muted); }
.copied-dialog { width: min(820px, calc(100vw - 64px)); max-width: none; max-height: calc(100dvh - 120px); padding: 0; border: 0; overflow: visible; background: transparent; color: #fff; }
.copied-dialog::backdrop { background: rgb(0 0 0 / .8); backdrop-filter: blur(7px); }
.copied-banner { position: relative; isolation: isolate; display: grid; grid-template-columns: 42% 58%; border: 1px solid #ff2446; background: #000; box-shadow: 0 24px 100px #0009; }
.copied-banner::before { content: ''; position: absolute; inset: -2px; padding: 2px; pointer-events: none; background: linear-gradient(115deg, #720015, #ff173d, #ff9a9f, #ff2446, #720015, #ff173d); background-size: 300% 300%; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; }
.copied-banner__art { position: relative; min-height: 420px; }
.copied-banner__art img { position: absolute; bottom: 0; left: -10%; width: 156%; height: 148%; object-fit: contain; object-position: bottom; filter: drop-shadow(0 8px 18px #0007); pointer-events: none; }
.copied-banner__content { position: relative; padding: 42px 36px 32px 20px; }
.copied-banner__close { position: absolute; top: 8px; right: 10px; width: 36px; height: 36px; border: 0; background: transparent; color: #ff7585; font: 300 28px/1 var(--ui); cursor: pointer; }
.copied-banner__status { display: flex; align-items: center; gap: 8px; margin: 0 0 20px; color: #fff; font: 800 11px/1.5 var(--ui); letter-spacing: .1em; text-transform: uppercase; }
.copied-banner__status > span { display: grid; place-items: center; width: 22px; height: 22px; flex-shrink: 0; line-height: 0; letter-spacing: 0; border: 1px solid #ff2446; border-radius: 50%; color: #ff3654; }
.copied-banner__status svg { display: block; }
.copied-banner h2 { font-size: clamp(24px, 3vw, 32px); line-height: 1.25; margin-bottom: 18px; color: #ff3654; text-shadow: 0 0 18px #ff173d40; }
.copied-banner h2 em { background: linear-gradient(105deg, #ff173d, #ff6b78, #ff2446); background-clip: text; -webkit-background-clip: text; color: transparent; }
.copied-banner__content > p:not([class]) { margin-bottom: 18px; color: #fff; font-size: 14px; line-height: 1.75; }
.copied-banner__content strong { color: #fff; }
.copied-banner__selection { display: flex; flex-wrap: wrap; gap: 6px 12px; padding: 12px 0; margin-bottom: 20px; border-block: 1px solid #7d1527; color: #fff; font-size: 14px; line-height: 1.75; }
.copied-banner__selection span + span { color: #fff; }
.copied-banner .instagram-button { text-decoration: none; justify-content: center; padding-inline: 18px; background: linear-gradient(105deg, #d9082b, #ff173d 55%, #b90025); color: #fff; border: 0; box-shadow: none; }
.copied-banner :is(a, button):focus-visible { outline-color: #ff3654; }
.copied-banner__note { margin: 12px 0 0; color: #fff; font-size: 11px; line-height: 1.65; }
@media (max-width: 600px) {
  /* the art pokes ~70px above the box, so nudge the box down to centre the whole thing */
  .copied-dialog { width: min(440px, calc(100vw - 40px)); max-height: calc(100dvh - 100px); margin: auto; translate: 0 24px; }
  .copied-banner { grid-template-columns: 1fr; }
  .copied-banner__art { min-height: 140px; margin-bottom: 6px; }
  .copied-banner__art img { left: 4px; bottom: 0; width: 220px; height: 210px; object-fit: cover; object-position: center top; mask-image: linear-gradient(#000 70%, transparent); }
  .copied-banner__content { position: static; padding: 0 22px 22px; max-height: calc(100dvh - 268px); overflow-y: auto; }
  .copied-banner__close { position: absolute; top: 8px; right: 8px; width: 44px; height: 44px; }
  .copied-banner__status { font-size: 10px; letter-spacing: .06em; margin-bottom: 12px; }
  .copied-banner h2 { font-size: clamp(22px, 6vw, 28px); margin-bottom: 14px; }
  .copied-banner__content > p:not([class]) { font-size: 13px; line-height: 1.65; margin-bottom: 14px; }
  .copied-banner__selection { flex-direction: column; gap: 4px; margin-bottom: 16px; font-size: 13px; line-height: 1.65; }
  .copied-banner .instagram-button { min-height: 48px; font-size: 12px; letter-spacing: .02em; padding-inline: 16px; }
}
@media (max-width: 600px) and (max-height: 600px) {
  .copied-dialog { max-height: calc(100dvh - 40px); translate: 0 12px; }
  .copied-banner__art { min-height: 70px; }
  .copied-banner__art img { height: 110px; width: 150px; }
  .copied-banner__content { max-height: calc(100dvh - 138px); }
}
@media (prefers-reduced-motion: no-preference) {
  .copied-dialog[open] .copied-banner { animation: copied-arrive .24s ease-out both; }
  .copied-dialog[open] .copied-banner::before { animation: copied-outline 4s ease-in-out infinite; }
  @keyframes copied-arrive { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes copied-outline { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
}
.shop-page :is(a, button):focus-visible { outline: 2px solid var(--shop-pink); outline-offset: 4px; }
.shop-page .copied-banner .instagram-button:focus { outline: none; }
.shop-page .copied-banner .instagram-button:focus-visible { text-decoration: none; box-shadow: none; outline: none; }
/* narrower than full width the promo column would outgrow the banner beside it, so stack */
@media (max-width: 1300px) { .shop-showcase { grid-template-columns: minmax(0, 1fr); gap: 16px; } }
@media (max-width: 1100px) { .catalog-layout { grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; } .game-picker { grid-template-columns: repeat(2, minmax(0, 1fr)); } .shop-game__surface { min-height: 230px; } .enquiry__inner { padding: 20px; } .shop-hero__intro { gap: 32px; } }
@media (max-width: 760px) {
  .shop-hero__intro { grid-template-columns: 1fr; gap: 24px; margin-bottom: 26px; }
  .shop-hero__aside { justify-self: start; max-width: 540px; }
  .catalog-heading { display: block; }
  .catalog-heading > p { margin: 18px 0 0; max-width: 460px; }
  .catalog-layout { grid-template-columns: 1fr; gap: 28px; }
  .service-picker { gap: 7px; }
  .service-picker--rank-up { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .service-picker button { justify-content: center; text-align: center; min-height: 58px; padding: 10px; font-size: 11px; }
  .service-picker button span { display: none; }
  .shop-game__surface { min-height: 230px; }
  .shop-game__logo { padding: 14px; }
  .shop-game__logo img { max-height: 72px; }
  .shop-game__logo--hsr { padding-inline: 8px; }
  .shop-game__logo--hsr img { max-height: 96px; }
  .shop-game__logo--nte img { height: 96px; max-height: 96px; }
  .enquiry__inner { padding: 24px; }
  .enquiry__description { min-height: 0; }
}
@media (max-width: 380px) { .game-picker { gap: 10px; } .shop-game__surface { min-height: 205px; } .shop-game__logo { padding: 10px; } .shop-game__logo img { max-height: 62px; } .shop-game__logo--hsr img { max-height: 84px; } .shop-game__logo--nte img { height: 84px; max-height: 84px; } .shop-game__bottom { padding: 10px; gap: 7px; } .shop-game__bottom > span:first-child { font-size: 11px; } .enquiry__inner { padding: 20px; } }
@media (prefers-reduced-motion: reduce) { .shop-game, .enquiry { animation: none; } .service-picker button { transition: none; } }
</style>
