<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">{{ $t('expenses.title') }}</h1>
      <button class="btn btn-primary" @click="openAdd">{{ $t('expenses.addExpense') }}</button>
    </div>

    <!-- Category budget tracker -->
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

    <!-- Expense ledger -->
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
            <td>{{ e.expense_date }}</td>
            <td class="cell-amount">RM {{ e.amount.toFixed(2) }}</td>
            <td>{{ e.description }}</td>
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

const { locale } = useI18n()
const store = useExpensesStore()
const toast = useToast()

const categoryFilter = ref('all')
const activeCategories = computed(() => store.allCategories)

function catName(cat) { return locale.value === 'bm' ? cat.name_bm : cat.name_en }
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
.section-heading {
  font-size: var(--text-lg);
  margin: var(--space-6) 0 var(--space-4);
}
.budget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-4);
}
.budget-card-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}
.budget-card-stats {
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
  margin-bottom: var(--space-3);
}
.budget-spent { font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--color-text-primary); }
.budget-limit { font-size: var(--text-sm); color: var(--color-text-tertiary); }

.filter-row { margin-bottom: var(--space-4); }
.ledger-wrap { overflow-x: auto; }
.cell-amount { font-weight: var(--font-semibold); color: var(--color-text-primary); }
</style>
