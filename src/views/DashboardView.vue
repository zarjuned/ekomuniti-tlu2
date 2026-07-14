<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('dashboard.title') }}</h1>
        <p class="page-subtitle">{{ currentDateLabel }}</p>
      </div>
    </div>

    <!-- Notification banner -->
    <div v-if="pendingCount > 0" class="notification-banner animate-flash">
      <span>⚠️ {{ $t('dashboard.pendingApproval', { n: pendingCount }) }}</span>
    </div>

    <!-- Hero cards -->
    <div class="hero-grid">
      <div class="hero-card balance-card">
        <span class="hero-label">{{ $t('dashboard.totalBalance') }}</span>
        <span class="hero-value">RM {{ totalBalance.toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}</span>
      </div>
      <div class="hero-card arrears-card">
        <span class="hero-label">{{ $t('dashboard.arrears') }}</span>
        <span class="hero-value text-danger">RM {{ arrearsTotal.toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}</span>
      </div>
      <div class="hero-card budget-card">
        <span class="hero-label">{{ $t('dashboard.monthlyBudget') }}</span>
        <div class="budget-row">
          <span class="text-success">+RM {{ monthIncome.toLocaleString() }}</span>
          <span class="text-danger">-RM {{ monthExpense.toLocaleString() }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" :style="{ width: budgetPercent + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Progress ring + charts row -->
    <div class="charts-row">
      <div class="glass-card progress-section">
        <h3 class="section-title">{{ $t('dashboard.collectionProgress') }}</h3>
        <div class="progress-ring-wrap">
          <svg viewBox="0 0 200 200" class="progress-ring">
            <circle cx="100" cy="100" r="85" stroke="var(--color-bg-tertiary)" stroke-width="14" fill="none" />
            <circle cx="100" cy="100" r="85" stroke="ringColor" stroke-width="14" fill="none"
                    :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"
                    stroke-linecap="round" transform="rotate(-90 100 100)"
                    :style="{ stroke: ringColor, transition: 'stroke-dashoffset 0.8s ease-out' }" />
            <text x="100" y="95" text-anchor="middle" fill="var(--color-text-primary)" font-size="22" font-weight="700">{{ paidCount }} / {{ totalHouses }}</text>
            <text x="100" y="120" text-anchor="middle" fill="var(--color-text-secondary)" font-size="13">{{ $t('dashboard.paid') }} ({{ percentPaid }}%)</text>
          </svg>
        </div>
      </div>

      <div class="glass-card cashflow-section">
        <h3 class="section-title">{{ $t('dashboard.cashflow') }}</h3>
        <div class="cashflow-chart">
          <Bar :data="cashflowData" :options="chartOptions" />
        </div>
      </div>

      <div class="glass-card defaulter-section">
        <div class="section-title-row">
          <h3 class="section-title">{{ $t('dashboard.defaulters') }}</h3>
          <button class="btn btn-secondary btn-sm" @click="copyReminder">
            {{ copied ? '✓ Copied' : $t('dashboard.copyWhatsApp') }}
          </button>
        </div>
        <div class="defaulter-list">
          <div v-for="h in defaulters" :key="h.id" class="defaulter-item">
            <StatusDot status="unpaid" showLabel />
            <span class="defaulter-house">{{ h.house_number }}</span>
            <span class="defaulter-name">{{ h.owner_name }}</span>
          </div>
          <EmptyState v-if="defaulters.length === 0" :title="$t('common.noData')" />
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="quick-actions">
      <button class="btn btn-primary" @click="$router.push({ name: 'payments' })">
        {{ $t('dashboard.recordPayment') }}
      </button>
      <button class="btn btn-secondary" @click="$router.push({ name: 'expenses' })">
        {{ $t('dashboard.addExpense') }}
      </button>
      <button class="btn btn-secondary" @click="$router.push({ name: 'attendance' })">
        {{ $t('dashboard.postAnnouncement') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { usePaymentsStore } from '@/stores/payments'
import { useHousesStore } from '@/stores/houses'
import { useExpensesStore } from '@/stores/expenses'
import { useSettingsStore } from '@/stores/settings'
import { useWhatsApp } from '@/composables/useWhatsApp'
import { getCurrentMonthYear, getMonthsAgo, formatMonthYear } from '@/lib/utils'
import { TOTAL_HOUSES } from '@/lib/constants'
import { useI18n } from 'vue-i18n'
import StatusDot from '@/components/common/StatusDot.vue'
import EmptyState from '@/components/common/EmptyState.vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { locale } = useI18n()
const payments = usePaymentsStore()
const houses = useHousesStore()
const expenses = useExpensesStore()
const settings = useSettingsStore()

const currentMonth = getCurrentMonthYear()
const totalHouses = TOTAL_HOUSES

const currentDateLabel = computed(() => formatMonthYear(currentMonth, locale.value))
const pendingCount = computed(() => payments.pending.length)

const monthIncome = computed(() => payments.totalApprovedForMonth(currentMonth))
const monthExpense = computed(() => expenses.totalExpense(currentMonth))
const totalIncomeAll = computed(() => payments.approved.reduce((s, p) => s + p.amount, 0))
const totalExpenseAll = computed(() => expenses.totalExpense())
const totalBalance = computed(() => totalIncomeAll.value - totalExpenseAll.value)

const arrearsTotal = computed(() => {
  // Houses unpaid for current month = total houses - (paid + pending)
  const counts = payments.countsForMonth(currentMonth)
  return counts.unpaid * 20
})

const paidCount = computed(() => payments.countsForMonth(currentMonth).paid)
const percentPaid = computed(() => Math.round((paidCount.value / totalHouses) * 100))

const budgetPercent = computed(() => {
  if (monthIncome.value === 0) return 0
  return Math.min(100, Math.round((monthExpense.value / monthIncome.value) * 100))
})

// Progress ring
const radius = 85
const dashArray = 2 * Math.PI * radius
const dashOffset = computed(() => dashArray - (dashArray * percentPaid.value) / 100)
const ringColor = computed(() => {
  if (percentPaid.value < 30) return 'var(--color-danger)'
  if (percentPaid.value < 70) return 'var(--color-warning)'
  return 'var(--color-success)'
})

// Defaulters
const defaulters = computed(() => {
  const currentPay = payments.forMonth(currentMonth)
  const paidHouseIds = new Set(currentPay.filter(p => p.status === 'approved' || p.status === 'pending').map(p => p.house_id))
  return houses.houses.filter(h => !paidHouseIds.has(h.id))
})

// Cashflow chart
const cashflowData = computed(() => {
  const months = []
  const incomes = []
  const exps = []
  for (let i = 5; i >= 0; i--) {
    const my = getMonthsAgo(i)
    months.push(formatMonthYear(my, locale.value))
    incomes.push(payments.totalApprovedForMonth(my))
    exps.push(expenses.totalExpense(my))
  }
  return {
    labels: months,
    datasets: [
      { label: 'Income', data: incomes, backgroundColor: 'rgba(34, 197, 94, 0.8)', borderRadius: 6 },
      { label: 'Expense', data: exps, backgroundColor: 'rgba(239, 68, 68, 0.8)', borderRadius: 6 }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af', font: { size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af', font: { size: 10 } } }
  }
}

const { generateReminder, copyToClipboard, copied } = useWhatsApp()

async function copyReminder() {
  const msg = generateReminder(defaulters.value, currentMonth)
  await copyToClipboard(msg)
}
</script>

<style scoped>
.notification-banner {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: var(--color-warning);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  margin-bottom: var(--space-5);
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}
@media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }

.hero-card {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.balance-card {
  background: var(--color-accent-gradient);
  border: none;
  box-shadow: var(--shadow-glow);
}
.balance-card .hero-label, .balance-card .hero-value { color: #fff; }
.hero-label {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.hero-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}
.budget-row {
  display: flex;
  gap: var(--space-4);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}
@media (max-width: 1023px) { .charts-row { grid-template-columns: 1fr; } }

.section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-4);
}
.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}
.section-title-row h3 { margin-bottom: 0; }

.progress-section {
  display: flex;
  flex-direction: column;
}
.progress-ring-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}
.progress-ring { width: 200px; height: 200px; }

.cashflow-section { min-height: 320px; }
.cashflow-chart {
  height: 260px;
  position: relative;
}

.defaulter-list {
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.defaulter-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--text-sm);
}
.defaulter-house { font-weight: var(--font-semibold); color: var(--color-text-primary); min-width: 60px; }
.defaulter-name { color: var(--color-text-secondary); font-size: var(--text-xs); }

.quick-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
</style>
