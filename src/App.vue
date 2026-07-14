<template>
  <div class="app-root" :class="{ 'has-sidebar': showSidebar, 'is-resident': isResidentRoute }">
    <AppSidebar v-if="showSidebar && !isResidentRoute" :expanded="sidebarExpanded" />
    <div class="main-col" :class="{ 'with-sidebar': showSidebar && !isResidentRoute }">
      <AppHeader v-if="showSidebar" :isMobile="!sidebarExpanded" @toggle-sidebar="sidebarExpanded = !sidebarExpanded" />
      <main class="main-content" :class="{ 'with-mobile-nav': showSidebar }">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <MobileNav v-if="showSidebar && !isResidentRoute" />
    </div>
    <BaseToast />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import BaseToast from '@/components/common/BaseToast.vue'

const route = useRoute()
const auth = useAuthStore()

const sidebarExpanded = ref(true)

const publicRoutes = ['login', 'resident']
const showSidebar = computed(() => !publicRoutes.includes(route.name))
const isResidentRoute = computed(() => route.name === 'resident-dashboard')

function handleResize() {
  sidebarExpanded.value = window.innerWidth >= 1024
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  background: var(--color-bg-primary);
}

.main-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
}

.main-col.with-sidebar {
  margin-left: var(--sidebar-width);
}

.main-content {
  flex: 1;
  padding: 0;
}

.main-content.with-mobile-nav {
  padding-bottom: var(--mobile-nav-height);
}

@media (max-width: 767px) {
  .main-col.with-sidebar {
    margin-left: 0;
  }
}
</style>
