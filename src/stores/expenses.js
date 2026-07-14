import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCurrentMonthYear, getMonthsAgo } from '@/lib/utils'

const MOCK_CATEGORIES = [
  { id: 'cat-1', name_bm: 'Yuran Kawalan Keselamatan', name_en: 'Security Guard Services', monthly_budget: 800, phase: 'operasi', is_active: true },
  { id: 'cat-2', name_bm: 'Penyelenggaraan Lampu Jalan', name_en: 'Street Light Maintenance', monthly_budget: 100, phase: 'operasi', is_active: true },
  { id: 'cat-3', name_bm: 'Kos Potong Rumput / Landskap', name_en: 'Grass Cutting & Landscaping', monthly_budget: 300, phase: 'operasi', is_active: true },
  { id: 'cat-4', name_bm: 'Sukaneka / Jamuan Penduduk', name_en: 'Community Events & Sports', monthly_budget: 0, phase: 'operasi', is_active: true },
  { id: 'cat-5', name_bm: 'Alat Tulis & Pentadbiran', name_en: 'Stationery & Admin Costs', monthly_budget: 50, phase: 'operasi', is_active: true },
  { id: 'cat-6', name_bm: 'Persiapan Makan Minum Mesyuarat', name_en: 'Meeting Catering & F&B', monthly_budget: 150, phase: 'sebelum', is_active: true },
  { id: 'cat-7', name_bm: 'Kos Cetakan Log & Borang', name_en: 'Logbooks & Forms Printing', monthly_budget: 50, phase: 'sebelum', is_active: true },
  { id: 'cat-8', name_bm: 'Yuran Pendaftaran e-ROSES', name_en: 'e-ROSES Registration Fee', monthly_budget: 30, phase: 'selepas', is_active: true },
  { id: 'cat-9', name_bm: 'Cop Rasmi Persatuan', name_en: 'Official Stamps', monthly_budget: 100, phase: 'selepas', is_active: true }
]

const now = getCurrentMonthYear()
const MOCK_EXPENSES = [
  { id: 'exp-1', amount: 800, category_id: 'cat-1', description: 'Bayaran kawalan keselamatan bulan ini', receipt_image_url: null, expense_date: `${now}-05`, created_by: 'adm-2', created_at: `${now}-05T09:00:00Z` },
  { id: 'exp-2', amount: 300, category_id: 'cat-3', description: 'Kos potong rumput taman', receipt_image_url: null, expense_date: `${now}-08`, created_by: 'adm-2', created_at: `${now}-08T14:00:00Z` },
  { id: 'exp-3', amount: 45, category_id: 'cat-5', description: 'Beli kertas A4 & pen', receipt_image_url: null, expense_date: `${now}-12`, created_by: 'adm-3', created_at: `${now}-12T11:00:00Z` },
  { id: 'exp-4', amount: 80, category_id: 'cat-2', description: 'Tukar mentol lampu jalan no.25', receipt_image_url: null, expense_date: `${now}-18`, created_by: 'adm-2', created_at: `${now}-18T16:00:00Z` },
  { id: 'exp-5', amount: 150, category_id: 'cat-6', description: 'Katering mesyuarat AJK', receipt_image_url: null, expense_date: `${now}-20`, created_by: 'adm-1', created_at: `${now}-20T19:00:00Z` },
  { id: 'exp-6', amount: 800, category_id: 'cat-1', description: 'Bayaran kawalan keselamatan bulan lepas', receipt_image_url: null, expense_date: `${getMonthsAgo(1)}-05`, created_by: 'adm-2', created_at: `${getMonthsAgo(1)}-05T09:00:00Z` },
  { id: 'exp-7', amount: 280, category_id: 'cat-3', description: 'Kos potong rumput taman (bulan lepas)', receipt_image_url: null, expense_date: `${getMonthsAgo(1)}-09`, created_by: 'adm-2', created_at: `${getMonthsAgo(1)}-09T14:00:00Z` },
  { id: 'exp-8', amount: 800, category_id: 'cat-1', description: 'Bayaran kawalan keselamatan 2 bulan lepas', receipt_image_url: null, expense_date: `${getMonthsAgo(2)}-05`, created_by: 'adm-2', created_at: `${getMonthsAgo(2)}-05T09:00:00Z` }
]

export const useExpensesStore = defineStore('expenses', () => {
  const expenses = ref([...MOCK_EXPENSES])
  const categories = ref([...MOCK_CATEGORIES])
  const loading = ref(false)

  const allCategories = computed(() => categories.value.filter(c => c.is_active))

  function categoryName(cat, locale = 'bm') {
    return locale === 'bm' ? cat.name_bm : cat.name_en
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
    categoryName, forCategory, totalForCategory, totalExpense, monthlyTotals,
    addExpense, removeExpense
  }
})
