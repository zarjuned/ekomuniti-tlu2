<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <div>
        <div class="section-label">{{ $t('expenses.longTermPlan') }}</div>
        <h1 class="page-title">Jangka Panjang 2026</h1>
      </div>
      <button class="btn btn-primary" @click="openAdd">{{ $t('expenses.addExpense') }}</button>
    </div>

    <!-- Plan info -->
    <div class="glass-card plan-info">
      <p>{{ $t('expenses.planBasedOn', { fee: 20, houses: 40, monthly: 800, yearly: 9600 }) }}</p>
    </div>

    <!-- Donut chart + legend -->
    <div class="glass-card donut-card">
      <div class="donut-wrap">
        <svg viewBox="0 0 200 200" class="donut-svg">
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-bg-tertiary)" stroke-width="20"/>
          <template v-for="(seg, i) in donutSegments" :key="i">
            <circle
              cx="100" cy="100" r="80" fill="none"
              :stroke="seg.color"
              stroke-width="20"
              :stroke-dasharray="seg.dash + ' ' + (502.65 - seg.dash)"
              :stroke-dashoffset="-seg.offset"
              stroke-linecap="butt"
              transform="rotate(-90 100 100)"
            />
          </template>
          <circle cx="100" cy="100" r="70" fill="#fff"/>
        </svg>
        <div class="donut-center">
          <div class="donut-total">RM 9,600</div>
          <div class="donut-label">{{ $t('expenses.perYear') }}</div>
        </div>
      </div>

      <div class="plan-legend">
        <div v-for="cat in activeCategories" :key="cat.id" class="legend-item">
          <div class="legend-dot" :style="{ background: cat.color }"></div>
          <div class="legend-info">
            <div class="legend-name">{{ catName(cat) }}</div>
            <div class="legend-desc">{{ cat.desc || catDesc(cat) }}</div>
          </div>
          <div class="legend-right">
            <div class="legend-pct">{{ cat.yearly_pct }}%</div>
            <div class="legend-amt">RM {{ cat.yearly_amount.toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Prinsip -->
    <div class="section-header">
      <div class="section-label">{{ $t('expenses.principles') }}</div>
    </div>
    <div class="glass-card principles-list">
      <ul>
        <li v-for="(p, i) in principleItems" :key="i">
          <span class="principle-num">{{ i + 1 }}</span>
          <span>{{ p }}</span>
        </li>
      </ul>
    </div>

    <!-- Monthly budget tracker -->
    <div class="section-header">
      <div class="section-label">{{ $t('expenses.categoryTracker') }}</div>
    </div>
    <div class="budget-grid">
      <div v-for="cat in activeCategories" :key="cat.id" class="budget-tile glass-card">
        <div class="budget-tile-icon">{{ cat.icon }}</div>
        <div class="budget-tile-name">{{ catName(cat) }}</div>
        <div class="budget-tile-stats">
          <span class="budget-spent">RM {{ spentForCategory(cat.id).toLocaleString() }}</span>
          <span class="budget-limit">/ RM {{ cat.monthly_budget }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" :class="progressVariant(cat.id, cat.monthly_budget)" :style="{ width: progressWidth(cat.id, cat.monthly_budget) + '%' }"></div>
        </div>
        <p v-if="spentForCategory(cat.id) > cat.monthly_budget && cat.monthly_budget > 0" class="text-danger text-xs mt-2">⚠ {{ $t('expenses.overBudget') }}</p>
      </div>
    </div>

    <!-- Expense ledger -->
    <div class="section-header">
      <div class="section-label">{{ $t('expenses.ledger') }}</div>
    </div>
    <div class="filter-row">
      <select v-model="categoryFilter" class="form-select" style="max-width:240px">
        <option value="all">{{ $t('expenses.allCategories') }}</option>
        <option v-for="c in activeCategories" :key="c.id" :value="c.id">{{ catName(c) }}</option>
      </select>
    </div>
    <div class="ledger-wrap glass-card">
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t('expenses.date') }}</th>
            <th>{{ $t('expenses.amount') }}</th>
            <th>{{ $t('expenses.description') }}</th>
            <th>{{ $t('expenses.category') }}</th>
            <th>{{ $t('payments.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in filteredExpenses" :key="e.id">
            <td class="cell-date">{{ e.expense_date }}</td>
            <td class="cell-amount">RM {{ e.amount.toFixed(2) }}</td>
            <td class="cell-desc">{{ e.description }}</td>
            <td><span class="badge" :style="{ color: catColor(e.category_id), background: catColor(e.category_id) + '18' }">{{ catNameById(e.category_id) }}</span></td>
            <td>
              <button class="btn btn-ghost btn-sm text-danger" @click="remove(e)">{{ $t('expenses.delete') }}</button>
            </td>
          </tr>
          <tr v-if="filteredExpenses.length === 0">
            <td colspan="5" style="text-align:center;padding:var(--space-8)">
              <p class="text-secondary">{{ $t('common.noData') }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add expense modal -->
    <BaseModal v-model="showAdd" :title="$t('expenses.addExpense')">
      <form @submit.prevent="submitAdd">
        <div class="form-group">
          <label class="form-label">{{ $t('expenses.amount') }}</label>
          <input v-model.number="form.amount" type="number" step="0.01" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('expenses.category') }}</label>
          <select v-model="form.categoryId" class="form-select" required>
            <option v-for="c in activeCategories" :key="c.id" :value="c.id">{{ catName(c) }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('expenses.description') }}</label>
          <textarea v-model="form.description" class="form-textarea" required></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('expenses.date') }}</label>
          <input v-model="form.date" type="date" class="form-input" required />
        </div>
        <div style="display:flex;gap:var(--space-2);justify-content:flex-end">
          <button type="button" class="btn btn-ghost" @click="showAdd = false">{{ $t('common.cancel') }}</button>
          <button type="submit" class="btn btn-primary">{{ $t('expenses.save') }}</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import { getCurrentMonthYear } from '@/lib/utils'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/common/BaseModal.vue'

