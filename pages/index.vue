<script setup lang="ts">
useHead({ title: 'KeroSpace Workspace' })

// greeting follows the device clock (set on the client to avoid an SSR mismatch)
const greeting = ref('Good morning')
function pickGreeting() {
  const h = new Date().getHours()
  return h < 5
    ? 'Good evening'
    : h < 12
      ? 'Good morning'
      : h < 17
        ? 'Good afternoon'
        : 'Good evening'
}
let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  greeting.value = pickGreeting()
  // re-check every minute so it flips as the day rolls over
  clock = setInterval(() => {
    greeting.value = pickGreeting()
  }, 60_000)
})
onBeforeUnmount(() => clearInterval(clock))

const stats = [
  { label: 'AI Chats', value: '256', delta: '+15% vs last month' },
  { label: 'Files', value: '1,428', delta: '+8% vs last month' },
  { label: 'Automations', value: '34', delta: '+25% vs last month' },
  { label: 'Time Saved', value: '18.5h', delta: '+9% vs last month' },
]

const recentChats = [
  { title: 'Marketing Strategy', sub: 'How to plan a product launch?', time: '2m Ago' },
  { title: 'SEO Best Practices', sub: 'Generate blog topics for AI tools', time: '5h Ago' },
  { title: 'Python Code Review', sub: 'Check my automation script', time: '2h Ago' },
  { title: 'Client Proposal', sub: 'Improve this proposal content', time: '1h Ago' },
]

const workflows = [
  { title: 'Auto File Organizer', sub: 'Organize new files automatically', time: '1m Ago', icon: 'folder', iconBig: true },
  { title: 'Daily AI Summary', sub: 'Get AI summary every morning', time: '10m Ago', icon: 'summary', iconBig: true },
  { title: 'Content Generator', sub: 'Generate content for blog', time: '2m Ago', icon: 'file-code', iconSize: 25 },
  { title: 'Data Backup', sub: 'Backup important data', time: '1h Ago', icon: 'database', iconSize: 25 },
]

const files = [
  { title: 'Project Proposal.pdf', sub: '2.4 MB · PDF', time: '10m Ago', img: '/icons/pdf.png' },
  { title: 'Market Research.xlsx', sub: '1.8 MB · Excel', time: 'Yesterday', img: '/icons/xlsx.svg' },
  { title: 'Design Mockup.fig', sub: '4.2 MB · Figma', time: 'Tomorrow', img: '/icons/figma.svg' },
  { title: 'Presentation.pptx', sub: '6.3 MB · PowerPoint', time: '1h Ago', img: '/icons/powerpoint.svg', iconSize: 34 },
]
</script>

<template>
  <div class="app">
    <TopBar />

    <main class="app__content">
      <div class="greeting">
        <h1>{{ greeting }},</h1>
        <p>Here's what's happening in your workspace today.</p>
      </div>

      <section class="stats">
        <StatCard
          v-for="s in stats"
          :key="s.label"
          :label="s.label"
          :value="s.value"
          :delta="s.delta"
        />
      </section>

      <section class="grid3">
        <PanelCard title="Recent Chats" action="see-more">
          <ListRow
            v-for="c in recentChats"
            :key="c.title"
            variant="dark"
            icon="chat-ai"
            :title="c.title"
            :sub="c.sub"
            :time="c.time"
          />
        </PanelCard>

        <PanelCard title="Automation Workflows" action="see-more">
          <ListRow
            v-for="w in workflows"
            :key="w.title"
            variant="red"
            :icon="w.icon"
            :icon-big="w.iconBig"
            :icon-size="w.iconSize"
            :title="w.title"
            :sub="w.sub"
            :time="w.time"
          />
        </PanelCard>

        <StorageOverview />
      </section>

      <section class="grid3">
        <ChatCard />

        <ProductivityChart />

        <PanelCard title="Automation Workflows" action="see-more">
          <ListRow
            v-for="f in files"
            :key="f.title"
            variant="img"
            :img="f.img"
            :icon-size="f.iconSize"
            :title="f.title"
            :sub="f.sub"
            :time="f.time"
          />
        </PanelCard>
      </section>
    </main>
  </div>
</template>
