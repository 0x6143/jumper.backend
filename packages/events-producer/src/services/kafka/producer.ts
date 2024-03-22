import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry'
import { RawAvroSchema } from '@kafkajs/confluent-schema-registry/dist/@types'
import { LibrdKafkaError, Producer } from 'node-rdkafka'

import { EventType, eventSchema } from '../../schemas/event'
import { config } from '../../config'
import { logger } from '../../services/logger'

/**
 * module scoped singleton client to persist connection to kafka & schema registry between messages
 */
let producer: Producer | undefined
let registry: SchemaRegistry | undefined

/**
 * module scoped map of schemas to id’s by name
 */
const schemas: Record<string, { definition: RawAvroSchema; topic: string; id?: number }> = {
  event: { definition: eventSchema, topic: config.kafka.topics.event },
}

const registerSchemas = async () => {
  if (!registry) {
    throw new Error('Kafka services are not ready!')
  }

  // loop through all schemas, register them and store the id’s
  for (const name in schemas) {
    const { id } = await registry.register({
      type: SchemaType.AVRO,
      schema: JSON.stringify(schemas[name].definition),
    })

    schemas[name].id = id
  }
}

export const initialize = async () => {
  // connect to schema registry
  registry = new SchemaRegistry({ host: config.schemaRegistry.host })

  // register all schemas on instantiation. (registration is idempotent)
  await registerSchemas()

  // config will need tweaking in prod
  const newProducer = new Producer({
    'client.id': config.kafka.clientId,
    'metadata.broker.list': config.kafka.brokers,
    'compression.codec': 'gzip',
    'retry.backoff.ms': 200,
    'message.send.max.retries': 10,
    'socket.keepalive.enable': true,
    'queue.buffering.max.messages': 100000,
    'queue.buffering.max.ms': 1000,
    'batch.num.messages': 1000000,
    dr_cb: false, // do not need delivery reports (these aren’t transactional messages)
  })

  // Connect to the broker
  newProducer.connect(undefined, (err: LibrdKafkaError) => {
    if (err) {
      logger.error(err)
      throw new Error('Error occured when connecting to the broker')
    }
  })

  // keep connection alive
  newProducer.setPollInterval(100)

  // global event error handler
  newProducer.on('event.error', (err) => {
    logger.error(err, 'Error received from producer')
  })

  // assign the client once the producer is ready
  newProducer.on('ready', () => {
    logger.info('Producer is ready!')
    producer = newProducer
  })
}

// wrapper around produce fn to encode messages before sending
export const produceEvent = async (event: EventType) => {
  if (!producer || !registry) {
    throw new Error('Kafka services are not ready!')
  }

  if (!schemas.event.id) {
    throw new Error("Unable to find registered schema for 'eventSchema'")
  }

  const message = await registry.encode(schemas.event.id, event)

  try {
    producer.produce(
      schemas.event.topic,
      null,
      Buffer.from(message), // message to send. Must be a buffer
      event.data.name, // message key (used for partitioning)
      Date.now()
    )
  } catch (err) {
    logger.error(err, 'A problem occurred when sending our message')
  }
}
