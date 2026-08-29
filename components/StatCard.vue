<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string
  delta: string
}>()

// split "+15% vs last month" -> coloured "+15%" + plain "vs last month"
const parsed = computed(() => {
  const [change, ...rest] = props.delta.split(' ')
  return { change, rest: rest.join(' ') }
})
</script>

<template>
  <article class="stat">
    <div class="stat__top">
      <span class="stat__label">{{ label }}</span>
      <span class="stat__glyph" aria-hidden="true">
        <svg viewBox="0 0 24 22" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="12" width="2.6" height="9" rx="0.4" fill="#df2531" />
          <rect x="5.6" y="14" width="2.6" height="7" rx="0.4" fill="#000000" />
          <rect x="9.2" y="2" width="2.6" height="19" rx="0.4" fill="#df2531" />
          <rect x="12.8" y="4" width="2.6" height="17" rx="0.4" fill="#000000" />
          <rect x="16.4" y="8" width="2.6" height="13" rx="0.4" fill="#df2531" />
          <rect x="20" y="10" width="2.6" height="11" rx="0.4" fill="#000000" />
        </svg>
      </span>
    </div>

    <div class="stat__num">{{ value }}</div>

    <div class="stat__bot">
      <span class="stat__delta">
        <span
          class="stat__change"
          :class="{
            'is-up': parsed.change.startsWith('+'),
            'is-down': parsed.change.startsWith('-'),
          }"
          >{{ parsed.change }}</span>
        {{ parsed.rest }}
      </span>
      <span class="stat__more" aria-hidden="true">
        <AppIcon name="more-vertical" :size="14" />
      </span>
    </div>
  </article>
</template>
