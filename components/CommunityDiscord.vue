<script setup lang="ts">
import { communityDiscordServers } from '~/data/communityDiscord'
</script>

<template>
  <section id="community-discord" class="discord" aria-labelledby="discord-title">
    <header class="discord__heading">
      <div>
        <p class="discord__eyebrow"><span class="discord__logo" aria-hidden="true" /> On Discord</p>
        <h2 id="discord-title">Same game.<br /><em>New connections.</em></h2>
      </div>
      <p class="discord__intro">News, build talk and a place to meet other players. Join your game's official Discord community.</p>
    </header>

    <div class="discord__layout">
      <div class="server-directory">
        <div class="server-directory__inner">
          <header class="server-directory__heading">
            <div><p>Find your community</p><h3>Official game servers</h3></div>
            <span class="server-directory__brand" role="img" aria-label="Discord" />
          </header>
          <ul class="server-list" aria-label="Official game Discord servers">
            <li v-for="server in communityDiscordServers" :key="server.id">
              <a class="server" :href="server.invite" target="_blank" rel="noopener noreferrer"
                :aria-label="`Join ${server.server} on Discord (opens in a new tab)`">
                <AppImage class="server__background" :src="server.banner" :style="{ objectPosition: server.bannerPosition }" alt="" width="1024" height="576" loading="lazy" decoding="async" />
                <span class="server__logo" :class="{ 'server__logo--nte': server.id === 'nte' }"><AppImage :src="`/images/games/${server.id}-logo.webp`" :alt="server.name" width="78" height="48" loading="lazy" /></span>
                <span class="server__copy"><b>{{ server.name }}</b><span>{{ server.description }}</span></span>
                <span class="server__join" aria-hidden="true"><span>Join</span><svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 18 18 6M6 6h12v12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
              </a>
            </li>
          </ul>
          <footer class="server-directory__foot">Choose your game. Meet the people who play it.</footer>
        </div>
      </div>

      <figure class="discord-art">
        <AppImage src="/images/community/arlecchino.webp" width="1200" height="1725" sizes="(max-width: 900px) 420px, 500px" alt="Arlecchino community banner" loading="lazy" />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.discord { --discord-pink: #ff4d5e; --discord-purple: #ff4d5e; --discord-red: #ff3859; width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px)); margin: 0 auto; padding-bottom: clamp(88px, 10vw, 144px); scroll-margin-top: 32px; }
.discord__heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; margin-bottom: 32px; }
.discord__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.discord__eyebrow img { object-fit: contain; }
.discord h2 { margin: 0; font: 900 clamp(28px, 3.5vw, 46px)/1.16 var(--display); text-transform: uppercase; letter-spacing: -.025em; }
.discord h2 em { font-style: normal; background: linear-gradient(100deg, #ff183b, #ff183b 55%, #dcdce0); background-clip: text; -webkit-text-fill-color: transparent; }
.discord__intro { max-width: 330px; margin: 0 0 3px; color: #fff; font-size: 16px; line-height: 1.75; }
.discord__layout { display: grid; grid-template-columns: minmax(0, 1.22fr) minmax(0, .78fr); align-items: start; gap: clamp(24px, 3.2vw, 44px); }
.server-directory { min-width: 0; padding: 2px; background: conic-gradient(from var(--card-outline-angle), #ff183b, #ff183b 35%, #dcdce0 50%, #ff183b 65%, #ff183b); animation: card-outline-turn 3s linear infinite; }
.server-directory__inner { background: #000; }
.server-directory__heading { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 24px; }
.server-directory__heading p { margin: 0 0 7px; color: var(--discord-pink); font-size: 10px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.server-directory__heading h3 { margin: 0; font: 800 clamp(15px, 1.6vw, 20px)/1.3 var(--display); text-transform: uppercase; }
.server-directory__brand { display: block; flex-shrink: 0; width: 36px; height: 28px; background: var(--logo-red); -webkit-mask: url('/images/community/discord-symbol.svg') center / contain no-repeat; mask: url('/images/community/discord-symbol.svg') center / contain no-repeat; }
/* Discord mark painted in red → dark red through the logo's shape */
.discord__logo { display: block; flex-shrink: 0; width: 22px; height: 17px; background: var(--logo-red); -webkit-mask: url('/images/community/discord-symbol.svg') center / contain no-repeat; mask: url('/images/community/discord-symbol.svg') center / contain no-repeat; }
.server-list { margin: 0; padding: 0; list-style: none; }
.server-list li { border-top: 1px solid #2a2a2e; }
.server { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-columns: 78px minmax(0, 1fr) auto; align-items: center; gap: 18px; min-height: 88px; padding: 14px 22px; }
/* black and white; no extra darkening, the row's own shade already dims it */
.server__background { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15); pointer-events: none; }
.server::after { content: ''; position: absolute; z-index: -1; inset: 0; background: linear-gradient(90deg, rgba(0, 0, 0, .9), rgba(0, 0, 0, .8) 48%, rgba(0, 0, 0, .55)); box-shadow: inset 0 0 0 100vmax rgba(110, 6, 20, 0); transform: translateZ(0); transition: box-shadow .28s ease; pointer-events: none; }
.server__logo { position: relative; display: block; min-width: 0; height: 48px; overflow: hidden; }
.server__logo img { position: absolute; inset: 0; width: 100%; height: 100%; min-width: 0; min-height: 0; object-fit: contain; }
.server__logo--nte img { inset: 2px; width: calc(100% - 4px); height: calc(100% - 4px); }
.server__copy { display: grid; gap: 6px; min-width: 0; }
.server__copy b { color: #fff; font: 800 13px/1.45 var(--display); }
.server__copy > span { max-width: 380px; color: #c8c8cc; font-size: 12px; line-height: 1.6; }
.server__join { display: flex; align-items: center; gap: 9px; color: var(--discord-pink); font: 800 14px/1.3 var(--display); text-transform: uppercase; }
.server__join svg { flex-shrink: 0; }
.server__copy, .server__join { transform: translateZ(0); backface-visibility: hidden; -webkit-font-smoothing: antialiased; }
.server:focus-visible { outline: 2px solid var(--discord-purple); outline-offset: 5px; }
.server-directory__foot { padding: 19px 24px 23px; color: #b8b8bb; font-size: 12px; line-height: 1.6; }
.discord-art { position: relative; width: 100%; aspect-ratio: 3 / 4; margin: 0; border: 0; border-radius: 0; overflow: hidden; }
/* the tall artwork fills the frame, cropped to keep her face in view; a little extra saturation */
.discord-art > img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; filter: saturate(1.35); }
@media (min-width: 901px) {
  .discord__layout { align-items: stretch; }
  .server-directory { contain: size; min-height: 0; }
  .server-directory__inner { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; height: 100%; }
  .server-directory__heading { padding: 18px 22px; }
  .server-list { display: grid; grid-template-rows: repeat(6, minmax(0, 1fr)); min-height: 0; }
  .server-list li { min-height: 0; }
  .server { height: 100%; min-height: 0; padding-block: 8px; }
  .server__copy > span { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden; }
  .server-directory__foot { padding: 12px 22px 14px; }
}
/* hover keeps the dark overlay and only adds a red tint: no opacity fade, so the text layers above never re-rasterise (that made Join and its arrow jitter) */
@media (hover: hover) { .server:hover::after { box-shadow: inset 0 0 0 100vmax rgba(110, 6, 20, .35); } }
@media (min-width: 1101px) and (max-width: 1279px) { .server__copy > span { -webkit-line-clamp: 1; line-clamp: 1; } }
@media (max-width: 1100px) and (min-width: 901px) {
  .discord__layout { grid-template-columns: minmax(0, 1.35fr) minmax(0, .65fr); }
  .server-directory__heading { padding: 14px 18px; }
  .server-directory__heading h3 { font-size: 15px; }
  .server-directory__brand { width: 28px; height: 22px; }
  .server { grid-template-columns: 64px minmax(0, 1fr) auto; gap: 12px; padding: 5px 18px; }
  .server__logo { height: 32px; }
  .server__copy > span { display: none; }
  .server-directory__foot { padding: 10px 18px; font-size: 11px; }
}
@media (max-width: 900px) { .discord__layout { grid-template-columns: minmax(0, 1fr); gap: 28px; } .discord-art { order: -1; width: min(100%, 420px); margin-inline: auto; } .discord__heading { align-items: flex-start; } .discord__intro { max-width: 280px; font-size: 14px; } }
@media (max-width: 600px) {
  .discord__heading { display: block; margin-bottom: 26px; }
  .discord__intro { max-width: 420px; margin-top: 18px; font-size: 15px; }
  .server-directory__heading { padding: 20px 18px; }
  .server-directory__brand { width: 28px; height: 22px; }
  .server { grid-template-columns: 60px minmax(0, 1fr) 18px; gap: 12px; padding: 17px 16px; }
  .server__copy b { font-size: 12px; }
  .server__copy > span { font-size: 12px; }
  .server__join > span { display: none; }
  .server-directory__foot { padding: 18px; }
}
@media (prefers-reduced-motion: reduce) { .server-directory { animation: none; } .server::after { transition: none; } }
</style>
