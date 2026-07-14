import { ref } from 'vue'

export function useExport() {
  const generating = ref(false)

  function exportCSV(data, filename, columns = null) {
    generating.value = true
    try {
      const cols = columns || (data.length > 0 ? Object.keys(data[0]) : [])
      const header = cols.join(',')
      const rows = data.map(row =>
        cols.map(c => {
          const val = row[c]
          const str = val === null || val === undefined ? '' : String(val)
          return str.includes(',') ? `"${str}"` : str
        }).join(',')
      )
      const csv = [header, ...rows].join('\n')
      const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      generating.value = false
    }
  }

  async function exportPDF(elementId, filename) {
    generating.value = true
    try {
      // html2pdf needs to be dynamically imported
      const html2pdf = (await import('html2pdf.js')).default
      const element = document.getElementById(elementId)
      await html2pdf().set({
        margin: 10,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(element).save()
    } finally {
      generating.value = false
    }
  }

  return { exportCSV, exportPDF, generating }
}
