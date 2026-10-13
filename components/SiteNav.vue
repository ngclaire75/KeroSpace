<script setup lang="ts">
const links = [
  { label: 'Games' },
  { label: 'Items', active: true },
  { label: 'How It Works' },
  { label: 'Guides' },
  { label: 'Community', caret: true },
]
const open = ref(false)
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
        <svg v-if="l.caret" viewBox="0 0 10 10" width="8" height="8" aria-hidden="true">
          <path d="M1 3h8L5 8z" fill="currentColor" />
        </svg>
      </a>
    </nav>

    <div class="nav__actions">
      <button type="button" class="nav__icon" aria-label="Search items">
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
      </button>
      <a href="#" class="nav__cta">Explore</a>
      <button type="button" class="nav__lang" aria-label="Language: English">
        <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" class="nav__flag">
          <rect width="20" height="14" rx="2" fill="#fff" />
          <path d="M0 2h20M0 6h20M0 10h20" stroke="#e0202d" stroke-width="2" />
          <rect width="9" height="7.5" rx="1" fill="#1f2a5c" />
        </svg>
        EN
        <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true">
          <path d="M1 3h8L5 8z" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        class="nav__burger"
        :aria-expanded="open"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <span /><span /><span />
      </button>
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
/* the glowing tab that hangs from the frame's top edge */
.nav__links a.is-active::before {
  content: '';
  position: absolute;
  top: -42px;
  left: 50%;
  width: 58px;
  height: 5px;
  translate: -50% 0;
  border-radius: 0 0 6px 6px;
  background: var(--red);
  box-shadow: 0 0 18px 2px var(--red-glow), 0 0 40px 6px rgba(255, 42, 61, 0.25);
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: auto;
}
.nav__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--ink-2);
  cursor: pointer;
  transition: background 0.25s, color 0.25s;
}
.nav__icon:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.nav__cta {
  padding: 11px 24px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ff4152, var(--red-2));
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow:
    0 0 0 1px rgba(255, 120, 130, 0.35) inset,
    0 8px 28px -6px var(--red-glow),
    0 0 22px rgba(255, 42, 61, 0.35);
  transition: transform 0.25s var(--ease), box-shadow 0.25s;
}
.nav__cta:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(255, 140, 150, 0.5) inset,
    0 10px 34px -4px var(--red-glow),
    0 0 30px rgba(255, 42, 61, 0.5);
}

.nav__lang {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 18px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s;
}
.nav__lang:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.04);
}

.nav__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 40px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
}
.nav__burger span {
  height: 2px;
  border-radius: 2px;
  background: #fff;
  transition: transform 0.3s var(--ease), opacity 0.2s;
}
.is-open .nav__burger span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.is-open .nav__burger span:nth-child(2) {
  opacity: 0;
}
.is-open .nav__burger span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

@media (max-width: 1080px) {
  .nav__lang {
    display: none;
  }
}

@media (max-width: 900px) {
  .nav {
    padding-top: 22px;
    gap: 12px;
  }
  .nav__burger {
    display: flex;
  }
  .nav__links {
    position: absolute;
    top: calc(100% + 12px);
    left: 16px;
    right: 16px;
    flex-direction: column;
    gap: 4px;
    margin: 0;
    padding: 10px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(16, 16, 20, 0.92);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    opacity: 0;
    pointer-events: none;
    translate: 0 -8px;
    transition: opacity 0.25s, translate 0.3s var(--ease);
  }
  .is-open .nav__links {
    opacity: 1;
    pointer-events: auto;
    translate: 0 0;
  }
  .nav__links a {
    padding: 13px 14px;
    border-radius: 12px;
  }
  .nav__links a.is-active {
    background: rgba(255, 42, 61, 0.1);
  }
  .nav__links a.is-active::before {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav__word {
    font-size: 16px;
  }
  .nav__cta {
    padding: 10px 16px;
    font-size: 12px;
  }
  .nav__icon {
    display: none;
  }
}
</style>
