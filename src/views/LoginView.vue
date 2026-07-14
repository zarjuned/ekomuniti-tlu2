<template>
  <div class="auth-page">
    <div class="auth-card glass-card animate-scale-in">
      <div class="auth-header">
        <div class="auth-logo">TLU2</div>
        <h1>{{ $t('auth.adminLogin') }}</h1>
        <p>E-Komuniti Taman Langat Utama 2</p>
      </div>
      <form @submit.prevent="submit" class="auth-form">
        <div class="form-group">
          <label class="form-label">{{ $t('auth.email') }}</label>
          <input v-model="email" type="email" class="form-input" placeholder="admin@tlu2.my" required />
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('auth.password') }}</label>
          <input v-model="password" type="password" class="form-input" placeholder="••••••••" required />
        </div>
        <p v-if="error" class="form-error" style="margin-bottom: var(--space-3);">{{ $t('auth.invalidCredentials') }}</p>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;" :disabled="loading">
          <span v-if="loading" class="animate-pulse">{{ $t('common.loading') }}</span>
          <span v-else>{{ $t('auth.login') }}</span>
        </button>
      </form>
      <div class="auth-switch">
        <router-link to="/resident">{{ $t('auth.enterResident') }} →</router-link>
      </div>
      <div class="auth-hint">
        <p>Demo: admin@tlu2.my / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { loginAdmin, loading, error } = useAuth()

const email = ref('admin@tlu2.my')
const password = ref('admin123')

async function submit() {
  const ok = await loginAdmin(email.value, password.value)
  if (ok) router.push({ name: 'dashboard' })
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 50%), var(--color-bg-primary);
}
.auth-card {
  width: 100%;
  max-width: 420px;
  padding: var(--space-8);
}
.auth-header { text-align: center; margin-bottom: var(--space-6); }
.auth-logo {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background: var(--color-accent-gradient);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: #fff;
  margin-bottom: var(--space-4);
  box-shadow: var(--shadow-glow);
}
.auth-header h1 { font-size: var(--text-xl); color: var(--color-text-primary); }
.auth-header p { color: var(--color-text-secondary); font-size: var(--text-sm); margin-top: var(--space-1); }
.auth-form { display: flex; flex-direction: column; gap: var(--space-2); }
.auth-switch {
  margin-top: var(--space-5);
  text-align: center;
}
.auth-switch a { color: var(--color-accent-primary); font-size: var(--text-sm); }
.auth-switch a:hover { color: var(--color-accent-secondary); }
.auth-hint {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
  text-align: center;
}
.auth-hint p { font-size: var(--text-xs); color: var(--color-text-tertiary); font-family: monospace; }
</style>
