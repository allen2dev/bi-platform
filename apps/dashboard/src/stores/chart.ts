import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { ChartConfig, ChartInstance } from '@bi-platform/core'
import { ChartType } from '@bi-platform/core'
import { createChartEngine } from '@bi-platform/chart-engine'
import { mockFetch } from '@/api/mock'

const engine = createChartEngine()

export const useChartStore = defineStore('chart', () => {
  const instances = shallowRef(new Map<string, ChartInstance>())
  const loading = ref(new Set<string>())
  const errors = ref(new Map<string, string>())

  async function fetchSeries(sourceId: string): Promise<unknown[]> {
    return mockFetch<unknown[]>('/api/query', {
      method: 'POST',
      body: { source: sourceId }
    })
  }

  async function renderInto(
    id: string,
    config: ChartConfig,
    el: HTMLElement
  ): Promise<ChartInstance | null> {
    loading.value = new Set(loading.value).add(id)
    errors.value = new Map(errors.value)
    errors.value.delete(id)
    try {
      const data = await fetchSeries(config.data.id)
      const prev = instances.value.get(id)
      if (prev) engine.destroy(prev)
      const chart = await engine.render(config, el, data)
      const next = new Map(instances.value)
      next.set(id, chart)
      instances.value = next
      return chart
    } catch (e) {
      errors.value = new Map(errors.value).set(id, e instanceof Error ? e.message : '错误')
      return null
    } finally {
      const s = new Set(loading.value)
      s.delete(id)
      loading.value = s
    }
  }

  async function refreshChart(id: string, config: ChartConfig, el: HTMLElement) {
    return renderInto(id, config, el)
  }

  function destroyChart(id: string) {
    const c = instances.value.get(id)
    if (c) engine.destroy(c)
    const next = new Map(instances.value)
    next.delete(id)
    instances.value = next
  }

  function mapChartType(raw: string): ChartType {
    if (raw === 'bar') return ChartType.Bar
    if (raw === 'pie') return ChartType.Pie
    return ChartType.Line
  }

  return {
    instances,
    loading,
    errors,
    renderInto,
    refreshChart,
    destroyChart,
    mapChartType
  }
})
