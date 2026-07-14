import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const auth = useAuthStore()
  const error = ref(null)

  async function loginAdmin(email, password) {
    error.value = null
    try {
      await auth.loginAdmin(email, password)
      return true
    } catch (e) {
      error.value = 'invalid'
      return false
    }
  }

  async function loginResident(houseNumber, pin) {
    error.value = null
    try {
      await auth.loginResident(houseNumber, pin)
      return true
    } catch (e) {
      error.value = 'invalid'
      return false
    }
  }

  function logout() {
    auth.logout()
  }

  return {
    user: auth.user,
    role: auth.role,
    isAdmin: auth.isAdmin,
    isResident: auth.isResident,
    houseId: auth.houseId,
    houseNumber: auth.houseNumber,
    loading: auth.loading,
    error,
    loginAdmin,
    loginResident,
    logout,
    checkSession: auth.checkSession
  }
}
