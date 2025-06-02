# bi-platform
一个功能完整、高可扩展性的 BI 平台

## 🏗️ 核心特性

1. Monorepo 架构

*   统一的包管理和版本控制

*   共享组件库和工具函数

*   独立的应用模块（管理后台、仪表板、报表、移动端）

2. 图表引擎系统

*   支持多种图表类型（ECharts、D3.js、Three.js）

*   插件化的图表渲染器

*   统一的数据适配层

3. 数据源管理

*   多数据源支持（MySQL、PostgreSQL、MongoDB、API等）

*   实时数据订阅

*   多级缓存策略

4. 可视化设计器

*   拖拽式组件设计

*   实时预览和属性编辑

*   历史记录和撤销重做

## 🚀 技术亮点

前端技术栈：

*   Vue 3.4 + TypeScript 5.0 + Vite 5.0

*   Pinia 状态管理

*   Element Plus UI 框架

*   现代化工程工具链

性能优化：

*   虚拟滚动处理大数据量

*   图表懒加载

*   智能缓存策略

*   WebWorker 数据处理

扩展性设计：

*   插件系统架构

*   微前端支持（Module Federation）

*   主题系统

*   国际化支持

## 📊 特色功能

1.  智能图表引擎 - 自动识别数据类型并推荐最佳图表

2.  实时数据流 - WebSocket 实时数据更新

3.  协作设计 - 多人同时编辑仪表板

4.  移动端适配 - 响应式设计，支持触摸操作

5.  权限管理 - 细粒度的访问控制

## 🛠️ 开发体验

*   完整的 CLI 工具链

*   热重载开发环境

*   自动化测试覆盖

*   组件文档生成

*   性能监控工具

## 目录结构

```plaintext
bi-platform/
├── packages/                          # Monorepo 包管理
│   ├── core/                         # 核心包
│   │   ├── components/               # 通用组件库
│   │   ├── utils/                    # 工具函数
│   │   ├── types/                    # TypeScript 类型定义
│   │   └── constants/                # 常量定义
│   ├── chart-engine/                 # 图表引擎
│   │   ├── renderers/                # 图表渲染器
│   │   ├── adapters/                 # 数据适配器
│   │   └── plugins/                  # 图表插件
│   ├── data-source/                  # 数据源管理
│   │   ├── connectors/               # 数据连接器
│   │   ├── transformers/             # 数据转换器
│   │   └── cache/                    # 缓存层
│   └── designer/                     # 可视化设计器
│       ├── drag-drop/                # 拖拽引擎
│       ├── property-panel/           # 属性面板
│       └── canvas/                   # 画布组件
├── apps/
│   ├── admin/                        # 管理后台
│   ├── dashboard/                    # 仪表板应用
│   ├── report/                       # 报表应用
│   └── mobile/                       # 移动端应用
├── server/                           # 后端服务
│   ├── api/                          # API 服务
│   ├── auth/                         # 认证服务
│   ├── data/                         # 数据服务
│   └── schedule/                     # 调度服务
├── docs/                             # 文档
├── scripts/                          # 构建脚本
└── configs/                          # 配置文件
```

## 前端技术栈

### 核心框架

*   Vue 3.4+ - 渐进式框架

*   TypeScript 5.0+ - 类型安全

*   Vite 5.0+ - 构建工具

*   Pinia 2.0+ - 状态管理

### UI 框架

*   Element Plus - 基础 UI 组件

*   Ant Design Vue - 备选方案

*   自定义设计系统 - 品牌一致性

### 图表可视化

*   Apache ECharts - 主要图表库

*   D3.js - 自定义可视化

*   Three.js - 3D 可视化

*   Canvas/WebGL - 高性能渲染

### 工程化工具

*   Monorepo (PNPM) - 包管理

*   ESLint + Prettier - 代码规范

*   Husky + lint-staged - Git 钩子

*   Jest + Vitest - 单元测试

*   Cypress - E2E 测试

## 核心模块设计

### 1. 图表引擎 (Chart Engine)

```typescript
// 图表引擎核心接口
interface ChartEngine {
  // 注册图表类型
  registerChart(type: string, renderer: ChartRenderer): void
  
  // 渲染图表
  render(config: ChartConfig, container: HTMLElement): Promise<Chart>
  
  // 更新图表
  update(chart: Chart, data: any[]): Promise<void>
  
  // 销毁图表
  destroy(chart: Chart): void
}
// 图表配置
interface ChartConfig {
  type: ChartType
  data: DataSource
  options: ChartOptions
  interactions: InteractionConfig[]
  theme: ThemeConfig
}
// 支持的图表类型
enum ChartType {
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
```

### 2. 数据源管理 (Data Source)

