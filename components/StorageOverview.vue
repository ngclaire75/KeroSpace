<script setup lang="ts">
const segments = [
  { label: 'Documents', value: 10.4, color: 'var(--c-doc)' },
  { label: 'Images', value: 1.4, color: 'var(--c-img)' },
  { label: 'Videos', value: 5.4, color: 'var(--c-vid)' },
  { label: 'Others', value: 2.4, color: 'var(--c-oth)' },
]
const max = Math.max(...segments.map((s) => s.value))
const pct = (v: number) => `${(v / max) * 100}%`
</script>

<template>
  <PanelCard title="Storage Overview">
    <div class="stor__box">
      <p class="stor__label">Total Used:</p>
      <span class="stor__big">19 GB <span>(68% of 10 GB)</span></span>
    </div>

    <div class="stor__rows">
      <div v-for="s in segments" :key="s.label" class="stor__row">
        <div class="stor__track">
          <i :style="{ width: pct(s.value), background: s.color }" />
        </div>
        <span class="stor__row-val">{{ s.value }} GB</span>
      </div>
    </div>

    <div class="stor__legend">
      <span v-for="s in segments" :key="s.label" class="stor__lg">
        <i :style="{ background: s.color }" />{{ s.label }}
      </span>
    </div>
  </PanelCard>
</template>
