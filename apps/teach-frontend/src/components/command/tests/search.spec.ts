import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearch } from '../search'

const searchTasks = vi.fn()
const resetSearchTasks = vi.fn()
vi.mock('../searchTasks.ts', () => {
  return {
    useSearchTasks() {
      return {
        searchTasks, resetSearchTasks,
      }
    },
  }
})

const searchCommands = vi.fn()
const resetSearchCommands = vi.fn()
vi.mock('../searchCommands.ts', () => {
  return {
    useSearchCommands() {
      return {
        searchCommands, resetSearchCommands,
      }
    },
  }
})

describe('search', () => {
  beforeEach(async () => {
    vi.useFakeTimers()

    const { resetSearch } = useSearch()
    resetSearch()

    await vi.runAllTimersAsync()

    searchTasks.mockClear()
    resetSearchTasks.mockClear()
    searchCommands.mockClear()
    resetSearchCommands.mockClear()
  })

  it('should be loading is true when search is start', async () => {
    const { search, loading } = useSearch()

    search.value = 'test'

    await vi.advanceTimersToNextTimerAsync()

    expect(loading.value).toBe(true)
  })

  it('should be loading is false when search is end', async () => {
    const { search, loading } = useSearch()

    search.value = 'test'

    // await vi.advanceTimersToNextTimerAsync()
    // await vi.advanceTimersToNextTimerAsync()

    await vi.runAllTimersAsync()

    expect(loading.value).toBe(false)
  })

  it('should be searching is true when search is end', async () => {
    const { search, searching } = useSearch()

    search.value = 'test'

    await vi.runAllTimersAsync()

    expect(searching.value).toBe(true)
  })

  it('should be search tasks', async () => {
    const { search } = useSearch()

    search.value = 'test'

    await vi.runAllTimersAsync()

    expect(searchTasks).toBeCalledWith('test')
  })

  describe('search command', () => {
    it('should be search tasks command', async () => {
      const { search } = useSearch()

      search.value = '>test'

      await vi.runAllTimersAsync()

      expect(searchCommands).toBeCalledWith('test')
    })

    it('search tasks command remove trailing white space', async () => {
      const { search } = useSearch()

      search.value = '>test  '

      await vi.runAllTimersAsync()

      expect(searchCommands).toBeCalledWith('test')
    })
  })

  it('should be reset when search is empty', async () => {
    const { search, loading, searching } = useSearch()

    search.value = 'test'
    await vi.runAllTimersAsync()
    search.value = ''
    await vi.runAllTimersAsync()

    expect(loading.value).toBe(false)
    expect(searching.value).toBe(false)
    expect(resetSearchTasks).toBeCalled()
    expect(resetSearchCommands).toBeCalled()
  })
})
