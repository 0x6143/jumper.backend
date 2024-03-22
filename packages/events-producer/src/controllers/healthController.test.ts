import { NextFunction, Request, Response } from 'express'
import { get } from './healthController'

describe('healthController', () => {
  it('should return 200 ok', async () => {
    const jsonMock = jest.fn()
    const statusMock = jest.fn(() => ({ json: jsonMock }))
    const resMock: Response = {
      status: statusMock,
    } as unknown as jest.Mocked<Response>

    get({} as Request, resMock, {} as NextFunction)
    expect(statusMock).toHaveBeenCalledWith(200)
    expect(jsonMock).toHaveBeenCalledWith('OK!')
  })
})
