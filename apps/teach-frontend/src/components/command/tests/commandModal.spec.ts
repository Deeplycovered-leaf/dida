import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed } from 'vue'
import { useCommandModal } from '../commandModal'
import { fireEvent, useSetup } from '@/tests/helper'
import * as misc from '@/composables/misc'

// vi.mock('@/composables/misc', () => {
//   return {
//     useIsMac() {
//       return computed(() => true)
//     },
//   }
// })

describe('commandModal', () => {
  beforeEach(() => {
    const { closeCommandModal } = useCommandModal()
    closeCommandModal()
  })

  it('should be open modal', () => {
    const { showCommandModal, openCommandModal } = useCommandModal()

    openCommandModal()

    expect(showCommandModal.value).toBe(true)
  })

  it('should be close modal', () => {
    const { showCommandModal, closeCommandModal } = useCommandModal()

    closeCommandModal()

    expect(showCommandModal.value).toBe(false)
  })

  it('should be open modal with cmd+k in macos', () => {
    vi.spyOn(misc, 'useIsMac').mockReturnValue(computed(() => true))

    const { registerKeyboardShortcut, showCommandModal } = useCommandModal()

    const { wrapper } = useSetup(() => {
      registerKeyboardShortcut()
    })

    fireEvent.keyDown({
      key: 'k',
      metaKey: true,
    })

    expect(showCommandModal.value).toBe(true)

    wrapper.unmount()
  })

  it('should be open modal with ctrl+k in windows', () => {
    vi.spyOn(misc, 'useIsMac').mockReturnValue(computed(() => false))

    const { registerKeyboardShortcut, showCommandModal } = useCommandModal()

    const { wrapper } = useSetup(() => {
      registerKeyboardShortcut()
    })

    fireEvent.keyDown({
      key: 'k',
      ctrlKey: true,
    })

    expect(showCommandModal.value).toBe(true)

    wrapper.unmount()
  })
})
