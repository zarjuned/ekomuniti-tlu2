<template>
  <div class="empty-state">
    <div class="empty-state-icon">🗂️</div>
    <h3 class="empty-state-title">{{ title }}</h3>
    <p v-if="description" class="empty-state-desc">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' }
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-4);
  text-align: center;
}
.empty-state-icon { font-size: 48px; margin-bottom: var(--space-4); opacity: 0.6; }
.empty-state-title { font-size: var(--text-lg); color: var(--color-text-secondary); }
.empty-state-desc { font-size: var(--text-sm); color: var(--color-text-tertiary); margin-top: var(--space-2); max-width: 360px; }
</style>
