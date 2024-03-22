import express, { ErrorRequestHandler } from 'express'

import * as consumeEvents from './tasks/consumeEvents'
import { router } from './routes/router'
import { config } from './config'
import { logger } from './services/logger'

const app = express()
const PORT = config.port

/**
 * error handler middleware
 */
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500
  logger.error(err)
  res.status(statusCode).json({ message: err.message })

  return
}

app.use(errorHandler)

app.use('/', router)

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running at http://localhost:${PORT}`)

  consumeEvents
    .start()
    .then(() => {
      logger.info('GA Consumer is waiting for messages..')
    })
    .catch(() => {
      throw new Error('An error occured in the consumer!')
    })
})
