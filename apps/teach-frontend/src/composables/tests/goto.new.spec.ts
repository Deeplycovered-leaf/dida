import { describe, expect, it, vi } from 'vitest'
import { GITHUB_URL, goToLogin, openGithub, useGoto } from '../goto'
import { RouteNames } from '@/router/const'
import { setup_router, useSetup } from '@/tests/helper'

describe('goto', () => {
  it('should be go to home page', () => {
    const { router } = useSetup(() => {
      const { gotoHome } = useGoto()
      gotoHome()
    })

    expect(router.push).toBeCalledWith({
      name: RouteNames.HOME,
    })
  })

  it('should be go to settings page', () => {
    const { router } = useSetup(() => {
      const { gotoSettings } = useGoto()
      gotoSettings()
    })

    expect(router.push).toBeCalledWith({
      name: RouteNames.SETTINGS,
    })
  })

  it('should be go to settings theme page', () => {
    const { router } = useSetup(() => {
      const { gotoSettingsTheme } = useGoto()
      gotoSettingsTheme()
    })

    expect(router.push).toBeCalledWith({
      name: RouteNames.SETTINGS_THEME,
    })
  })

  it('should be go to github page', () => {
    vi.spyOn(window, 'open')

    openGithub()

    expect(window.open).toBeCalledWith(GITHUB_URL)
  })

  it('should go to login page', async () => {
    const router = setup_router()

    goToLogin()

    expect(router.replace).toBeCalledWith({ name: RouteNames.LOGIN })

    // const router = setup_router({ routes })

    // await goToLogin()

    // expect(router.currentRoute.value.name).toBe(RouteNames.LOGIN)
  })
})
