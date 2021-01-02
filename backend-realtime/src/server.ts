import dotenv from 'dotenv'

import http from 'http'
import { promisify } from 'util'
import stoppable from 'stoppable'

import appExpress from './app'
import logger from './common/logger'
import { connectKafka } from './kafka'
import { environment } from './common/environment'
import { RegisterSocket } from './socket'

dotenv.config()

const TERMINATION_GRACE_PERIOD = 30

const { PORT, NODE_ENV, LOG_LEVEL } = environment()

/** **********************************************************************************
 *                              Create HTTP server
 ********************************************************************************** */
const httpServer = http.createServer(appExpress)
const app = stoppable(httpServer, TERMINATION_GRACE_PERIOD)

app.on('listening', async () => {
  logger.info(`Server started on PORT="${PORT}", NODE_ENV="${NODE_ENV}", LOG_LEVEL=${LOG_LEVEL}`)

  await connectKafka()

  if (NODE_ENV === 'dev') {
    logger.info(`Open: ws://localhost:${PORT}`)
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

RegisterSocket(httpServer)

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
