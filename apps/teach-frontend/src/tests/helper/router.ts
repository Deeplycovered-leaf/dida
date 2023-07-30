import { vi } from 'vitest'
import { createRouterMock } from 'vue-router-mock'
import type { RouterMockOptions } from 'vue-router-mock'
import { setRouterInstance, setupRouterGuard } from '@/router'

export function setup_router(options?: RouterMockOptions) {
  const router = createRouterMock({
    spy: {
      create: fn => vi.fn(fn),
      reset: spy => spy.mockClear(),
    },
    ...options,
  })

  setupRouterGuard(router)

  setRouterInstance(router)

  return router
}
