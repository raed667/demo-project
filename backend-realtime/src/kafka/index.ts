import { Kafka } from 'kafkajs'
import { environment } from '../common/environment'
const { KAFKA_HOST, KAFKA_PORT } = environment()
import logger, { LogCreator } from '../common/logger'

let isConnected = false

export const kafka = new Kafka({
  clientId: 'demo-app-backend-realtime',
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
  logCreator: LogCreator,
})

export const consumer = kafka.consumer({
  groupId: 'demo-app-backend-realtime',
  allowAutoTopicCreation: true,
  readUncommitted: true,
})

export const connectKafka = async () => {
  return await consumer.connect()
}

export const disconnectKafka = async () => {
  return await consumer.disconnect()
}

consumer.on('consumer.connect', ({ timestamp }) => {
  isConnected = true
  logger.debug(`Kafka consumer.connect, timestamp="${timestamp}"`)
})

consumer.on('consumer.disconnect', ({ timestamp }) => {
  isConnected = false
  logger.debug(`Kafka consumer.disconnect, timestamp="${timestamp}"`)
})

export const consumeTopic = async (topic: string) => {
  if (isConnected) {
    await consumer.subscribe({ topic, fromBeginning: true })
  }
  return Promise.resolve()
}
