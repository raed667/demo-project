import prometheus from 'prom-client'

export const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500], // buckets for response time from 0.1ms to 500ms
})

export const redisCacheHitCounter = new prometheus.Counter({
  name: 'redis_cache_hit_counter',
  help: 'Redis redis cache hit counter',
  labelNames: ['counter'],
})
