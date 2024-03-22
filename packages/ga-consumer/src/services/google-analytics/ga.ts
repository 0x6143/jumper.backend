import { EventType } from 'events-producer/src/schemas/event'
import { config } from '../../config'

export const sendToGA = async (event: EventType) => {
  const URL = `${config.ga.url}?measurement_id=${config.ga.measurementId}&api_secret=${config.ga.apiSecret}`

  // each param is stringified so we need to parse it before sending
  const parsedEventParams = Object.entries(event.data.params).reduce(
    (cur, [key, val]) => {
      // data is a reserved keyword in GA, so this is a workaround
      if (key === 'data') {
        return { ...cur, ...JSON.parse(val) }
      }

      cur[key] = JSON.parse(val)
      return cur
    },
    {} as EventType['data']['params']
  )

  return await fetch(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      client_id: event.client_id,
      user_id: event.user_id,
      events: [
        {
          name: event.data.name,
          params: parsedEventParams,
        },
      ],
    }),
  })
}
