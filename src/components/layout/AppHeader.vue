<template>
  <header class="app-header">
    <div class="left-section">
      <button class="mobile-menu-btn" @click="$emit('toggle-sidebar')">
        <span>☰</span>
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
  if (!auth.user?.full_name) return auth.role?.[0]?.toUpperCase() || 'U'
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
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-5);
  position: sticky;
  top: 0;
  z-index: 40;
}
.left-section { display: flex; align-items: center; gap: var(--space-3); }
.right-section { display: flex; align-items: center; gap: var(--space-4); }

.mobile-menu-btn {
  display: none;
  font-size: 20px;
  color: var(--color-text-secondary);
  padding: var(--space-2);
}
@media (max-width: 767px) {
  .mobile-menu-btn { display: inline-flex; }
}

.header-title h1 { font-size: var(--text-lg); font-weight: var(--font-semibold); color: var(--color-text-primary); }

.user-badge {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: #fff;
}
.user-info { display: flex; flex-direction: column; line-height: 1.2; }
.user-name { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-primary); }
.user-role { font-size: var(--text-xs); color: var(--color-text-tertiary); }
</style>
