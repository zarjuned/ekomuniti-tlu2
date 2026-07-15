<template>
  <!-- Mobile overlay -->
  <div class="sidebar-overlay" :class="{ show: mobileOpen }" @click="$emit('close-mobile')"></div>

  <aside class="sidebar" :class="{ open: mobileOpen }">
    <div class="sidebar-brand">
      <div class="brand-icon">T</div>
      <div>
        <div class="brand-name">E-Komuniti</div>
        <div class="brand-sub">Taman Langat Utama 2</div>
      </div>
    </div>
    <div class="sidebar-label">Navigasi</div>
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="nav-item"
        :class="{ active: isActive(item.name) }"
        @click="$emit('close-mobile')"
      >
        <component :is="item.icon" :size="20" stroke-width="1.8"></component>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <div class="footer-avatar">{{ userInitial }}</div>
      <div>
        <div class="footer-name">{{ auth.user?.full_name || auth.role || 'Admin' }}</div>
        <div class="footer-role">{{ roleLabel }}</div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { ROLE_LABELS } from '@/lib/constants'
import {
  LayoutDashboard, Home, CreditCard, Receipt, Building2,
  FileText, UserCheck, Settings
} from 'lucide-vue-next'

defineProps({ mobileOpen: { type: Boolean, default: false } })
defineEmits(['close-mobile'])

const { t, locale } = useI18n()
const route = useRoute()
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

const userInitial = computed(() => {
  if (!auth.user?.full_name) return (auth.role?.[0] || 'A').toUpperCase()
  return auth.user.full_name.charAt(0).toUpperCase()
})

const roleLabel = computed(() => {
  if (!auth.role) return ''
  const r = ROLE_LABELS[auth.role]
  return r ? r[locale.value] || r.bm : auth.role
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-right: 1px solid var(--color-border);
  z-index: 50;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
}

@media (min-width: 1024px) {
  .sidebar { transform: translateX(0); }
}
.sidebar.open { transform: translateX(0); }

.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 49;
  background: rgba(0,0,0,0.35);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.sidebar-overlay.show {
  opacity: 1;
  pointer-events: auto;
}
@media (min-width: 1024px) {
  .sidebar-overlay { display: none !important; }
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}
.brand-icon {
  width: 38px; height: 38px;
  border-radius: var(--radius-md);
  background: var(--color-accent-gradient);
  display: flex; align-items: center; justify-content: center;
  font-weight: var(--font-bold); font-size: 17px;
  color: #fff; flex-shrink: 0;
  font-family: var(--font-display);
}
.brand-name { font-size: 14px; font-weight: var(--font-semibold); color: var(--color-text-primary); }
.brand-sub { font-size: 11px; color: var(--color-text-secondary); }

.sidebar-label {
  font-size: 10px; font-weight: var(--font-semibold);
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--color-text-tertiary);
  padding: 12px 20px 4px;
}

.sidebar-nav {
  flex: 1; overflow-y: auto;
  padding: 4px 10px;
  display: flex; flex-direction: column; gap: 2px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all 0.15s;
}
.nav-item:hover { background: rgba(0,0,0,0.04); color: var(--color-text-primary); }
.nav-item.active {
  background: rgba(0,122,255,0.1);
  color: var(--color-accent-primary);
}
.nav-item svg { flex-shrink: 0; opacity: 0.8; }
.nav-item.active svg { opacity: 1; }

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  display: flex; align-items: center; gap: 10px;
}
.footer-avatar {
  width: 32px; height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-accent-gradient);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: var(--font-bold);
  flex-shrink: 0;
}
.footer-name { font-size: 13px; font-weight: var(--font-medium); color: var(--color-text-primary); }
.footer-role { font-size: 11px; color: var(--color-text-secondary); }
</style>
