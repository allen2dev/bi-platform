import type { QueryConfig } from '@bi-platform/core'
import { createMockDataSourceManager, type MockHandler } from './mock-manager'

export * from './mock-manager'

/** Built-in mock datasets for demo / GitHub Pages */
export const mockDatasets = {
  salesTrend: [
    { category: '1月', value: 120 },
    { category: '2月', value: 200 },
    { category: '3月', value: 150 },
    { category: '4月', value: 280 },
    { category: '5月', value: 320 },
    { category: '6月', value: 410 }
  ],
  categoryShare: [
    { name: '华东', value: 335 },
    { name: '华北', value: 234 },
    { name: '华南', value: 154 },
    { name: '西部', value: 135 }
  ],
  regionBar: [
    { category: '上海', value: 420 },
    { category: '北京', value: 380 },
    { category: '深圳', value: 510 },
    { category: '杭州', value: 290 }
  ],
  dashboards: [
    {
      id: 'dash-1',
      name: '销售总览',
      description: '月度趋势与区域占比（Mock）',
      components: [],
      updatedAt: '2026-04-01T08:00:00.000Z'
    },
    {
      id: 'dash-2',
      name: '区域分析',
      description: '各城市销量对比（Mock）',
      components: [],
      updatedAt: '2026-04-15T10:30:00.000Z'
    }
  ]
} as const

function staticRows<T extends Record<string, unknown>>(rows: T[]): MockHandler {
  return async () => ({ rows: [...rows], total: rows.length })
}

export function createDefaultMockManager() {
  return createMockDataSourceManager({
    'mock/sales-trend': staticRows([...mockDatasets.salesTrend]),
    'mock/category-share': staticRows([...mockDatasets.categoryShare]),
    'mock/region-bar': staticRows([...mockDatasets.regionBar]),
    'mock/dashboards': async () => ({
      rows: [...mockDatasets.dashboards],
      total: mockDatasets.dashboards.length
    }),
    'mock/dashboard-layout': async (config: QueryConfig) => {
      const id = (config.filters?.find((f) => f.field === 'id')?.value as string) || 'dash-1'
      if (id === 'dash-2') {
        return {
          rows: [
            {
              id: 'dash-2',
              components: [
                {
                  id: 'c1',
                  type: 'chart',
                  label: '城市销量',
                  props: { chartType: 'bar', dataSourceId: 'mock/region-bar', title: '各城市销量' },
                  position: { x: 0, y: 0, w: 12, h: 5 }
                },
                {
                  id: 'c2',
                  type: 'kpi',
                  label: '总销量',
                  props: { value: 1600, suffix: '万', title: '汇总' },
                  position: { x: 0, y: 5, w: 4, h: 2 }
                }
              ]
            }
          ],
          total: 1
        }
      }
      return {
        rows: [
          {
            id: 'dash-1',
            components: [
              {
                id: 'c1',
                type: 'chart',
                label: '销售趋势',
                props: { chartType: 'line', dataSourceId: 'mock/sales-trend', title: '月度销售趋势' },
                position: { x: 0, y: 0, w: 8, h: 5 }
              },
              {
                id: 'c2',
                type: 'chart',
                label: '区域占比',
                props: { chartType: 'pie', dataSourceId: 'mock/category-share', title: '区域占比' },
                position: { x: 8, y: 0, w: 4, h: 5 }
              },
              {
                id: 'c3',
                type: 'text',
                label: '说明',
                props: { text: '数据来自本地 Mock，可部署到 GitHub Pages 离线预览。' },
                position: { x: 0, y: 5, w: 12, h: 1 }
              }
            ]
          }
        ],
        total: 1
      }
    }
  })
}
