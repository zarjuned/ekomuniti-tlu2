<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">{{ $t('payments.title') }}</h1>
      <button class="btn btn-primary" @click="showCashForm = true">
        {{ $t('payments.cashPayment') }}
      </button>
    </div>

    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'pending' }" @click="tab = 'pending'">
        {{ $t('payments.pending') }} ({{ payments.pending.length }})
      </button>
      <button class="tab" :class="{ active: tab === 'all' }" @click="tab = 'all'">
        {{ $t('common.total') }} ({{ payments.payments.length }})
      </button>
    </div>

    <div class="payments-table-wrap glass-card">
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t('payments.date') }}</th>
            <th>{{ $t('payments.house') }}</th>
            <th>{{ $t('payments.months') }}</th>
            <th>{{ $t('payments.amount') }}</th>
            <th>{{ $t('payments.bankRef') }}</th>
            <th>{{ $t('payments.status') }}</th>
            <th>{{ $t('payments.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in displayList" :key="p.id">
            <td>{{ formatDateShort(p.submitted_at) }}</td>
            <td class="cell-house">{{ houseName(p.house_id) }}</td>
            <td>{{ formatMonthYear(p.month_year, locale) }}</td>
            <td class="cell-amount">RM {{ p.amount.toFixed(2) }}</td>
            <td class="cell-ref">{{ p.bank_reference || '—' }}</td>
            <td>
              <BaseBadge :variant="statusVariant(p.status)">{{ $t('payments.' + p.status) }}</BaseBadge>
            </td>
            <td class="cell-actions">
              <template v-if="p.status === 'pending'">
                <button class="btn btn-success btn-sm" @click="approve(p)">{{ $t('payments.approve') }}</button>
                <button class="btn btn-danger btn-sm" @click="reject(p)">{{ $t('payments.reject') }}</button>
              </template>
              <button v-else class="btn btn-ghost btn-sm" disabled>—</button>
            </td>
          </tr>
          <tr v-if="displayList.length === 0">
            <td colspan="7" style="text-align:center; padding: var(--space-8);">
              <p class="text-secondary">{{ tab === 'pending' ? $t('payments.noPending') : $t('common.noData') }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cash payment modal -->
    <BaseModal v-model="showCashForm" :title="$t('payments.cashPayment')">
      <form @submit.prevent="submitCash">
        <div class="form-group">
          <label class="form-label">{{ $t('payments.house') }}</label>
          <select v-model="cashForm.houseId" class="form-select" required>
            <option value="" disabled>-- Pilih Rumah --</option>
            <option v-for="h in houses.houses" :key="h.id" :value="h.id">{{ h.house_number }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('payments.months') }}</label>
          <select v-model="cashForm.monthYear" class="form-select">
            <option v-for="m in monthOptions" :key="m" :value="m">{{ formatMonthYear(m, locale) }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('payments.amount') }}</label>
          <input v-model.number="cashForm.amount" type="number" class="form-input" step="0.01" />
        </div>
        <div style="display:flex; gap:var(--space-2); justify-content:flex-end;">
          <button type="button" class="btn btn-ghost" @click="showCashForm = false">{{ $t('common.cancel') }}</button>
          <button type="submit" class="btn btn-primary">{{ $t('payments.submit') }}</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePaymentsStore } from '@/stores/payments'
import { useHousesStore } from '@/stores/houses'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import { formatMonthYear, getCurrentMonthYear, getMonthsAgo, formatDate } from '@/lib/utils'
import { PAYMENT_METHODS, PAYMENT_STATUS } from '@/lib/constants'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const { locale } = useI18n()
const payments = usePaymentsStore()
const houses = useHousesStore()
const auth = useAuthStore()
const toast = useToast()

const tab = ref('pending')

const displayList = computed(() => {
  if (tab.value === 'pending') return payments.pending
  return [...payments.payments].sort((a, b) => b.submitted_at > a.submitted_at ? 1 : -1).slice(0, 100)
})

function houseName(houseId) {
  const h = houses.findHouse(houseId)
  return h ? h.house_number : houseId
}

function statusVariant(s) {
  return s === 'approved' ? 'success' : s === 'pending' ? 'warning' : 'danger'
}

function formatDateShort(iso) {
  if (!iso) return '—'
  return iso.slice(0, 10)
}

async function approve(p) {
  await payments.approvePayment(p.id, auth.user?.id)
  toast.success('Bayaran diluluskan')
}

async function reject(p) {
  await payments.rejectPayment(p.id, auth.user?.id)
  toast.success('Bayaran ditolak')
}

// Cash payment form
const showCashForm = ref(false)
const cashForm = ref({ houseId: '', monthYear: getCurrentMonthYear(), amount: 20 })

const monthOptions = computed(() => {
  const arr = []
  for (let i = 0; i < 12; i++) arr.push(getMonthsAgo(i))
  return arr
})

async function submitCash() {
  try {
    await payments.submitPayment({
      houseId: cashForm.value.houseId,
      monthYear: cashForm.value.monthYear,
      amount: cashForm.value.amount,
      method: PAYMENT_METHODS.CASH,
      bankRef: null
    })
    await payments.approvePayment(payments.payments[0].id, auth.user?.id)
    toast.success('Bayaran tunai berjaya direkodkan')
    showCashForm.value = false
    cashForm.value = { houseId: '', monthYear: getCurrentMonthYear(), amount: 20 }
  } catch (e) {
    toast.error(e.message === 'duplicate' ? 'Duplicate submission' : 'Error')
  }
}
</script>

<style scoped>
.tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}
.tab {
  padding: var(--space-3) var(--space-5);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.tab.active {
  color: var(--color-accent-primary);
  border-bottom-color: var(--color-accent-primary);
}
.tab:hover:not(.active) { color: var(--color-text-primary); }

.payments-table-wrap { overflow-x: auto; }

.cell-house { font-weight: var(--font-semibold); color: var(--color-text-primary); }
.cell-amount { font-weight: var(--font-semibold); }
.cell-ref { font-family: monospace; font-size: var(--text-xs); color: var(--color-text-tertiary); }
.cell-actions { display: flex; gap: var(--space-2); }
</style>
