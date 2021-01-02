export interface IEnvironment {
  PORT: number
  NODE_ENV: NodeEnvironment
  KAFKA_HOST: string
  KAFKA_PORT: number
  LOG_LEVEL: LogLevel
}

export const validNodeEnvs = ['dev', 'test', 'prod'] as const
export type NodeEnvironment = typeof validNodeEnvs[number]

const validLogLevels = [
  'error',
  'warn',
  'help',
  'data',
  'info',
  'debug',
  'prompt',
  'http',
  'verbose',
  'input',
  'silly',
] as const

export type LogLevel = typeof validLogLevels[number]

const getEnvValue = (key: string) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} not found.`)
  }
  return value
}

const getNumericEnvValue = (key: string) => {
  const valueStr = getEnvValue(key)
  const value = parseInt(valueStr)
  if (isNaN(value) || value <= 0) {
    throw new Error(`Expected ${key} to be a positive integer, got="{value}"`)
  }
  return value
}

const getConstrainedEnvValue = <T extends string>(
  key: string,
  values: ReadonlyArray<T>,
  defaultValue?: T
) => {
  try {
    const value = getEnvValue(key)
    if (values.includes(value as T)) {
      return value as T
    }
    throw new Error(`Expected ${key} to be one of ${values.join(',')}`)
  } catch (e) {
    if (defaultValue) {
      return defaultValue
    }
    throw e
  }
}

export const environment = (): IEnvironment => {
  const PORT = getNumericEnvValue('PORT')
  const NODE_ENV = getConstrainedEnvValue('NODE_ENV', validNodeEnvs)
  const LOG_LEVEL = getConstrainedEnvValue('LOG_LEVEL', validLogLevels, 'info')

  // Kafka
  const KAFKA_HOST = getEnvValue('KAFKA_HOST')
  const KAFKA_PORT = getNumericEnvValue('KAFKA_PORT')

  return {
    PORT,
    NODE_ENV,
    LOG_LEVEL,
    KAFKA_HOST,
    KAFKA_PORT,
  }
}
