export interface Position {
  x: number
  y: number
  w: number
  h: number
}

export type CanvasComponentType = 'chart' | 'text' | 'kpi'

export interface CanvasComponent {
  id: string
  type: CanvasComponentType
  label: string
  props: Record<string, unknown>
  position: Position
}
