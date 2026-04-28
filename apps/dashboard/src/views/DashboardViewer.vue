<template>
  <div class="page" v-loading="loading">
    <el-page-header @back="back" class="mb">
      <template #content>
        <span class="title">{{ dash?.name ?? '仪表板' }}</span>
      </template>
      <template #extra>
        <el-button type="primary" @click="goEdit">编辑</el-button>
      </template>
    </el-page-header>
    <el-alert v-if="error" :title="error" type="error" class="mb" />
    <div v-if="dash" class="grid" :style="gridStyle">
      <div
        v-for="c in dash.components"
        :key="c.id"
        class="cell"
        :style="cellStyle(c.position)"
      >
        <BiChart
          v-if="c.type === 'chart'"
          :chart-id="`${c.id}-view`"
          :config="chartConfig(c)"
          :title="String(c.props.title ?? '')"
        />
        <el-card v-else-if="c.type === 'kpi'" shadow="never" class="kpi">
          <div class="kpi-title">{{ c.props.title }}</div>
          <div class="kpi-value">
            {{ c.props.value }}<small>{{ c.props.suffix }}</small>
          </div>
        </el-card>
        <el-card v-else shadow="never" class="text-card">
          {{ c.props.text }}
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { CanvasComponent } from '@bi-platform/core'
import { useDashboardStore } from '@/stores/dashboard'
import { useChartStore } from '@/stores/chart'
import BiChart from '@/components/BiChart.vue'

const route = useRoute()
const router = useRouter()
const dashStore = useDashboardStore()
const chartStore = useChartStore()
const { currentDashboard: dash, loading, error } = storeToRefs(dashStore)

const id = computed(() => route.params.id as string)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridAutoRows: 'minmax(72px, auto)',
  gap: '12px'
}))

function cellStyle(pos: CanvasComponent['position']) {
  return {
    gridColumn: `${pos.x + 1} / span ${pos.w}`,
    gridRow: `${pos.y + 1} / span ${pos.h}`,
    minHeight: '120px'
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

onMounted(async () => {
  await dashStore.loadList()
  await dashStore.loadDashboard(id.value)
})

function back() {
  router.push('/dashboards')
}

function goEdit() {
  router.push(`/d/${id.value}/edit`)
}
</script>

<style scoped>
.page {
  max-width: 1280px;
  margin: 0 auto;
}
.mb {
  margin-bottom: 16px;
}
.title {
  font-weight: 600;
}
.kpi,
.text-card {
  height: 100%;
  background: #161b22;
  border: 1px solid #30363d;
  color: inherit;
}
.kpi-title {
  color: #8b949e;
  font-size: 13px;
}
.kpi-value {
  font-size: 28px;
  font-weight: 700;
  margin-top: 8px;
}
.kpi-value small {
  font-size: 14px;
  margin-left: 4px;
  color: #8b949e;
}
</style>
