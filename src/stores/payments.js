import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PAYMENT_STATUS, PAYMENT_METHODS, TOTAL_HOUSES } from '@/lib/constants'
import { getCurrentMonthYear, getMonthsAgo } from '@/lib/utils'

function generateMockPayments() {
  const payments = []
  const months = [getCurrentMonthYear(), getMonthsAgo(1), getMonthsAgo(2), getMonthsAgo(3)]
  let id = 1
  months.forEach((monthYear, monthIdx) => {
    for (let h = 1; h <= TOTAL_HOUSES; h++) {
      // Most houses paid, some pending in current month, some older have arrears
      let status = PAYMENT_STATUS.APPROVED
      if (monthIdx === 0) {
        // Current month: ~20 unpaid (houses 5, 12, 18, 22, 27, 31, 33, 38, 40, 42, 45, 47, 49, 51, 55, 57, 59, 60, 62, 64)
        const unpaidHouses = [5, 12, 18, 22, 27, 31, 33, 38, 40, 42, 45, 47, 49, 51, 55, 57, 59, 60, 62, 64]
        if (unpaidHouses.includes(h)) {
          if (h === 5 || h === 22 || h === 45) {
            status = PAYMENT_STATUS.PENDING
          } else {
            continue // No payment record
          }
        }
      } else if (monthIdx === 1) {
        // Previous month: all paid except 2 pending review
        if (h === 7 || h === 33) status = PAYMENT_STATUS.PENDING
      }
      payments.push({
        id: `pay-${id++}`,
        house_id: `house-${h}`,
        amount: 20,
        month_year: monthYear,
        payment_method: h % 5 === 0 ? PAYMENT_METHODS.CASH : PAYMENT_METHODS.BANK_TRANSFER,
        bank_reference: h % 5 !== 0 ? `MBB${Math.floor(100000000 + Math.random() * 899999999)}` : null,
        receipt_image_url: h % 3 === 0 ? `/mock-receipt-${id}.jpg` : null,
        status,
        notes: null,
        submitted_at: `${monthYear}-15T10:00:00Z`,
        reviewed_by: status === PAYMENT_STATUS.APPROVED ? 'adm-2' : null,
        reviewed_at: status === PAYMENT_STATUS.APPROVED ? `${monthYear}-16T12:00:00Z` : null
      })
    }
  })
  return payments
}

export const usePaymentsStore = defineStore('payments', () => {
  const payments = ref(generateMockPayments())
  const loading = ref(false)

  const pending = computed(() =>
    payments.value.filter(p => p.status === PAYMENT_STATUS.PENDING)
  )

  const approved = computed(() =>
    payments.value.filter(p => p.status === PAYMENT_STATUS.APPROVED)
  )

  function forHouse(houseId) {
    return payments.value
      .filter(p => p.house_id === houseId)
      .sort((a, b) => (b.submitted_at > a.submitted_at ? 1 : -1))
  }

  function forMonth(monthYear) {
    return payments.value.filter(p => p.month_year === monthYear)
  }

  function statusForHouseMonth(houseId, monthYear) {
    const p = payments.value.find(p => p.house_id === houseId && p.month_year === monthYear)
    return p ? p.status : 'unpaid'
  }

  function totalApprovedForMonth(monthYear) {
    return approved.value
      .filter(p => p.month_year === monthYear)
      .reduce((sum, p) => sum + p.amount, 0)
  }

  function countsForMonth(monthYear) {
    const mp = forMonth(monthYear)
    const paid = mp.filter(p => p.status === PAYMENT_STATUS.APPROVED).length
    const pendingCt = mp.filter(p => p.status === PAYMENT_STATUS.PENDING).length
    const unpaid = TOTAL_HOUSES - paid - pendingCt
    return { paid, pending: pendingCt, unpaid, total: TOTAL_HOUSES }
  }

  async function submitPayment({ houseId, monthYear, amount, method, bankRef }) {
    loading.value = true
    try {
      const existing = statusForHouseMonth(houseId, monthYear)
      if (existing === PAYMENT_STATUS.PENDING || existing === PAYMENT_STATUS.APPROVED) {
        throw new Error('duplicate')
      }
      const newPay = {
        id: `pay-${Date.now()}`,
        house_id: houseId,
        amount,
        month_year: monthYear,
        payment_method: method,
        bank_reference: bankRef,
        receipt_image_url: null,
        status: PAYMENT_STATUS.PENDING,
        notes: null,
        submitted_at: new Date().toISOString(),
        reviewed_by: null,
        reviewed_at: null
      }
      payments.value.unshift(newPay)
      await new Promise(r => setTimeout(r, 400))
      return newPay
    } finally {
      loading.value = false
    }
  }

  async function approvePayment(id, adminUserId) {
    const p = payments.value.find(x => x.id === id)
    if (p) {
      p.status = PAYMENT_STATUS.APPROVED
      p.reviewed_by = adminUserId
      p.reviewed_at = new Date().toISOString()
    }
  }

  async function rejectPayment(id, adminUserId) {
    const p = payments.value.find(x => x.id === id)
    if (p) {
      p.status = PAYMENT_STATUS.REJECTED
      p.reviewed_by = adminUserId
      p.reviewed_at = new Date().toISOString()
    }
  }

  return {
    payments, loading, pending, approved,
    forHouse, forMonth, statusForHouseMonth, totalApprovedForMonth, countsForMonth,
    submitPayment, approvePayment, rejectPayment
  }
})
