import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MOCK_ANNOUNCEMENTS = [
  { id: 'ann-1', title_bm: 'Mesyuarat Agung Tahunan', title_en: 'Annual General Meeting', content_bm: 'Mesyuarat akan diadakan pada 20 Julai 2026 jam 8 malam di dewan komuniti.', content_en: 'The AGM will be held on 20 July 2026 at 8pm at the community hall.', created_by: 'adm-1', is_active: true, created_at: '2026-07-01T10:00:00Z' },
  { id: 'ann-2', title_bm: 'Kutipan Yuran Bulan Julai', title_en: 'July Fee Collection', content_bm: 'Sila jelaskan yuran RM20 sebelum 15 Julai 2026.', content_en: 'Please pay RM20 fees before 15 July 2026.', created_by: 'adm-2', is_active: true, created_at: '2026-07-02T09:00:00Z' }
]

const MOCK_AUDIT_LOG = [
  { id: 'log-1', admin_user_id: 'adm-2', admin_name: 'Puan Aminah', action_type: 'APPROVE_PAYMENT', target_table: 'payments', target_id: 'pay-1', details_json: { house: 'No. 1', month: '2026-07' }, created_at: '2026-07-10T10:30:00Z' },
  { id: 'log-2', admin_user_id: 'adm-2', admin_name: 'Puan Aminah', action_type: 'ADD_EXPENSE', target_table: 'expenses', target_id: 'exp-1', details_json: { category: 'Keselamatan', amount: 800 }, created_at: '2026-07-05T09:15:00Z' },
  { id: 'log-3', admin_user_id: 'adm-1', admin_name: 'Encik Rahman', action_type: 'POST_ANNOUNCEMENT', target_table: 'announcements', target_id: 'ann-1', details_json: { title: 'Mesyuarat Agung Tahunan' }, created_at: '2026-07-01T10:00:00Z' }
]

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({
    monthly_fee: '20.00',
    association_name: 'Persatuan Penduduk Taman Langat Utama 2',
    bank_name: 'Maybank',
    bank_account_number: '564892013894',
    bank_account_holder: 'Persatuan Penduduk Taman Langat Utama 2',
    ros_registration_number: 'PPM-023-10-XXXXXXXX'
  })
  const adminUsers = ref([
    { id: 'adm-1', email: 'admin@tlu2.my', full_name: 'Encik Rahman', role: 'pengerusi', active: true },
    { id: 'adm-2', email: 'bendahari@tlu2.my', full_name: 'Puan Aminah', role: 'bendahari', active: true },
    { id: 'adm-3', email: 'setiausaha@tlu2.my', full_name: 'Encik Kumar', role: 'setiausaha', active: true }
  ])
  const announcements = ref([...MOCK_ANNOUNCEMENTS])
  const auditLog = ref([...MOCK_AUDIT_LOG])

  const activeAdmins = computed(() => adminUsers.value.filter(a => a.active))

  function updateSetting(key, value) {
    settings.value[key] = value
  }

  function addAnnouncement(item) {
    announcements.value.unshift({
      id: `ann-${Date.now()}`,
      ...item,
      is_active: true,
      created_at: new Date().toISOString()
    })
  }

  function addAuditEntry(entry) {
    auditLog.value.unshift({
      id: `log-${Date.now()}`,
      ...entry,
      created_at: new Date().toISOString()
    })
  }

  return {
    settings, adminUsers, announcements, auditLog,
    activeAdmins, updateSetting, addAnnouncement, addAuditEntry
  }
})
