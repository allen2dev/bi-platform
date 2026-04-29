import type { ChartConfig, ChartInstance } from '@bi-platform/core'

export type { ChartConfig, ChartInstance }

export interface ChartRenderer {
  mount(el: HTMLElement, config: ChartConfig, data: unknown): ChartInstance
  update(instance: ChartInstance, config: ChartConfig, data: unknown): void
  resize(instance: ChartInstance): void
  destroy(instance: ChartInstance): void
}

export interface ChartEngine {
  registerChart(type: string, renderer: ChartRenderer): void
  render(config: ChartConfig, container: HTMLElement, data: unknown): Promise<ChartInstance>
  update(chart: ChartInstance, config: ChartConfig, data: unknown): Promise<void>
  destroy(chart: ChartInstance): void
}
