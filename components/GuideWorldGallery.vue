<script setup lang="ts">
import { guideGames } from '~/data/guides'
const props = defineProps<{ gameId: string }>()
const worldArtwork: Record<string, { src: string; width: number; height: number }> = {
  genshin: { src: '/images/anotherworld/genshinanother-esrgan-2x.webp', width: 1834, height: 2400 },
  hi3: { src: '/images/anotherworld/honkaiimpactanother-esrgan-2x.webp', width: 1472, height: 2616 },
  mlbb: { src: '/images/anotherworld/mlbbanother-esrgan-2x.webp', width: 1472, height: 2616 },
  nte: { src: '/images/anotherworld/nteanother-esrgan-2x.webp', width: 2400, height: 3656 },
  hsr: { src: '/images/anotherworld/starrailanother-esrgan-2x.webp', width: 2400, height: 4266 },
  wuwa: { src: '/images/anotherworld/wuwaanother-esrgan-2x.webp', width: 1372, height: 2048 },
}
// The game whose page this is is already on screen, so only the other five are offered.
const otherGames = computed(() => guideGames.filter(game => game.id !== props.gameId))
const gallery = ref<HTMLElement>()
const activeIndex = ref(0)
const cardsPerSlide = ref(3)
// The last slide may not be full (5 cards, 3 per slide). Empty slots let it scroll a whole slide,
// so it shows only the remaining cards instead of repeating ones from the slide before.
const spacers = computed(() => slides.value.length * cardsPerSlide.value - otherGames.value.length)
const slides = computed(() => Array.from({ length: Math.ceil(otherGames.value.length / cardsPerSlide.value) }, (_, index) => ({
  label: otherGames.value.slice(index * cardsPerSlide.value, (index + 1) * cardsPerSlide.value).map(game => game.name).join(', '),
})))
let resizeObserver: ResizeObserver | undefined
let targetIndex: number | null = null
let settleTimer: ReturnType<typeof setTimeout> | undefined
function releaseTarget() {
  targetIndex = null
  clearTimeout(settleTimer)
}
function slideStep() {
  const first = gallery.value?.firstElementChild as HTMLElement | null
  return first && gallery.value ? first.offsetWidth + parseFloat(getComputedStyle(gallery.value).columnGap || '0') : 0
}
function updateSlide() {
  const step = slideStep()
  if (!gallery.value || !step) return
  const index = Math.max(0, Math.min(slides.value.length - 1, Math.round(gallery.value.scrollLeft / (step * cardsPerSlide.value))))
  if (targetIndex !== null) {
    clearTimeout(settleTimer)
    settleTimer = setTimeout(releaseTarget, 150)
    if (index !== targetIndex) return
    releaseTarget()
  }
  activeIndex.value = index
}
function selectSlide(index: number) {
  if (!gallery.value) return
  activeIndex.value = index
  targetIndex = index
  clearTimeout(settleTimer)
  settleTimer = setTimeout(releaseTarget, 900)
  gallery.value.scrollTo({ left: slideStep() * cardsPerSlide.value * index, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
onMounted(() => {
  if (!gallery.value) return
  resizeObserver = new ResizeObserver(() => {
    if (!gallery.value) return
    const count = Number(getComputedStyle(gallery.value).getPropertyValue('--cards-per-slide')) || 3
    if (count !== cardsPerSlide.value) {
      releaseTarget()
      cardsPerSlide.value = count
      activeIndex.value = 0
      gallery.value.scrollTo({ left: 0, behavior: 'instant' })
    } else {
      updateSlide()
    }
  })
  resizeObserver.observe(gallery.value)
})
onBeforeUnmount(() => {
  clearTimeout(settleTimer)
  resizeObserver?.disconnect()
})
</script>

<template>
  <section class="gx-section worlds" aria-labelledby="gx-more-title">
    <header class="worlds__header" data-reveal><div><p class="worlds__eyebrow">Keep exploring</p><h2 id="gx-more-title" class="worlds__title">Another world.<br /><em class="gd-em">Your next adventure.</em></h2></div></header>
    <ul :id="`worlds-${gameId}`" ref="gallery" class="worlds__gallery" aria-label="Other game guides" data-reveal @scroll.passive="updateSlide" @pointerdown="releaseTarget" @touchstart.passive="releaseTarget">
      <li v-for="game in otherGames" :key="game.id" class="world-panel"><NuxtLink :to="`/guides/${game.id}`" class="world-panel__link"><AppImage class="world-panel__image" :class="{ 'world-panel__image--raised': game.id === 'mlbb' || game.id === 'hi3' }" :src="worldArtwork[game.id].src" alt="" sizes="(max-width: 760px) 100vw, (max-width: 1000px) 45vw, 350px" :width="worldArtwork[game.id].width" :height="worldArtwork[game.id].height" /><span class="world-panel__shade" aria-hidden="true" /><span class="world-panel__top"><span>{{ game.dev }}</span></span><span class="world-panel__copy"><span class="world-panel__genre">{{ game.genre }}</span><span class="world-panel__name">{{ game.name }}</span><span class="world-panel__cta">Explore guides</span></span></NuxtLink></li>
      <li v-for="n in spacers" :key="`spacer-${n}`" class="world-panel world-panel--spacer" aria-hidden="true" />
    </ul>
    <div class="worlds__indicators" role="group" aria-label="Choose a game guide">
      <button v-for="(slide, index) in slides" :key="index" type="button" :class="{ 'is-active': activeIndex === index }" :aria-label="`Show ${slide.label}`" :aria-pressed="activeIndex === index" :aria-controls="`worlds-${gameId}`" @click="selectSlide(index)"><span aria-hidden="true" /></button>
    </div>
  </section>
</template>

<style scoped>
.worlds{margin-top:clamp(75px,9vw,130px)}.worlds__header{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:34px}.worlds__eyebrow{font:800 11px/1.4 var(--ui);text-transform:uppercase;letter-spacing:.15em;color:#ff4d5e;margin:0 0 18px}.worlds__title{font:900 clamp(25px,3vw,40px)/1.2 var(--display);text-transform:uppercase;letter-spacing:-.04em;margin:0}.worlds__gallery{--cards-per-slide:3;display:flex;gap:12px;margin:0;padding:0;list-style:none;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.worlds__gallery::-webkit-scrollbar{display:none}.world-panel{flex:0 0 calc((100% - 24px)/3);min-width:0;scroll-snap-align:start;scroll-snap-stop:always}.world-panel--spacer{visibility:hidden}.world-panel__link{position:relative;isolation:isolate;display:flex;flex-direction:column;justify-content:space-between;min-height:500px;overflow:hidden;border:2px solid #ffffff26;border-radius:0;background:#000000;color:#fff}.world-panel__image{position:absolute;z-index:-2;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%}.world-panel__shade{position:absolute;z-index:-1;inset:0;background:linear-gradient(180deg,#0006,transparent 35%,#000000dc 87%)}.world-panel__top{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:18px 14px;font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;text-shadow:0 1px 5px #000}.world-panel__copy{display:flex;flex-direction:column;gap:13px;padding:22px 15px}.world-panel__genre{font-size:9px;line-height:1.6;letter-spacing:.08em;font-weight:800;text-transform:uppercase;color:#fff}.world-panel__name{font:900 clamp(15px,1.45vw,20px)/1.5 var(--display);text-transform:uppercase;letter-spacing:-.025em;text-wrap:balance}.world-panel__cta{display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:800;padding-top:13px;border-top:1px solid #fff;color:#fff}.world-panel__link:focus-visible{border-image:linear-gradient(110deg,#ff183b,#ff183b 55%,#dcdce0) 1}.world-panel__link:focus-visible{outline:2px solid #ff4d5e;outline-offset:5px}@media(hover:hover){.world-panel__link:hover{border-image:linear-gradient(110deg,#ff183b,#ff183b 55%,#dcdce0) 1}}@media(max-width:1000px){.world-panel__link{min-height:370px}}@media(max-width:760px){.worlds__header{display:block;margin-bottom:25px}.worlds__gallery{--cards-per-slide:1;padding:0;margin-inline:0;scrollbar-width:none}.worlds__gallery::-webkit-scrollbar{display:none}.world-panel{flex:0 0 100%;scroll-snap-stop:always}.world-panel__link{min-height:clamp(480px,68svh,620px)}.world-panel__name{font-size:22px}.world-panel__copy{padding:25px 22px}.world-panel__top{padding:18px 22px}.world-panel__genre{font-size:10px}.world-panel__image{object-position:center 30%}}@media(prefers-reduced-motion:reduce){*,*::before{transition:none!important}.worlds__gallery{scroll-behavior:auto}}


  .world-panel__image--raised{object-position:center 18%}

  .worlds__indicators{display:flex;justify-content:center;gap:6px;margin-top:10px}
  .worlds__indicators button{display:grid;place-items:center;width:48px;max-width:calc((100% - 30px)/6);height:36px;padding:0;border:0;border-radius:4px;background:transparent;cursor:pointer}
  .worlds__indicators span{width:calc(100% - 8px);max-width:40px;height:3px;border-radius:2px;background:rgba(255,255,255,.55);box-shadow:0 1px 5px rgba(0,0,0,.8)}
  .worlds__indicators button.is-active span{background:linear-gradient(90deg,#ff183b,#ff183b 55%,#dcdce0);box-shadow:0 0 7px rgba(255, 77, 94,.65)}
  .worlds__indicators button:focus-visible{outline:2px solid #ff4d5e;outline-offset:2px}
</style>
