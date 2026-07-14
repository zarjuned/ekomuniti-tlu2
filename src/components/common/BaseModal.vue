<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <Transition name="scale-in">
          <div class="modal-container" :class="[size]" v-if="modelValue">
            <div class="modal-header" v-if="title || $slots.header">
              <slot name="header">
                <h2 class="modal-title">{{ title }}</h2>
              </slot>
              <button class="modal-close" @click="close" :aria-label="'close'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  size: { type: String, default: 'md' }
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
}
.modal-container {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
}
.modal-container.sm { max-width: 400px; }
.modal-container.md { max-width: 560px; }
.modal-container.lg { max-width: 800px; }
.modal-container.xl { max-width: 1100px; }
.modal-header {
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}
.modal-close {
  color: var(--color-text-tertiary);
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}
.modal-close:hover { color: var(--color-text-primary); background: var(--color-bg-tertiary); }
.modal-body { padding: var(--space-5); }
.modal-footer {
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}
.scale-in-enter-active { transition: all 0.25s ease-out; }
.scale-in-leave-to { opacity: 0; transform: scale(0.95); }
.scale-in-enter-from { opacity: 0; transform: scale(0.95); }
</style>
