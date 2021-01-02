import bodyParser from 'body-parser'
import express from 'express'
import methodOverride from 'method-override'
import { environment } from './common/environment'
import logger from './common/logger'
import { OperationError } from './common/errors/operation-error'

import { StatusCodes } from 'http-status-codes'

interface IError {
  status?: number
  fields?: string[]
  message?: string
  name?: string
}

export const registerRoutes = (app: express.Express) => {
  app
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(methodOverride())
    .use((_req, res, next) => {
      if (environment().NODE_ENV === 'dev') {
        res.header('Access-Control-Allow-Origin', '*')
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        )
      }
      next()
    })

  app.use((_req, res: express.Response) => {
    res.status(StatusCodes.NOT_FOUND).send({
      message: 'Not Found',
    })
  })

  const getErrorBody = (err: unknown) => {
    if (err instanceof OperationError) {
      return {
        message: err.message,
        status: err.status,
      }
    } else {
      return {
        // @ts-expect-error error could have a message
        message: err.message || 'UNKNOWN_ERROR',
        // @ts-expect-error error could have a status
        status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
  }

  app.use(
    (err: IError, _req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (environment().NODE_ENV === 'dev') {
        logger.error(err)
      }

      const body = getErrorBody(err)
      res.status(Number(body.status)).json(body)
      next()
    }
  )
}
