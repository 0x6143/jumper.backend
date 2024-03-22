import { EventType } from 'events-producer/src/schemas/event'
import { sendToGA } from './ga'

describe('sendToGA', () => {
  it('sends expected data to ga', () => {
    const mockFetch = jest.fn().mockImplementation((_input: RequestInfo | URL, _init?: RequestInit | undefined) => {
      return Promise.resolve({
        ok: true,
        json: () => {},
      } as Response)
    })

    global.fetch = mockFetch

    const event: EventType = {
      client_id: 'test-client-id',
      data: { name: 'test-event', params: { randomKey: '"random-value"' } },
      timestamp: 1711050281646,
      user_id: 'test-user-id',
    }

    sendToGA(event)

    expect(mockFetch).toHaveBeenCalledWith('https://www.google-analytics.com/mp/collect?measurement_id=&api_secret=', {
      body: '{"client_id":"test-client-id","user_id":"test-user-id","events":[{"name":"test-event","params":{"randomKey":"random-value"}}]}',
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
  })
})
