<template>
  <div class="app-root" :class="{ 'is-resident': isResidentRoute }">
    <AppSidebar
      v-if="showSidebar && !isResidentRoute"
      :mobile-open="mobileSidebarOpen"
      @close-mobile="mobileSidebarOpen = false"
    />
    <div class="main-col">
      <AppHeader
        v-if="showSidebar"
        @toggle-sidebar="mobileSidebarOpen = !mobileSidebarOpen"
      />
      <main class="main-content">
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
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import BaseToast from '@/components/common/BaseToast.vue'

const route = useRoute()
const mobileSidebarOpen = ref(false)

const publicRoutes = ['login', 'resident']
const showSidebar = computed(() => !publicRoutes.includes(route.name))
const isResidentRoute = computed(() => route.name === 'resident-dashboard')

// Close mobile sidebar on route change
const unwatch = computed(() => {
  mobileSidebarOpen.value = false
  return route.name
})
// Keep unwatch alive
const _ = computed(() => unwatch.value)

function handleResize() {
  if (window.innerWidth >= 1024) mobileSidebarOpen.value = false
}
onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))
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
.main-content {
  flex: 1;
}
@media (min-width: 1024px) {
  .main-col {
    margin-left: var(--sidebar-width);
  }
}
</style>
