<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    sub: string
    time: string
    /** dark | red | img */
    variant?: 'dark' | 'red' | 'img'
    icon?: string
    img?: string
    iconBig?: boolean
    /** explicit glyph size in px; overrides iconBig */
    iconSize?: number
  }>(),
  { variant: 'dark', iconBig: false },
)
</script>

<template>
  <div class="row" :class="{ 'row--file': variant === 'img' }">
    <span
      class="row__ico"
      :class="{
        'row__ico--dark': variant === 'dark',
        'row__ico--red': variant === 'red',
        'row__ico--img': variant === 'img',
        'row__ico--big': iconBig && !iconSize,
      }"
      :style="iconSize ? { '--row-ico': iconSize + 'px' } : undefined"
    >
      <img v-if="variant === 'img'" :src="img" :alt="title" />
      <AppIcon v-else-if="icon" :name="icon" :size="15" />
    </span>

    <span class="row__body">
      <span class="row__title">{{ title }}</span>
      <span class="row__sub">{{ sub }}</span>
    </span>

    <span class="row__time">{{ time }}</span>
  </div>
</template>
