<template>
  <div class="base-card" :class="[variant, { 'hoverable': hoverable }]">
    <div v-if="title || $slots.header" class="base-card-header">
      <slot name="header">
        <h3 v-if="title" class="base-card-title">{{ title }}</h3>
      </slot>
      <slot name="header-actions"></slot>
    </div>
    <div class="base-card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="base-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  variant: { type: String, default: 'glass' },
  hoverable: { type: Boolean, default: false }
})
</script>

<style scoped>
.base-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.base-card.glass {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.base-card.glass.hoverable:hover {
  background: rgba(17, 24, 39, 0.75);
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}
.base-card.solid {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}
.base-card-gradient {
  background: var(--color-accent-gradient);
}
.base-card-header {
  padding: var(--space-5) var(--space-5) var(--space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.base-card-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.base-card-body {
  padding: var(--space-5);
}
.base-card-header ~ .base-card-body {
  padding-top: 0;
}
.base-card-footer {
  padding: var(--space-3) var(--space-5) var(--space-5);
  border-top: 1px solid var(--color-border);
}
</style>
