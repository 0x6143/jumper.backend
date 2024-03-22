import { RequestHandler } from 'express'

// health check should do a deeper check on service health, i.e. health of connection to kafka
export const get: RequestHandler = (_req, res, _next) => {
  res.status(200).json('OK!')
}
