import dotenv from 'dotenv'

import http from 'http'
import { promisify } from 'util'
import stoppable from 'stoppable'

import appExpress from './app'
import logger from './common/logger'
import { connectKafka } from './kafka'
import { getRedisClient } from './redis'
import { environment } from './common/environment'
import { createDBConnection } from './repository/database'

dotenv.config()

const TERMINATION_GRACE_PERIOD = 30

const { PORT, NODE_ENV, LOG_LEVEL, LOCAL_DOCKER } = environment()

const redis = getRedisClient()
/** **********************************************************************************
 *                              Create HTTP server
 ********************************************************************************** */

const app = stoppable(http.createServer(appExpress), TERMINATION_GRACE_PERIOD)

app.on('listening', async () => {
  logger.info(`Server started on PORT="${PORT}", NODE_ENV="${NODE_ENV}", LOG_LEVEL=${LOG_LEVEL}`)
  await createDBConnection()

  if (NODE_ENV === 'prod' || LOCAL_DOCKER) {
    logger.debug(`Connecting to Redis, NODE_ENV=${NODE_ENV}, LOCAL_DOCKER=${LOCAL_DOCKER}`)
    await redis.connect()
    logger.debug(`Connecting to Kafka, NODE_ENV=${NODE_ENV}, LOCAL_DOCKER=${LOCAL_DOCKER}`)
    await connectKafka()
  } else {
    logger.debug(`Will not connect to services, NODE_ENV=${NODE_ENV}, LOCAL_DOCKER=${LOCAL_DOCKER}`)
  }

  if (NODE_ENV === 'dev') {
    logger.info(`Open: http://localhost:${PORT}/api/docs`)
  }
})

app.on('error', (error: any) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`

  switch (error.code) {
    case 'EACCES':
      logger.error(`Port: ${bind} requires elevated privileges`)
      process.exit(1)
    case 'EADDRINUSE':
      logger.error(`$Port: ${bind} is already in use`)
      process.exit(1)
    default:
      throw error
  }
})

const handleSignal = (signal: string) => async () => {
  try {
    logger.warn(`Got ${signal}. Graceful shutdown start`, new Date().toISOString())
    const stopAppServer = promisify(app.stop)
    await Promise.all([stopAppServer()])
    logger.warn('Successful graceful shutdown', new Date().toISOString())
    process.exit(0)
  } catch (error) {
    logger.warn('Error during graceful shutdown', error)
    process.exit(1)
  }
}

process.on('SIGTERM', handleSignal('SIGTERM'))
process.on('SIGINT', handleSignal('SIGINT'))

// Export http server
export const server = async () => {
  app.listen(PORT)
}
