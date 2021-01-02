import express, { Request, Response, NextFunction } from 'express'
import prometheus from 'prom-client'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import 'express-async-errors'

import { httpRequestDurationMicroseconds } from './common/monitoring'
import { environment } from './common/environment'
import { registerRoutes } from './register-routes'
import { normalizePath } from './common/path-normalizer'

const { NODE_ENV } = environment()

/** **********************************************************************************
 *                              Create Express server
 ********************************************************************************** */
const appExpress = express()

/** **********************************************************************************
 *                              Set basic express settings
 ********************************************************************************** */
prometheus.collectDefaultMetrics()

appExpress.use(express.json())
appExpress.use(express.urlencoded({ extended: true }))

/** **********************************************************************************
 *                              Prometheus
 ********************************************************************************** */

// Used for metrics, runs before each request
appExpress.use((_req: Request, res: Response, next: NextFunction) => {
  res.locals.startEpoch = Date.now()
  next()
})

// Used for metrics, runs after each request
appExpress.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const responseTimeInMs = Date.now() - res.locals.startEpoch
    httpRequestDurationMicroseconds
      .labels(req.method, normalizePath(req.path), `${res.statusCode}`)
      .observe(responseTimeInMs)
  })
  next()
})

// Show routes called in console during development
if (NODE_ENV === 'dev') {
  appExpress.use(
    morgan('dev', {
      skip: (req: Request) => req.url.includes('metrics'),
    })
  )
}

appExpress.use('/api/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('./swagger.json')))
})

appExpress.get('/api/metrics', (_req: Request, res: Response) => {
  res.set('Content-Type', prometheus.register.contentType)
  res.end(prometheus.register.metrics())
})

/** **********************************************************************************
 *                              Register API routes
 ********************************************************************************** */
registerRoutes(appExpress)

/** **********************************************************************************
 *                              Start the Express server
 ********************************************************************************** */

// Export express instance
export default appExpress
