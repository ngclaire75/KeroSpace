<script setup lang="ts">
// hours worked per weekday; max scale = 30h
const MAX = 30
const days = [
  { day: 'Mon', hours: 13 },
  { day: 'Tue', hours: 9 },
  { day: 'Wed', hours: 17 },
  { day: 'Thu', hours: 12 },
  { day: 'Fri', hours: 26 },
  { day: 'Sat', hours: 8 },
  { day: 'Sun', hours: 11 },
]
const yTicks = [30, 25, 20, 15, 10, 5]
const pct = (h: number) => `${(h / MAX) * 100}%`

// tap-to-reveal on touch devices (hover handles the rest on desktop)
const activeIdx = ref<number | null>(null)
const plot = ref<HTMLElement | null>(null)

function toggle(i: number) {
  activeIdx.value = activeIdx.value === i ? null : i
}
function onDocPointer(e: Event) {
  if (plot.value && !plot.value.contains(e.target as Node)) activeIdx.value = null
}
onMounted(() => document.addEventListener('pointerdown', onDocPointer, true))
onBeforeUnmount(() =>
  document.removeEventListener('pointerdown', onDocPointer, true),
)
</script>

<template>
  <PanelCard title="Productivity Trend" action="weekly">
    <div class="pt">
      <div class="pt__y">
        <span v-for="t in yTicks" :key="t">{{ t }}h</span>
      </div>

      <div class="pt__body">
        <div ref="plot" class="pt__plot">
          <div
            v-for="(d, i) in days"
            :key="d.day"
            class="pt__col"
            :class="{ 'is-active': activeIdx === i }"
            @click="toggle(i)"
          >
            <div class="pt__bar" :style="{ height: pct(d.hours) }">
              <span class="pt__tip">
                <span class="pt__tip-label">Hours</span>
                <span class="pt__tip-val">
                  <i class="pt__tip-dot" />{{ d.hours }}h
                </span>
              </span>
            </div>
          </div>
        </div>

        <div class="pt__x">
          <span v-for="d in days" :key="d.day">{{ d.day }}</span>
        </div>
      </div>
    </div>
  </PanelCard>
</template>
