<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="brand">BI Platform</div>
      <el-menu
        :default-active="active"
        router
        background-color="transparent"
        text-color="#c9d1d9"
        active-text-color="#58a6ff"
      >
        <el-menu-item index="/dashboards">仪表板</el-menu-item>
        <el-menu-item index="/data-sources">数据源 (Mock)</el-menu-item>
        <el-menu-item index="/admin">管理后台</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="crumb">{{ title }}</span>
        </div>
        <div class="header-right">
          <el-switch
            v-model="isDark"
            inline-prompt
            active-text="暗"
            inactive-text="亮"
            @change="onTheme"
          />
          <el-tag v-if="user" type="info" effect="dark" class="user-tag">{{ user.name }}</el-tag>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const route = useRoute()
const app = useAppStore()
const { user, theme } = storeToRefs(app)

const active = computed(() => {
  if (route.path.startsWith('/d/')) return '/dashboards'
  return route.path
})

const title = computed(() => {
  if (route.path === '/dashboards') return '仪表板'
  if (route.path.startsWith('/d/') && route.path.endsWith('/edit')) return '可视化设计器'
  if (route.path.startsWith('/d/')) return '仪表板预览'
  if (route.path === '/data-sources') return '数据源'
  if (route.path === '/admin') return '管理后台'
  return 'BI Platform'
})

const isDark = ref(theme.value === 'dark')
watch(
  () => theme.value,
  (t) => {
    isDark.value = t === 'dark'
  }
)

function onTheme() {
  app.switchTheme(isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('light', !isDark.value)
}
document.documentElement.classList.toggle('light', theme.value === 'light')
</script>

<style scoped>
.layout {
  height: 100%;
}
.aside {
  border-right: 1px solid #30363d;
  background: #161b22;
}
.brand {
  padding: 20px 16px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.02em;
  border-bottom: 1px solid #30363d;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #30363d;
  background: #161b22;
}
.main {
  background: #0d1117;
  padding: 20px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.crumb {
  color: #8b949e;
  font-size: 14px;
}
</style>
