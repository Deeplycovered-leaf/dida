import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VueRouterMock, createRouterMock, injectRouterMock } from 'vue-router-mock'
import { config, mount } from '@vue/test-utils'
import { useGoto } from './goto'
import { RouteNames } from '@/router/const'

const router_mock = createRouterMock({
  spy: {
    create: fn => vi.fn(fn),
    reset: spy => spy.mockClear(),
  },
})

config.plugins.VueWrapper.install(VueRouterMock)

describe('goto', () => {
  beforeEach(() => {
    router_mock.reset()
    injectRouterMock(router_mock)
  })
  it('should be go to home page', () => {
    const comp = {
      setup() {
        const { gotoHome } = useGoto()
        gotoHome()
      },
    }
    const wrapper = mount(comp)
    const router = wrapper.router

    expect(router.push).toBeCalledWith({
      name: RouteNames.HOME,
    })
  })

  it('should be go to settings page', () => {
    const comp = {
      setup() {
        const { gotoSettings } = useGoto()
        gotoSettings()
      },
    }
    const wrapper = mount(comp)
    const router = wrapper.router

    expect(router.push).toBeCalledWith({
      name: RouteNames.SETTINGS,
    })
  })

  it('should be go to settings theme page', () => {
    const comp = {
      setup() {
        const { gotoSettingsTheme } = useGoto()
        gotoSettingsTheme()
      },
    }
    const wrapper = mount(comp)
    const router = wrapper.router

    expect(router.push).toBeCalledWith({
      name: RouteNames.SETTINGS_THEME,
    })
  })
})
