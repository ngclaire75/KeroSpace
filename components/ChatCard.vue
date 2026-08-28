<script setup lang="ts">
const suggestions = ['Analyze this data', 'Summarize this document']
</script>

<template>
  <section class="panel chat-card">
    <div class="chat-card__glow" />

    <div class="panel__head">
      <span class="panel__title">Recent Chats</span>
    </div>

    <div class="chips">
      <span v-for="s in suggestions" :key="s" class="chip">{{ s }}</span>
    </div>

    <div class="composer">
      <div class="composer__top">
        <span class="composer__credits">200 credits remaining</span>
        <span class="composer__upgrade">Upgrade</span>
      </div>
      <div class="composer__field">
        <textarea
          class="composer__input"
          rows="1"
          placeholder="Ask anything..."
        ></textarea>
        <div class="composer__bar">
          <div class="composer__tools" aria-hidden="true">
            <AppIcon name="record" :size="18" />
            <AppIcon name="mic" :size="18" />
          </div>
          <button type="button" class="composer__send" aria-label="Send">
            <AppIcon name="send" :size="15" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
