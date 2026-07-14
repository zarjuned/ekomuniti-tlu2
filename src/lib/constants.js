export const TOTAL_HOUSES = 64
export const MONTHLY_FEE = 20
export const RECEIPT_PREFIX = 'TLU2'
export const MAX_IMAGE_SIZE_KB = 50

export const ADMIN_ROLES = {
  PENGERUSI: 'pengerusi',
  BENDAHARI: 'bendahari',
  SETIAUSAHA: 'setiausaha',
  AJK: 'ajk'
}

export const ROLE_LABELS = {
  pengerusi: { bm: 'Pengerusi', en: 'Chairman' },
  bendahari: { bm: 'Bendahari', en: 'Treasurer' },
  setiausaha: { bm: 'Setiausaha', en: 'Secretary' },
  ajk: { bm: 'Ahli Jawatankuasa', en: 'Committee Member' },
  resident: { bm: 'Penduduk', en: 'Resident' }
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

export const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer'
}

export const EXPENSE_PHASES = {
  SEBELUM: 'sebelum',
  SEMASA: 'semasa',
  SELEPAS: 'selepas',
  OPERASI: 'operasi'
}

export const MONTHS_BM = [
  'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
  'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
]

export const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
