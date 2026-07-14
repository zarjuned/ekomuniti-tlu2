<template>
  <div class="resident-page animate-fade-in">
    <div class="resident-header">
      <button class="btn btn-ghost btn-sm" @click="logout">← {{ $t('nav.logout') }}</button>
    </div>

    <div class="welcome-section">
      <h1>{{ $t('resident.welcome', { house: auth.houseNumber }) }}</h1>
      <div class="status-alert" :class="hasArrears ? 'danger' : 'success'">
        <template v-if="hasArrears">
          <strong>RM {{ arrearsAmount }} {{ $t('resident.outstanding') }}</strong>
          <p>{{ arrearsMonths }} bulan belum dibayar</p>
        </template>
        <template v-else>
          <strong>RM 0 {{ $t('resident.noBalance') }}</strong>
          <p>{{ $t('resident.paid') }}</p>
        </template>
      </div>
    </div>

    <!-- 12-month payment status -->
    <div class="glass-card monthly-section">
      <h2 class="section-title">{{ $t('resident.paymentStatus') }}</h2>
      <div class="month-grid">
        <div v-for="m in months" :key="m.key" class="month-block" :class="m.status">
          <span class="month-label">{{ m.name }}</span>
          <span class="month-dot"></span>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="action-grid">
      <button class="action-btn" @click="showPayForm = true">
        <span class="action-icon">💳</span>
        <span class="action-label">{{ $t('resident.submitSlip') }}</span>
      </button>
      <button class="action-btn" @click="$router.push({ name: 'attendance' })">
        <span class="action-icon">📢</span>
        <span class="action-label">{{ $t('resident.announcements') }}</span>
      </button>
      <button class="action-btn">
        <span class="action-icon">📝</span>
        <span class="action-label">{{ $t('resident.register') }}</span>
      </button>
      <button class="action-btn">
        <span class="action-icon">📞</span>
        <span class="action-label">{{ $t('resident.contactAJK') }}</span>
      </button>
    </div>

    <!-- Payment submission modal -->
    <BaseModal v-model="showPayForm" :title="$t('payments.submitPayment')">
      <form @submit.prevent="submitSlip">
        <div class="form-group">
          <label class="form-label">{{ $t('payments.months') }}</label>
          <select v-model="payMonth" class="form-select">
            <option v-for="m in availableMonths" :key="m" :value="m">{{ formatMonthYear(m, locale) }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('payments.amount') }}</label>
          <input v-model.number="payAmount" type="number" step="0.01" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('payments.bankRef') }}</label>
          <input v-model="bankRef" class="form-input" placeholder="MBB..." />
        </div>
        <FileUpload v-model="receiptFile" />
        <p v-if="submitError" class="form-error mt-2">{{ submitError }}</p>
        <div style="display:flex; gap:var(--space-2); justify-content:flex-end; margin-top: var(--space-4);">
          <button type="button" class="btn btn-ghost" @click="showPayForm = false">{{ $t('common.cancel') }}</button>
          <button type="submit" class="btn btn-primary">{{ $t('payments.submit') }}</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { usePaymentsStore } from '@/stores/payments'
import { useToast } from '@/composables/useToast'
import { getCurrentMonthYear, getMonthsAgo, formatMonthYear } from '@/lib/utils'
import { PAYMENT_METHODS } from '@/lib/constants'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/common/BaseModal.vue'
import FileUpload from '@/components/common/FileUpload.vue'

const { locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const auth = useAuth()
const payments = usePaymentsStore()
const toast = useToast()

const houseId = computed(() => authStore.houseId)

const arrearsMonths = computed(() => {
  let count = 0
  for (let i = 0; i < 6; i++) {
    if (payments.statusForHouseMonth(houseId.value, getMonthsAgo(i)) === 'unpaid') count++
  }
  return count
})
const hasArrears = computed(() => arrearsMonths.value > 0)
const arrearsAmount = computed(() => arrearsMonths.value * 20)

const months = computed(() => {
  const arr = []
  for (let i = 0; i < 12; i++) {
    const my = getMonthsAgo(i)
    const [y, m] = my.split('-')
    const names = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis']
    arr.push({
      key: my,
      name: names[parseInt(m, 10) - 1],
      status: payments.statusForHouseMonth(houseId.value, my)
    })
  }
  return arr
})

function logout() {
  auth.logout()
  router.push({ name: 'resident' })
}

const showPayForm = ref(false)
const payMonth = ref(getCurrentMonthYear())
const payAmount = ref(20)
const bankRef = ref('')
const receiptFile = ref(null)
const submitError = ref('')

const availableMonths = computed(() => {
  const arr = []
  for (let i = 0; i < 12; i++) {
    const my = getMonthsAgo(i)
    if (payments.statusForHouseMonth(houseId.value, my) !== 'unpaid') continue
    arr.push(my)
  }
  if (arr.length === 0) arr.push(getCurrentMonthYear())
  return arr
})

async function submitSlip() {
  submitError.value = ''
  try {
    await payments.submitPayment({
      houseId: houseId.value,
      monthYear: payMonth.value,
      amount: payAmount.value,
      method: PAYMENT_METHODS.BANK_TRANSFER,
      bankRef: bankRef.value
    })
    toast.success('Slip bayaran dihantar. Menunggu kelulusan AJK.')
    showPayForm.value = false
    bankRef.value = ''
    receiptFile.value = null
  } catch (e) {
    submitError.value = e.message === 'duplicate' ? 'Bayaran bulan ini sedang diproses' : 'Ralat'
  }
}
</script>

<style scoped>
.resident-page {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-4);
  padding-bottom: calc(var(--mobile-nav-height) + 20px);
}
.resident-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4);
}

.welcome-section { text-align: center; margin-bottom: var(--space-5); }
.welcome-section h1 { font-size: var(--text-2xl); margin-bottom: var(--space-4); }

.status-alert {
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
.status-alert.danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--color-danger);
}
.status-alert.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: var(--color-success);
}
.status-alert strong { display: block; font-size: var(--text-xl); }
.status-alert p { font-size: var(--text-sm); margin-top: var(--space-1); }

.section-title {
  font-size: var(--text-sm);
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.monthly-section { margin-bottom: var(--space-5); }
.month-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}
.month-block {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}
.month-label { font-size: var(--text-xs); color: var(--color-text-secondary); }
.month-dot { width: 14px; height: 14px; border-radius: var(--radius-full); }
.month-block.paid .month-dot { background: var(--color-success); box-shadow: 0 0 10px rgba(34,197,94,0.5); }
.month-block.pending .month-dot { background: var(--color-warning); box-shadow: 0 0 10px rgba(245,158,11,0.5); }
.month-block.unpaid .month-dot { background: var(--color-danger); box-shadow: 0 0 10px rgba(239,68,68,0.5); }

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
.action-btn {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover {
  border-color: var(--color-accent-primary);
  transform: translateY(-2px);
}
.action-icon { font-size: 28px; }
.action-label { font-size: var(--text-sm); color: var(--color-text-primary); font-weight: var(--font-medium); }
</style>
