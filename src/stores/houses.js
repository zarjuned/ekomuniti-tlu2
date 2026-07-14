import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TOTAL_HOUSES } from '@/lib/constants'

const MOCK_NAMES = [
  'Ahmad bin Ali', 'Chong Wei Ming', 'Ramasamy a/l Muthu', 'Siti Aminah binti Yusuf',
  'Mohd Farhan bin Osman', 'Tan Ah Kow', 'Ganesan a/l Ravi', 'Nurul Huda binti Hasan',
  'Lim Boon Huat', 'Kamal bin Ismail', 'Priya a/p Suresh', 'Fatimah bt Abdullah',
  'Ong Chee Keong', 'Muthu a/l Arumugam', 'Zainab bt Ibrahim', 'Lee Mei Ling',
  'Rizal bin Hamid', 'Kavitha a/p Maniam', 'Chan Kok Leong', 'Nor Azlina bt Yusof',
  'Harjit Singh', 'Yap Ah Fook', 'Arun a/l Bala', 'Sharifah bt Ali',
  'Wong Chee Weng', 'Nasir bin Othman', 'Meenakshi a/p Pillai', 'Salmah bt Hassan',
  'Tan Kim Huat', 'Zulkifli bin Mat', 'Lakshmi a/p Ramu', 'Rohana bt Daud',
  'Leong Kok Weng', 'Shahrul bin Nizam', 'Amirah bt Azman', 'Ho Ah Lek',
  'Vellu a/l Kandasamy', 'Hanis bt Hakim', 'Chia Ming Hui', 'Nadzirah bt Rashid',
  'Rajesh a/l Kumar', 'Soh Ah Peng', 'Nithya a/p Gopal', 'Hafizah bt Sulaiman',
  'Teoh Boon Chai', 'Azman bin Wahab', 'Saras a/p Devi', 'Syarifah bt Alwi',
  'Chew Kok Leong', 'Rosli bin Talib', 'Shanthi a/p Muniandy', 'Khadijah bt Omar',
  'Koh Ah Soon', 'Faizal bin Zain', 'Revathi a/p Nair', 'Mardiana bt Hamzah',
  'Phua Ah Bah', 'Azhar bin Ghani', 'Vasantha a/p Krishna', 'Zainal bin Abidin'
]

function generateHouses() {
  const houses = []
  for (let i = 1; i <= TOTAL_HOUSES; i++) {
    houses.push({
      id: `house-${i}`,
      house_number: `No. ${i}`,
      owner_name: MOCK_NAMES[i - 1] || `Penduduk No. ${i}`,
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
