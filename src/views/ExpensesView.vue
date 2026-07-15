<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">{{ $t('expenses.title') }}</h1>
      <button class="btn btn-primary" @click="openAdd">{{ $t('expenses.addExpense') }}</button>
    </div>

    <!-- Pelan Perbelanjaan Jangka Panjang -->
    <section class="expenses-section">
      <h2 class="section-heading">{{ $t('expenses.longTermPlan') }}</h2>
      <div class="plan-info glass-card">
        <p>{{ $t('expenses.planBasedOn', { fee: 20, houses: 40, monthly: 800, yearly: 9600 }) }}</p>
      </div>
      <div class="plan-grid">
        <div v-for="cat in activeCategories" :key="cat.id" class="plan-card glass-card">
          <div class="plan-card-header">
            <span class="plan-pct">{{ cat.yearly_pct }}%</span>
            <span class="plan-yearly">RM {{ store.yearlyAmount(cat).toLocaleString() }} / {{ $t('expenses.perYear') }}</span>
          </div>
          <div class="plan-card-title">{{ catName(cat) }}</div>
          <div class="plan-card-desc">{{ catDesc(cat) }}</div>
          <div class="plan-card-spent">
            <span class="text-xs text-secondary">{{ $t('expenses.spentThisYear') }}:</span>
            <span class="text-sm font-semibold">RM {{ store.yearlyTotalForCategory(cat.id).toLocaleString() }}</span>
          </div>
          <div class="progress-bar mt-2">
            <div
              class="progress-bar-fill"
              :class="planProgressVariant(cat)"
              :style="{ width: planProgressWidth(cat) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category budget tracker (monthly) -->
    <section class="expenses-section">
      <h2 class="section-heading">{{ $t('expenses.categoryTracker') }}</h2>
      <div class="budget-grid">
        <div v-for="cat in activeCategories" :key="cat.id" class="budget-card glass-card">
          <div class="budget-card-title">{{ catName(cat) }}</div>
          <div class="budget-card-stats">
            <span class="budget-spent">RM {{ spentForCategory(cat.id).toLocaleString() }}</span>
            <span class="budget-limit">/ RM {{ cat.monthly_budget }}</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-bar-fill"
              :class="progressVariant(cat.id, cat.monthly_budget)"
              :style="{ width: progressWidth(cat.id, cat.monthly_budget) + '%' }"
            ></div>
          </div>
          <p v-if="spentForCategory(cat.id) > cat.monthly_budget && cat.monthly_budget > 0" class="text-danger text-xs mt-2">
            ⚠ {{ $t('expenses.overBudget') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Prinsip Pengurusan Kewangan -->
    <section class="expenses-section">
      <h2 class="section-heading">{{ $t('expenses.principles') }}</h2>
      <div class="principles-list glass-card">
        <ul>
          <li v-for="(p, i) in principleItems" :key="i">{{ p }}</li>
        </ul>
      </div>
    </section>

    <!-- Expense ledger -->
    <section class="expenses-section">
      <h2 class="section-heading">{{ $t('expenses.ledger') }}</h2>
      <div class="filter-row">
        <select v-model="categoryFilter" class="form-select" style="max-width: 240px;">
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
              <td><BaseBadge>{{ catNameById(e.category_id) }}</BaseBadge></td>
              <td>
                <button class="btn btn-ghost btn-sm text-danger" @click="remove(e)">{{ $t('expenses.delete') }}</button>
              </td>
            </tr>
            <tr v-if="filteredExpenses.length === 0">
              <td colspan="5" style="text-align:center; padding:var(--space-8);">
                <p class="text-secondary">{{ $t('common.noData') }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

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
        <div style="display:flex; gap:var(--space-2); justify-content:flex-end;">
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
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const { locale, t } = useI18n()
const store = useExpensesStore()
const toast = useToast()

const categoryFilter = ref('all')
const activeCategories = computed(() => store.allCategories)

function catName(cat) { return locale.value === 'bm' ? cat.name_bm : cat.name_en }

function catDesc(cat) {
  const descs = {
    'cat-1': locale.value === 'bm' ? 'Bantuan banjir, kebakaran, kematian & keluarga memerlukan' : 'Flood, fire, death aid & families in need',
    'cat-2': locale.value === 'bm' ? 'Sumbangan kematian, ziarah & bantuan segera' : 'Death contributions, visits & immediate aid',
    'cat-3': locale.value === 'bm' ? 'Hari Kebangsaan, gotong-royong, Hari Keluarga, program kanak-kanak & warga emas' : 'National Day, gotong-royong, Family Day, children & senior programmes',
    'cat-4': locale.value === 'bm' ? 'Baiki taman permainan, papan tanda, cat kemudahan awam, keceriaan kawasan' : 'Playground repair, signage, public facility painting, beautification',
    'cat-5': locale.value === 'bm' ? 'Percetakan, alat tulis, jamuan mesyuarat, bayaran akaun bank' : 'Printing, stationery, meeting refreshments, bank account fees',
    'cat-6': locale.value === 'bm' ? 'Simpanan projek besar & dana kecemasan luar jangka' : 'Major project savings & contingency emergency fund'
  }
  return descs[cat.id] || ''
}

function catNameById(id) {
  const c = activeCategories.value.find(x => x.id === id)
  return c ? catName(c) : '—'
}
function spentForCategory(catId) {
  return store.totalForCategory(catId, getCurrentMonthYear())
}
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

function planProgressWidth(cat) {
  const yb = store.yearlyAmount(cat)
  if (!yb || yb <= 0) return 0
  return Math.min(100, (store.yearlyTotalForCategory(cat.id) / yb) * 100)
}
function planProgressVariant(cat) {
  const yb = store.yearlyAmount(cat)
  if (!yb || yb <= 0) return ''
  const pct = (store.yearlyTotalForCategory(cat.id) / yb) * 100
  if (pct > 100) return 'danger'
  if (pct > 75) return 'warning'
  return 'success'
}

const principleItems = computed(() => [
  t('expenses.principle1'),
  t('expenses.principle2'),
  t('expenses.principle3'),
  t('expenses.principle4'),
  t('expenses.principle5')
])

const filteredExpenses = computed(() => {
  const list = [...store.expenses].sort((a, b) => b.expense_date > a.expense_date ? 1 : -1)
  if (categoryFilter.value === 'all') return list
  return list.filter(e => e.category_id === categoryFilter.value)
})

async function remove(exp) {
  if (!confirm('Adakah anda pasti ingin menghapuskan rekod ini?')) return
  await store.removeExpense(exp.id)
  toast.success('Rekod dihapuskan')
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
  toast.success('Perbelanjaan ditambah')
  showAdd.value = false
}
</script>

<style scoped>
/* ===== Section spacing ===== */
.expenses-section {
  margin-bottom: var(--space-8);
}
.section-heading {
  font-size: var(--text-lg);
  margin: 0 0 var(--space-4);
}

/* ===== Pelan Perbelanjaan Jangka Panjang ===== */
.plan-info {
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
}
.plan-info p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}
.plan-card {
  padding: var(--space-4);
}
.plan-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.plan-pct {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-accent);
  flex-shrink: 0;
}
.plan-yearly {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  text-align: right;
  white-space: nowrap;
}
.plan-card-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}
.plan-card-desc {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-3);
  line-height: 1.5;
}
.plan-card-spent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1);
}

/* ===== Budget tracker ===== */
.budget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-4);
}
.budget-card-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.budget-card-stats {
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
  margin-bottom: var(--space-3);
}
.budget-spent {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}
.budget-limit {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

/* ===== Prinsip ===== */
.principles-list {
  padding: var(--space-4);
}
.principles-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.principles-list li {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding-left: var(--space-5);
  position: relative;
  line-height: 1.5;
}
.principles-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: var(--font-bold);
}

/* ===== Ledger ===== */
.filter-row {
  margin-bottom: var(--space-4);
}
.ledger-wrap {
  overflow-x: auto;
}
.cell-amount {
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  white-space: nowrap;
}
.cell-date {
  white-space: nowrap;
  font-size: var(--text-xs);
}
.cell-desc {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== Responsive ===== */
@media (max-width: 767px) {
  .plan-grid {
    grid-template-columns: 1fr;
  }
  .plan-card-header {
    flex-wrap: wrap;
  }
  .plan-yearly {
    white-space: normal;
    text-align: left;
  }

  .budget-grid {
    grid-template-columns: 1fr;
  }

  .cell-desc {
    max-width: 120px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .plan-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .budget-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.mt-2 { margin-top: var(--space-2); }
</style>
