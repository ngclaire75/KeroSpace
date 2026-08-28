<script setup lang="ts">
const nav = [
  { label: 'Overview', active: true },
  { label: 'AI Chat', active: false },
  { label: 'Files', active: false },
  { label: 'Automations', active: false },
  { label: 'Templates', active: false },
  { label: 'Analytics', active: false },
  { label: 'Settings', active: false },
]
</script>

<template>
  <header class="topbar">
    <div class="brand-wrap">
      <span class="logo"><img src="/images/logo.webp" alt="KeroSpace" /></span>
      <span class="brand">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M20 20h-4v-4h4v4Zm-6 0h-4v-4h4v4Zm-6 0H4v-4h4v4Zm12-6h-4v-4h4v4Zm-6 0h-4v-4h4v4Zm-6 0H4v-4h4v4Zm12-6h-4V4h4v4Zm-6 0h-4V4h4v4ZM8 8H4V4h4v4Z"
          />
        </svg>
        KeroSpace
      </span>
    </div>

    <nav class="nav">
      <a
        v-for="item in nav"
        :key="item.label"
        href="#"
        :class="{ 'is-active': item.active }"
        >{{ item.label }}</a
      >
    </nav>

    <div class="actions">
      <button type="button" class="btn-new">
        <AppIcon name="plus" :size="14" /> New
      </button>
      <button type="button" class="ico-btn" aria-label="Search">
        <AppIcon name="search" :size="18" />
      </button>
      <button type="button" class="ico-btn" aria-label="Notifications">
        <AppIcon name="bell" :size="18" />
      </button>
      <button type="button" class="ico-btn" aria-label="Menu">
        <AppIcon name="menu" :size="18" />
      </button>
    </div>
  </header>
</template>
