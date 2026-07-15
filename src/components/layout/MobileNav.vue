<template>
  <nav class="mobile-nav">
    <router-link
      v-for="item in items"
      :key="item.name"
      :to="{ name: item.name }"
      class="mobile-nav-item"
      :class="{ active: isActive(item.name) }"
    >
      <component :is="item.icon" :size="22" stroke-width="1.8"></component>
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
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-top: 1px solid var(--color-border);
  z-index: 50;
  padding: 4px 0 calc(4px + env(safe-area-inset-bottom));
}

@media (max-width: 1023px) {
  .mobile-nav { display: flex; justify-content: space-around; }
}

@media (min-width: 1024px) {
  .mobile-nav { display: none !important; }
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  color: var(--color-text-tertiary);
  text-decoration: none;
  font-size: 10px;
  font-weight: var(--font-medium);
  transition: color 0.2s;
  flex: 1;
  justify-content: center;
  min-width: 0;
}
.mobile-nav-item:hover, .mobile-nav-item.active {
  color: var(--color-accent-primary);
}
.mobile-nav-item.active svg { opacity: 1; }
.mob-nav-label { font-size: 10px; line-height: 1; }
</style>
