import { mount } from '@vue/test-utils'
import type { createRouterMock } from 'vue-router-mock'

export function useSetup(setup: () => void) {
  const comp = {
    setup,
    render() {},
  }
  const wrapper = mount(comp)

  return {
    wrapper,
    router: wrapper.router as ReturnType<typeof createRouterMock>,
  }
}