const { locale, t } = useI18n()
const store = useExpensesStore()
const toast = useToast()

const categoryFilter = ref('all')

const CATEGORY_COLORS = {
  'cat-1': '#007AFF',
  'cat-2': '#34C759',
  'cat-3': '#FF9500',
  'cat-4': '#AF52DE',
  'cat-5': '#FF2D55',
  'cat-6': '#5AC8FA'
}

const CATEGORY_ICONS = {
  'cat-1': '🤲', 'cat-2': '🕊️', 'cat-3': '🎉',
  'cat-4': '🔧', 'cat-5': '📋', 'cat-6': '🏦'
}

const CATEGORY_DESCS_BM = {
  'cat-1': 'Bantuan banjir, kebakaran, kematian & keluarga memerlukan',
  'cat-2': 'Sumbangan kematian, ziarah & bantuan segera',
  'cat-3': 'Hari Kebangsaan, gotong-royong, Hari Keluarga',
  'cat-4': 'Baiki taman permainan, papan tanda, cat kemudahan awam',
  'cat-5': 'Percetakan, alat tulis, jamuan mesyuarat, bayaran bank',
  'cat-6': 'Simpanan projek besar & dana kecemasan luar jangka'
}

const CATEGORY_DESCS_EN = {
  'cat-1': 'Flood, fire, death aid & families in need',
  'cat-2': 'Death contributions, visits & immediate aid',
  'cat-3': 'National Day, gotong-royong, Family Day events',
  'cat-4': 'Playground repair, signage, painting, beautification',
  'cat-5': 'Printing, stationery, meeting catering, bank fees',
  'cat-6': 'Major project savings & contingency emergency fund'
}

const activeCategories = computed(() =>
  store.allCategories.map(c => ({
    ...c,
    yearly_amount: store.yearlyAmount(c),
    color: CATEGORY_COLORS[c.id] || '#007AFF',
    icon: CATEGORY_ICONS[c.id] || '📌',
    desc: locale.value === 'bm' ? CATEGORY_DESCS_BM[c.id] : CATEGORY_DESCS_EN[c.id]
  }))
)

const donutSegments = computed(() => {
  const circum = 2 * Math.PI * 80
  let offset = 0
  return activeCategories.value.map(c => {
    const pct = c.yearly_pct / 100
    const dash = circum * pct
    const segOffset = circum * (offset / 100)
    offset += c.yearly_pct
    return { color: c.color, dash, offset: segOffset }
  })
})

function catName(cat) { return locale.value === 'bm' ? cat.name_bm : cat.name_en }
function catDesc(cat) { return cat.desc || '' }
function catColor(id) { return CATEGORY_COLORS[id] || '#007AFF' }
function catNameById(id) {
  const c = activeCategories.value.find(x => x.id === id)
  return c ? catName(c) : '—'
}
function spentForCategory(catId) { return store.totalForCategory(catId, getCurrentMonthYear()) }
function progressWidth(catId, budget) {
  if (!budget || budget <= 0) return 0
  return Math.min(100, (spentForCategory(catId) / budget) * 100)
}
function progressVariant(catId, budget) {
  if (!budget || budget <= 0) return ''
  const pct = (spentForCategory(catId) / budget) * 100
  if (pct > 100) return 'danger'
  if (pct > 75) return 'warning'
  return 'success'
}

const principleItems = computed(() => [
  t('expenses.principle1'), t('expenses.principle2'),
  t('expenses.principle3'), t('expenses.principle4'), t('expenses.principle5')
])

const filteredExpenses = computed(() => {
  const list = [...store.expenses].sort((a, b) => b.expense_date > a.expense_date ? 1 : -1)
  if (categoryFilter.value === 'all') return list
  return list.filter(e => e.category_id === categoryFilter.value)
})

async function remove(exp) {
  if (!confirm(t('expenses.confirmDelete') || 'Hapus rekod ini?')) return
  await store.removeExpense(exp.id)
  toast.success(locale.value === 'bm' ? 'Rekod dihapuskan' : 'Deleted')
}

