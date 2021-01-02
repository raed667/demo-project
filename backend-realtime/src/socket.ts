import http from 'http'
import WebSocket from 'ws'
import { consumer } from './kafka'
import { EachMessagePayload } from 'kafkajs'
import logger from './common/logger'
import { Subject } from 'rxjs'

export const subject = new Subject()

export const RegisterSocket = async (server: http.Server) => {
  // Kafka
  await consumer.subscribe({ topic: 'todo-created', fromBeginning: false })
  consumer.run({
    eachMessage: async ({ message, topic }: EachMessagePayload) => {
      try {
        if (topic === 'todo-created' && message.value) {
          subject.next({
            todo: JSON.parse(message.value.toString()),
            timestamp: message.timestamp,
          })
        }
      } catch (error) {
        logger.warn(`Consumer error: ${error}`)
      }
    },
  })

  // WS
  const wss = new WebSocket.Server({ server, noServer: true })

  wss.on('connection', (ws) => {
    logger.debug('WS connection')

    const subscription = subject.subscribe((update) => {
      const payload = JSON.stringify(update)
      logger.debug(`WS send "${payload}"`)
      ws.send(JSON.stringify(payload))
    })

    ws.on('message', (message) => {
      logger.debug(`WS received "${message}"`)
    })

    ws.on('close', () => {
      subscription.unsubscribe()
      logger.debug('WS close-connection')
    })
  })
}
