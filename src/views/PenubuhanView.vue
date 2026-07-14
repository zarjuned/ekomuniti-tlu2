<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">{{ $t('penubuhan.title') }}</h1>
    </div>

    <!-- Phase stepper -->
    <div class="stepper">
      <div
        v-for="(phase, idx) in phases" :key="phase.key"
        class="step"
        :class="{ active: currentPhase === phase.key, done: idx < currentPhaseIndex }"
        @click="currentPhase = phase.key"
      >
        <div class="step-num">{{ idx + 1 }}</div>
        <div class="step-label">{{ phase.label }}</div>
      </div>
      <div class="step-line"></div>
    </div>

    <!-- Attendance block -->
    <div class="penubuhan-grid">
      <div class="glass-card">
        <h2 class="section-title">{{ $t('penubuhan.attendance') }}</h2>
        <p class="text-sm text-secondary mb-4">{{ $t('penubuhan.tapToCheckin') }}</p>
        <div class="attendance-counter">
          <span class="counter-value">{{ attendance.presentCount }} / 64</span>
          <BaseBadge :variant="attendance.quorumReached ? 'success' : 'warning'">
            {{ attendance.quorumReached ? $t('penubuhan.quorum') : $t('penubuhan.noQuorum') }}
          </BaseBadge>
        </div>
        <div class="mini-house-grid">
          <button
            v-for="i in 64" :key="i"
            class="mini-house"
            :class="{ present: attendance.isPresent('house-' + i) }"
            :disabled="attendance.isPresent('house-' + i)"
            @click="checkIn(i)"
          >
            {{ i }}
          </button>
        </div>
      </div>

      <!-- Setup costs table -->
      <div class="glass-card">
        <h2 class="section-title">{{ $t('penubuhan.setupCosts') }}</h2>
        <div class="summary-row">
          <div>
            <span class="text-secondary text-xs">{{ $t('penubuhan.estimated') }}</span>
            <div class="summary-value">RM {{ penubuhan.totalEstimated }}</div>
          </div>
          <div>
            <span class="text-secondary text-xs">{{ $t('penubuhan.actual') }}</span>
            <div class="summary-value">RM {{ penubuhan.totalActual }}</div>
          </div>
          <div class="savings-block">
            <span class="text-secondary text-xs">{{ $t('penubuhan.digitalSavings') }}</span>
            <div class="summary-value text-success">RM {{ penubuhan.savings }}</div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>{{ $t('penubuhan.estimated') }}</th>
              <th>{{ $t('penubuhan.actual') }}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentItems" :key="item.id">
              <td>{{ locale === 'bm' ? item.item_bm : item.item_en }}</td>
              <td>RM {{ item.estimated }}</td>
              <td>RM {{ item.actual }}</td>
              <td>
                <BaseBadge :variant="item.status === 'done' ? 'success' : 'warning'">{{ item.status }}</BaseBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePenubuhanStore } from '@/stores/penubuhan'
import { useAttendanceStore } from '@/stores/attendance'
import BaseBadge from '@/components/common/BaseBadge.vue'

const { t, locale } = useI18n()
const penubuhan = usePenubuhanStore()
const attendance = useAttendanceStore()

const phases = computed(() => [
  { key: 'sebelum', label: t('penubuhan.phase1') },
  { key: 'semasa', label: t('penubuhan.phase2') },
  { key: 'selepas', label: t('penubuhan.phase3') }
])

const currentPhase = ref('sebelum')
const currentPhaseIndex = computed(() => phases.value.findIndex(p => p.key === currentPhase.value))

const currentItems = computed(() => penubuhan.forPhase(currentPhase.value))

function checkIn(num) {
  attendance.checkIn(`house-${num}`, `Penduduk No. ${num}`)
}
</script>

<style scoped>
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  position: relative;
  margin-bottom: var(--space-6);
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  z-index: 1;
  padding: 0 var(--space-4);
}
.step-num {
  width: 40px; height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-bg-tertiary);
  border: 2px solid var(--color-border);
  display: flex; align-items: center; justify-content: center;
  font-weight: var(--font-bold);
  color: var(--color-text-secondary);
  transition: all 0.3s;
}
.step.active .step-num { background: var(--color-accent-primary); border-color: var(--color-accent-primary); color: #fff; }
.step.done .step-num { background: var(--color-success); border-color: var(--color-success); color: #fff; }
.step-label { color: var(--color-text-secondary); font-size: var(--text-sm); }

.penubuhan-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
@media (max-width: 1023px) { .penubuhan-grid { grid-template-columns: 1fr; } }

.section-title {
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
}

.attendance-counter {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.counter-value { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--color-text-primary); }

.mini-house-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--space-2);
}
@media (max-width: 1023px) { .mini-house-grid { grid-template-columns: repeat(6, 1fr); } }
@media (max-width: 767px) { .mini-house-grid { grid-template-columns: repeat(4, 1fr); } }

.mini-house {
  aspect-ratio: 1;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.mini-house:hover:not(:disabled) {
  background: var(--color-accent-primary);
  color: #fff;
  border-color: var(--color-accent-primary);
}
.mini-house.present {
  background: var(--color-success);
  color: #fff;
  border-color: var(--color-success);
  cursor: default;
}
.mini-house:disabled { opacity: 0.7; }

.summary-row {
  display: flex;
  gap: var(--space-5);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-3);
}
.summary-value { font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--color-text-primary); }
</style>
