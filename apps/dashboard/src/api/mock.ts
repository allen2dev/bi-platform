import { createDefaultMockManager } from '@bi-platform/data-source'

const manager = createDefaultMockManager()

export async function mockFetch<T = unknown>(
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<T> {
  await new Promise((r) => setTimeout(r, 120))
  if (path === '/api/dashboards') {
    const res = await manager.query({ source: 'mock/dashboards' })
    return res as T
  }
  if (path.startsWith('/api/dashboard/')) {
    const id = path.split('/').pop() ?? 'dash-1'
    const res = await manager.query({
      source: 'mock/dashboard-layout',
      filters: [{ field: 'id', op: 'eq', value: id }]
    })
    const row = res.rows[0] as { components?: unknown[] } | undefined
    return (row ?? { components: [] }) as T
  }
  if (path === '/api/query' && init?.body) {
    const body = init.body as { source: string }
    const res = await manager.query({ source: body.source })
    return (res.rows ?? []) as T
  }
  throw new Error(`Unknown mock path: ${path}`)
}

export function getMockManager() {
  return manager
}
