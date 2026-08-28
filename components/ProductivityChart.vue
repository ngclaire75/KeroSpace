<script setup lang="ts">
// hours worked per weekday; max scale = 30h
const MAX = 30
const days = [
  { day: 'Mon', hours: 13 },
  { day: 'Tue', hours: 9 },
  { day: 'Wed', hours: 17 },
  { day: 'Thu', hours: 12 },
  { day: 'Fri', hours: 26, hot: true },
  { day: 'Sat', hours: 8 },
  { day: 'Sun', hours: 11 },
]
const yTicks = [30, 25, 20, 15, 10, 5]
const pct = (h: number) => `${(h / MAX) * 100}%`
</script>

<template>
  <PanelCard title="Productivity Trend" action="weekly">
    <div class="pt">
      <div class="pt__y">
        <span v-for="t in yTicks" :key="t">{{ t }}h</span>
      </div>

      <div class="pt__body">
        <div class="pt__plot">
          <div v-for="d in days" :key="d.day" class="pt__col">
            <span v-if="d.hot" class="pt__tip">{{ d.hours }}h</span>
            <div
              class="pt__bar"
              :class="{ 'pt__bar--hot': d.hot }"
              :style="{ height: pct(d.hours) }"
            />
          </div>
        </div>

        <div class="pt__x">
          <span v-for="d in days" :key="d.day">{{ d.day }}</span>
        </div>
      </div>
    </div>
  </PanelCard>
</template>
