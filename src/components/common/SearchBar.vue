<template>
  <div class="search-bar">
    <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input
      type="text"
      class="search-input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
    />
    <button v-if="modelValue" class="search-clear" @click="clear">&times;</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  debounce: { type: Number, default: 150 }
})
const emit = defineEmits(['update:modelValue'])

let timer = null
function onInput(e) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    emit('update:modelValue', e.target.value)
  }, props.debounce)
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
}
.search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}
.search-input {
  width: 100%;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-3) var(--space-3) 44px;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}
.search-input::placeholder {
  color: var(--color-text-tertiary);
}
.search-clear {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: 20px;
  line-height: 1;
  padding: 0 4px;
}
.search-clear:hover { color: var(--color-text-primary); }
</style>
