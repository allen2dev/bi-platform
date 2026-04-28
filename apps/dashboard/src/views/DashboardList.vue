<template>
  <div class="page">
    <el-card shadow="never" class="card">
      <template #header>
        <span>仪表板</span>
        <el-button type="primary" text @click="refresh">刷新 Mock</el-button>
      </template>
      <el-skeleton v-if="loading" :rows="4" animated />
      <el-alert v-else-if="error" :title="error" type="error" show-icon />
      <el-row v-else :gutter="16">
        <el-col v-for="d in dashboards" :key="d.id" :xs="24" :sm="12" :md="8">
          <el-card class="dash-card" shadow="hover">
            <div class="dash-title" @click="go(d.id)">{{ d.name }}</div>
            <div class="dash-desc" @click="go(d.id)">{{ d.description }}</div>
            <div class="dash-actions">
              <el-button type="primary" link @click="go(d.id)">查看</el-button>
              <el-button link @click="goEdit(d.id)">设计器</el-button>
            </div>
            <div class="dash-meta">更新 {{ formatDate(d.updatedAt) }}</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard'

const router = useRouter()
const store = useDashboardStore()
const { dashboards, loading, error } = storeToRefs(store)

onMounted(() => {
  store.loadList()
})

function refresh() {
  store.loadList()
}

function go(id: string) {
  router.push(`/d/${id}`)
}

function goEdit(id: string) {
  router.push(`/d/${id}/edit`)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
}
.card {
  background: #161b22;
  border: 1px solid #30363d;
  color: inherit;
}
.dash-card {
  cursor: pointer;
  margin-bottom: 16px;
  background: #21262d;
  border: 1px solid #30363d;
  color: inherit;
}
.dash-title {
  font-weight: 600;
  margin-bottom: 8px;
  cursor: pointer;
}
.dash-desc {
  color: #8b949e;
  font-size: 13px;
  min-height: 36px;
  cursor: pointer;
}
.dash-actions {
  margin-top: 8px;
}
.dash-meta {
  margin-top: 12px;
  font-size: 12px;
  color: #6e7681;
}
</style>
