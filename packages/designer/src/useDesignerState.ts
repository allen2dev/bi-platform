import { ref, computed } from 'vue'
import type { CanvasComponent } from '@bi-platform/core'

export interface LibraryItem {
  type: CanvasComponent['type']
  label: string
  defaultProps: Record<string, unknown>
  defaultSize: { w: number; h: number }
}

const defaultLibrary: LibraryItem[] = [
  {
    type: 'chart',
    label: '图表',
    defaultProps: { chartType: 'line', dataSourceId: 'mock/sales-trend', title: '新图表' },
    defaultSize: { w: 6, h: 4 }
  },
  {
    type: 'text',
    label: '文本',
    defaultProps: { text: '双击编辑文本' },
    defaultSize: { w: 6, h: 2 }
  },
  {
    type: 'kpi',
    label: '指标卡',
    defaultProps: { title: '指标', value: 0, suffix: '' },
    defaultSize: { w: 3, h: 2 }
  }
]

function uid() {
  return `cmp-${Math.random().toString(36).slice(2, 10)}`
}

export function useDesignerState(initial: CanvasComponent[] = []) {
  const canvasComponents = ref<CanvasComponent[]>([...initial])
  const selectedId = ref<string | null>(null)
  const gridSize = ref(8)
  const snapToGrid = ref(true)
  const history = ref<CanvasComponent[][]>([[...initial]])
  const historyIndex = ref(0)

  const selectedComponent = computed(() =>
    canvasComponents.value.find((c) => c.id === selectedId.value) ?? null
  )

  const componentLibrary = defaultLibrary

  const toolbarActions = [
    { id: 'undo', label: '撤销', icon: 'undo' },
    { id: 'redo', label: '重做', icon: 'redo' }
  ]

  function pushHistory() {
    const snap = JSON.parse(JSON.stringify(canvasComponents.value)) as CanvasComponent[]
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(snap)
    historyIndex.value = history.value.length - 1
  }

  function undo() {
    if (historyIndex.value <= 0) return
    historyIndex.value -= 1
    canvasComponents.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }

  function redo() {
    if (historyIndex.value >= history.value.length - 1) return
    historyIndex.value += 1
    canvasComponents.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }

  function addFromLibrary(item: LibraryItem, position: { x: number; y: number }) {
    pushHistory()
    const c: CanvasComponent = {
      id: uid(),
      type: item.type,
      label: item.label,
      props: { ...item.defaultProps },
      position: { x: position.x, y: position.y, w: item.defaultSize.w, h: item.defaultSize.h }
    }
    canvasComponents.value = [...canvasComponents.value, c]
    selectedId.value = c.id
  }

  function selectComponent(id: string | null) {
    selectedId.value = id
  }

  function updateComponent(
    id: string,
    patch: Partial<Pick<CanvasComponent, 'label' | 'props' | 'position'>>
  ) {
    pushHistory()
    canvasComponents.value = canvasComponents.value.map((c) => {
      if (c.id !== id) return c
      return {
        ...c,
        label: patch.label ?? c.label,
        position: patch.position ? { ...c.position, ...patch.position } : c.position,
        props: patch.props ? { ...c.props, ...patch.props } : c.props
      }
    })
  }

  function removeComponent(id: string) {
    pushHistory()
    canvasComponents.value = canvasComponents.value.filter((c) => c.id !== id)
    if (selectedId.value === id) selectedId.value = null
  }

  function setCanvas(components: CanvasComponent[]) {
    canvasComponents.value = JSON.parse(JSON.stringify(components))
    selectedId.value = null
    history.value = [JSON.parse(JSON.stringify(components))]
    historyIndex.value = 0
  }

  return {
    componentLibrary,
    canvasComponents,
    selectedId,
    selectedComponent,
    toolbarActions,
    gridSize,
    snapToGrid,
    addFromLibrary,
    selectComponent,
    updateComponent,
    removeComponent,
    setCanvas,
    undo,
    redo
  }
}
