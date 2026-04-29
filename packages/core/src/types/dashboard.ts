import type { CanvasComponent } from './designer'

export interface Dashboard {
  id: string
  name: string
  description?: string
  components: CanvasComponent[]
  updatedAt: string
}

export type GlobalFilters = Record<string, unknown>
