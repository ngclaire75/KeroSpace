export const teamSynergy: Record<string, { size: string; roles: string[]; tips: string[] }> = {
  hsr: {
    size: '4 characters', roles: ['Damage dealer', 'Support / debuffer', 'Support / damage', 'Sustain'],
    tips: ['Match buffs and debuffs to your damage dealer’s kit. Some characters need specific Paths or attack types from their teammates.', 'Balance Skill Point use across the team and tune action order so buffs are ready before your damage window.'],
  },
  genshin: {
    size: '4 characters', roles: ['On-field role', 'Off-field application', 'Buffer / utility', 'Defensive support'],
    tips: ['Choose the reaction or damage plan first, then match elemental application and buffs to it.', 'Plan Energy Recharge and particle generation around the whole rotation. Check constellation and weapon requirements before substituting teammates.'],
  },
  hi3: {
    size: '3 battlesuits', roles: ['Damage dealer', 'Support', 'Support'],
    tips: ['Match support buffs to the damage type and the battlesuit’s mechanics, including Astral Ring requirements when applicable.', 'Set up support effects and QTE triggers before the damage dealer’s burst. Joint skills can require specific battlesuits.'],
  },
  wuwa: {
    size: '3 Resonators', roles: ['Damage dealer', 'Sub-DPS / amplifier', 'Sustain / buffer'],
    tips: ['Match Outro buffs to the next Resonator’s damage type and attack type. Check whether swapping early ends the buff.', 'Build Concerto Energy to line up Intro and Outro skills, then use your strongest attacks during the support window.'],
  },
  nte: {
    size: '4 Espers', roles: ['On-field damage', 'Cycle partner', 'Off-field support', 'Sustain / utility'],
    tips: ['Choose compatible attributes for the Esper Cycles you want to trigger, then build around the characters that enable them.', 'Balance field time with off-field skills and support effects so the team can keep its damage plan running.'],
  },
  mlbb: {
    size: '5 heroes', roles: ['EXP lane', 'Jungle', 'Mid lane', 'Gold lane', 'Roam'],
    tips: ['Build around lane coverage, reliable crowd control and a balance of physical and magic damage.', 'Pair engage and control skills with follow-up damage. A recommended partner fills only part of the lineup; adapt the remaining picks to the enemy draft.'],
  },
}
