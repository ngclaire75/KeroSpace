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
      <div class="rank-reasons" aria-labelledby="rank-reasons-title">
        <div class="rank-reasons__intro">
          <p class="rank-reasons__eyebrow">Why KeroSpace</p>
          <h3 id="rank-reasons-title">Why make your next move with KeroSpace?</h3>
          <p class="rank-reasons__lede">Three things that keep your climb simple, from the first message to your new rank.</p>
        </div>
        <ul class="rank-reasons__list">
          <li><h4>Your goal sets the plan.</h4><p>A few tiers or a bigger climb. Share your current rank and target, and we shape the service around it.</p></li>
          <li><h4>A quote you can discuss.</h4><p>Bring your budget into the conversation. Agree on the price and service details before you order.</p></li>
          <li><h4>One direct conversation.</h4><p>Message @koqbisagtu with your goals and questions. Straight answers, without the guesswork.</p></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rank-service { padding-top: clamp(64px, 8vw, 100px); }
.rank-service__header { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
.rank-service__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0; color: #fff; font-size: 11px; font-weight: 800; line-height: 1.6; letter-spacing: .15em; text-transform: uppercase; white-space: nowrap; }
.rank-service__pitch { max-width: 900px; }
.rank-service h2 { margin: 0; color: #fff; font: 900 clamp(28px, 3.8vw, 50px)/1.2 var(--display); letter-spacing: -.03em; text-transform: uppercase; }
.rank-service h2 em { font-style: normal; background: linear-gradient(100deg, #ff183b, #ff183b 55%, #dcdce0); background-clip: text; -webkit-background-clip: text; color: transparent; }
.rank-service__lead { margin: 24px 0 14px; color: #fff; font-size: 18px; font-weight: 800; line-height: 1.65; }
.rank-service__description { max-width: 760px; margin: 0; color: var(--shop-muted); font-size: 16px; line-height: 1.85; }
.rank-service__showcase { margin-top: 30px; }
/* heading on the left, reasons on the right */
.rank-reasons { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap: clamp(28px, 5vw, 72px); align-items: start; min-width: 0; padding: clamp(24px, 3.5vw, 44px); border: 2px solid transparent; background: linear-gradient(#000, #000) padding-box, var(--shop-outline) border-box; }
.rank-reasons__eyebrow { margin: 0 0 14px; color: var(--shop-pink); font-size: 11px; font-weight: 800; line-height: 1.6; letter-spacing: .15em; text-transform: uppercase; }
.rank-reasons__intro h3 { margin: 0; color: #fff; font: 900 clamp(22px, 2.4vw, 30px)/1.25 var(--display); letter-spacing: -.02em; text-transform: uppercase; text-wrap: balance; }
.rank-reasons__lede { margin: 16px 0 0; color: var(--shop-muted); font-size: 15px; line-height: 1.75; }
.rank-reasons__list { margin: 0; padding: 0; list-style: none; }
.rank-reasons__list li { padding: 22px 0; border-top: 1px solid #2a2a2e; }
.rank-reasons__list li:first-child { padding-top: 0; border-top: 0; }
.rank-reasons__list li:last-child { padding-bottom: 0; }
.rank-reasons h4 { margin: 0 0 6px; color: #fff; font: 800 15px/1.5 var(--display); }
.rank-reasons__list p { margin: 0; color: var(--shop-muted); font-size: 14px; line-height: 1.7; }
@media (max-width: 900px) {
  .rank-reasons { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 760px) {
  .rank-service__header { gap: 16px; }
  .rank-service__eyebrow { font-size: 10px; letter-spacing: .1em; }
  .rank-service__lead { margin-top: 20px; font-size: 17px; }
  .rank-service__description { font-size: 15px; }
  .rank-reasons__list li { grid-template-columns: 44px minmax(0, 1fr); gap: 12px; }
  }
</style>
