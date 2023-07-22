import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useSearchTasks } from '../searchTasks'
import { completeSmartProject, useListProjectsStore, useTasksStore } from '@/store'
import { liveListProject, tasks } from '@/tests/fixture'

describe('search tasks', () => {
  beforeEach(() => {
    createTestingPinia({
      createSpy: vi.fn,
    })

    const task_store = useTasksStore()
    vi.mocked(task_store.findAllTasksNotRemoved).mockResolvedValue(tasks)

    const list_project_store = useListProjectsStore()
    vi.mocked(list_project_store.findProject).mockReturnValue(liveListProject)

    const { resetSearchTasks } = useSearchTasks()
    resetSearchTasks()
  })

  it('should be search a task by title', async () => {
    const { searchTasks, filteredTasks } = useSearchTasks()

    await searchTasks('吃饭')

    expect(filteredTasks.value.length).toBe(1)
    const item = filteredTasks.value[0].item
    expect(item).toHaveProperty('id')
    expect(item.title).toBe('吃饭')
    expect(item).toHaveProperty('desc')
    expect(item).toHaveProperty('done')
    expect(item).toHaveProperty('from')
  })

  it('should be search a task by desc', async () => {
    const { searchTasks, filteredTasks } = useSearchTasks()

    await searchTasks('吃什')

    expect(filteredTasks.value.length).toBe(1)
  })

  it('should be not be found when a task does not exist', async () => {
    const { searchTasks, filteredTasks } = useSearchTasks()

    await searchTasks('xxx')

    expect(filteredTasks.value.length).toBe(0)
  })

  it('should be tasks project is listPrject when status is active', async () => {
    const { searchTasks, filteredTasks } = useSearchTasks()

    await searchTasks('吃饭')

    expect(filteredTasks.value[0].item.done).toBe(false)
    expect(filteredTasks.value[0].item.from?.name).toBe('生活')
  })

  it('should be tasks project is completeSmartProject when status is COMPLETED', async () => {
    const { searchTasks, filteredTasks } = useSearchTasks()

    await searchTasks('代码')

    expect(filteredTasks.value[0].item.done).toBe(true)
    expect(filteredTasks.value[0].item.from?.name).toBe(completeSmartProject.name)
  })

  it('should be reset tasks', async () => {
    const { searchTasks, resetSearchTasks, filteredTasks } = useSearchTasks()

    await searchTasks('吃饭')
    resetSearchTasks()

    expect(filteredTasks.value.length).toBe(0)
  })
})
