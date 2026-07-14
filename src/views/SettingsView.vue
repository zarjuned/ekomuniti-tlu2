<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">{{ $t('settings.title') }}</h1>
    </div>

    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" class="tab" :class="{ active: tab === t.key }" @click="tab = t.key">
        {{ t.label }}
      </button>
    </div>

    <!-- Profile -->
    <div v-if="tab === 'profile'" class="glass-card">
      <div class="form-group">
        <label class="form-label">Nama Persatuan</label>
        <input v-model="settings.settings.association_name" class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">No. Pendaftaran ROS</label>
        <input v-model="settings.settings.ros_registration_number" class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">Bank</label>
        <input v-model="settings.settings.bank_name" class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">No. Akaun Bank</label>
        <input v-model="settings.settings.bank_account_number" class="form-input" />
      </div>
      <button class="btn btn-primary" @click="saveProfile">{{ $t('common.save') }}</button>
    </div>

    <!-- Admin users -->
    <div v-else-if="tab === 'admins'" class="glass-card">
      <div class="admins-header">
        <h3>{{ $t('settings.adminUsers') }}</h3>
        <button class="btn btn-primary btn-sm">{{ $t('settings.addAdmin') }}</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Emel</th>
            <th>{{ $t('settings.role') }}</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in settings.adminUsers" :key="u.id">
            <td>{{ u.full_name }}</td>
            <td class="cell-email">{{ u.email }}</td>
            <td><BaseBadge variant="accent">{{ u.role }}</BaseBadge></td>
            <td><BaseBadge :variant="u.active ? 'success' : 'default'">{{ u.active ? 'Aktif' : 'Nyahaktif' }}</BaseBadge></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Fee config -->
    <div v-else-if="tab === 'fee'" class="glass-card">
      <div class="form-group">
        <label class="form-label">{{ $t('settings.feeConfig') }} (RM sebulan)</label>
        <input v-model="settings.settings.monthly_fee" type="number" step="0.01" class="form-input" style="max-width: 200px;" />
      </div>
      <button class="btn btn-primary" @click="toast.success('Yuran dikemas kini')">{{ $t('common.save') }}</button>
    </div>

    <!-- Audit log -->
    <div v-else-if="tab === 'audit'" class="glass-card">
      <h3 class="mb-4">{{ $t('settings.auditLog') }}</h3>
      <div class="search-bar-wrap mb-4">
        <SearchBar v-model="auditQuery" placeholder="Cari dalam log..." />
      </div>
      <div class="audit-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Tarikh</th>
              <th>Pengguna</th>
              <th>{{ $t('settings.action') }}</th>
              <th>{{ $t('settings.details') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in filteredAudit" :key="log.id">
              <td class="cell-date">{{ log.created_at }}</td>
              <td>{{ log.admin_name }}</td>
              <td><BaseBadge>{{ log.action_type }}</BaseBadge></td>
              <td class="cell-json">{{ JSON.stringify(log.details_json) }}</td>
            </tr>
            <tr v-if="filteredAudit.length === 0">
              <td colspan="4" style="text-align:center; padding: var(--space-8);">
                <p class="text-secondary">{{ $t('common.noData') }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from '@/composables/useToast'
import BaseBadge from '@/components/common/BaseBadge.vue'
import SearchBar from '@/components/common/SearchBar.vue'

const { t } = useI18n()
const settings = useSettingsStore()
const toast = useToast()

const tab = ref('profile')
const tabs = [
  { key: 'profile', label: t('settings.profile') },
  { key: 'admins', label: t('settings.adminUsers') },
  { key: 'fee', label: t('settings.feeConfig') },
  { key: 'audit', label: t('settings.auditLog') }
]

function saveProfile() { toast.success('Maklumat persatuan dikemas kini') }

const auditQuery = ref('')
const filteredAudit = computed(() => {
  const q = auditQuery.value.toLowerCase()
  if (!q) return settings.auditLog
  return settings.auditLog.filter(l =>
    l.admin_name.toLowerCase().includes(q) ||
    l.action_type.toLowerCase().includes(q) ||
    JSON.stringify(l.details_json).toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.tabs {
  display: flex;
  gap: var(--space-2);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}
.tab {
  padding: var(--space-3) var(--space-5);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.tab.active { color: var(--color-accent-primary); border-bottom-color: var(--color-accent-primary); }
.tab:hover:not(.active) { color: var(--color-text-primary); }

.admins-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}
.cell-email { font-family: monospace; font-size: var(--text-xs); color: var(--color-text-tertiary); }
.cell-date { font-family: monospace; font-size: var(--text-xs); color: var(--color-text-tertiary); white-space: nowrap; }
.cell-json { font-family: monospace; font-size: var(--text-xs); color: var(--color-text-tertiary); max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.audit-wrap { overflow-x: auto; }
.search-bar-wrap { max-width: 400px; }
</style>
