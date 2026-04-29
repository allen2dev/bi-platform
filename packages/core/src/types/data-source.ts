export enum DataSourceType {
  MySQL = 'mysql',
  PostgreSQL = 'postgresql',
  MongoDB = 'mongodb',
  Redis = 'redis',
  ClickHouse = 'clickhouse',
  ElasticSearch = 'elasticsearch',
  API = 'api',
  File = 'file',
  WebSocket = 'websocket',
  Mock = 'mock'
}

export interface Filter {
  field: string
  op: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: unknown
}

export interface Aggregation {
  field: string
  fn: 'sum' | 'avg' | 'count' | 'min' | 'max'
}

export interface Pagination {
  page: number
  pageSize: number
}

export interface CacheConfig {
  ttlMs?: number
}

export interface QueryConfig {
  source: string
  sql?: string
  filters?: Filter[]
  aggregations?: Aggregation[]
  pagination?: Pagination
  cache?: CacheConfig
}

export interface QueryResult<T = unknown> {
  rows: T[]
  total?: number
}
