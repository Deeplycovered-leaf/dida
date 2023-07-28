import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { useSearchCommands } from '../searchCommands'
import { useCommand } from '@/composables/command'

describe('searchCommands', () => {
  beforeAll(() => {
    const commands = useCommand()
    commands.addCommand({ name: '前往主页', execute() {} })
    commands.addCommand({ name: '切换皮肤', execute() {} })
  })

  beforeEach(() => {
    const { resetSearchCommands } = useSearchCommands()
    resetSearchCommands()
  })
  it('should be search a command', () => {
    const { searchCommands, filteredCommands } = useSearchCommands()

    searchCommands('主页')

    expect(filteredCommands.value.length).toBe(1)
    expect(filteredCommands.value[0].name).toBe('前往主页')
  })

  it('should be search all command', () => {
    const { searchCommands, filteredCommands } = useSearchCommands()

    searchCommands('')

    expect(filteredCommands.value.length).toBe(2)
  })
})
