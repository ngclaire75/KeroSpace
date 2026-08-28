<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    action?: 'see-more' | 'weekly' | 'none'
  }>(),
  { action: 'none' },
)
</script>

<template>
  <section class="panel">
    <div class="panel__head">
      <span class="panel__title">{{ title }}</span>

      <span v-if="action === 'see-more'" class="panel__action">See More</span>
      <span v-else-if="action === 'weekly'" class="panel__action">
        Weekly <AppIcon name="chevron-down" :size="12" />
      </span>
    </div>

    <slot />
  </section>
</template>
