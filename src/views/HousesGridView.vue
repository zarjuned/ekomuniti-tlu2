<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">{{ $t('houses.title') }}</h1>
    </div>

    <div class="filter-bar">
      <SearchBar v-model="query" :placeholder="$t('houses.search')" />
      <div class="filter-chips">
        <button class="chip" :class="{ active: filter === 'all' }" @click="filter = 'all'">{{ $t('houses.showAll') }}</button>
        <button class="chip" :class="{ active: filter === 'unpaid' }" @click="filter = 'unpaid'">{{ $t('houses.unpaidCurrent') }}</button>
        <button class="chip" :class="{ active: filter === 'arrears' }" @click="filter = 'arrears'">{{ $t('houses.hasArrears') }}</button>
      </div>
    </div>

    <div class="house-grid">
      <div
        v-for="h in filteredHouses" :key="h.id"
        class="house-card"
        :class="{ selected: selectedId === h.id }"
        @click="openDetail(h)"
      >
        <div class="house-num">{{ h.house_number }}</div>
        <StatusDot :status="statusFor(h.id)" showLabel />
        <div v-if="arrearsFor(h.id) > 0" class="house-arrears">
          {{ $t('houses.arrears') }}: RM{{ arrearsFor(h.id) }}
        </div>
      </div>
      <EmptyState v-if="filteredHouses.length === 0" :title="$t('common.noData')" />
    </div>

    <!-- Slide-out detail -->
    <Transition name="slide-right">
      <div v-if="selectedHouse" class="detail-drawer">
        <div class="drawer-header">
          <h2>{{ selectedHouse.house_number }}</h2>
          <button class="btn btn-ghost" @click="selectedId = null">✕</button>
        </div>
        <div class="drawer-body">
          <div class="info-row">
            <span class="info-label">{{ $t('houses.owner') }}</span>
            <span class="info-value">{{ selectedHouse.owner_name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('houses.phone') }}</span>
            <span class="info-value">{{ selectedHouse.phone }}</span>
          </div>
          <h3 class="drawer-subtitle">{{ $t('houses.paymentHistory') }}</h3>
          <div class="timeline">
            <div v-for="m in monthTimeline" :key="m" class="timeline-item">
              <span class="timeline-month">{{ formatMonthYear(m, locale) }}</span>
              <StatusDot :status="statusForMonth(selectedHouse.id, m)" showLabel />
            </div>
          </div>
          <div class="drawer-actions" v-if="isAdmin">
            <button class="btn btn-secondary btn-sm">{{ $t('houses.edit') }}</button>
            <button class="btn btn-ghost btn-sm">{{ $t('houses.resetPin') }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHousesStore } from '@/stores/houses'
import { usePaymentsStore } from '@/stores/payments'
import { useAuthStore } from '@/stores/auth'
import { getCurrentMonthYear, getMonthsAgo, formatMonthYear } from '@/lib/utils'
import { useI18n } from 'vue-i18n'
import SearchBar from '@/components/common/SearchBar.vue'
import StatusDot from '@/components/common/StatusDot.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const { locale } = useI18n()
const houses = useHousesStore()
const payments = usePaymentsStore()
const auth = useAuthStore()

const query = ref('')
const filter = ref('all')
const selectedId = ref(null)
const isAdmin = computed(() => auth.isAdmin)

const currentMonth = getCurrentMonthYear()

const searchResults = computed(() => houses.search(query.value))

const filteredHouses = computed(() => {
  let list = searchResults.value
  if (filter.value === 'unpaid') {
    list = list.filter(h => payments.statusForHouseMonth(h.id, currentMonth) === 'unpaid')
  } else if (filter.value === 'arrears') {
    list = list.filter(h => arrearsFor(h.id) > 0)
  }
  return list
})

const selectedHouse = computed(() => selectedId.value ? houses.findHouse(selectedId.value) : null)

function openDetail(h) { selectedId.value = h.id }

function statusFor(houseId) {
  return payments.statusForHouseMonth(houseId, currentMonth)
}

function statusForMonth(houseId, my) {
  return payments.statusForHouseMonth(houseId, my)
}

function arrearsFor(houseId) {
  // Count months unpaid (last 12 months)
  let count = 0
  for (let i = 0; i < 6; i++) {
    const my = getMonthsAgo(i)
    const s = payments.statusForHouseMonth(houseId, my)
    if (s === 'unpaid') count++
  }
  return count * 20
}

const monthTimeline = computed(() => {
  const arr = []
  for (let i = 0; i < 12; i++) arr.push(getMonthsAgo(i))
  return arr
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}
.filter-chips { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.chip {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  transition: all 0.2s;
}
.chip.active {
  background: var(--color-accent-primary);
  color: #fff;
  border-color: var(--color-accent-primary);
}
.chip:hover:not(.active) { background: var(--color-bg-elevated); color: var(--color-text-primary); }

.house-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--space-3);
}
@media (max-width: 1439px) { .house-grid { grid-template-columns: repeat(6, 1fr); } }
@media (max-width: 1023px) { .house-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 767px) { .house-grid { grid-template-columns: repeat(3, 1fr); } }

.house-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-height: 96px;
}
.house-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-accent-primary);
  box-shadow: var(--shadow-md);
}
.house-card.selected { border-color: var(--color-accent-primary); background: rgba(99, 102, 241, 0.1); }
.house-num { font-weight: var(--font-bold); font-size: var(--text-base); color: var(--color-text-primary); }
.house-arrears { font-size: var(--text-xs); color: var(--color-danger); font-weight: var(--font-medium); }

.detail-drawer {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 400px; max-width: 100vw;
  background: var(--color-bg-secondary);
  border-left: 1px solid var(--color-border);
  box-shadow: -20px 0 40px rgba(0,0,0,0.4);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.drawer-header {
  padding: var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}
.drawer-body { padding: var(--space-5); }
.info-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--text-sm);
}
.info-label { color: var(--color-text-secondary); }
.info-value { color: var(--color-text-primary); font-weight: var(--font-medium); }
.drawer-subtitle {
  margin-top: var(--space-5);
  margin-bottom: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}
.timeline { display: flex; flex-direction: column; gap: var(--space-2); }
.timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  font-size: var(--text-sm);
  border-bottom: 1px solid var(--color-border);
}
.timeline-month { color: var(--color-text-secondary); }
.drawer-actions {
  margin-top: var(--space-5);
  display: flex;
  gap: var(--space-2);
}
</style>
