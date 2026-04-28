<template>
  <div class="designer" v-loading="loading">
    <div class="toolbar">
      <el-page-header @back="back">
        <template #content>
          <span>设计器 — {{ dash?.name }}</span>
        </template>
        <template #extra>
          <el-button @click="undo">撤销</el-button>
          <el-button @click="redo">重做</el-button>
          <el-button type="primary" @click="save">保存到本地状态</el-button>
          <el-button @click="preview">预览</el-button>
        </template>
      </el-page-header>
    </div>
    <div class="main">
      <aside class="sidebar">
        <div class="side-title">组件库</div>
        <div
          v-for="item in componentLibrary"
          :key="item.label"
          class="lib-item"
          draggable="true"
          @dragstart="onDragStart($event, item)"
        >
          {{ item.label }}
        </div>
      </aside>
      <div
        class="canvas"
        @dragover.prevent
        @drop="onDrop"
        @click.self="selectComponent(null)"
      >
        <div
          v-for="c in canvasComponents"
          :key="c.id"
          class="widget"
          :class="{ active: selectedId === c.id }"
          :style="widgetStyle(c.position)"
          @click.stop="selectComponent(c.id)"
        >
          <BiChart
            v-if="c.type === 'chart'"
            :chart-id="c.id"
            :config="chartConfig(c)"
            :title="String(c.props.title ?? '')"
          />
          <el-card v-else-if="c.type === 'kpi'" shadow="never" class="inner">
            <div class="muted">{{ c.props.title }}</div>
            <div class="big">{{ c.props.value }}{{ c.props.suffix }}</div>
          </el-card>
          <el-card v-else shadow="never" class="inner">{{ c.props.text }}</el-card>
        </div>
      </div>
      <aside class="props">
        <div class="side-title">属性</div>
        <template v-if="selectedComponent">
          <el-form label-position="top" size="small">
            <el-form-item label="标题">
              <el-input v-model="titleModel" @change="applyTitle" />
            </el-form-item>
            <el-form-item v-if="selectedComponent.type === 'chart'" label="数据源 (Mock)">
              <el-select v-model="dsModel" @change="applyDs">
                <el-option label="销售趋势" value="mock/sales-trend" />
                <el-option label="区域占比" value="mock/category-share" />
                <el-option label="城市销量" value="mock/region-bar" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="selectedComponent.type === 'chart'" label="图表类型">
              <el-select v-model="typeModel" @change="applyChartType">
                <el-option label="折线" value="line" />
                <el-option label="柱状" value="bar" />
                <el-option label="饼图" value="pie" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-button type="danger" text @click="removeSelected">删除组件</el-button>
        </template>
        <el-empty v-else description="选择画布上的组件" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { CanvasComponent } from '@bi-platform/core'
import { useDesignerState, type LibraryItem } from '@bi-platform/designer'
import { useDashboardStore } from '@/stores/dashboard'
import { useChartStore } from '@/stores/chart'
import BiChart from '@/components/BiChart.vue'

const route = useRoute()
const router = useRouter()
const dashStore = useDashboardStore()
const chartStore = useChartStore()
const { currentDashboard: dash, loading } = storeToRefs(dashStore)

const id = computed(() => route.params.id as string)

const {
  componentLibrary,
  canvasComponents,
  selectedId,
  selectedComponent,
  addFromLibrary,
  selectComponent,
  updateComponent,
  removeComponent,
  setCanvas,
  undo,
  redo
} = useDesignerState()

const dragItem = ref<LibraryItem | null>(null)

onMounted(async () => {
  await dashStore.loadList()
  await dashStore.loadDashboard(id.value)
  if (dashStore.currentDashboard?.components?.length) {
    setCanvas(dashStore.currentDashboard.components)
  }
})

const titleModel = ref('')
const dsModel = ref('mock/sales-trend')
const typeModel = ref('line')

watch(
  selectedComponent,
  (c) => {
    if (!c) return
    titleModel.value = String(c.props.title ?? '')
    dsModel.value = String(c.props.dataSourceId ?? 'mock/sales-trend')
    typeModel.value = String(c.props.chartType ?? 'line')
  },
  { immediate: true }
)

function widgetStyle(pos: CanvasComponent['position']) {
  return {
    gridColumn: `${pos.x + 1} / span ${pos.w}`,
    gridRow: `${pos.y + 1} / span ${pos.h}`
  }
}

function chartConfig(c: CanvasComponent) {
  const ds = String(c.props.dataSourceId ?? 'mock/sales-trend')
  return {
    type: chartStore.mapChartType(String(c.props.chartType ?? 'line')),
    data: { id: ds },
    options: { title: c.props.title as string, legend: true }
  }
}

function onDragStart(e: DragEvent, item: LibraryItem) {
  dragItem.value = item
  e.dataTransfer?.setData('text/plain', item.label)
}

function onDrop(e: DragEvent) {
  const item = dragItem.value
  dragItem.value = null
  if (!item) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const col = Math.min(11, Math.floor(((e.clientX - rect.left) / rect.width) * 12))
  const row = Math.floor((e.clientY - rect.top) / 80)
  addFromLibrary(item, { x: col, y: Math.max(0, row) })
}

function applyTitle() {
  const c = selectedComponent.value
  if (!c) return
  updateComponent(c.id, { props: { ...c.props, title: titleModel.value } })
}

function applyDs() {
  const c = selectedComponent.value
  if (!c || c.type !== 'chart') return
  updateComponent(c.id, { props: { ...c.props, dataSourceId: dsModel.value } })
}

function applyChartType() {
  const c = selectedComponent.value
  if (!c || c.type !== 'chart') return
  updateComponent(c.id, { props: { ...c.props, chartType: typeModel.value } })
}

function removeSelected() {
  const c = selectedComponent.value
  if (!c) return
  removeComponent(c.id)
}

async function save() {
  if (!dash.value) return
  await dashStore.saveDashboard({
    ...dash.value,
    components: canvasComponents.value
  })
}

function preview() {
  router.push(`/d/${id.value}`)
}

function back() {
  router.push(`/d/${id.value}`)
}
</script>

<style scoped>
.designer {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  margin: -10px;
}
.toolbar {
  padding: 8px 0 16px;
  border-bottom: 1px solid #30363d;
}
.main {
  flex: 1;
  display: grid;
  grid-template-columns: 200px 1fr 260px;
  gap: 12px;
  min-height: 0;
  padding-top: 12px;
}
.sidebar,
.props {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
  overflow: auto;
}
.side-title {
  font-weight: 600;
  margin-bottom: 12px;
}
.lib-item {
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #21262d;
  border: 1px dashed #484f58;
  border-radius: 6px;
  cursor: grab;
}
.canvas {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 72px;
  gap: 8px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
  align-content: start;
  min-height: 480px;
}
.widget {
  border: 1px solid transparent;
  border-radius: 8px;
  min-height: 0;
  overflow: hidden;
}
.widget.active {
  border-color: #58a6ff;
  box-shadow: 0 0 0 1px #58a6ff inset;
}
.inner {
  height: 100%;
  background: #161b22;
  border: 1px solid #30363d;
  color: inherit;
}
.muted {
  color: #8b949e;
  font-size: 12px;
}
.big {
  font-size: 22px;
  font-weight: 700;
  margin-top: 6px;
}
</style>
