import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useSearch } from '../search'
import { useSearchTasks } from '../searchTasks'
import { useSearchCommands } from '../searchCommands'
import { completeSmartProject, useListProjectsStore, useTasksStore } from '@/store'
import { liveListProject, tasks } from '@/tests/fixture'
import { useCommand } from '@/composables/command'

describe('search', () => {
  beforeAll(() => {
    const { addCommand } = useCommand()
    addCommand({ name: '前往主页', execute() {} })
    addCommand({ name: '切换皮肤', execute() {} })
  })

  beforeEach(async () => {
    vi.useFakeTimers()

    createTestingPinia({
      createSpy: vi.fn,
    })

    const task_store = useTasksStore()
    vi.mocked(task_store.findAllTasksNotRemoved).mockResolvedValue(tasks)

    const list_project_store = useListProjectsStore()
    vi.mocked(list_project_store.findProject).mockReturnValue(liveListProject)

    // const { resetSearch } = useSearch()
    // resetSearch()

    // await vi.runAllTimersAsync()
  })

  describe('ui state', () => {
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
  })

  describe('search tasks', () => {
    it('should be search tasks by title', async () => {
      const { search } = useSearch()
      const { filteredTasks } = useSearchTasks()

      search.value = '吃饭'

      await vi.runAllTimersAsync()

      expect(filteredTasks.value.length).toBe(1)
      const item = filteredTasks.value[0].item
      expect(item).toHaveProperty('id')
      expect(item.title).toBe('吃饭')
      expect(item).toHaveProperty('desc')
      expect(item).toHaveProperty('done')
      expect(item).toHaveProperty('from')
    })

    it('should be search a task by desc', async () => {
      const { search } = useSearch()
      const { filteredTasks } = useSearchTasks()

      search.value = '吃什'

      await vi.runAllTimersAsync()

      expect(filteredTasks.value.length).toBe(1)
      expect(filteredTasks.value[0].item.title).toBe('吃饭')
    })

    it('should be not be found when a task does not exist', async () => {
      const { search } = useSearch()
      const { filteredTasks } = useSearchTasks()

      search.value = 'xxx'

      await vi.runAllTimersAsync()

      expect(filteredTasks.value.length).toBe(0)
    })

    it('should be tasks project is listPrject when status is active', async () => {
      const { search } = useSearch()
      const { filteredTasks } = useSearchTasks()

      search.value = '吃饭'
      await vi.runAllTimersAsync()

      expect(filteredTasks.value[0].item.done).toBe(false)
      expect(filteredTasks.value[0].item.from?.name).toBe('生活')
    })

    it('should be tasks project is completeSmartProject when status is COMPLETED', async () => {
      const { search } = useSearch()
      const { filteredTasks } = useSearchTasks()

      search.value = '代码'

      await vi.runAllTimersAsync()

      expect(filteredTasks.value[0].item.done).toBe(true)
      expect(filteredTasks.value[0].item.from?.name).toBe(completeSmartProject.name)
    })
  })

  describe('search command', () => {
    it('normal', async () => {
      const { search } = useSearch()
      const { filteredCommands } = useSearchCommands()

      search.value = '>主页'

      await vi.runAllTimersAsync()

      expect(filteredCommands.value.length).toBe(1)
      expect(filteredCommands.value[0].name).toBe('前往主页')
    })

    it('remove trailing white space', async () => {
      const { search } = useSearch()
      const { filteredCommands } = useSearchCommands()

      search.value = '>主页  '

      await vi.runAllTimersAsync()

      expect(filteredCommands.value[0].name).toBe('前往主页')
    })

    it('should be search all command', async () => {
      const { search } = useSearch()
      const { filteredCommands } = useSearchCommands()

      search.value = '>'

      await vi.runAllTimersAsync()
      expect(filteredCommands.value.length).toBe(2)
    })
  })

  it('should be reset when search is empty', async () => {
    const { search, loading, searching } = useSearch()
    const { filteredCommands } = useSearchCommands()
    const { filteredTasks } = useSearchTasks()

    search.value = 'test'
    await vi.runAllTimersAsync()
    search.value = '>主页'
    await vi.runAllTimersAsync()
    search.value = ''
    await vi.runAllTimersAsync()

    expect(loading.value).toBe(false)
    expect(searching.value).toBe(false)
    expect(filteredCommands.value.length).toBe(2)
    expect(filteredTasks.value.length).toBe(0)
  })
})
