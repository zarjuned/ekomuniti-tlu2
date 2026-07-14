<template>
  <div class="page animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">{{ $t('reports.title') }}</h1>
    </div>

    <div class="reports-config glass-card">
      <div class="config-row">
        <div class="form-group">
          <label class="form-label">{{ $t('reports.reportType') }}</label>
          <select v-model="reportType" class="form-select">
            <option value="annual">{{ $t('reports.annual') }}</option>
            <option value="monthly">{{ $t('reports.monthly') }}</option>
            <option value="defaulters">{{ $t('reports.defaulters') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('reports.year') }}</label>
          <select v-model="year" class="form-select">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>
      <div class="config-actions">
        <button class="btn btn-primary" @click="exportPDF" :disabled="generating">
          {{ generating ? '...' : $t('reports.downloadPDF') }}
        </button>
        <button class="btn btn-secondary" @click="doPrint">{{ $t('reports.print') }}</button>
        <button class="btn btn-secondary" @click="doExportCSV">{{ $t('reports.exportCSV') }}</button>
      </div>
    </div>

    <!-- Live document preview -->
    <div class="preview-scroll">
      <div id="report-preview" class="report-preview">
        <div class="report-header">
          <h1>{{ settings.settings.association_name }}</h1>
          <p>No. Pendaftaran ROS: {{ settings.settings.ros_registration_number }}</p>
          <h2>{{ reportTitle }}</h2>
          <p>Tahun: {{ year }}</p>
        </div>

        <div v-if="reportType === 'annual'" class="report-section">
          <h3>Penyata Kewangan</h3>
          <table class="report-table">
            <tr><td>Kutipan Yuran</td><td>RM {{ totalIncome.toFixed(2) }}</td></tr>
            <tr><td>Jumlah Perbelanjaan</td><td>RM {{ totalExpense.toFixed(2) }}</td></tr>
            <tr class="total-row"><td><strong>Baki Akhir</strong></td><td><strong>RM {{ (totalIncome - totalExpense).toFixed(2) }}</strong></td></tr>
          </table>
          <h4 style="margin-top:20px;">Perbelanjaan Mengikut Kategori</h4>
          <table class="report-table">
            <tr v-for="cat in expenses.allCategories" :key="cat.id">
              <td>{{ locale === 'bm' ? cat.name_bm : cat.name_en }}</td>
              <td>RM {{ expenses.totalForCategory(cat.id).toFixed(2) }}</td>
            </tr>
          </table>
        </div>

        <div v-else-if="reportType === 'defaulters'" class="report-section">
          <h3>Senarai Tunggakan</h3>
          <p>Rumah yang belum menjelaskan yuran: RM 20 / bulan</p>
          <table class="report-table">
            <thead><tr><th>Rumah</th><th>Pemilik</th><th>Bulan Belum Bayar</th><th>Tunggakan (RM)</th></tr></thead>
            <tbody>
              <tr v-for="h in defaulterRows" :key="h.id">
                <td>{{ h.house_number }}</td>
                <td>{{ h.owner_name }}</td>
                <td>{{ h.unpaidCount }} bulan</td>
                <td>RM {{ h.arrears.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="report-section">
          <h3>Laporan Bulanan</h3>
          <table class="report-table">
            <tr><td>Bulan</td><td>Pendapatan (RM)</td><td>Perbelanjaan (RM)</td><td>Baki (RM)</td></tr>
            <tr v-for="m in monthlyData" :key="m.monthYear">
              <td>{{ formatMonthYear(m.monthYear, locale) }}</td>
              <td>{{ payments.totalApprovedForMonth(m.monthYear).toFixed(2) }}</td>
              <td>{{ expenses.totalExpense(m.monthYear).toFixed(2) }}</td>
              <td>{{ (payments.totalApprovedForMonth(m.monthYear) - expenses.totalExpense(m.monthYear)).toFixed(2) }}</td>
            </tr>
          </table>
        </div>

        <div class="report-footer">
          <p>Dijana secara automatik oleh E-Komuniti TLU2 pada {{ new Date().toLocaleString('ms-MY') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePaymentsStore } from '@/stores/payments'
import { useExpensesStore } from '@/stores/expenses'
import { useHousesStore } from '@/stores/houses'
import { useSettingsStore } from '@/stores/settings'
import { useExport } from '@/composables/useExport'
import { formatMonthYear, getCurrentMonthYear, getMonthsAgo } from '@/lib/utils'

const { locale } = useI18n()
const payments = usePaymentsStore()
const expenses = useExpensesStore()
const houses = useHousesStore()
const settings = useSettingsStore()
const { exportCSV, exportPDF, generating } = useExport()

const reportType = ref('annual')
const year = ref('2026')

const reportTitle = computed(() => {
  if (reportType.value === 'annual') return 'Penyata Kewangan Tahunan (AGM)'
  if (reportType.value === 'monthly') return 'Laporan Bulanan'
  return 'Senarai Tunggakan'
})

const totalIncome = computed(() => payments.approved.reduce((s, p) => s + p.amount, 0))
const totalExpense = computed(() => expenses.totalExpense())

const monthlyData = computed(() => {
  const arr = []
  for (let i = 11; i >= 0; i--) {
    const my = getMonthsAgo(i)
    arr.push({ monthYear: my })
  }
  return arr
})

const defaulterRows = computed(() => {
  return houses.houses.map(h => {
    let unpaidCount = 0
    for (let i = 0; i < 12; i++) {
      if (payments.statusForHouseMonth(h.id, getMonthsAgo(i)) === 'unpaid') unpaidCount++
    }
    return { id: h.id, house_number: h.house_number, owner_name: h.owner_name, unpaidCount, arrears: unpaidCount * 20 }
  }).filter(r => r.unpaidCount > 0)
})

function doPrint() { window.print() }

function doExportCSV() {
  let data
  if (reportType.value === 'defaulters') {
    data = defaulterRows.value.map(r => ({ Rumah: r.house_number, Pemilik: r.owner_name, Tunggakan: r.arrears }))
  } else {
    data = monthlyData.value.map(m => ({
      Bulan: formatMonthYear(m.monthYear, locale.value),
      Pendapatan: payments.totalApprovedForMonth(m.monthYear),
      Perbelanjaan: expenses.totalExpense(m.monthYear),
      Baki: payments.totalApprovedForMonth(m.monthYear) - expenses.totalExpense(m.monthYear)
    }))
  }
  exportCSV(data, `laporan-${reportType.value}-${year.value}`)
}
</script>

<style scoped>
.reports-config { margin-bottom: var(--space-5); }
.config-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
@media (max-width: 767px) { .config-row { grid-template-columns: 1fr; } }
.config-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-4); }

.preview-scroll { display: flex; justify-content: center; }
.report-preview {
  width: 210mm; max-width: 100%;
  background: #fff;
  color: #111;
  padding: 20mm;
  min-height: 297mm;
  box-shadow: var(--shadow-xl);
  font-family: 'Inter', sans-serif;
  font-size: 12pt;
}
.report-header { text-align: center; margin-bottom: 24pt; border-bottom: 2px solid #111; padding-bottom: 12pt; }
.report-header h1 { font-size: 18pt; color: #111; }
.report-header h2 { font-size: 14pt; color: #333; margin-top: 8pt; font-weight: 600; }
.report-header p { color: #555; font-size: 10pt; }
.report-section { margin-bottom: 24pt; }
.report-section h3 { font-size: 14pt; margin-bottom: 12pt; border-bottom: 1px solid #ddd; padding-bottom: 6pt; }
.report-section h4 { font-size: 12pt; margin-bottom: 6pt; color: #333; }
.report-table {
  width: 100%; border-collapse: collapse;
}
.report-table th, .report-table td {
  border: 1px solid #ddd; padding: 6pt 8pt; text-align: left; font-size: 11pt;
}
.report-table thead { background: #f5f5f5; }
.total-row { background: #fafafa; font-weight: 600; }
.report-footer {
  margin-top: 24pt;
  padding-top: 12pt;
  border-top: 1px solid #ccc;
  font-size: 9pt;
  color: #888;
  text-align: center;
}

@media print {
  body * { visibility: hidden; }
  #report-preview, #report-preview * { visibility: visible; }
  #report-preview { box-shadow: none; }
}
</style>
