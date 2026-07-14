import { RECEIPT_PREFIX } from '@/lib/constants'

let counter = 42

export function useReceipt() {
  function generateReceiptNumber() {
    counter++
    return `${RECEIPT_PREFIX}-${String(counter).padStart(4, '0')}`
  }

  function createReceipt(payment) {
    return {
      receiptNumber: generateReceiptNumber(),
      houseNumber: payment.house_number || 'N/A',
      amount: payment.amount,
      monthYear: payment.month_year,
      method: payment.payment_method,
      date: new Date().toISOString()
    }
  }

  function getQRCodeUrl(receiptNumber) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(receiptNumber)}`
  }

  return { generateReceiptNumber, createReceipt, getQRCodeUrl }
}
