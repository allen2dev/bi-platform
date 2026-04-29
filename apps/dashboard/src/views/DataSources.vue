<template>
  <div class="page">
    <el-card shadow="never" class="card">
      <template #header>Mock 数据源</template>
      <p class="hint">GitHub Pages 部署时使用内置 Mock，无需后端。</p>
      <el-table :data="rows" stripe>
        <el-table-column prop="id" label="标识" width="200" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="desc" label="说明" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const rows = [
  { id: 'mock/sales-trend', type: 'Mock', desc: '月度销售折线/柱状数据' },
  { id: 'mock/category-share', type: 'Mock', desc: '区域占比饼图数据' },
  { id: 'mock/region-bar', type: 'Mock', desc: '城市销量柱状数据' },
  { id: 'mock/dashboards', type: 'Mock', desc: '仪表板列表' },
  { id: 'mock/dashboard-layout', type: 'Mock', desc: '画布布局 JSON' }
]
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
}
.card {
  background: #161b22;
  border: 1px solid #30363d;
  color: inherit;
}
.hint {
  color: #8b949e;
  margin: 0 0 16px;
}
</style>
