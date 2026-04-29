import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { Dashboard, GlobalFilters } from '@bi-platform/core'
import { mockFetch } from '@/api/mock'

const storageKey = (id: string) => `bi-platform-dashboard-${id}`

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboards = ref<Dashboard[]>([])
  const currentDashboard = shallowRef<Dashboard | null>(null)
  const filters = ref<GlobalFilters>({})
  const isEditing = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadList() {
    loading.value = true
    error.value = null
    try {
      const list = await mockFetch<{ rows: Dashboard[] }>('/api/dashboards')
      dashboards.value = list.rows ?? []
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function loadDashboard(id: string) {
    loading.value = true
    error.value = null
    try {
      const data = await mockFetch<{ id: string; components: Dashboard['components'] }>(
        `/api/dashboard/${id}`
      )
      const meta = dashboards.value.find((d) => d.id === id)
      let components = data.components ?? []
      try {
        const raw = sessionStorage.getItem(storageKey(id))
        if (raw) {
          const parsed = JSON.parse(raw) as { components?: Dashboard['components'] }
          if (Array.isArray(parsed.components)) components = parsed.components
        }
      } catch {
        /* ignore */
      }
      currentDashboard.value = {
        id: data.id,
        name: meta?.name ?? id,
        description: meta?.description,
        components,
        updatedAt: meta?.updatedAt ?? new Date().toISOString()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function saveDashboard(dashboard: Dashboard) {
    currentDashboard.value = { ...dashboard }
    try {
      sessionStorage.setItem(
        storageKey(dashboard.id),
        JSON.stringify({ components: dashboard.components })
      )
    } catch {
      /* ignore */
    }
    await new Promise((r) => setTimeout(r, 200))
  }

  function applyFilters(f: GlobalFilters) {
    filters.value = { ...f }
  }

  return {
    dashboards,
    currentDashboard,
    filters,
    isEditing,
    loading,
    error,
    loadList,
    loadDashboard,
    saveDashboard,
    applyFilters
  }
})
