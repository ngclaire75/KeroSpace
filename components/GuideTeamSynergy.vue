<script setup lang="ts">
import { teamSynergy } from '~/data/teamSynergy'
import type { TeamSlot, TeamSynergy } from '~/data/characterBuilds'
const props = defineProps<{ gameId: string; title: string; teams?: TeamSynergy[]; loading?: boolean; sourceUrl?: string }>()
const guide = computed(() => teamSynergy[props.gameId])
// MLBB heroes mix and match freely, so its page shows only the general team plan, not lineups.
const showLineups = computed(() => props.gameId !== 'mlbb')
const lineups = computed(() => showLineups.value ? props.teams || [] : [])
const memberNames = computed(() => [...new Set(lineups.value.flatMap(team => team.slots.flatMap(slot => slot.options.map(member => member.name))))])
const { data: typeIcons } = await useFetch('/api/team-icons', {
  query: computed(() => ({ game: props.gameId, titles: memberNames.value.slice(0, 40).join('|') })),
  server: false,
  timeout: 90000,
  // Wait for the teams to arrive; the query watcher fetches as soon as names exist.
  immediate: memberNames.value.length > 0,
})
function slotIcons(slot: TeamSlot) {
  const icons = slot.options.slice(0, 1).flatMap(member => typeIcons.value?.[member.name] || [])
  return [...new Map(icons.map(icon => [icon.label, icon])).values()]
}
const failedIcons = ref<Record<string, number>>({})
function iconSource(image: string) {
  return failedIcons.value[image] === 1 ? `/api/game-artwork?src=${encodeURIComponent(image)}` : image
}
function retryIcon(image: string) { failedIcons.value[image] = (failedIcons.value[image] || 0) + 1 }
</script>

<template>
  <section v-if="guide" class="team-synergy" aria-labelledby="team-synergy-title">
    <header class="team-synergy__head">
      <div>
        <p class="gd-eyebrow">Teammates &amp; combinations</p>
        <h2 id="team-synergy-title">Team <em class="gd-em">synergy.</em></h2>
      </div>
    </header>
    <p v-if="!showLineups" class="team-synergy__caption">Teammate alternatives can depend on equipment and unlocks. <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener noreferrer">Check team requirements ↗</a></p>
    <p v-else-if="loading" class="team-synergy__status" role="status">Loading teammates for {{ title }}…</p>
    <div v-else-if="lineups.length" class="team-synergy__teams">
      <article v-for="(team, index) in lineups" :key="index" class="team-synergy__team">
        <h3>{{ team.name }}</h3>
        <ul class="team-synergy__slots">
          <li v-for="(slot, slotIndex) in team.slots" :key="slotIndex">
            <template v-for="member in slot.options.slice(0, 1)" :key="member.name">
              <span class="team-synergy__member" :title="member.name">
                <span class="team-synergy__name">{{ member.name }}</span>
              </span>
            </template>
            <span v-if="slotIcons(slot).length" class="team-synergy__icons">
              <template v-for="icon in slotIcons(slot)" :key="icon.label">
                <img v-if="(failedIcons[icon.image] || 0) < 2" :src="iconSource(icon.image)" :alt="icon.label" :title="icon.label" width="24" height="24" loading="lazy" referrerpolicy="no-referrer" @error="retryIcon(icon.image)" />
              </template>
            </span>
          </li>
        </ul>
      </article>
      <p class="team-synergy__caption">Teammate alternatives can depend on equipment and unlocks. <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener noreferrer">Check team requirements ↗</a></p>
    </div>
    <p v-else class="team-synergy__status">No verified teammate lineup for {{ title }} yet. Use these roles to plan your team.</p>
    <div class="team-synergy__plan">
      <div>
        <h3>Team structure</h3>
        <ul class="team-synergy__roles"><li v-for="role in guide.roles" :key="role">{{ role }}</li></ul>
      </div>
      <div>
        <h3>Make the team work</h3>
        <ul class="team-synergy__tips"><li v-for="tip in guide.tips" :key="tip">{{ tip }}</li></ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-synergy { margin-top: 56px; padding-top: 32px; }
.team-synergy__head { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 26px; }
.team-synergy h2 { margin: 0; font: 900 clamp(28px, 4vw, 44px) / 1.1 var(--display); text-transform: uppercase; }
.team-synergy h3 { margin: 0 0 16px; font: 800 13px / 1.4 var(--ui); letter-spacing: .06em; text-transform: uppercase; }
.team-synergy__teams { display: grid; gap: 16px; }
.team-synergy__team { padding: 22px 0; text-align: left; }
.team-synergy__team > h3 { padding-left: 0; }
.team-synergy__slots { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 0; padding: 0; list-style: none; }
.team-synergy__slots > li { display: flex; align-items: center; gap: 8px; overflow: hidden; box-sizing: border-box; padding: 16px; min-width: 0; border: 1px solid var(--cb-edge, #4a4a53); border-radius: 0; background: var(--cb-panel, #0a0a0d); }
.team-synergy__member { display: flex; align-items: center; gap: 12px; box-sizing: border-box; flex: 0 1 auto; min-width: 0; overflow: hidden; padding: 0; text-align: left; font: 800 15px / 1.5 var(--ui); }
.team-synergy__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.team-synergy__icons { display: flex; align-items: center; gap: 5px; flex-shrink: 0; margin-left: auto; }
.team-synergy__icons img { display: block; width: 24px; height: 24px; object-fit: contain; }
.team-synergy__plan { display: grid; grid-template-columns: minmax(0, 1fr); gap: 32px; margin-top: 30px; }
.team-synergy__roles { display: flex; flex-wrap: wrap; gap: 10px 22px; margin: 0; padding: 0; list-style: none; color: #e8c4fa; font: 800 12px / 1.6 var(--ui); text-transform: uppercase; }
.team-synergy__tips { margin: 0; padding-left: 18px; }
.team-synergy__tips li + li { margin-top: 10px; }
.team-synergy__tips, .team-synergy__status, .team-synergy__caption { color: #c9c2ce; font: 600 14px / 1.7 var(--ui); }
.team-synergy__caption { font-size: 13px; line-height: 1.6; } /* same as the build note (.cb-note) */
.team-synergy__caption a { color: #e8c4fa; text-underline-offset: 3px; }
.team-synergy a:focus-visible { outline: 2px solid #e8c4fa; outline-offset: 4px; }
@media (max-width: 640px) {
  .team-synergy__slots { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .team-synergy__plan { grid-template-columns: 1fr; gap: 26px; }
  .team-synergy__head { align-items: start; flex-direction: column; gap: 12px; }
}
</style>