```typescript
// 数据源管理器
interface DataSourceManager {
  // 注册数据源
  register(source: DataSource): Promise<void>
  
  // 获取数据
  query(config: QueryConfig): Promise<QueryResult>
  
  // 实时数据订阅
  subscribe(config: SubscribeConfig): Observable<any>
  
  // 缓存管理
  cache: CacheManager
}
// 数据源类型
enum DataSourceType {
  MySQL = 'mysql',
  PostgreSQL = 'postgresql',
  MongoDB = 'mongodb',
  Redis = 'redis',
  ClickHouse = 'clickhouse',
  ElasticSearch = 'elasticsearch',
  API = 'api',
  File = 'file',
  WebSocket = 'websocket'
}
// 查询配置
interface QueryConfig {
  source: string
  sql?: string
  filters?: Filter[]
  aggregations?: Aggregation[]
  pagination?: Pagination
  cache?: CacheConfig
}
```

### 3. 拖拽设计器 (Designer)

```typescript
// 设计器核心
interface Designer {
  // 画布操作
  canvas: CanvasManager
  
  // 组件库
  components: ComponentLibrary
  
  // 属性面板
  propertyPanel: PropertyPanel
  
  // 历史记录
  history: HistoryManager
  
  // 导出功能
  export(format: ExportFormat): Promise<ExportResult>
}
// 画布管理器
interface CanvasManager {
  // 添加组件
  addComponent(component: Component, position: Position): void
  
  // 选择组件
  selectComponent(id: string): void
  
  // 更新组件
  updateComponent(id: string, props: any): void
  
  // 删除组件
  removeComponent(id: string): void
  
  // 布局管理
  layout: LayoutManager
}
```

### 4. 主题系统 (Theme System)

```typescript
// 主题配置
interface ThemeConfig {
  name: string
  colors: ColorPalette
  typography: Typography
  spacing: Spacing
  components: ComponentTheme
}
// 色彩系统
interface ColorPalette {
  primary: string[]
  secondary: string[]
  success: string[]
  warning: string[]
  error: string[]
  neutral: string[]
}
// 主题管理器
interface ThemeManager {
  // 注册主题
  register(theme: ThemeConfig): void
  
  // 切换主题
  switch(name: string): void
  
  // 自定义主题
  customize(config: Partial<ThemeConfig>): ThemeConfig
  
  // 导出主题
  export(name: string): Promise<string>
}
```

## 状态管理架构

### Pinia Store 设计

```typescript
// 全局状态
export const useAppStore = defineStore('app', {
  state: () => ({
    user: null as User | null,
    theme: 'light' as ThemeMode,
    locale: 'zh-CN' as Locale,
    permissions: [] as Permission[]
  }),
  actions: {
    login(credentials: LoginCredentials): Promise<void>
    logout(): Promise<void>
    switchTheme(theme: ThemeMode): void
  }
})
// 仪表板状态
export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboards: [] as Dashboard[],
    currentDashboard: null as Dashboard | null,
    filters: {} as GlobalFilters,
    isEditing: false
  }),
  actions: {
    loadDashboard(id: string): Promise<void>
    saveDashboard(dashboard: Dashboard): Promise<void>
    applyFilters(filters: GlobalFilters): void
  }
})
// 图表状态
export const useChartStore = defineStore('chart', {
  state: () => ({
    charts: new Map<string, Chart>(),
    loading: new Set<string>(),
    errors: new Map<string, Error>()
  }),
  actions: {
    createChart(config: ChartConfig): Promise<string>
    updateChart(id: string, config: Partial<ChartConfig>): Promise<void>
    refreshChart(id: string): Promise<void>
  }
})
```

## 组件库设计

### 基础组件

```vue
<!-- 图表容器组件 -->
<template>
  <div class="bi-chart" :class="chartClasses">
    <div class="bi-chart__header" v-if="showHeader">
      <h3 class="bi chart__title">{{ title }}</h3>
      <div class="bi-chart__actions">
        <slot name="actions" />
      </div>
    </div>
    
    <div class="bi-chart__content" ref="chartContainer">
      <div class="bi-chart__loading" v-if="loading">
        <bi-loading />
      </div>
      <div class="bi-chart__error" v-else-if="error">
        <bi-error :message="error.message" @retry="handleRetry" />
      </div>
      <div class="bi-chart__empty" v-else-if="isEmpty">
        <bi-empty description="暂无数据" />
      </div>
    </div>
    
    <div class="bi-chart__footer" v-if="showFooter">
      <slot name="footer" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useChartEngine } from '@/composables/useChartEngine'
interface Props {
  config: ChartConfig
  title?: string
  showHeader?: boolean
  showFooter?: boolean
  autoResize?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showFooter: false,
  autoResize: true
})
const chartContainer = ref<HTMLElement>()
const { chart, loading, error, isEmpty, render, update, destroy } = useChartEngine()
const chartClasses = computed(() => ({
  'bi-chart--loading': loading.value,
  'bi-chart--error': error.value,
  'bi-chart--empty': isEmpty.value
}))
onMounted(async () => {
  if (chartContainer.value) {
    await render(props.config, chartContainer.value)
  }
})
onUnmounted(() => {
  destroy()
})
const handleRetry = () => {
  render(props.config, chartContainer.value!)
}
</script>
```

### 高级组件

