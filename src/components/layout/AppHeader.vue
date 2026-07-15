<template>
  <header class="app-header">
    <div class="left-section">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
      </button>
      <div class="header-title">
        <h1 v-if="pageTitle">{{ pageTitle }}</h1>
      </div>
    </div>
    <div class="right-section">
      <LanguageToggle />
      <div v-if="auth.user" class="user-badge">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-info" v-if="!isMobile">
          <span class="user-name">{{ auth.user.full_name || auth.role }}</span>
          <span class="user-role">{{ roleLabel }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { ROLE_LABELS } from '@/lib/constants'
import LanguageToggle from '@/components/common/LanguageToggle.vue'

defineProps({ isMobile: { type: Boolean, default: false } })
defineEmits(['toggle-sidebar'])

const { t, locale } = useI18n()
const route = useRoute()
const auth = useAuthStore()

const pageTitle = computed(() => {
  const map = {
    dashboard: 'dashboard.title',
    houses: 'houses.title',
    payments: 'payments.title',
    expenses: 'expenses.title',
    penubuhan: 'penubuhan.title',
    reports: 'reports.title',
    attendance: 'attendance.title',
    settings: 'settings.title'
  }
  return map[route.name] ? t(map[route.name]) : ''
})

const userInitial = computed(() => {
  if (!auth.user?.full_name) return auth.role?.[0]?.toUpperCase() || 'A'
  return auth.user.full_name.charAt(0).toUpperCase()
})

const roleLabel = computed(() => {
  if (!auth.role) return ''
  const r = ROLE_LABELS[auth.role]
  return r ? r[locale.value] || r.bm : auth.role
})
</script>

<style scoped>
.app-header {
  height: var(--header-height);
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 40;
}
.left-section { display: flex; align-items: center; gap: 10px; }
.right-section { display: flex; align-items: center; gap: 12px; }

.menu-btn {
  display: none;
  width: 36px; height: 36px;
  align-items: center; justify-content: center;
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
}
.menu-btn:hover { background: var(--color-bg-tertiary); }
@media (max-width: 1023px) { .menu-btn { display: flex; } }
@media (min-width: 1024px) { .menu-btn { display: none; } }

.header-title h1 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: var(--font-bold);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
}

.user-badge { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 32px; height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-accent-gradient);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: var(--font-bold); color: #fff;
}
.user-info { display: flex; flex-direction: column; line-height: 1.2; }
.user-name { font-size: 13px; font-weight: var(--font-medium); color: var(--color-text-primary); }
.user-role { font-size: 11px; color: var(--color-text-secondary); }
</style>
