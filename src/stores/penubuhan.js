import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { EXPENSE_PHASES } from '@/lib/constants'

const SETUP_ITEMS = [
  { id: 'setup-1', phase: 'sebelum', item_bm: 'Makan Minum Mesyuarat', item_en: 'Meeting Catering', estimated: 150, actual: 140, status: 'done' },
  { id: 'setup-2', phase: 'sebelum', item_bm: 'Cetakan Log & Borang', item_en: 'Logbooks & Forms', estimated: 50, actual: 45, status: 'done' },
  { id: 'setup-3', phase: 'sebelum', item_bm: 'Pembelian White Board', item_en: 'Whiteboard', estimated: 80, actual: 75, status: 'done' },
  { id: 'setup-4', phase: 'selepas', item_bm: 'Cop Rasmi Persatuan', item_en: 'Official Stamps', estimated: 100, actual: 90, status: 'pending' },
  { id: 'setup-5', phase: 'selepas', item_bm: 'Banner Penubuhan', item_en: 'Notification Banner', estimated: 150, actual: 0, status: 'pending' },
  { id: 'setup-6', phase: 'selepas', item_bm: 'Yuran e-ROSES', item_en: 'e-ROSES Fee', estimated: 30, actual: 0, status: 'pending' },
  { id: 'setup-7', phase: 'selepas', item_bm: 'Cop Dokumen Perlembagaan', item_en: 'Constitution Stamping', estimated: 100, actual: 0, status: 'pending' }
]

export const usePenubuhanStore = defineStore('penubuhan', () => {
  const items = ref([...SETUP_ITEMS])

  const totalEstimated = computed(() => items.value.reduce((s, i) => s + i.estimated, 0))
  const totalActual = computed(() => items.value.reduce((s, i) => s + i.actual, 0))
  const savings = computed(() => totalEstimated.value - totalActual.value)

  function forPhase(phase) {
    return items.value.filter(i => i.phase === phase)
  }

  function updateItem(id, updates) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value[idx] = { ...items.value[idx], ...updates }
  }

  const currentPhase = ref(EXPENSE_PHASES.SEBELUM)

  return {
    items, currentPhase,
    totalEstimated, totalActual, savings,
    forPhase, updateItem
  }
})
