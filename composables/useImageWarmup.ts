/** Defer tab/slide preparation until its section is close to the viewport. */
export function useImageWarmup(target: Ref<HTMLElement | undefined>, warm: () => void) {
  let observer: IntersectionObserver | undefined
  onMounted(() => {
    if (!target.value) return
    if (!('IntersectionObserver' in window)) { warm(); return }
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer?.disconnect()
        warm()
      }
    }, { rootMargin: '600px' })
    observer.observe(target.value)
  })
  onBeforeUnmount(() => observer?.disconnect())
}
