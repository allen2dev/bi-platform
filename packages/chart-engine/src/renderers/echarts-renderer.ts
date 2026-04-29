import * as echarts from 'echarts'
import type { ChartConfig, ChartInstance } from '@bi-platform/core'
import { ChartType } from '@bi-platform/core'
import type { ChartRenderer } from '../types'

export type EChartsBackedInstance = ChartInstance & {
  __chart: echarts.ECharts
}

function buildOption(config: ChartConfig, data: unknown): echarts.EChartsOption {
  const title = (config.options?.title as string) ?? ''
  const rows = Array.isArray(data) ? (data as Record<string, unknown>[]) : []

  switch (config.type) {
    case ChartType.Pie: {
      const seriesData = rows.map((r) => ({
        name: String(r.name ?? r.label ?? ''),
        value: Number(r.value ?? 0)
      }))
      return {
        title: { text: title, left: 'center' },
        tooltip: { trigger: 'item' },
        legend: config.options?.legend ? { bottom: 0 } : undefined,
        series: [{ type: 'pie', radius: '60%', data: seriesData }]
      }
    }
    case ChartType.Bar: {
      const categories = rows.map((r) => String(r.category ?? r.name ?? ''))
      const values = rows.map((r) => Number(r.value ?? 0))
      return {
        title: { text: title },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: values }]
      }
    }
    case ChartType.Line:
    default: {
      const categories = rows.map((r) => String(r.category ?? r.name ?? r.date ?? ''))
      const values = rows.map((r) => Number(r.value ?? 0))
      return {
        title: { text: title },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'value' },
        series: [{ type: 'line', smooth: true, data: values }]
      }
    }
  }
}

export const echartsRenderer: ChartRenderer = {
  mount(el, config, data) {
    const chart = echarts.init(el)
    chart.setOption(buildOption(config, data), true)
    const inst: EChartsBackedInstance = {
      id: `echarts-${Math.random().toString(36).slice(2)}`,
      __chart: chart,
      dispose: () => chart.dispose(),
      resize: () => chart.resize()
    }
    return inst
  },
  update(instance, config, data) {
    const ec = (instance as EChartsBackedInstance).__chart
    if (ec) ec.setOption(buildOption(config, data), true)
  },
  resize(instance) {
    ;(instance as EChartsBackedInstance).__chart?.resize()
  },
  destroy(instance) {
    ;(instance as EChartsBackedInstance).__chart?.dispose()
  }
}