const showAdd = ref(false)
const form = ref({ amount: 0, categoryId: '', description: '', date: new Date().toISOString().slice(0, 10) })

function openAdd() {
  form.value = {
    amount: 0,
    categoryId: activeCategories.value[0]?.id || '',
    description: '',
    date: new Date().toISOString().slice(0, 10)
  }
  showAdd.value = true
}

async function submitAdd() {
  await store.addExpense({
    amount: form.value.amount,
    category_id: form.value.categoryId,
    description: form.value.description,
    expense_date: form.value.date
  })
  toast.success(locale.value === 'bm' ? 'Perbelanjaan ditambah' : 'Expense added')
  showAdd.value = false
}
</script>

<style scoped>
.section-label { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-secondary); margin-bottom: 2px; }

.plan-info { padding: var(--space-3) var(--space-4); }
.plan-info p { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.5; }

/* Donut */
.donut-card { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
@media (min-width: 480px) {
  .donut-card { padding: 24px; gap: 20px; }
}
.donut-wrap { position: relative; width: 200px; height: 200px; perspective: 800px; }
@media (min-width: 480px) {
  .donut-wrap { width: 240px; height: 240px; }
}
.donut-svg { width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
.donut-wrap:hover .donut-svg { transform: rotateX(6deg) rotateY(-4deg); }
.donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
.donut-total { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--color-text-primary); }
@media (min-width: 480px) {
  .donut-total { font-size: 18px; }
}
.donut-label { font-size: 10px; color: var(--color-text-secondary); margin-top: 2px; }

/* Legend */
.plan-legend { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.legend-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: var(--radius-md); background: var(--color-bg-primary); border: 1px solid rgba(60,60,67,0.06); transition: all 0.2s; }
@media (min-width: 480px) {
  .legend-item { gap: 10px; padding: 10px 14px; }
}
.legend-item:hover { transform: translateX(4px); box-shadow: var(--shadow-sm); }
.legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
@media (min-width: 480px) {
  .legend-dot { width: 12px; height: 12px; }
}
.legend-info { flex: 1; min-width: 0; }
.legend-name { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media (min-width: 480px) {
  .legend-name { font-size: 13px; }
}
.legend-desc { font-size: 9px; color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
.legend-right { text-align: right; flex-shrink: 0; }
.legend-pct { font-family: var(--font-display); font-size: 17px; font-weight: 700; }
@media (min-width: 480px) {
  .legend-pct { font-size: 20px; }
}
.legend-amt { font-size: 9px; color: var(--color-text-secondary); }
@media (min-width: 480px) {
  .legend-amt { font-size: 10px; }
}

/* Principles */
.principles-list { padding: var(--space-3); }
@media (min-width: 480px) {
  .principles-list { padding: var(--space-4); }
}
.principles-list ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
.principles-list li { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border-radius: var(--radius-md); font-size: var(--text-sm); color: var(--color-text-primary); line-height: 1.5; transition: background 0.15s; }
@media (min-width: 480px) {
  .principles-list li { gap: 12px; padding: 12px 16px; }
}
.principles-list li:not(:last-child) { border-bottom: 1px solid rgba(60,60,67,0.06); }
.principles-list li:hover { background: rgba(0,0,0,0.02); }
.principle-num { width: 20px; height: 20px; border-radius: 50%; background: var(--color-success); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
@media (min-width: 480px) {
  .principle-num { width: 22px; height: 22px; font-size: 11px; margin-top: 1px; }
}

/* Budget tiles */
.budget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
@media (min-width: 480px) {
  .budget-grid { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; }
}
@media (max-width: 360px) { .budget-grid { grid-template-columns: 1fr; } }
.budget-tile { padding: 12px 14px; }
@media (min-width: 480px) {
  .budget-tile { padding: 14px 16px; }
}
.budget-tile-icon { font-size: 18px; margin-bottom: 4px; }
.budget-tile-name { font-size: 11px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media (min-width: 480px) {
  .budget-tile-name { font-size: 12px; }
}
.budget-tile-stats { display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px; }
.budget-spent { font-family: var(--font-display); font-size: 15px; font-weight: 700; }
@media (min-width: 480px) {
  .budget-spent { font-size: 17px; }
}
.budget-limit { font-size: 11px; color: var(--color-text-tertiary); }

/* Ledger */
.filter-row { margin-bottom: 0; }
.ledger-wrap { overflow-x: auto; }
.cell-amount { font-family: var(--font-display); font-weight: 600; white-space: nowrap; }
.cell-date { font-size: var(--text-xs); color: var(--color-text-secondary); white-space: nowrap; }
.cell-desc { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (min-width: 480px) { .cell-desc { max-width: 180px; } }
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: var(--radius-full); font-size: 10px; font-weight: 600; white-space: nowrap; }
@media (min-width: 480px) {
  .badge { padding: 2px 10px; font-size: 11px; }
}
.text-xs { font-size: var(--text-xs); }
.text-danger { color: var(--color-danger); }
.text-secondary { color: var(--color-text-secondary); }
.mt-2 { margin-top: var(--space-2); }
</style>
