// Site-wide scroll reveal: sections further down a page fade up as they enter the viewport.
//
// - The home page keeps its own hand-tuned reveal, so it is skipped.
// - Anything that already animates itself ([data-reveal], [data-together-reveal],
//   [data-heading-reveal]) is left alone, as is everything inside it.
// - Content already on screen when it appears is never hidden, so nothing flashes on load.
// - Sections rendered later (fetched builds, rosters) are picked up as they appear.
// - Visitors who prefer reduced motion see everything immediately.
export default defineNuxtPlugin(nuxtApp => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

  const OWN_REVEAL = '[data-reveal], [data-together-reveal], [data-heading-reveal]'
  const CANDIDATES = 'main section, main > header, main > div > header'
  // card grids reveal card by card, staggered across each row
  const CARDS = '.gl-games > li, .gk-grid > li'
  const router = useRouter()

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('ks-in')
      observer.unobserve(entry.target)
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

  function arm() {
    const main = document.querySelector('main')
    if (!main || router.currentRoute.value.path === '/') return
    const found = [...main.querySelectorAll<HTMLElement>(CANDIDATES)].filter(el =>
      !el.hasAttribute('data-ks-reveal')
      && !el.closest(OWN_REVEAL)
      && !el.querySelector(OWN_REVEAL)
      && !el.querySelector(CARDS))
    // outermost only, so a section and the sections inside it never animate twice
    const outermost = found.filter(el => !found.some(other => other !== el && other.contains(el)))
    for (const el of outermost) {
      el.setAttribute('data-ks-reveal', '')
      // already visible (or above the fold): show it as-is rather than hide and re-fade it
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) { el.classList.add('ks-in'); continue }
      observer.observe(el)
    }
    for (const card of main.querySelectorAll<HTMLElement>(CARDS)) {
      if (card.hasAttribute('data-ks-reveal') || card.closest(OWN_REVEAL)) continue
      card.setAttribute('data-ks-reveal', '')
      card.setAttribute('data-ks-card', '')
      if (card.getBoundingClientRect().top < window.innerHeight * 0.92) { card.classList.add('ks-in'); continue }
      // position within its row: 0, 1, 2… → a short left-to-right stagger
      const row = card.parentElement ? getComputedStyle(card.parentElement).gridTemplateColumns.split(' ').length || 1 : 1
      const index = card.parentElement ? [...card.parentElement.children].indexOf(card) : 0
      card.style.setProperty('--ks-delay', `${(index % row) * 70}ms`)
      observer.observe(card)
    }
    document.documentElement.classList.add('ks-motion')
  }

  // late content (client-fetched builds, rosters) appears after navigation finishes
  let queued = 0
  const mutations = new MutationObserver(() => {
    if (queued) return
    queued = requestAnimationFrame(() => { queued = 0; arm() })
  })

  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(() => {
      arm()
      const main = document.querySelector('main')
      mutations.disconnect()
      if (main) mutations.observe(main, { childList: true, subtree: true })
    })
  })
})
