import { beforeEach, describe, expect, it, vi } from 'vitest'
import AxiosMockAdapter from 'axios-mock-adapter'
import { http } from '../http'
import { cleanToken, setToken } from '@/utils/token'
import { goToLogin, messageError, messageRedirectToSignIn } from '@/composables'

vi.mock('@/composables/message')

describe('http', () => {
  let axios_mock: AxiosMockAdapter
  beforeEach(() => {
    axios_mock = new AxiosMockAdapter(http)

    cleanToken()
    vi.clearAllMocks()
  })

  it('should be set token in header when token exists', async () => {
    const token = 'token'
    setToken(token)

    axios_mock.onGet('/tasks').reply(200, {
      code: 0,
      data: null,
      message: '',
    })
    await http.get('/tasks')

    expect(axios_mock.history.get[0].headers?.Authorization).toBe(`Bearer ${token}`)
  })

  it('should return data of response when  code is 0', async () => {
    const data = 'data'
    axios_mock.onGet('/tasks').reply(200, {
      code: 0,
      data,
      message: '',
    })
    const result = await http.get('/tasks')

    expect(result).toBe(data)
  })

  it('should throw error and show error message when code not is 0', async () => {
    const message = 'error message'
    axios_mock.onGet('/tasks').reply(200, {
      code: 1,
      data: null,
      message,
    })
    await expect(() => http.get('/tasks')).rejects.toThrowError(message)
    expect(messageError).toBeCalledWith(message)
  })

  it('should redirct to sign in and throw error when http status code is 401', async () => {
    axios_mock.onGet('/tasks').reply(401)

    await expect(() => http.get('/tasks')).rejects.toThrowError()
    expect(messageRedirectToSignIn).toBeCalledWith(goToLogin)
  })
})
