<script setup lang="ts">
const members = [
  { name: 'Ava Bennett', role: 'Product Designer', img: '/images/a.webp' },
  { name: 'Nathan Brooks', role: 'Frontend Engineer', img: '/images/b.webp' },
  { name: 'Daniel Hutcherson', role: 'Product Manager', img: '/images/c.webp' },
  { name: 'Madeline Lee', role: 'Data Analyst', img: '/images/d.webp' },
]
</script>

<template>
  <PanelCard title="Active Team Members" action="see-more">
    <div v-for="m in members" :key="m.name" class="member">
      <span class="member__avatar">
        <span class="member__pic"><img :src="m.img" :alt="m.name" /></span>
        <i class="member__dot" />
      </span>

      <span class="member__body">
        <span class="member__name">{{ m.name }}</span>
        <span class="member__role">{{ m.role }}</span>
      </span>

      <span class="member__status">Active</span>
    </div>
  </PanelCard>
</template>
