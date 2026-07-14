<template>
  <span class="status-dot" :class="color" :title="label">
    <span class="dot-inner"></span>
    <span v-if="showLabel" class="dot-label">{{ label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
  showLabel: { type: Boolean, default: false }
})

const color = computed(() => {
  const map = { approved: 'paid', paid: 'paid', pending: 'pending', unpaid: 'unpaid', rejected: 'unpaid' }
  return map[props.status] || 'unpaid'
})

const label = computed(() => {
  const map = { approved: 'Paid', paid: 'Paid', pending: 'Pending', unpaid: 'Unpaid', rejected: 'Rejected' }
  return map[props.status] || props.status
})
</script>

<style scoped>
.status-dot {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
.dot-inner {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.status-dot.paid .dot-inner {
  background: var(--color-paid);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
}
.status-dot.pending .dot-inner {
  background: var(--color-pending);
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
}
.status-dot.unpaid .dot-inner {
  background: var(--color-unpaid);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}
.dot-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-transform: capitalize;
}
</style>
