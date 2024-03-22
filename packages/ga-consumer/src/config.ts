export const config = {
  port: Number(process.env.GA_CONSUMER_PORT) || 3002,
  logLevel: process.env.LOG_LEVEL || 'info',

  kafka: {
    groupId: process.env.KAFKA_CLIENT_ID || 'ga-consumer',
    brokers: process.env.KAFKA_BROKERS_LIST || 'localhost:29092',
    topics: {
      event: process.env.KAFKA_EVENTS_TOPIC || 'events',
    },
  },

  schemaRegistry: {
    host: process.env.SCHEMA_REGISTRY_HOST || 'http://localhost:8081',
  },

  ga: {
    url: process.env.GA_URL || 'https://www.google-analytics.com/mp/collect',
    apiSecret: process.env.GA_API_SECRET || '',
    measurementId: process.env.GA_MEASUREMENT_ID || '',
  },
}
