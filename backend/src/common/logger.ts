import { createLogger, format, transports } from 'winston'
import { logLevel } from 'kafkajs'
import { environment } from './environment'
// Import Functions
const { File, Console } = transports
const { LOG_LEVEL } = environment()

// Init logger
const logger = createLogger({
  level: LOG_LEVEL,
})

/**
 * For production write to all logs with level `info` and below
 * to `combined.log. Write all logs error (and below) to `error.log`.
 * For development, print to the console.
 */
if (process.env.NODE_ENV === 'production') {
  const fileFormat = format.combine(format.timestamp(), format.json())
  const errTransport = new File({
    filename: './logs/error.log',
    format: fileFormat,
    level: 'error',
  })
  const infoTransport = new File({
    filename: './logs/combined.log',
    format: fileFormat,
  })
  logger.add(errTransport)
  logger.add(infoTransport)
} else {
  const errorStackFormat = format((info) => {
    if (info.stack) {
      // tslint:disable-next-line:no-console
      console.log(info.stack)
      return false
    }
    return info
  })
  const consoleTransport = new Console({
    format: format.combine(format.colorize(), format.simple(), errorStackFormat()),
  })
  logger.add(consoleTransport)
}

export const kafkaToWinstonLogLevel = (level: logLevel) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error'
    case logLevel.WARN:
      return 'warn'
    case logLevel.INFO:
      return 'info'
    case logLevel.DEBUG:
      return 'debug'
  }
}

export const LogCreator = () => {
  return ({ level, log }: any) => {
    const { message, ...extra } = log
    logger.log({
      level: kafkaToWinstonLogLevel(level),
      message,
      extra,
    })
  }
}

export default logger
