import type { ChartConfig, ChartInstance } from '@bi-platform/core'
import type { ChartEngine, ChartRenderer } from './types'
import { echartsRenderer } from './renderers/echarts-renderer'
import { ChartType } from '@bi-platform/core'

const defaultRenderers: Record<string, ChartRenderer> = {
  [ChartType.Line]: echartsRenderer,
  [ChartType.Bar]: echartsRenderer,
  [ChartType.Pie]: echartsRenderer
}

export function createChartEngine(): ChartEngine {
  const registry = new Map<string, ChartRenderer>(Object.entries(defaultRenderers))

  return {
    registerChart(type, renderer) {
      registry.set(type, renderer)
    },
    async render(config, container, data) {
      const renderer = registry.get(config.type) ?? echartsRenderer
      return renderer.mount(container, config, data)
    },
    async update(chart, config, data) {
      const renderer = registry.get(config.type) ?? echartsRenderer
      renderer.update(chart, config, data)
    },
    destroy(chart) {
      echartsRenderer.destroy(chart)
    }
  }
}

export * from './types'
export { echartsRenderer } from './renderers/echarts-renderer'
