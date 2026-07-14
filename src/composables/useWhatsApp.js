import { ref, computed } from 'vue'
import { MONTHS_BM, TOTAL_HOUSES } from '@/lib/constants'

export function useWhatsApp(locale = 'bm') {
  const copied = ref(false)

  function generateReminder(unpaidHouses, monthYear) {
    const [year, month] = monthYear.split('-')
    const monthName = locale === 'bm'
      ? MONTHS_BM[parseInt(month, 10) - 1]
      : ['January','February','March','April','May','June','July','August','September','October','November','December'][parseInt(month, 10) - 1]
    const greeting = locale === 'bm'
      ? `Salam sejahtera penduduk Taman Langat Utama 2.`
      : `Greetings residents of Taman Langat Utama 2.`
    const body = locale === 'bm'
      ? `Berikut adalah rumah yang belum menjelaskan yuran RM20 untuk bulan ${monthName} ${year}:`
      : `The following houses have not paid the RM20 fee for ${monthName} ${year}:`
    const houses = unpaidHouses.map(h => h.house_number).join(', ')
    const closing = locale === 'bm'
      ? `Sila buat pembayaran melalui app E-Komuniti atau hubungi Bendahari.\n\nTerima kasih atas kerjasama anda.`
      : `Please pay via the E-Komuniti app or contact the Treasurer.\n\nThank you for your cooperation.`
    const houseIcon = `\u{1F3D8}\uFE0F`
    const redIcon = `\u{1F534}`
    const thanksIcon = `\u{1F64F}`
    return `${houseIcon} Peringatan Yuran Bulanan — ${monthName} ${year}\n\n${greeting}\n\n${body}\n\n${redIcon} ${houses}\n\n${closing} ${thanksIcon}`
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
    } catch (e) {
      copied.value = false
    }
  }

  function openWhatsApp(text) {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return { generateReminder, copyToClipboard, openWhatsApp, copied }
}
