<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('dashboard.title') }}</h1>
        <p class="page-subtitle">{{ currentDateLabel }}</p>
      </div>
    </div>

    <!-- Alert banner -->
    <div v-if="pendingCount > 0" class="alert-banner">
      ⚠️ {{ $t('dashboard.pendingApproval', { n: pendingCount }) }}
    </div>

    <!-- Stat cards -->
    <div class="stat-grid">
      <div class="stat-card accent-blue card-3d">
        <div class="stat-label">{{ $t('dashboard.totalBalance') }}</div>
        <div class="stat-value">RM {{ totalBalance.toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}</div>
        <div class="stat-sub"><span class="stat-dot" style="background:var(--color-success)"></span> Dana Terkumpul</div>
      </div>
      <div class="stat-card accent-orange card-3d">
        <div class="stat-label">{{ $t('dashboard.arrears') }}</div>
        <div class="stat-value text-danger">RM {{ arrearsTotal.toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}</div>
        <div class="stat-sub"><span class="stat-dot" style="background:var(--color-warning)"></span> Belum Bayar</div>
      </div>
    </div>

    <!-- Mid row: ring + chart side by side on desktop -->
    <div class="mid-row">
      <!-- Progress ring -->
      <div class="glass-card ring-card">
        <div class="section-label">{{ $t('dashboard.collectionProgress') }}</div>
        <div class="ring-wrap">
          <svg viewBox="0 0 200 200" class="ring-svg">
            <circle cx="100" cy="100" r="85" stroke="var(--color-bg-tertiary)" stroke-width="14" fill="none"/>
            <circle cx="100" cy="100" r="85" stroke="ringColor" stroke-width="14" fill="none"
                    :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"
                    stroke-linecap="round" transform="rotate(-90 100 100)"
                    :style="{ stroke: ringColor, transition: 'stroke-dashoffset 0.8s ease-out' }"/>
            <text x="100" y="95" text-anchor="middle" fill="var(--color-text-primary)" font-size="22" font-weight="700" font-family="var(--font-display)">{{ paidCount }} / {{ totalHouses }}</text>
            <text x="100" y="120" text-anchor="middle" fill="var(--color-text-secondary)" font-size="13">{{ $t('dashboard.paid') }} ({{ percentPaid }}%)</text>
          </svg>
        </div>
      </div>

      <!-- Cashflow chart -->
      <div class="glass-card chart-card">
        <div class="section-label">{{ $t('dashboard.cashflow') }}</div>
        <div class="chart-wrap">
          <Bar :data="cashflowData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- Defaulters -->
    <div class="glass-card">
      <div class="section-label">{{ $t('dashboard.defaulters') }}</div>
      <div class="defaulter-list">
        <div v-for="h in defaulters" :key="h.id" class="defaulter-item">
          <span class="defaulter-dot" style="background:var(--color-danger)"></span>
          <span class="defaulter-house">{{ h.house_number }}</span>
          <span class="defaulter-name">{{ h.owner_name }}</span>
        </div>
        <EmptyState v-if="defaulters.length === 0" :title="$t('common.noData')" />
      </div>
    </div>

    <!-- Quick actions -->
    <div class="quick-actions">
      <button class="quick-btn" @click="$router.push({ name: 'payments' })">
        <div class="quick-icon" style="background:rgba(0,122,255,0.12);color:var(--color-accent-primary)">+</div>
        {{ $t('dashboard.recordPayment') }}
      </button>
      <button class="quick-btn" @click="$router.push({ name: 'expenses' })">
        <div class="quick-icon" style="background:rgba(255,149,0,0.12);color:var(--color-warning)">+</div>
        {{ $t('dashboard.addExpense') }}
      </button>
      <button class="quick-btn" @click="$router.push({ name: 'attendance' })">
        <div class="quick-icon" style="background:rgba(175,82,222,0.12);color:#AF52DE">📋</div>
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
  const counts = payments.countsForMonth(currentMonth)
  return counts.unpaid * 20
})

const paidCount = computed(() => payments.countsForMonth(currentMonth).paid)
const percentPaid = computed(() => Math.round((paidCount.value / totalHouses) * 100))

