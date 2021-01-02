import { Kafka } from 'kafkajs'
import { environment } from '../common/environment'
const { KAFKA_HOST, KAFKA_PORT } = environment()
import logger, { LogCreator } from '../common/logger'

let isConnected = false

export const kafka = new Kafka({
  clientId: 'demo-app-backend',
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
  logCreator: LogCreator,
})

export const producer = kafka.producer({ idempotent: true })

export const connectKafka = async () => {
  return await producer.connect()
}

export const disconnectKafka = async () => {
  return await producer.disconnect()
}

producer.on('producer.connect', ({ timestamp }) => {
  isConnected = true
  logger.debug(`Kafka producer.connect, timestamp="${timestamp}"`)
})

producer.on('producer.disconnect', ({ timestamp }) => {
  isConnected = false
  logger.debug(`Kafka producer.disconnect, timestamp="${timestamp}"`)
})

export const produce = async (topic: string, key: string, value: string) => {
  if (isConnected) {
    return await producer.send({
      topic,
      messages: [{ key, value }],
    })
  }
  return Promise.resolve()
}
