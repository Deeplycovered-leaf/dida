import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RouterMock } from 'vue-router-mock'
import { RouteNames } from '../const'
import { routes } from '..'
import { cleanToken, setToken } from '@/utils/token'
import { setup_router } from '@/tests/helper'

describe('router', () => {
  // 跳转的页面需要权限
  //  1. 登录后，有token直接 跳转
  //  2. 没有token，跳转到登录页面
  // 跳转的页面不需要权限，直接跳转
  let router: RouterMock
  beforeEach(() => {
    cleanToken()
    router = setup_router({ routes, useRealNavigation: true })
  })

  describe('requires auth', () => {
    it('should go to task page when have token', async () => {
      setToken('token')
      await router.push({ name: RouteNames.TASK })

      expect(router.currentRoute.value.name).toBe(RouteNames.TASK)
    })

    it('should go to login page when no token', async () => {
      vi.useFakeTimers()
      router.push({ name: RouteNames.TASK })
      await vi.runAllTimersAsync()

      expect(router.currentRoute.value.name).toBe(RouteNames.LOGIN)
    })
  })

  it('should go to login page when no need auth', async () => {
    await router.push({ name: RouteNames.LOGIN })

    expect(router.currentRoute.value.name).toBe(RouteNames.LOGIN)
  })
})