```vue
<!-- 仪表板设计器 -->
<template>
  <div class="bi-designer">
    <div class="bi-designer__toolbar">
      <bi-toolbar 
        :actions="toolbarActions"
        @action="handleToolbarAction"
      />
    </div>
    
    <div class="bi-designer__main">
      <div class="bi-designer__sidebar">
        <bi-component-library 
          :components="componentLibrary"
          @drag-start="handleDragStart"
        />
      </div>
      
      <div class="bi-designer__canvas">
        <bi-canvas
          :components="canvasComponents"
          :grid-size="gridSize"
          :snap-to-grid="snapToGrid"
          @drop="handleDrop"
          @select="handleSelect"
          @update="handleUpdate"
        />
      </div>
      
      <div class="bi-designer__properties">
        <bi-property-panel
          :component="selectedComponent"
          @change="handlePropertyChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDesigner } from '@/composables/useDesigner'
const {
  componentLibrary,
  canvasComponents,
  selectedComponent,
  toolbarActions,
  gridSize,
  snapToGrid,
  handleDragStart,
  handleDrop,
  handleSelect,
  handleUpdate,
  handlePropertyChange,
  handleToolbarAction
} = useDesigner()
</script>
```

## 性能优化策略

### 1. 虚拟滚动

```typescript
// 大数据量表格虚拟滚动
export const useVirtualScroll = (
  data: Ref<any[]>,
  itemHeight: number,
  containerHeight: number
) => {
  const startIndex = ref(0)
  const endIndex = ref(0)
  const visibleData = computed(() => 
    data.value.slice(startIndex.value, endIndex.value)
  )
  
  const handleScroll = (scrollTop: number) => {
    startIndex.value = Math.floor(scrollTop / itemHeight)
    endIndex.value = Math.min(
      startIndex.value + Math.ceil(containerHeight / itemHeight) + 1,
      data.value.length
    )
  }
  
  return { visibleData, handleScroll }
}

```

### 2. 图表懒加载

```typescript
// 图表懒加载
export const useLazyChart = () => {
  const { stop, start } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        loadChart()
        stop()
      }
    }
  )
  
  return { start }
}

```

### 3. 数据缓存

```typescript
// 多级缓存策略
export class CacheManager {
  private memoryCache = new Map()
  private persistentCache: LocalForage
  
  async get(key: string): Promise<any> {
    // 内存缓存
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)
    }
    
    // 持久化缓存
    const cached = await this.persistentCache.getItem(key)
    if (cached) {
      this.memoryCache.set(key, cached)
      return cached
    }
    
    return null
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.memoryCache.set(key, value)
    await this.persistentCache.setItem(key, {
      data: value,
      timestamp: Date.now(),
      ttl
    })
  }
}

```

## 微前端架构

### Module Federation 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { federation } from '@originjs/vite-plugin-federation'
export default defineConfig({
  plugins: [
    federation({
      name: 'bi-dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/components/Dashboard.vue',
        './ChartEngine': './src/lib/chart-engine'
      },
      shared: {
        vue: { singleton: true },
        'element-plus': {},
        echarts: {}
      }
    })
  ]
})

```

## 开发工具链

### 脚手架工具

```shell
# 创建新组件
npm run create:component MyComponent
# 创建新图表类型  
npm run create:chart PieChart
# 创建新数据源连接器
npm run create:connector MySQLConnector
# 生成类型定义
npm run generate:types
# 构建文档
npm run build:docs

```

### 调试工具

```typescript
// 开发者工具扩展
export const BiDevTools = {
  // 图表调试
  debugChart(chartId: string) {
    const chart = chartStore.getChart(chartId)
    console.group(`Chart Debug: ${chartId}`)
    console.log('Config:', chart.config)
    console.log('Data:', chart.data)
    console.log('Performance:', chart.performance)
    console.groupEnd()
  },
  
  // 性能监控
  monitor() {
    // 监控渲染性能
    // 监控内存使用
    // 监控网络请求
  }
}

```

## 扩展性设计

### 插件系统

```typescript
// 插件接口
interface Plugin {
  name: string
  version: string
  install(app: App, options?: any): void
  uninstall?(): void
}
// 插件管理器
export class PluginManager {
  private plugins = new Map<string, Plugin>()
  
  register(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin)
  }
  
  install(name: string, app: App, options?: any): void {
    const plugin = this.plugins.get(name)
    if (plugin) {
      plugin.install(app, options)
    }
  }
}

```

### 主题扩展

```typescript
// 主题插件示例
export const CustomThemePlugin: Plugin = {
  name: 'custom-theme',
  version: '1.0.0',
  install(app, options) {
    const themeManager = app.config.globalProperties.$theme
    themeManager.register(options.theme)
  }
}

```

## 总结

这个架构设计提供了：

1.  高可扩展性 - 模块化设计、插件系统、微前端架构

2.  高性能 - 虚拟滚动、懒加载、多级缓存

3.  高可维护性 - TypeScript、单元测试、文档

4.  高可靠性 - 错误处理、监控、容器化部署

5.  用户友好 - 拖拽设计、主题系统、响应式设计
