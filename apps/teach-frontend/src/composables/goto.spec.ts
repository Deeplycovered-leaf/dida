import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRouter } from 'vue-router'
import { useGoto } from './goto'
import { RouteNames } from '@/router/const'

vi.mock('vue-router')

const push = vi.fn()
// eslint-disable-next-line @typescript-eslint/ban-types
vi.mocked(useRouter as () => { push: Function }).mockImplementation(() => {
  return {
    push,
  }
})

describe('goto', () => {
  beforeEach(() => {
    push.mockClear()
  })

  it('should be go to home page', () => {
    const { gotoHome } = useGoto()

    gotoHome()

    expect(push).toBeCalledWith({
      name: RouteNames.HOME,
    })
  })

  it('should be go to settings page', () => {
    const { gotoSettings } = useGoto()

    gotoSettings()

    expect(push).toBeCalledWith({
      name: RouteNames.SETTINGS,
    })
  })

  it('should be go to settings theme page', () => {
    const { gotoSettingsTheme } = useGoto()

    gotoSettingsTheme()

    expect(push).toBeCalledWith({
      name: RouteNames.SETTINGS_THEME,
    })
  })
})
