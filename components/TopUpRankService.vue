<template>
  <section class="rank-service" aria-labelledby="rank-service-title">
    <header class="rank-service__header">
      <p class="rank-service__eyebrow">KeroSpace / Rank-up service</p>
    </header>

    <div class="rank-service__pitch">
      <div class="rank-service__copy">
        <h2 id="rank-service-title">Your rank isn’t<br /><em>your limit.</em></h2>
        <p class="rank-service__lead">Every rank. A new goal. Your next move with KeroSpace.</p>
        <p class="rank-service__description">One milestone away or ready for a bigger climb? Our Mobile Legends rank-up service welcomes players at every rank. Tell us where you are and where you want to be. Let’s shape the service around your goal.</p>
      </div>

    </div>

    <div class="rank-service__showcase">
      <figure class="rank-service__banner">
        <AppImage src="/images/mlbb-rank-price-list-neon-esrgan-2x.webp" alt="Mobile Legends rank-up service banner with rank badges and prices" width="3344" height="1882" sizes="(max-width: 860px) 100vw, 740px" />
      </figure>

      <div class="rank-reasons" aria-labelledby="rank-reasons-title">
        <h3 id="rank-reasons-title">Why make your next move with KeroSpace?</h3>
        <ul>
          <li><h4>Your goal sets the plan.</h4><p>A few tiers or a bigger climb: start with your current rank and target, then discuss the service that fits.</p></li>
          <li><h4>A quote you can discuss.</h4><p>Bring your budget into the conversation. Agree on the price and service details before you order.</p></li>
          <li><h4>One direct conversation.</h4><p>Message @koqbisagtu with your goals and questions. Talk through the details directly, without the guesswork.</p></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rank-service { padding-top: clamp(64px, 8vw, 100px); }
.rank-service__header { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
.rank-service__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0; color: #fff; font-size: 11px; font-weight: 800; line-height: 1.6; letter-spacing: .15em; text-transform: uppercase; white-space: nowrap; }
.rank-service__eyebrow::before { content: ''; flex: 0 0 26px; height: 2px; background: linear-gradient(90deg, var(--shop-red), var(--shop-pink), var(--shop-purple)); }
.rank-service__pitch { max-width: 900px; }
.rank-service h2 { margin: 0; color: #fff; font: 900 clamp(28px, 3.8vw, 50px)/1.2 var(--display); letter-spacing: -.03em; text-transform: uppercase; }
.rank-service h2 em { font-style: normal; background: linear-gradient(100deg, var(--shop-red), var(--shop-pink) 50%, var(--shop-purple)); background-clip: text; -webkit-background-clip: text; color: transparent; }
.rank-service__lead { margin: 24px 0 14px; color: #fff; font-size: 18px; font-weight: 800; line-height: 1.65; }
.rank-service__description { max-width: 760px; margin: 0; color: var(--shop-muted); font-size: 16px; line-height: 1.85; }
.rank-service__showcase { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); align-items: stretch; gap: 16px; margin-top: 30px; }
.rank-service__banner { margin: 0; min-width: 0; aspect-ratio: 1672 / 941; background: #000; }
.rank-service__banner img { display: block; width: 100%; height: 100%; object-fit: contain; }
.rank-reasons { display: grid; grid-template-rows: auto minmax(0, 1fr); gap: 20px; min-width: 0; min-height: 0; contain: size; padding: 24px; border: 2px solid #493350; background: #000; }
.rank-reasons > h3 { margin: 0; color: #fff; font-family: var(--display); font-size: 20px; font-weight: 800; line-height: 1.5; }
.rank-reasons ul { display: grid; grid-template-rows: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 0; padding: 0; list-style: none; }
.rank-reasons li { min-height: 0; }
.rank-reasons h4 { margin: 0 0 6px; color: var(--shop-pink); font: 800 14px/1.6 var(--display); }
.rank-reasons li p { margin: 0; color: #fff; font-size: 14px; line-height: 1.65; }
@media (min-width: 1101px) and (max-width: 1280px) {
  .rank-reasons { padding: 16px; gap: 8px; }
  .rank-reasons > h3 { font-size: 17px; line-height: 1.4; }
  .rank-reasons ul { gap: 6px; }
  .rank-reasons h4 { font-size: 12px; line-height: 1.4; margin-bottom: 4px; }
  .rank-reasons li p { font-size: 13px; line-height: 1.5; }
}
@media (max-width: 1100px) {
  .rank-service__showcase { grid-template-columns: minmax(0, 1fr); }
  .rank-reasons { contain: none; grid-template-rows: auto auto; padding: 24px; }
  .rank-reasons ul { grid-template-rows: none; gap: 24px; }
}
@media (max-width: 760px) {
  .rank-service__header { gap: 16px; }
  .rank-service__eyebrow { font-size: 10px; letter-spacing: .1em; }
  .rank-service__lead { margin-top: 20px; font-size: 17px; }
  .rank-service__description { font-size: 15px; }
}
</style>
