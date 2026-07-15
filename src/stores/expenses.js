import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCurrentMonthYear, getMonthsAgo } from '@/lib/utils'

const YEARLY_TOTAL = 9600
const MONTHLY_TOTAL = 800

const MOCK_CATEGORIES = [
  { id: 'cat-1', name_bm: 'Dana Kebajikan & Bantuan Kecemasan', name_en: 'Welfare & Emergency Aid Fund', monthly_budget: 240, yearly_pct: 30, phase: 'operasi', is_active: true },
  { id: 'cat-2', name_bm: 'Khairat Kematian', name_en: 'Death Benevolence Fund', monthly_budget: 160, yearly_pct: 20, phase: 'operasi', is_active: true },
  { id: 'cat-3', name_bm: 'Program Komuniti & Perpaduan', name_en: 'Community & Unity Programmes', monthly_budget: 120, yearly_pct: 15, phase: 'operasi', is_active: true },
  { id: 'cat-4', name_bm: 'Penyelenggaraan Kemudahan Awam', name_en: 'Public Facilities Maintenance', monthly_budget: 120, yearly_pct: 15, phase: 'operasi', is_active: true },
  { id: 'cat-5', name_bm: 'Pentadbiran Persatuan', name_en: 'Association Administration', monthly_budget: 80, yearly_pct: 10, phase: 'operasi', is_active: true },
  { id: 'cat-6', name_bm: 'Dana Simpanan/Kecemasan', name_en: 'Savings/Emergency Fund', monthly_budget: 80, yearly_pct: 10, phase: 'operasi', is_active: true }
]

const now = getCurrentMonthYear()
const MOCK_EXPENSES = [
  { id: 'exp-1', amount: 200, category_id: 'cat-1', description: 'Bantuan kepada keluarga memerlukan', receipt_image_url: null, expense_date: `${now}-05`, created_by: 'adm-2', created_at: `${now}-05T09:00:00Z` },
  { id: 'exp-2', amount: 80, category_id: 'cat-3', description: 'Gotong-royong perdana', receipt_image_url: null, expense_date: `${now}-10`, created_by: 'adm-2', created_at: `${now}-10T14:00:00Z` },
  { id: 'exp-3', amount: 60, category_id: 'cat-5', description: 'Alat tulis & percetakan borang', receipt_image_url: null, expense_date: `${now}-12`, created_by: 'adm-3', created_at: `${now}-12T11:00:00Z` },
  { id: 'exp-4', amount: 100, category_id: 'cat-4', description: 'Baiki papan tanda & cat kemudahan awam', receipt_image_url: null, expense_date: `${now}-18`, created_by: 'adm-2', created_at: `${now}-18T16:00:00Z` },
  { id: 'exp-5', amount: 150, category_id: 'cat-2', description: 'Sumbangan khairat kematian ahli', receipt_image_url: null, expense_date: `${now}-20`, created_by: 'adm-1', created_at: `${now}-20T19:00:00Z` }
]

export const useExpensesStore = defineStore('expenses', () => {
  const expenses = ref([...MOCK_EXPENSES])
  const categories = ref([...MOCK_CATEGORIES])
  const loading = ref(false)

  const allCategories = computed(() => categories.value.filter(c => c.is_active))
  const yearlyTotal = computed(() => YEARLY_TOTAL)
  const monthlyTotal = computed(() => MONTHLY_TOTAL)

  function categoryName(cat, locale = 'bm') {
    return locale === 'bm' ? cat.name_bm : cat.name_en
  }

  function yearlyAmount(cat) {
    return (cat.yearly_pct / 100) * YEARLY_TOTAL
  }

  function forCategory(catId) {
    return expenses.value.filter(e => e.category_id === catId)
  }

  function totalForCategory(catId, monthYear = null) {
    return forCategory(catId)
      .filter(e => !monthYear || e.expense_date.startsWith(monthYear))
      .reduce((sum, e) => sum + e.amount, 0)
  }

  function totalExpense(monthYear = null) {
    return expenses.value
      .filter(e => !monthYear || e.expense_date.startsWith(monthYear))
      .reduce((sum, e) => sum + e.amount, 0)
  }

  function yearlyTotalSpent() {
    return expenses.value.reduce((sum, e) => sum + e.amount, 0)
  }

  function yearlyTotalForCategory(catId) {
    return forCategory(catId).reduce((sum, e) => sum + e.amount, 0)
  }

  function monthlyTotals(monthsCount = 6) {
    const result = []
    for (let i = monthsCount - 1; i >= 0; i--) {
      const my = getMonthsAgo(i)
      result.push({
        monthYear: my,
        total: totalExpense(my)
      })
    }
    return result
  }

  async function addExpense({ amount, category_id, description, expense_date }) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 200))
      const exp = {
        id: `exp-${Date.now()}`,
        amount,
        category_id,
        description,
        receipt_image_url: null,
        expense_date,
        created_by: 'adm-2',
        created_at: new Date().toISOString()
      }
      expenses.value.unshift(exp)
      return exp
    } finally {
      loading.value = false
    }
  }

  async function removeExpense(id) {
    const idx = expenses.value.findIndex(e => e.id === id)
    if (idx !== -1) {
      expenses.value.splice(idx, 1)
      await new Promise(r => setTimeout(r, 200))
    }
  }

  return {
    expenses, categories, loading, allCategories,
    yearlyTotal, monthlyTotal,
    categoryName, yearlyAmount, forCategory, totalForCategory, totalExpense,
    yearlyTotalSpent, yearlyTotalForCategory, monthlyTotals,
    addExpense, removeExpense
  }
})
