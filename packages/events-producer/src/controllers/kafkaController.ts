import { RequestHandler } from 'express'
import { EventType } from '../schemas/event'
import * as producer from '../services/kafka/producer'
import { logger } from '../services/logger'

export const postEvent: RequestHandler = ({ body }, res, next) => {
  try {
    const event: EventType = {
      user_id: body.userId,
      client_id: body.clientId,
      timestamp: body.timestamp,
      data: {
        name: body.event.name,
        params: body.event.params,
      },
    }

    // validate mandatory fields exist
    if (!event.client_id || !event.timestamp || !event.data?.name) {
      logger.error(event, 'Received event is missing required fields')
      return
    }

    // stringify params so we can support arbitrary events
    event.data.params = Object.entries(event.data.params).reduce(
      (cur, [key, val]) => {
        cur[key] = JSON.stringify(val)
        return cur
      },
      {} as EventType['data']['params']
    )

    /**
     * fire and forget
     * in prod we would add metrics here to track throughput of messages
     */
    producer.produceEvent(event)
    logger.debug(event, 'message sent to Kafka successfully')

    res.status(204)
  } catch (err: unknown) {
    logger.error(err, 'error while sending message to Kafka')
    next(err)
  }
}
