<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">{{ $t('attendance.title') }}</h1>
    </div>

    <!-- Forms hub grid -->
    <h2 class="section-heading">{{ $t('attendance.forms') }}</h2>
    <div class="forms-grid">
      <div class="glass-card glass-card-hover form-card" @click="openAttendance = true">
        <div class="form-icon">📋</div>
        <h3 class="form-title">{{ $t('attendance.attendanceForm') }}</h3>
        <p class="text-secondary text-xs">Digital check-in for meetings</p>
      </div>
      <div class="glass-card glass-card-hover form-card" @click="openRegistration = true">
        <div class="form-icon">👥</div>
        <h3 class="form-title">{{ $t('attendance.registrationForm') }}</h3>
        <p class="text-secondary text-xs">ROS member registration</p>
      </div>
      <div class="glass-card glass-card-hover form-card">
        <div class="form-icon">📜</div>
        <h3 class="form-title">{{ $t('attendance.constitution') }}</h3>
        <p class="text-secondary text-xs">Association rules document</p>
      </div>
    </div>

    <!-- Attendance log (for current AGM) -->
    <h2 class="section-heading">{{ $t('attendance.attendanceForm') }}</h2>
    <div class="glass-card">
      <div class="attendance-stats">
        <div>
          <span class="text-xs text-secondary">Hadir</span>
          <div class="stat-value">{{ attendance.presentCount }} / 64</div>
        </div>
        <div>
          <span class="text-xs text-secondary">Peratusan</span>
          <div class="stat-value">{{ attendance.attendanceRate }}%</div>
        </div>
        <BaseBadge :variant="attendance.quorumReached ? 'success' : 'warning'">
          {{ attendance.quorumReached ? $t('penubuhan.quorum') : $t('penubuhan.noQuorum') }}
        </BaseBadge>
      </div>
      <div class="attendance-grid">
        <button
          v-for="i in 64" :key="i"
          class="attendance-cell"
          :class="{ present: attendance.isPresent('house-' + i) }"
          :disabled="attendance.isPresent('house-' + i)"
          @click="doCheckIn(i)"
        >
          <span class="cell-num">{{ i }}</span>
        </button>
      </div>
    </div>

    <!-- Registration form modal -->
    <BaseModal v-model="openRegistration" :title="$t('attendance.registrationForm')">
      <form @submit.prevent="submitRegistration">
        <div class="form-group">
          <label class="form-label">Nama</label>
          <input v-model="regName" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="form-label">No IC (12 digit)</label>
          <input v-model="regIC" class="form-input" pattern="[0-9]{12}" maxlength="12" required />
        </div>
        <div class="form-group">
          <label class="form-label">No Telefon</label>
          <input v-model="regPhone" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Emel</label>
          <input v-model="regEmail" type="email" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">No Rumah</label>
          <select v-model="regHouse" class="form-select" required>
            <option v-for="i in 64" :key="i" :value="i">No. {{ i }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label"><input v-model="regAgree" type="checkbox" required /> Saya bersetuju dengan perlembagaan persatuan</label>
        </div>
        <div style="display:flex; gap:var(--space-2); justify-content:flex-end;">
          <button type="button" class="btn btn-ghost" @click="openRegistration = false">{{ $t('common.cancel') }}</button>
          <button type="submit" class="btn btn-primary">{{ $t('common.save') }}</button>
        </div>
      </form>
    </BaseModal>

    <!-- Attendance form modal -->
    <BaseModal v-model="openAttendance" :title="$t('attendance.attendanceForm')">
      <p class="text-secondary mb-4">Tap on a house to mark as present for the current meeting.</p>
      <p class="text-center text-success font-semibold">{{ attendance.presentCount }} / 64 hadir</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useHousesStore } from '@/stores/houses'
import { useToast } from '@/composables/useToast'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const attendance = useAttendanceStore()
const houses = useHousesStore()
const toast = useToast()

const openAttendance = ref(false)
const openRegistration = ref(false)

const regName = ref('')
const regIC = ref('')
const regPhone = ref('')
const regEmail = ref('')
const regHouse = ref(1)
const regAgree = ref(false)

function doCheckIn(num) {
  const h = houses.findHouse(`house-${num}`)
  attendance.checkIn(`house-${num}`, h?.owner_name || `Penduduk No. ${num}`)
}

function submitRegistration() {
  if (regIC.value.length !== 12) {
    toast.error('No IC mestilah 12 digit')
    return
  }
  toast.success('Pendaftaran berjaya')
  openRegistration.value = false
  regName.value = ''; regIC.value = ''; regPhone.value = ''; regEmail.value = ''; regAgree.value = false
}
</script>

<style scoped>
.section-heading {
  font-size: var(--text-lg);
  margin: var(--space-6) 0 var(--space-4);
}

.forms-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}
@media (max-width: 767px) { .forms-grid { grid-template-columns: 1fr; } }

.form-card {
  cursor: pointer;
  text-align: center;
  padding: var(--space-6);
}
.form-icon { font-size: 40px; margin-bottom: var(--space-3); }
.form-title { font-size: var(--text-base); }

.attendance-stats {
  display: flex;
  gap: var(--space-5);
  align-items: center;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-4);
}
.stat-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.attendance-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--space-2);
}
@media (max-width: 1023px) { .attendance-grid { grid-template-columns: repeat(6, 1fr); } }
@media (max-width: 767px) { .attendance-grid { grid-template-columns: repeat(4, 1fr); } }

.attendance-cell {
  aspect-ratio: 1;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.attendance-cell:hover:not(:disabled) {
  background: var(--color-accent-primary);
  border-color: var(--color-accent-primary);
  color: #fff;
}
.attendance-cell.present {
  background: var(--color-success);
  border-color: var(--color-success);
  color: #fff;
}
.attendance-cell:disabled { cursor: default; }
.cell-num { font-weight: var(--font-bold); }
</style>
