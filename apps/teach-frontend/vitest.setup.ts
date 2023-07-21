import { VueRouterMock, createRouterMock, injectRouterMock } from 'vue-router-mock'
import { config } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

setup_router_mock()

function setup_router_mock() {
  const router_mock = createRouterMock({
    spy: {
      create: fn => vi.fn(fn),
      reset: spy => spy.mockClear(),
    },
  })

  config.plugins.VueWrapper.install(VueRouterMock)

  beforeEach(() => {
    router_mock.reset()
    injectRouterMock(router_mock)
  })
}
