<script setup lang="ts">
import { NuxtLink } from '#components'

const route = useRoute()
const links = computed(() => [
  { label: 'Home', href: '/', active: route.path === '/' && !route.hash },
  { label: 'Games', href: '/#supported-games', active: route.path === '/' && route.hash === '#supported-games' },
  { label: 'Community', href: '/community', active: route.path === '/community' },
  { label: 'Guides' },
  { label: 'Top Up', href: '/top-up', active: route.path === '/top-up' },
  { label: 'E-Sports' },
])

const open = ref(false)
// the menu item that was just tapped keeps its neon text while the menu closes
const pressed = ref<string | null>(null)

function close() {
  open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
// the menu only exists below 900px — drop it if the viewport grows past that
let mq: MediaQueryList | undefined
const onMq = (e: MediaQueryListEvent) => e.matches && close()

watch(open, (v) => {
  document.documentElement.classList.toggle('menu-lock', v)
  if (v) pressed.value = null
})
onMounted(() => {
  window.addEventListener('keydown', onKey)
  mq = window.matchMedia('(min-width: 901px)')
  mq.addEventListener('change', onMq)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  mq?.removeEventListener('change', onMq)
  document.documentElement.classList.remove('menu-lock')
})
</script>

<template>
  <header class="nav" :class="{ 'is-open': open }">
    <NuxtLink to="/" class="nav__brand" aria-label="KeroSpace home">
      <AppImage class="nav__mark" loading="eager" src="/images/logo.webp" alt="" width="34" height="34" />
      <AppImage class="nav__word" loading="eager" sizes="180px" src="/images/wordmark-neon.webp" alt="" width="840" height="206" />
    </NuxtLink>

    <nav class="nav__links" aria-label="Primary">
      <component
        v-for="l in links"
        :key="l.label"
        :is="l.href ? NuxtLink : 'span'"
        :to="l.href"
        :role="!l.href ? 'link' : undefined"
        :aria-disabled="!l.href ? true : undefined"
        :class="{ 'is-active': l.active }"
        :aria-current="l.active ? 'page' : undefined"
      >
        {{ l.label }}
      </component>
    </nav>

    <div class="nav__actions">
      <button
        type="button"
        class="nav__burger"
        :aria-expanded="open"
        aria-controls="mobile-menu"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        @click="open = !open"
      >
        <span /><span /><span />
      </button>
    </div>

    <!-- ===== mobile menu (≤ 900px) ===== -->
    <div id="mobile-menu" class="menu" :aria-hidden="!open" :inert="!open">
      <div class="menu__inner">
        <p class="menu__eyebrow">Navigate</p>

        <ol class="menu__list">
          <li
            v-for="(l, k) in links"
            :key="l.label"
            class="menu__item"
            :class="{ 'is-active': l.active, 'is-pressed': pressed === l.label }"
            :style="{ '--d': `${0.12 + k * 0.05}s` }"
          >
            <component
              :is="l.href ? NuxtLink : 'span'"
              :to="l.href"
              class="menu__link"
              :role="!l.href ? 'link' : undefined"
              :aria-disabled="!l.href ? true : undefined"
              :aria-current="l.active ? 'page' : undefined"
              @pointerdown="l.href && (pressed = l.label)"
              @click="l.href && close()"
            >
              <span class="menu__num">{{ String(k + 1).padStart(2, '0') }}</span>
              <span class="menu__label">{{ l.label }}</span>
              <svg class="menu__arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M7 17 17 7M8 7h9v9"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </component>
          </li>
        </ol>

        <div class="menu__foot" :style="{ '--d': `${0.12 + links.length * 0.05}s` }">
          <AppImage class="menu__mark" src="/images/wordmark-neon.webp" alt="KeroSpace" width="840" height="206" />
          <p class="menu__credit">designed by claire.</p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 30px clamp(18px, 3vw, 36px) 0;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  /* line the visible bear up with the left edge of the page content below
     (the 1240px centred container with a clamp(16px, 4vw, 40px) gutter).
     The logo artwork has ~19.6% transparent padding, hence the 6.7px. */
  /* % = the nav's content width, so this stays exact even when the browser shows
     a scrollbar (100vw would include it and push the logo right) */
  margin-left: calc(max(clamp(16px, 4vw, 40px) - clamp(18px, 3vw, 36px), 50% - 620px) - 6.7px);
}
.nav__mark {
  width: 34px;
  height: 34px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255, 42, 61, 0.45));
}
.nav__word {
  /* trimmed to the artwork incl. its glow; letters sit centred in the box */
  height: 26px;
  width: auto;
}

