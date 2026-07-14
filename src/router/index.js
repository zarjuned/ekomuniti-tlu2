import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/resident',
    name: 'resident',
    component: () => import('@/views/ResidentPortalView.vue'),
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/houses',
    name: 'houses',
    component: () => import('@/views/HousesGridView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/payments',
    name: 'payments',
    component: () => import('@/views/PaymentsView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: () => import('@/views/ExpensesView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/penubuhan',
    name: 'penubuhan',
    component: () => import('@/views/PenubuhanView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/ReportsView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import('@/views/AttendanceView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAdmin: true, requiresRole: ['pengerusi', 'bendahari'] }
  },
  {
    path: '/resident/dashboard',
    name: 'resident-dashboard',
    component: () => import('@/views/ResidentDashboardView.vue'),
    meta: { requiresResident: true }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from) => {
  const auth = useAuthStore()

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'login' }
  }
  if (to.meta.requiresResident && !auth.isResident) {
    return { name: 'resident' }
  }
  if (to.meta.guest && (auth.isAdmin || auth.isResident)) {
    return auth.isAdmin ? { name: 'dashboard' } : { name: 'resident-dashboard' }
  }
  if (to.meta.requiresRole && !to.meta.requiresRole.includes(auth.role)) {
    return { name: 'dashboard' }
  }
})

export default router
