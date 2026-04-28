<template>
  <div class="chart-wrap" ref="root">
    <div v-if="showHeader" class="chart-head">
      <span>{{ titleText }}</span>
      <el-button size="small" text type="primary" @click="retry">刷新</el-button>
    </div>
    <div class="chart-body" ref="chartBody">
      <div v-if="isLoading" class="state overlay">加载中…</div>
      <div v-else-if="err" class="state overlay err">{{ err }}</div>
      <div v-show="!isLoading && !err" ref="chartMount" class="echarts-host" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ChartConfig } from '@bi-platform/core'
import { useChartStore } from '@/stores/chart'

const props = withDefaults(
  defineProps<{
    chartId: string
    config: ChartConfig
    title?: string
    showHeader?: boolean
  }>(),
  { showHeader: true }
)

const chartStore = useChartStore()
const chartBody = ref<HTMLElement>()
const chartMount = ref<HTMLElement>()

const titleText = computed(() => props.title ?? (props.config.options?.title as string) ?? '图表')

const isLoading = computed(() => chartStore.loading.has(props.chartId))
const err = computed(() => chartStore.errors.get(props.chartId) ?? '')

async function mountChart() {
  const el = chartMount.value
  if (!el) return
  await chartStore.renderInto(props.chartId, props.config, el)
}

function retry() {
  mountChart()
}

let ro: ResizeObserver | null = null

onMounted(() => {
  mountChart()
  ro = new ResizeObserver(() => {
    const inst = chartStore.instances.get(props.chartId)
    inst?.resize?.()
  })
  if (chartBody.value) ro.observe(chartBody.value)
})

onUnmounted(() => {
  ro?.disconnect()
  chartStore.destroyChart(props.chartId)
})

watch(
  () => props.config,
  () => mountChart(),
  { deep: true }
)
</script>

<style scoped>
.chart-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 220px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  overflow: hidden;
}
.chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #30363d;
  font-size: 14px;
}
.chart-body {
  flex: 1;
  min-height: 180px;
  position: relative;
}
.echarts-host {
  position: absolute;
  inset: 0;
}
.state.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background: rgba(13, 17, 23, 0.7);
  z-index: 1;
}
.state.err {
  color: #f85149;
}
</style>
