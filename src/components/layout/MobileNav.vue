<template>
  <nav class="mobile-nav">
    <router-link
      v-for="item in items"
      :key="item.name"
      :to="{ name: item.name }"
      class="mobile-nav-item"
      :class="{ active: isActive(item.name) }"
    >
      <component :is="item.icon" :size="20"></component>
      <span class="mob-nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LayoutDashboard, Home, CreditCard, Receipt, FileText } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()

const items = computed(() => [
  { name: 'dashboard', label: 'Papan', icon: LayoutDashboard },
  { name: 'houses', label: 'Rumah', icon: Home },
  { name: 'payments', label: 'Bayaran', icon: CreditCard },
  { name: 'expenses', label: 'Belanja', icon: Receipt },
  { name: 'reports', label: 'Laporan', icon: FileText }
])

function isActive(name) { return route.name === name }
</script>

<style scoped>
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--color-border);
  z-index: 50;
  padding: var(--space-2) 0 calc(var(--space-2) + env(safe-area-inset-bottom));
}
@media (max-width: 767px) {
  .mobile-nav { display: flex; justify-content: space-around; }
}
.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-2);
  color: var(--color-text-tertiary);
  text-decoration: none;
  font-size: var(--text-xs);
  transition: color 0.2s;
  flex: 1;
  justify-content: center;
}
.mobile-nav-item:hover, .mobile-nav-item.active {
  color: var(--color-accent-primary);
}
.mob-nav-label { font-size: 10px; }
</style>
