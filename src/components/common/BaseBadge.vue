<template>
  <span class="base-badge" :class="variant">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' }
})
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border: 1px solid transparent;
}
.base-badge.default {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}
.base-badge.success {
  background: rgba(34, 197, 94, 0.12);
  color: var(--color-success);
  border-color: rgba(34, 197, 94, 0.3);
}
.base-badge.warning {
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-warning);
  border-color: rgba(245, 158, 11, 0.3);
}
.base-badge.danger {
  background: rgba(239, 68, 68, 0.12);
  color: var(--color-danger);
  border-color: rgba(239, 68, 68, 0.3);
}
.base-badge.info {
  background: rgba(59, 130, 246, 0.12);
  color: var(--color-info);
  border-color: rgba(59, 130, 246, 0.3);
}
.base-badge.accent {
  background: rgba(99, 102, 241, 0.15);
  color: var(--color-accent-primary);
  border-color: rgba(99, 102, 241, 0.3);
}
</style>
