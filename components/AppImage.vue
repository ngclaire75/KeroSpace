<script setup lang="ts">
import { imageSources } from '~/utils/responsiveImages'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ src?: string; sizes?: string; loading?: 'lazy' | 'eager' }>()
const attrs = useAttrs()
const sources = computed(() => imageSources(props.src))
const imageSizes = computed(() => props.sizes || (Number(attrs.width) <= 256 ? `${attrs.width}px` : '100vw'))
</script>

<template>
  <img v-bind="attrs" :src="sources.src" :srcset="sources.srcset" :sizes="sources.srcset ? imageSizes : undefined"
    :loading="loading || (attrs.fetchpriority === 'high' ? 'eager' : 'lazy')" decoding="async" />
</template>