const radius = 85
const dashArray = 2 * Math.PI * radius
const dashOffset = computed(() => dashArray - (dashArray * percentPaid.value) / 100)
const ringColor = computed(() => {
  if (percentPaid.value < 30) return 'var(--color-danger)'
  if (percentPaid.value < 70) return 'var(--color-warning)'
  return 'var(--color-success)'
})

const defaulters = computed(() => {
  const currentPay = payments.forMonth(currentMonth)
  const paidHouseIds = new Set(currentPay.filter(p => p.status === 'approved' || p.status === 'pending').map(p => p.house_id))
  return houses.houses.filter(h => !paidHouseIds.has(h.id))
})

const cashflowData = computed(() => {
  const months = []; const incomes = []; const exps = []
  for (let i = 5; i >= 0; i--) {
    const my = getMonthsAgo(i)
    months.push(formatMonthYear(my, locale.value))
    incomes.push(payments.totalApprovedForMonth(my))
    exps.push(expenses.totalExpense(my))
  }
  return {
    labels: months,
    datasets: [
      { label: 'Income', data: incomes, backgroundColor: 'rgba(52,199,89,0.7)', borderRadius: 6 },
      { label: 'Expense', data: exps, backgroundColor: 'rgba(255,59,48,0.7)', borderRadius: 6 }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#8e8e93', font: { size: 10 } } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#8e8e93', font: { size: 10 } } }
  }
}

const { generateReminder, copyToClipboard, copied } = useWhatsApp()
</script>

<style scoped>
.alert-banner {
  background: rgba(255,149,0,0.1);
  border: 1px solid rgba(255,149,0,0.25);
  color: var(--color-warning);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

/* Stat grid */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (min-width: 480px) {
  .stat-grid { gap: 12px; }
}
.stat-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
}
@media (min-width: 480px) {
  .stat-card { padding: 18px 20px; }
}
.stat-card.accent-blue { background: linear-gradient(135deg, rgba(0,122,255,0.05), rgba(90,200,250,0.03)); border-color: rgba(0,122,255,0.12); }
.stat-card.accent-orange { background: linear-gradient(135deg, rgba(255,149,0,0.05), rgba(255,149,0,0.02)); border-color: rgba(255,149,0,0.12); }

.stat-label { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-secondary); margin-bottom: 2px; }
.stat-value { font-family: var(--font-display); font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: var(--color-text-primary); }
@media (min-width: 480px) {
  .stat-value { font-size: 26px; }
}
.stat-sub { font-size: 11px; color: var(--color-text-secondary); margin-top: 4px; display: flex; align-items: center; gap: 6px; }
.stat-dot { width: 6px; height: 6px; border-radius: 50%; }

.section-label { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-secondary); margin-bottom: var(--space-3); }

/* Mid row: ring + chart */
.mid-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}
@media (min-width: 600px) {
  .mid-row {
    grid-template-columns: 1fr 2fr;
  }
}

.ring-card {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
}
.ring-wrap {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ring-svg {
  width: 100%;
  max-width: 180px;
  height: auto;
}

.chart-card {
  padding: var(--space-4);
}
.chart-wrap {
  height: 220px;
}
@media (max-width: 600px) {
  .chart-wrap { height: 200px; }
}

/* Defaulters */
.defaulter-list { display: flex; flex-direction: column; gap: 2px; max-height: 320px; overflow-y: auto; }
.defaulter-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border-radius: var(--radius-md);
  font-size: var(--text-sm);
  border-bottom: 1px solid rgba(60,60,67,0.06);
}
.defaulter-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.defaulter-house { font-weight: 600; min-width: 50px; }
.defaulter-name { color: var(--color-text-secondary); font-size: var(--text-xs); }

/* Quick actions */
.quick-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
@media (max-width: 400px) {
  .quick-actions { grid-template-columns: repeat(3, 1fr); gap: 6px; }
}
.quick-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 14px 8px; border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  font-size: 11px; font-weight: 600; color: var(--color-text-primary);
  transition: all 0.2s; cursor: pointer;
}
@media (min-width: 480px) {
  .quick-btn { padding: 16px 12px; font-size: 12px; gap: 8px; }
}
.quick-btn:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.quick-btn:active { transform: scale(0.96); }
.quick-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; }
@media (min-width: 480px) {
  .quick-icon { width: 40px; height: 40px; font-size: 20px; }
}

.text-danger { color: var(--color-danger); }
</style>
