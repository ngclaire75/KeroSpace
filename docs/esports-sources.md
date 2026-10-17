# Esports archive

Checked on 17 October 2026. Content lives in `data/esports.ts`; `/esports` renders the archive. The navigation, mobile menu, footer and sitemap include the route.

## Coverage and editorial rules

This is a curated archive, not an exhaustive database of every regional league, qualifier, community event or match. It covers the six existing KeroSpace games. The M Series includes M1–M7, and MSC includes 2017–2026, with 2020 explicitly cancelled. MWI includes all five editions from 2022–2026. Additional entries cover Genshin competitions, the 2019 Asia-Pacific Honkai Championships and Wuthering Waves Holographic Overdrive 2026.

Each entry carries its own source link. Organizer records and broadcasts are preferred; historical reporting and tournament databases fill documented gaps. A record for a final or knockout stage does not imply that its date is the full event range. Date labels state those boundaries. Where a month is known but the precise day is not, `start` is only a sorting anchor and `dateLabel` is the displayed date. Do not display those anchors as exact dates.

No source-verified records were found for Honkai: Star Rail or Neverness to Everness in this research. This is not a claim that competitions have never existed. In-game fictional tournaments are excluded.

Player circles use monograms. The six-person selections for MLBB, Genshin and Wuthering Waves represent verified appearances or achievements, not an objective popularity ranking. Do not invent missing players or use unrelated people as portraits. Honkai Impact 3rd has historical event evidence but no sufficiently verified six-player selection here.

## Principal sources

- [MOONTON tournament archive](https://en.moonton.com/match/index.html): M Series, MSC and MWI results.
- [M4 results and player achievements](https://en.moonton.com/news/14.html).
- [M6 player profiles](https://en.moonton.com/news/243.html).
- [M7 Finals MVP](https://en.moonton.com/news/300.html).
- [MSC 2026 results](https://en.moonton.com/news/360.html).
- [Official Genshin SEA Carnival qualifier rules](https://webstatic.hoyoverse.com/upload/static-resource/2022/11/04/44aa1e5ee2408cf5142e7254b36066cd_6883118145042799900.pdf).
- [Official Astra Carnival broadcasts](https://www.youtube.com/@AstraCarnival).
- [Fonta Cup 2024 official match recordings and six competitors](https://www.bilibili.com/video/BV1rE4m1R7DS/).
- [Fonta Cup 2025 autumn organizer announcement](https://www.sina.cn/news/detail/5196976562112862.html).
- [Fonta Cup 2026 republished organizer schedule](https://news.17173.com/content/01192026/165854940.shtml).
- [2019 Honkai championship contemporary reporting](https://www.kaorinusantara.or.id/newsline/131092/asia-tenggara-siap-berguncang-mari-sambut-honkai-impact-3-sea-pac-finals).
- [Wuthering Waves organizer final broadcast](https://www.youtube.com/watch?v=4b-0KBa78wo).
- [Wuthering Waves schedule and final results](https://diorama.suaramerdeka.com/video-game/18317457594/pemain-indonesia-jadi-juara-wuthering-waves-holographic-overdrive-2026-bawa-pulang-rp-39-juta).
- [Wuthering Waves competitor reporting](https://holopis.com/gamer-indonesia-juara-wuthering-waves-bawa-pulang-rp39-juta/).

## Validation

Production build and static generation pass. Runtime checks exercised game changes, year and series filtering, search, order, filter reset and empty states. Data checks cover unique IDs, game relationships, source URLs, video ID format, date ordering, six-game logos, and the seven M Series / ten MSC edition records. Generated HTML contains the default game's twenty-two records and six players; embedded videos load only after an explicit click. Browser visual verification was unavailable.

## Private Sites preview

Project: `appgprj_6ad37c00e184819199577820d05c5865` (`kerospace-esports`). The preview is a static copy staged outside the repository at `/private/tmp/kerospace-esports-sites`; the Nuxt source in this repository remains the source for the existing Vercel deployment. No Vercel production deployment is performed by this change.

Published private preview: https://kerospace-esports.sunlitmoon16.chatgpt.site/esports

Sites version: `appgprj_6ad37c00e184819199577820d05c5865~appgver_87da4f13e4dc81918cf9f98a2244c720`. Deployment confirmed succeeded.
