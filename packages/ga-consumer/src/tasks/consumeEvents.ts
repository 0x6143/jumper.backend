import { SchemaRegistry } from '@kafkajs/confluent-schema-registry'
import { KafkaConsumer } from 'node-rdkafka'

import { EventType } from 'events-producer/src/schemas/event'
import { sendToGA } from '../services/google-analytics/ga'
import { config } from '../config'
import { logger } from '../services/logger'

export const start = async () => {
  // connect to schema registry
  const registry = new SchemaRegistry({ host: config.schemaRegistry.host })

  const consumer = new KafkaConsumer(
    {
      'group.id': config.kafka.groupId,
      'metadata.broker.list': config.kafka.brokers,
      'socket.keepalive.enable': true,
    },
    {}
  )

  consumer.connect()

  consumer
    .on('ready', () => {
      consumer.subscribe([config.kafka.topics.event])

      // get messages as soon as they are available.
      consumer.consume()
    })
    .on('data', async (data) => {
      logger.debug(data, 'received new message')

      if (!data.value) {
        return logger.error('message has no data!')
      }

      const decodedEvent: EventType = await registry.decode(data.value)

      // send event to google analytics
      try {
        sendToGA(decodedEvent)
        logger.debug(decodedEvent, 'event sent succesfully')
      } catch (e) {
        logger.error(e, 'an error occured when sending to GA')
      }
    })
}
