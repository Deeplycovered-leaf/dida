import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  TaskStatus,
  completeSmartProject,
  trashSmartProject,
  useTasksSelectorStore,
} from '@/store'
import { fetchAllTasks } from '@/api'
import { liveListProject } from '@/tests/fixture'

vi.mock('@/api')

vi.mocked(fetchAllTasks).mockResolvedValue([])

describe('tasks selector store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should be current selector is list project', async () => {
    const tasks_selector_store = useTasksSelectorStore()

    await tasks_selector_store.setCurrentSelector(liveListProject)

    expect(tasks_selector_store.currentSelector).toEqual(liveListProject)
    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.ACTIVE, pId: liveListProject.id })
  })

  it('should be current selector is smart project', async () => {
    const tasks_selector_store = useTasksSelectorStore()

    await tasks_selector_store.setCurrentSelector(completeSmartProject)

    expect(tasks_selector_store.currentSelector).toEqual(completeSmartProject)
    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.COMPLETED, sortBy: 'updatedAt' })
  })

  it('should be current selector is complete smart project', async () => {
    const tasks_selector_store = useTasksSelectorStore()

    await tasks_selector_store.setCurrentSelector(completeSmartProject)

    expect(tasks_selector_store.currentSelector).toEqual(completeSmartProject)
    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.COMPLETED, sortBy: 'updatedAt' })
  })

  it('should be current selector is trash smart project', async () => {
    const tasks_selector_store = useTasksSelectorStore()

    await tasks_selector_store.setCurrentSelector(trashSmartProject)

    expect(tasks_selector_store.currentSelector).toEqual(trashSmartProject)
    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.REMOVED, sortBy: 'updatedAt' })
  })
})
