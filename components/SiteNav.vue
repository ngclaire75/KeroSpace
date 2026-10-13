<script setup lang="ts">
const links = [
  { label: 'Games' },
  { label: 'Items', active: true },
  { label: 'How It Works' },
  { label: 'Guides' },
  { label: 'Community', caret: true, sub: ['Discord', 'Events', 'Leaderboard'] },
]

const open = ref(false)
const subOpen = ref(false)

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
  if (!v) subOpen.value = false
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
    <a href="#" class="nav__brand" aria-label="KeroSpace home">
      <img class="nav__mark" src="/images/logo.webp" alt="" width="34" height="34" />
      <span class="nav__word">KERO<b>SPACE</b></span>
    </a>

    <nav class="nav__links" aria-label="Primary">
      <a
        v-for="l in links"
        :key="l.label"
        href="#"
        :class="{ 'is-active': l.active }"
        :aria-current="l.active ? 'page' : undefined"
      >
        {{ l.label }}
        <svg v-if="l.caret" viewBox="0 0 10 10" width="9" height="9" aria-hidden="true">
          <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
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
        <p class="menu__eyebrow"><span />Navigate</p>

        <ol class="menu__list">
          <li
            v-for="(l, k) in links"
            :key="l.label"
            class="menu__item"
            :class="{ 'is-active': l.active, 'is-sub-open': l.sub && subOpen }"
            :style="{ '--d': `${0.12 + k * 0.05}s` }"
          >
            <component
              :is="l.sub ? 'button' : 'a'"
              :href="l.sub ? undefined : '#'"
              :type="l.sub ? 'button' : undefined"
              class="menu__link"
              :aria-expanded="l.sub ? subOpen : undefined"
              :aria-current="l.active ? 'page' : undefined"
              @click="l.sub ? (subOpen = !subOpen) : close()"
            >
              <span class="menu__num">{{ String(k + 1).padStart(2, '0') }}</span>
              <span class="menu__label">{{ l.label }}</span>
              <svg class="menu__arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  :d="l.sub ? 'm6 9 6 6 6-6' : 'M7 17 17 7M8 7h9v9'"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </component>

            <div v-if="l.sub" class="menu__sub">
              <div>
                <a v-for="s in l.sub" :key="s" href="#" @click="close">{{ s }}</a>
              </div>
            </div>
          </li>
        </ol>

        <div class="menu__foot" :style="{ '--d': `${0.12 + links.length * 0.05}s` }">
          <small>© {{ new Date().getFullYear() }} KeroSpace</small>
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
}
.nav__mark {
  width: 34px;
  height: 34px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255, 42, 61, 0.45));
}
.nav__word {
  font-family: var(--display);
  font-weight: 800;
  font-size: 19px;
  letter-spacing: 0.06em;
}
.nav__word b {
  font-weight: 800;
  color: var(--red);
}

.nav__links {
  display: flex;
  gap: clamp(18px, 2.6vw, 36px);
  margin-left: clamp(16px, 4vw, 52px);
}
.nav__links a {
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
  color: var(--red);
  text-shadow: 0 0 14px var(--red-glow);
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
    /* optical nudge: sit level with the logo mark */
    translate: 0 -5px;
  }
  /* logo mark only on mobile — wordmark hidden, mark a touch bigger */
  .nav__word {
    display: none;
  }
  .nav__mark {
    width: 48px;
    height: 48px;
  }

  /* sits under the nav's own brand + burger (z -1 inside the nav) and
     opens as a circle growing out of the burger */
  .menu {
    --origin: calc(100% - 29px) 39px;
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
  .menu__eyebrow span {
    width: 22px;
    height: 2px;
    border-radius: 2px;
    background: var(--red);
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
    transition:
      color 0.3s,
      translate 0.4s var(--ease);
  }
  .menu__arrow {
    color: var(--ink-3);
    transition:
      color 0.3s,
      transform 0.4s var(--ease);
  }
  .menu__link:active .menu__label {
    translate: 6px 0;
  }
  .menu__item.is-active .menu__num,
  .menu__item.is-active .menu__arrow {
    color: var(--red);
  }
  .menu__item.is-active .menu__label {
    background: linear-gradient(90deg, #ff2a3d, #ff9aa4);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .is-sub-open .menu__arrow {
    color: #fff;
    transform: rotate(180deg);
  }

  /* accordion via grid rows (animates to auto height) */
  .menu__sub {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.45s var(--ease);
  }
  .menu__sub > div {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    overflow: hidden;
    padding-left: 38px;
  }
  .is-sub-open .menu__sub {
    grid-template-rows: 1fr;
  }
  .is-sub-open .menu__sub > div {
    padding-bottom: 18px;
  }
  .menu__sub a {
    padding: 9px 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.03);
    font-size: 13px;
    font-weight: 700;
    color: var(--ink-2);
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
  .menu__foot small {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ink-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu,
  .menu__item,
  .menu__foot,
  .nav__burger span {
    transition-duration: 0.01s !important;
    transition-delay: 0s !important;
  }
}
</style>
