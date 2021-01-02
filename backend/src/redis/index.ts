import Redis from 'ioredis'
import { environment } from '../common/environment'
import logger from '../common/logger'

const { NODE_ENV, REDIS_HOST, REDIS_PORT } = environment()

const clients: { [key: string]: Redis.Redis | undefined } = {}
const errorCountArray: { [key: string]: number | undefined } = {}

export const getRedisClient = (key = NODE_ENV): Redis.Redis => {
  let client = clients[key]
  if (!client) {
    client = clients[key] = new Redis(REDIS_PORT, REDIS_HOST, {
      reconnectOnError: () => true,
      connectTimeout: 1000,
      lazyConnect: true,
      showFriendlyErrorStack: true,
    })

    client.on('connect', () => {
      logger.debug('Redis Ready')
    })

    client.on('error', (e) => {
      logger.error(e)
      let errorCount = errorCountArray[key]

      if (!errorCount) {
        errorCount = errorCountArray[key] = 1
      } else {
        // @ts-expect-error i know what i'm doing
        errorCountArray[key] += 1
      }

      if (errorCount > 10) {
        logger.warn('Redis tried 10 times disconnecting...')
        client?.disconnect()
      }
    })
  }

  client.setMaxListeners(100)

  return client
}
