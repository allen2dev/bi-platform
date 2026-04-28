import type { QueryConfig, QueryResult } from '@bi-platform/core'

export type MockDataset = Record<string, unknown>[]

export type MockHandler = (config: QueryConfig) => Promise<QueryResult>

export interface DataSourceManager {
  register(sourceId: string, handler: MockHandler): Promise<void>
  query(config: QueryConfig): Promise<QueryResult>
  cache: CacheManager
}

export class CacheManager {
  private memory = new Map<string, { value: unknown; expires: number }>()

  async get<T>(key: string): Promise<T | null> {
    const row = this.memory.get(key)
    if (!row) return null
    if (row.expires && Date.now() > row.expires) {
      this.memory.delete(key)
      return null
    }
    return row.value as T
  }

  async set(key: string, value: unknown, ttlMs?: number): Promise<void> {
    const expires = ttlMs ? Date.now() + ttlMs : 0
    this.memory.set(key, { value, expires })
  }

  invalidate(prefix?: string): void {
    if (!prefix) {
      this.memory.clear()
      return
    }
    for (const k of this.memory.keys()) {
      if (k.startsWith(prefix)) this.memory.delete(k)
    }
  }
}

function cacheKey(config: QueryConfig): string {
  return JSON.stringify({
    source: config.source,
    sql: config.sql,
    filters: config.filters,
    pagination: config.pagination
  })
}

export function createMockDataSourceManager(handlers: Record<string, MockHandler>): DataSourceManager {
  const registry = new Map<string, MockHandler>(Object.entries(handlers))
  const cache = new CacheManager()

  return {
    async register(sourceId, handler) {
      registry.set(sourceId, handler)
    },
    async query(config) {
      const ttl = config.cache?.ttlMs
      const key = cacheKey(config)
      if (ttl) {
        const hit = await cache.get<QueryResult>(key)
        if (hit) return hit
      }
      const handler = registry.get(config.source)
      if (!handler) {
        return { rows: [], total: 0 }
      }
      const result = await handler(config)
      if (ttl) await cache.set(key, result, ttl)
      return result
    },
    cache
  }
}
