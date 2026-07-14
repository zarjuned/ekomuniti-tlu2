<template>
  <aside class="sidebar" :class="{ collapsed: !expanded }">
    <div class="sidebar-brand">
      <div class="brand-logo">TLU2</div>
      <span v-if="expanded" class="brand-text">E-Komuniti</span>
    </div>
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="nav-item"
        :class="{ active: isActive(item.name) }"
      >
        <component :is="item.icon" :size="20"></component>
        <span v-if="expanded" class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <button class="nav-item logout-btn" @click="handleLogout">
        <LogOut :size="20"></LogOut>
        <span v-if="expanded" class="nav-label">{{ $t('nav.logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard, Home, CreditCard, Receipt, Building2,
  FileText, UserCheck, Settings, LogOut
} from 'lucide-vue-next'

defineProps({ expanded: { type: Boolean, default: true } })
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const navItems = computed(() => [
  { name: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
  { name: 'houses', label: t('nav.houses'), icon: Home },
  { name: 'payments', label: t('nav.payments'), icon: CreditCard },
  { name: 'expenses', label: t('nav.expenses'), icon: Receipt },
  { name: 'penubuhan', label: t('nav.penubuhan'), icon: Building2 },
  { name: 'reports', label: t('nav.reports'), icon: FileText },
  { name: 'attendance', label: t('nav.attendance'), icon: UserCheck },
  { name: 'settings', label: t('nav.settings'), icon: Settings, roles: ['pengerusi', 'bendahari'] }
].filter(i => !i.roles || i.roles.includes(auth.role)))

function isActive(name) { return route.name === name }

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar.collapsed { width: 72px; }
.sidebar.collapsed .nav-label { display: none; }

.sidebar-brand {
  padding: var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}
.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: #fff;
  flex-shrink: 0;
}
.brand-text {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  font-size: var(--text-sm);
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}
.nav-item:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}
.nav-item.active {
  background: rgba(99, 102, 241, 0.12);
  color: var(--color-accent-primary);
  box-shadow: inset 3px 0 0 var(--color-accent-primary);
}
.nav-label { white-space: nowrap; }

.sidebar-footer {
  padding: var(--space-3);
  border-top: 1px solid var(--color-border);
}
.logout-button {
  width: 100%;
  justify-content: flex-start;
  color: var(--color-danger);
}
.logout-button:hover {
  background: rgba(239, 68, 68, 0.08);
}

@media (max-width: 767px) {
  .sidebar { display: none; }
}
</style>
