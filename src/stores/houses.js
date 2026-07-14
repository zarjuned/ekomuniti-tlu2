import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TOTAL_HOUSES } from '@/lib/constants'

const RESIDENTS = {
  1:  'En Hamzah',
  2:  'Juned',
  5:  'Ain',
  6:  'Halim',
  7:  'Kamarul',
  8:  'Cikgu Dolah',
  9:  'Ravi',
  10: 'Shafinas',
  11: 'Adam',
  12: 'Shima',
  14: 'Amir',
  15: 'Kamil',
  16: 'Ashraf',
  17: 'Khairul',
  18: 'Rafizal',
  20: 'Wan',
  21: 'Ujang',
  22: 'Gunaseelan',
  23: 'Fauzan',
  24: 'Hasliza',
  25: 'Dayat',
  26: 'Nani',
  27: 'Faizal',
  28: 'Taufiq',
  29: 'Hana',
  30: 'Masrizal',
  31: 'Rosemeela',
  33: 'Nuridzwan'
}

const FALLBACK_NAMES = [
  'Ahmad bin Ismail', 'Siti Nurhaliza binti Tarudin', 'Mohd Zaki bin Ali', 'Noraini binti Othman',
  'Razak bin Hamid', 'Faridah binti Kassim', 'Hisham bin Dollah', 'Zaharah binti Ahmad',
  'Johari bin Mat Isa', 'Salbiah binti Hassan', 'Rashid bin Latiff', 'Azizah binti Dol',
  'Roslan bin Salleh', 'Haliza binti Ghazali', 'Ismail bin Yaakob', 'Marina binti Zainuddin',
  'Shakir bin Mokhtar', 'Fauziah binti Samad', 'Musa bin Lebai', 'Zubaidah binti Ismail',
  'Majid bin Yusof', 'Rohani binti Majid', 'Harun bin Seman', 'Hasnah binti Awang',
  'Bakar bin Din', 'Maznah binti Ariffin', 'Rahim bin Said', 'Saadiah binti Daud',
  'Leman bin Ali', 'Latifah binti Shafie', 'Suleiman bin Jantan', 'Aminah binti Sarip',
  'Din bin Mat', 'Kamariah binti Dolah', 'Ramli bin Tahir', 'Rokiah binti Puteh',
  'Omar bin Sudin', 'Samsiah binti Kadir', 'Daud bin Hamzah', 'Zainab binti Mamat',
  'Yusri bin Bakar', 'Norizan binti Ahmad', 'Halim bin Saad', 'Zakiah binti Darus',
  'Nasir bin Long', 'Jamilah binti Ishak', 'Azman bin Lebai Teh', 'Normah binti Hashim',
  'Sopian bin Manap', 'Kamsiah binti Awang', 'Hashim bin Abdullah', 'Salmiah binti Mohamad',
  'Ridzuan bin Hassan', 'Nurul binti Rahman', 'Kassim bin Selamat', 'Maimunah binti Sudin',
  'Wahid bin Osman',
  'Aminuddin bin Arshad', 'Fazlina binti Razak', 'Khairuddin bin Mat Zin', 'Sharifah binti Syed Omar',
  'Zamri bin Yusoff', 'Rohayu binti Sulaiman', 'Mansor bin Awang'
]

function generateHouses() {
  const houses = []
  for (let i = 1; i <= TOTAL_HOUSES; i++) {
    houses.push({
      id: `house-${i}`,
      house_number: `No. ${i}`,
      owner_name: RESIDENTS[i] || FALLBACK_NAMES[i - 1] || `Penduduk No. ${i}`,
      phone: `01${Math.floor(10000000 + Math.random() * 89999999)}`,
      pin_hash: '$2b$10$mockHashForPIN1234',
      address: `Jalan Langat Utama 2/${((i - 1) % 4) + 1}`,
      status: 'active',
      created_at: '2026-01-01T00:00:00Z'
    })
  }
  return houses
}

export const useHousesStore = defineStore('houses', () => {
  const houses = ref(generateHouses())
  const selectedHouseId = ref(null)

  const byNumber = computed(() => {
    const map = {}
    houses.value.forEach(h => { map[h.house_number] = h })
    return map
  })

  const housesCount = computed(() => houses.value.length)

  function findHouse(id) {
    return houses.value.find(h => h.id === id)
  }

  function search(query) {
    if (!query) return houses.value
    const q = query.toLowerCase()
    return houses.value.filter(h =>
      h.house_number.toLowerCase().includes(q) ||
      h.owner_name.toLowerCase().includes(q)
    )
  }

  function updateHouse(id, updates) {
    const idx = houses.value.findIndex(h => h.id === id)
    if (idx !== -1) {
      houses.value[idx] = { ...houses.value[idx], ...updates }
    }
  }

  return { houses, byNumber, housesCount, selectedHouseId, findHouse, search, updateHouse }
})
