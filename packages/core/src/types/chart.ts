export enum ChartType {
  Line = 'line',
  Bar = 'bar',
  Pie = 'pie',
  Scatter = 'scatter',
  Heatmap = 'heatmap',
  Gauge = 'gauge',
  Funnel = 'funnel',
  Radar = 'radar',
  Tree = 'tree',
  Graph = 'graph',
  Custom = 'custom'
}

export interface DataSourceRef {
  id: string
  params?: Record<string, unknown>
}

export interface ChartOptions {
  title?: string
  legend?: boolean
  grid?: { left?: string; right?: string; top?: string; bottom?: string }
  [key: string]: unknown
}

export interface InteractionConfig {
  type: string
  options?: Record<string, unknown>
}

export interface ChartThemeRef {
  name?: string
  color?: string[]
}

export interface ChartConfig {
  type: ChartType
  data: DataSourceRef
  options?: ChartOptions
  interactions?: InteractionConfig[]
  theme?: ChartThemeRef
}

export interface ChartInstance {
  id: string
  dispose: () => void
  resize?: () => void
}
