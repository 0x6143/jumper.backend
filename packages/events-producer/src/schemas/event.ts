import { RawAvroSchema } from '@kafkajs/confluent-schema-registry/dist/@types'

/**
 * type definition for the event schema.
 * note that this must match exactly the avro schema deifnition
 *
 * Using snake case here as it plays nicer with kafka tooling
 */
export type EventType = {
  user_id: string
  client_id: string
  timestamp: number
  data: {
    name: string
    params: Record<string, string>
  }
}

export const eventSchema: RawAvroSchema = {
  type: 'record',
  namespace: 'jumper.exchange',
  name: 'event',
  fields: [
    { name: 'user_id', type: 'string', default: '' },
    { name: 'client_id', type: 'string' },
    { name: 'timestamp', type: 'long' },
    {
      name: 'data',
      type: {
        name: 'data',
        type: 'record',
        fields: [
          { name: 'name', type: 'string' },
          {
            name: 'params',
            type: {
              type: 'map',
              values: 'string',
              default: {},
            },
          },
        ],
      },
    },
  ],
}
