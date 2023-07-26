import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { create_task_response } from './tasks.spec'
import {
  SmartProjectName,
  TaskStatus,
  completeSmartProject,
  loadSmartProjectTasks,
  trashSmartProject,
  useSmartProjects,
  useTasksSelectorStore,
} from '@/store'
import { fetchAllTasks } from '@/api'

vi.mock('@/api')

vi.mocked(fetchAllTasks).mockResolvedValue([])

describe('smart projects store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should be select complete project when project name is complete', async () => {
    const smart_project_store = useSmartProjects()
    const tasks_selector_store = useTasksSelectorStore()

    smart_project_store.selectProject(SmartProjectName.Complete)

    expect(tasks_selector_store.currentSelector).toEqual(completeSmartProject)
    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.COMPLETED, sortBy: 'updatedAt' })
  })

  it('should be select trash project when project name is trash', async () => {
    const smart_project_store = useSmartProjects()
    const tasks_selector_store = useTasksSelectorStore()

    smart_project_store.selectProject(SmartProjectName.Trash)

    expect(tasks_selector_store.currentSelector).toEqual(trashSmartProject)
    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.REMOVED, sortBy: 'updatedAt' })
  })

  it('should be load complete smart project tasks when SmartProjectName is complete', async () => {
    vi.mocked(fetchAllTasks).mockResolvedValue([
      create_task_response('task1', TaskStatus.COMPLETED),
    ])
    const tasks = await loadSmartProjectTasks(SmartProjectName.Complete)
    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.COMPLETED, sortBy: 'updatedAt' })
    expect(tasks.length).toBe(1)
    expect(tasks[0].status).toBe(TaskStatus.COMPLETED)
  })

  it('should be load removed smart project tasks when SmartProjectName is complete', async () => {
    vi.mocked(fetchAllTasks).mockResolvedValue([
      create_task_response('task1', TaskStatus.REMOVED),
    ])
    const tasks = await loadSmartProjectTasks(SmartProjectName.Trash)

    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.REMOVED, sortBy: 'updatedAt' })
    expect(tasks.length).toBe(1)
    expect(tasks[0].status).toBe(TaskStatus.REMOVED)
  })
})
