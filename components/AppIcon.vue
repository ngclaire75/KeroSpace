<script setup lang="ts">
/**
 * Icon wrapper.
 *  - Stroke icons: Lucide geometry (ISC, lucide.dev), inlined.
 *  - Filled icons: single filled path, rendered with fill="currentColor".
 */
const props = withDefaults(
  defineProps<{ name: string; size?: number | string }>(),
  { size: 24 },
)

const STROKE: Record<string, string> = {
  'grid-3x3':
    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',
  search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  menu: '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  zap: '<path d="M15.914 4a1.5 1.5 0 0 0-2.474-1.561l-9 9A1.5 1.5 0 0 0 5.5 14h4.002a.5.5 0 0 1 .471.666L8.086 20a1.5 1.5 0 0 0 2.475 1.56l9-9A1.5 1.5 0 0 0 18.5 10h-3.997a.5.5 0 0 1-.472-.667z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'chart-column': '<path d="M5 21v-6"/><path d="M12 21V3"/><path d="M19 21V9"/>',
  'more-vertical':
    '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  sparkles:
    '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',
  'file-text':
    '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  mic: '<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>',
  'circle-play': '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4V8z"/>',
  play: '<path d="M6 3 20 12 6 21 Z"/>',
  record:
    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/>',
  'send-horizontal':
    '<path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
}

type Filled = {
  viewBox: string
  body: string
  stroke?: number
  /** preserveAspectRatio; use 'none' to stretch the glyph to fill its box */
  par?: string
}

const FILLED: Record<string, Filled> = {
  // chat bubble with an AI sparkle
  'chat-ai': {
    viewBox: '0 0 24 24',
    body: '<path d="M12 2c.906 0 1.783.122 2.617.348a6 6 0 0 0 7.294 8.339q.087.645.089 1.313c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-4.709-1.176L2 22l1.176-5.291A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2m7.53-.68a.507.507 0 0 1 .94 0l.254.61a4.37 4.37 0 0 0 2.25 2.327l.717.32a.53.53 0 0 1 0 .962l-.758.338a4.36 4.36 0 0 0-2.22 2.25l-.246.566a.506.506 0 0 1-.934 0l-.247-.565a4.36 4.36 0 0 0-2.219-2.251l-.76-.338a.53.53 0 0 1 0-.963l.718-.32a4.37 4.37 0 0 0 2.251-2.325z"/>',
  },
  // folder with a settings badge
  folder: {
    viewBox: '0 0 24 24',
    body: '<path d="m17 22l-.3-1.5q-.3-.125-.562-.262T15.6 19.9l-1.45.45l-1-1.7l1.15-1q-.05-.3-.05-.65t.05-.65l-1.15-1l1-1.7l1.45.45q.275-.2.538-.337t.562-.263L17 12h2l.3 1.5q.3.125.563.263t.537.337l1.45-.45l1 1.7l-1.15 1q.05.3.05.65t-.05.65l1.15 1l-1 1.7l-1.45-.45q-.275.2-.537.338t-.563.262L19 22zm2.413-3.588Q20 17.826 20 17t-.587-1.412T18 15t-1.412.588T16 17t.588 1.413T18 19t1.413-.587M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v3.275q-.875-.625-1.9-.95T17.975 10q-2.95 0-4.962 2.063T11 16.975q0 .8.175 1.55T11.7 20z"/>',
  },
  // cloud upload — "data backup"
  database: {
    viewBox: '0 0 24 24',
    body: '<path d="m17 9l-.351.015A5.97 5.97 0 0 0 11 5c-3.309 0-6 2.691-6 6l.001.126A4.01 4.01 0 0 0 2 15c0 2.206 1.794 4 4 4h5v-4.586l-1.293 1.293a.997.997 0 0 1-1.414 0a1 1 0 0 1 0-1.414l2.999-2.999a1 1 0 0 1 1.416 0l2.999 2.999a.999.999 0 1 1-1.414 1.414L13 14.414V19h4c2.757 0 5-2.243 5-5s-2.243-5-5-5"/>',
  },
  // document with a code glyph — "content generator"
  'file-code': {
    viewBox: '0 0 24 24',
    body: '<path d="m10.04 11.29l-3.2 3.21l3.2 3.21l1.42-1.42l-1.8-1.79l1.8-1.79zm2.5 1.42l1.8 1.79l-1.8 1.79l1.42 1.42l3.2-3.21l-3.2-3.21z"/><path d="m19.94 7.68l-.03-.09a.8.8 0 0 0-.2-.29l-5-5c-.09-.09-.19-.15-.29-.2l-.09-.03a.8.8 0 0 0-.26-.05c-.02 0-.04-.01-.06-.01H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-12s-.01-.04-.01-.06c0-.09-.02-.17-.05-.26ZM6 20V4h7v4c0 .55.45 1 1 1h4v11z"/>',
  },
  // refresh ring with a check — "daily summary"
  summary: {
    viewBox: '0 0 2048 2048',
    stroke: 70,
    body: '<path d="M640 512V215q-132 63-236 164T232 609l-119-49q70-137 176-247t241-185H256V0h512v512zm1176 97q-63-121-159-217t-218-160l49-118q144 74 258 188t189 258zM128 1024q0 68 10 135t31 132l-118 49Q0 1187 0 1024t51-316l119 49q-20 65-31 132t-11 135m103 415q63 121 160 218t218 160l-49 119q-144-75-258-189t-190-259zm1708-76l90 90l-557 558l-269-270l90-90l179 178zm-19-339q0-68-11-135t-31-132l119-49q51 153 51 316zM757 1879q65 21 132 31t135 10v128q-164 0-317-51z"/>',
  },
}

const isFilled = computed(() => props.name in FILLED)
const filledDef = computed<Filled>(
  () => FILLED[props.name] ?? { viewBox: '0 0 24 24', body: '' },
)
const body = computed(() => FILLED[props.name]?.body ?? STROKE[props.name] ?? '')
</script>

<template>
  <svg
    v-if="isFilled"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    :viewBox="filledDef.viewBox"
    :preserveAspectRatio="filledDef.par"
    fill="currentColor"
    :stroke="filledDef.stroke ? 'currentColor' : undefined"
    :stroke-width="filledDef.stroke || undefined"
    stroke-linejoin="round"
    stroke-linecap="round"
    aria-hidden="true"
    v-html="body"
  />
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="body"
  />
</template>
