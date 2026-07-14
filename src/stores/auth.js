import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null)
  const houseId = ref(null)
  const houseNumber = ref(null)
  const loading = ref(false)

  const isAdmin = computed(() => ['pengerusi', 'bendahari', 'setiausaha', 'ajk'].includes(role.value))
  const isResident = computed(() => role.value === 'resident')

  async function loginAdmin(email, password) {
    loading.value = true
    try {
      // Mock admin users
      const mockAdmins = [
        { email: 'admin@tlu2.my', password: 'admin123', id: 'adm-1', full_name: 'Encik Rahman', role: 'pengerusi' },
        { email: 'bendahari@tlu2.my', password: 'bend123', id: 'adm-2', full_name: 'Puan Aminah', role: 'bendahari' },
        { email: 'setiausaha@tlu2.my', password: 'set123', id: 'adm-3', full_name: 'Encik Kumar', role: 'setiausaha' }
      ]
      const found = mockAdmins.find(a => a.email === email && a.password === password)
      if (!found) throw new Error('invalid')
      user.value = { id: found.id, email: found.email, full_name: found.full_name }
      role.value = found.role
      await new Promise(r => setTimeout(r, 400))
    } finally {
      loading.value = false
    }
  }

  async function loginResident(hNo, pin) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 400))
      // Accept any house with PIN '1234'
      if (pin !== '1234') throw new Error('invalid')
      const num = parseInt(hNo.replace(/\D/g, ''), 10)
      if (!num || num < 1 || num > 64) throw new Error('invalid')
      houseId.value = `house-${num}`
      houseNumber.value = `No. ${num}`
      role.value = 'resident'
      user.value = { id: houseId.value }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    role.value = null
    houseId.value = null
    houseNumber.value = null
  }

  function checkSession() {
    // In prototype mode, just check local state
  }

  return {
    user, role, houseId, houseNumber, loading,
    isAdmin, isResident,
    loginAdmin, loginResident, logout, checkSession
  }
})
