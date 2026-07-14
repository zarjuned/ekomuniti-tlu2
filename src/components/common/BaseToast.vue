<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="fade-up">
        <div v-for="t in toasts" :key="t.id" class="toast-item" :class="t.type">
          <span>{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--space-5);
  right: var(--space-5);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.toast-item {
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  min-width: 260px;
  max-width: 420px;
  animation: slideInRight 0.3s ease-out;
}
.toast-item.success { border-left: 3px solid var(--color-success); }
.toast-item.error { border-left: 3px solid var(--color-danger); }
.toast-item.warning { border-left: 3px solid var(--color-warning); }
.toast-item.info { border-left: 3px solid var(--color-info); }
</style>
