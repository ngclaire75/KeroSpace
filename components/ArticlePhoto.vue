<script setup lang="ts">
import type { ArticlePhoto } from '~/data/gameStories'
withDefaults(defineProps<{ photo: ArticlePhoto; eager?: boolean }>(), { eager: false })
</script>

<template>
  <figure class="article-photo">
    <div class="article-photo__frame">
      <img
        :src="photo.src"
        :srcset="`${photo.small} ${photo.smallWidth}w, ${photo.src} ${photo.width}w`"
        sizes="(max-width: 460px) 92vw, (max-width: 760px) 420px, (max-width: 1000px) 260px, 300px"
        :width="photo.width" :height="photo.height" :alt="photo.alt"
        :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : 'auto'" decoding="async"
      />
    </div>
    <figcaption>
      <p>{{ photo.caption }}</p>
      <p class="article-photo__credit">Photo: <a :href="photo.source" target="_blank" rel="noopener noreferrer">{{ photo.credit }}</a><template v-if="photo.license"> · <a :href="photo.license" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a> · Resized and converted to WebP.</template></p>
    </figcaption>
  </figure>
</template>

<style scoped>
.article-photo { margin: 0; }
.article-photo__frame { aspect-ratio: 16 / 9; overflow: hidden; border: 1px solid #4a4444; border-radius: 0; background: #000; }
.article-photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
figcaption { padding: 14px 0 0; color: #fff; }
figcaption p { margin: 0; font-size: 12px; line-height: 1.85; color: #fff; }
figcaption .article-photo__credit { margin-top: 8px; font-size: 10px; color: #fff; }
figcaption a { color: #fff; text-decoration: underline; text-underline-offset: 3px; }
figcaption a:hover { color: #ff4d5e; }
figcaption a:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
</style>
