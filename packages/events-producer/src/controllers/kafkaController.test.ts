import { NextFunction, Request, Response } from 'express'
import { postEvent } from './kafkaController'
import * as producer from '../services/kafka/producer'

jest.mock('../services/kafka/producer')

describe('kafkaController', () => {
  it('should return a 204 code', async () => {
    const statusMock = jest.fn()
    const resMock: Response = {
      status: statusMock,
    } as unknown as jest.Mocked<Response>

    const reqMock = {
      body: {
        userId: 'test-user-id',
        clientId: 'test-client-id',
        timestamp: 1711050281646,
        event: {
          name: 'test-event',
          params: {
            randomKey: 'random-value',
          },
        },
      },
    }

    postEvent(reqMock as Request, resMock, jest.fn() as NextFunction)

    expect(statusMock).toHaveBeenCalledWith(204)
  })

  it('should call produceEvent on the producer with expected data', async () => {
    const resMock: Response = {
      status: jest.fn(),
    } as unknown as jest.Mocked<Response>

    const reqMock = {
      body: {
        userId: 'test-user-id',
        clientId: 'test-client-id',
        timestamp: 1711050281646,
        event: {
          name: 'test-event',
          params: {
            randomKey: 'random-value',
          },
        },
      },
    }

    postEvent(reqMock as Request, resMock, jest.fn() as NextFunction)

    expect(producer.produceEvent).toHaveBeenCalledWith({
      client_id: 'test-client-id',
      data: { name: 'test-event', params: { randomKey: '"random-value"' } },
      timestamp: 1711050281646,
      user_id: 'test-user-id',
    })
  })
})
