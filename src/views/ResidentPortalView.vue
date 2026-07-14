<template>
  <div class="auth-page">
    <div class="auth-card glass-card animate-scale-in">
      <div class="auth-header">
        <div class="auth-logo">🏘️</div>
        <h1>{{ $t('auth.residentLogin') }}</h1>
        <p>E-Komuniti Taman Langat Utama 2</p>
      </div>
      <form @submit.prevent="submit" class="auth-form">
        <div class="form-group">
          <label class="form-label">{{ $t('auth.houseNumber') }}</label>
          <select v-model="houseNumber" class="form-select" required>
            <option value="" disabled>-- Pilih No. Rumah --</option>
            <option v-for="i in 64" :key="i" :value="`No. ${i}`">No. {{ i }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('auth.pin') }}</label>
          <input v-model="pin" type="password" inputmode="numeric" maxlength="4" class="form-input pin-input" placeholder="••••" required />
        </div>
        <p v-if="error" class="form-error" style="margin-bottom: var(--space-3);">{{ $t('auth.invalidPin') }}</p>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;" :disabled="loading">
          <span v-if="loading" class="animate-pulse">{{ $t('common.loading') }}</span>
          <span v-else>{{ $t('auth.login') }}</span>
        </button>
      </form>
      <div class="auth-switch">
        <router-link to="/login">{{ $t('auth.enterAdmin') }} →</router-link>
      </div>
      <div class="auth-hint">
        <p>Demo: Any House / PIN 1234</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { loginResident, loading, error } = useAuth()

const houseNumber = ref('No. 1')
const pin = ref('1234')

async function submit() {
  const ok = await loginResident(houseNumber.value, pin.value)
  if (ok) router.push({ name: 'resident-dashboard' })
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15), transparent 50%), var(--color-bg-primary);
}
.auth-card { width: 100%; max-width: 420px; padding: var(--space-8); }
.auth-header { text-align: center; margin-bottom: var(--space-6); }
.auth-logo {
  font-size: 48px;
  margin-bottom: var(--space-4);
}
.auth-header h1 { font-size: var(--text-xl); color: var(--color-text-primary); }
.auth-header p { color: var(--color-text-secondary); font-size: var(--text-sm); margin-top: var(--space-1); }
.auth-form { display: flex; flex-direction: column; gap: var(--space-2); }
.pin-input { text-align: center; font-size: var(--text-2xl); letter-spacing: 0.5em; }
.auth-switch { margin-top: var(--space-5); text-align: center; }
.auth-switch a { color: var(--color-accent-primary); font-size: var(--text-sm); }
.auth-hint {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
  text-align: center;
}
.auth-hint p { font-size: var(--text-xs); color: var(--color-text-tertiary); font-family: monospace; }
</style>
