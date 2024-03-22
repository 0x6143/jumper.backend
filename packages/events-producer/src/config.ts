export const config = {
  port: Number(process.env.EVENTS_PRODUCER_PORT) || 3001,
  logLevel: process.env.LOG_LEVEL || 'info',

  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'events-producer',
    brokers: process.env.KAFKA_BROKERS_LIST || 'localhost:29092',
    topics: {
      event: process.env.KAFKA_EVENTS_TOPIC || 'events',
    },
  },

  schemaRegistry: {
    host: process.env.SCHEMA_REGISTRY_HOST || 'http://localhost:8081',
  },
}
