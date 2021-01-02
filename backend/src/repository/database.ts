import * as path from 'path'
import { environment } from '../common/environment'
import { ConnectionOptions, Connection, createConnection, getConnection } from 'typeorm'
import { Todo } from './model/todo'
import logger from '../common/logger'

export const root: string = path.resolve(__dirname, '../../')
const { NODE_ENV, PG_HOST, PG_PASSWORD, PG_PORT, PG_USERNAME, LOCAL_DOCKER } = environment()

const createSQLiteConnection = async (): Promise<Connection> => {
  const options: ConnectionOptions = {
    name: 'dev',
    type: 'sqlite',
    database: `${root}/data/dev_db.sqlite`,
    entities: [Todo],
    logging: ['warn', 'error'],
    synchronize: false,
    dropSchema: false,
    migrationsRun: true,
    migrations: [path.join(path.resolve(__dirname), '/migrations/*{.ts,.js}')],
    cli: {
      migrationsDir: 'src/repository/migrations',
    },
  }

  const connection = await createConnection(options)
  return connection
}

export const createPGConnection = async (): Promise<Connection> => {
  const options: ConnectionOptions = {
    name: 'prod',
    type: 'postgres',
    host: PG_HOST,
    port: PG_PORT,
    username: PG_USERNAME,
    password: PG_PASSWORD,
    entities: [Todo],
    logging: ['warn', 'error'],
    synchronize: false,
    dropSchema: false,
    migrationsRun: true,
    migrations: [path.join(path.resolve(__dirname), '/migrations/*{.ts,.js}')],
    cli: {
      migrationsDir: 'src/repository/migrations',
    },
  }

  const connection = await createConnection(options)
  return connection
}

export const createDBConnection = async (): Promise<Connection> => {
  if (NODE_ENV === 'prod' || LOCAL_DOCKER) {
    logger.debug(`Connecting to PostgreSQL, NODE_ENV=${NODE_ENV}, LOCAL_DOCKER=${LOCAL_DOCKER}`)
    return await createPGConnection()
  }
  logger.debug(`Connecting to SQLite, NODE_ENV=${NODE_ENV}, LOCAL_DOCKER=${LOCAL_DOCKER}`)
  return await createSQLiteConnection()
}

export const getDbConnection = async (): Promise<Connection> => {
  try {
    const connectionName = LOCAL_DOCKER ? 'prod' : NODE_ENV
    return getConnection(connectionName)
  } catch {
    return await createDBConnection()
  }
}
