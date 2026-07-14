<template>
  <div class="language-toggle">
    <button
      class="lang-btn"
      :class="{ active: current === 'bm' }"
      @click="set('bm')"
    >BM</button>
    <button
      class="lang-btn"
      :class="{ active: current === 'en' }"
      @click="set('en')"
    >EN</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const current = computed(() => locale.value)

function set(lang) {
  locale.value = lang
}
</script>

<style scoped>
.language-toggle {
  display: inline-flex;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 2px;
}
.lang-btn {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-tertiary);
  transition: all 0.2s;
}
.lang-btn.active {
  background: var(--color-accent-primary);
  color: #fff;
}
.lang-btn:hover:not(.active) { color: var(--color-text-primary); }
</style>