.nav__links {
  display: flex;
  gap: clamp(18px, 2.6vw, 36px);
  margin-left: clamp(16px, 4vw, 52px);
}
.nav__links > * {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  transition: color 0.25s;
}
.nav__links a:hover {
  color: #fff;
}
.nav__links a.is-active {
  color: #fff;
  font-weight: 800;
}
.nav__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: auto;
}
/* ---------- burger: three bare lines that morph into a bare X ---------- */
.nav__burger {
  position: relative;
  display: none;
  width: 44px;
  height: 44px;
  /* 44px tap target, but the lines sit flush with the page's right edge */
  margin-right: -11px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.nav__burger span {
  position: absolute;
  left: 11px;
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: #fff;
  transition:
    transform 0.45s var(--ease),
    opacity 0.25s;
}
.nav__burger span:nth-child(1) {
  top: 14px;
}
.nav__burger span:nth-child(2) {
  top: 21px;
}
.nav__burger span:nth-child(3) {
  top: 28px;
}
.is-open .nav__burger span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.is-open .nav__burger span:nth-child(2) {
  opacity: 0;
}
.is-open .nav__burger span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ---------- full-screen menu ---------- */
.menu {
  display: none;
}

@media (max-width: 900px) {
  .nav {
    padding-top: 22px;
    gap: 12px;
  }
  .nav__links {
    display: none;
  }
  .nav__burger {
    display: block;
    translate: 0 -1px;
  }
  /* logo mark only on mobile — wordmark hidden, mark a touch bigger */
  .nav__word {
    display: none;
  }
  .nav__mark {
    width: 48px;
    height: 48px;
    translate: 0 2px;
  }
  .nav__brand {
    /* 48px mark → ~9.4px transparent edge */
    margin-left: calc(clamp(16px, 4vw, 40px) - clamp(18px, 3vw, 36px) - 9.4px);
  }

  /* sits under the nav's own brand + burger (z -1 inside the nav) and
     opens as a circle growing out of the burger */
  .menu {
    --origin: calc(100% - 29px) 42px;
    position: fixed;
    inset: 0;
    z-index: -1;
    display: block;
    overflow-y: auto;
    background: rgba(11, 11, 14, 0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    clip-path: circle(0 at var(--origin));
    visibility: hidden;
    transition:
      clip-path 0.6s cubic-bezier(0.7, 0, 0.2, 1),
      visibility 0s 0.6s;
  }
  .is-open .menu {
    clip-path: circle(150vmax at var(--origin));
    visibility: visible;
    transition:
      clip-path 0.7s cubic-bezier(0.7, 0, 0.2, 1),
      visibility 0s;
  }
  .menu__inner {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: 108px 24px 28px;
  }

  .menu__eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 14px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
  }

  .menu__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .menu__item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    opacity: 0;
    translate: 0 24px;
    transition:
      opacity 0.3s,
      translate 0.3s;
  }
  .is-open .menu__item,
  .is-open .menu__foot {
    opacity: 1;
    translate: 0 0;
    transition:
      opacity 0.6s var(--d) var(--ease),
      translate 0.7s var(--d) var(--ease);
  }

  .menu__link {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 18px 2px;
    border: 0;
    background: none;
    text-align: left;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .menu__num {
    width: 22px;
    font-family: var(--display);
    font-size: 11px;
    font-weight: 700;
    color: var(--ink-3);
    transition: color 0.3s;
  }
  .menu__label {
    flex: 1;
    font-family: var(--display);
    font-size: clamp(22px, 6.6vw, 30px);
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: #fff;
    transition: color 0.3s;
  }
  .menu__arrow {
    color: var(--ink-3);
    transition:
      color 0.3s,
      transform 0.4s var(--ease);
  }
  .menu__link[aria-disabled="true"] {
    cursor: default;
  }
  /* tap: the label lights up in an animated neon pink → purple gradient */
  .menu__link:not([aria-disabled="true"]):active .menu__label,
  .menu__item.is-pressed .menu__label {
    background: linear-gradient(90deg, #ff54bb, #b26bff, #ff54bb, #b26bff);
    background-size: 300% 100%;
    background-position: 0% 50%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: menu-neon 1.2s linear infinite;
  }
  .menu__item.is-active .menu__num,
  .menu__item.is-active .menu__arrow {
    color: #fff;
  }
  .menu__item.is-active .menu__label {
    font-weight: 900;
  }
  .menu__foot {
    margin-top: auto;
    padding-top: 36px;
    opacity: 0;
    translate: 0 24px;
    transition:
      opacity 0.3s,
      translate 0.3s;
  }
  .menu__mark {
    display: block;
    height: 30px;
    width: auto;
  }
  .menu__credit {
    display: block;
    width: fit-content;
    margin: -2px 0 0;
    font-family: var(--display);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.04em;
    background: linear-gradient(90deg, #d8baff, #ffc4e5, #d8baff);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: credit-gradient 3.5s linear infinite;
    animation-play-state: paused;
  }
  .is-open .menu__credit {
    animation-play-state: running;
  }
}

@keyframes menu-neon {
  /* one full pink → purple → pink period, so the loop is seamless */
  to { background-position: 100% 50%; }
}

@keyframes credit-gradient {
  to { background-position: 200% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .menu__credit,
  .menu__label {
    animation: none !important;
  }
  .menu,
  .menu__item,
  .menu__foot,
  .nav__burger span {
    transition-duration: 0.01s !important;
    transition-delay: 0s !important;
  }
}
</style>
