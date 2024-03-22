import express, { ErrorRequestHandler } from 'express'
import cors from 'cors'
import httpLogger from 'pino-http'

import * as producer from './services/kafka/producer'
import { router } from './routes/router'
import { config } from './config'
import { logger } from './services/logger'

const app = express()
const PORT = config.port

/**
 * initialize Kafka client
 */
producer.initialize()

/**
 * leverage built in json body parser for all requests
 */
app.use(express.json())

/**
 * cors config
 * prod config should configure this correctly
 * locally we can accept all requests from anywhere
 */
app.use(cors())

/**
 * logger middleware
 */
app.use(httpLogger({ logger }))

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
  logger.info(`server is running at http://localhost:${PORT}`)
})
