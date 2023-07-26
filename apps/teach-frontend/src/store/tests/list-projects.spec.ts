import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { ListProject } from '../listProjects'
import { useListProjectsStore } from '../listProjects'
import { useTasksSelectorStore } from '../tasksSelector'
import { TaskStatus } from '../tasks'
import { fetchAllProjects, fetchAllTasks, fetchCreateProject } from '@/api'

vi.mock('@/api')

function create_project_response(name: string) {
  return {
    _id: '0',
    name,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  }
}

vi.mocked(fetchAllProjects).mockResolvedValue([create_project_response('学校')])
vi.mocked(fetchCreateProject).mockImplementation(async (name: string) => create_project_response(name))
vi.mocked(fetchAllTasks).mockResolvedValue([])

describe('list projects store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.clearAllMocks()
  })

  it('init', async () => {
    const list_project_store = useListProjectsStore()
    const tasks_selector_store = useTasksSelectorStore()

    await list_project_store.init()

    expect(fetchAllProjects).toBeCalled()
    expect(list_project_store.projects.length).toBe(1)
    expect(tasks_selector_store.currentSelector).toEqual(list_project_store.projects[0])
  })

  describe('create project', () => {
    it('should create project', async () => {
      const list_project_store = useListProjectsStore()
      const tasks_selector_store = useTasksSelectorStore()
      const name = '学校'

      await list_project_store.createProject(name)

      expect(fetchCreateProject).toBeCalledWith(name)
      expect(list_project_store.projects[0].name).toBe(name)
      expect(tasks_selector_store.currentSelector).toEqual(list_project_store.projects[0])
    })

    it('should not create project', async () => {
      const list_project_store = useListProjectsStore()
      const tasks_selector_store = useTasksSelectorStore()
      const name = ''

      await list_project_store.createProject(name)

      expect(fetchCreateProject).not.toBeCalled()
      expect(list_project_store.projects.length).toBe(0)
      expect(tasks_selector_store.currentSelector).toBeUndefined()
    })
  })

  describe('select project', () => {
    it('should be select project by list project', async () => {
      const list_project_store = useListProjectsStore()
      const tasks_selector_store = useTasksSelectorStore()

      const name = '学校'
      await list_project_store.createProject(name)
      list_project_store.selectProject(list_project_store.projects[0])

      expect(tasks_selector_store.currentSelector).toEqual(list_project_store.projects[0])
      expect(fetchAllTasks).toBeCalledWith({
        pId: (tasks_selector_store.currentSelector as ListProject).id,
        status: TaskStatus.ACTIVE,
      })
    })

    it('should be select project by list project id', async () => {
      const list_project_store = useListProjectsStore()
      const tasks_selector_store = useTasksSelectorStore()

      const name = '学校'
      await list_project_store.createProject(name)
      list_project_store.selectProject(list_project_store.projects[0].id)

      expect(tasks_selector_store.currentSelector).toEqual(list_project_store.projects[0])
      expect(fetchAllTasks).toBeCalledWith({
        pId: (tasks_selector_store.currentSelector as ListProject).id,
        status: TaskStatus.ACTIVE,
      })
    })

    it('should be select project by list project name', async () => {
      const list_project_store = useListProjectsStore()
      const tasks_selector_store = useTasksSelectorStore()

      const name = '学校'
      await list_project_store.createProject(name)
      list_project_store.selectProject(list_project_store.projects[0].name)

      expect(tasks_selector_store.currentSelector).toEqual(list_project_store.projects[0])
      expect(fetchAllTasks).toBeCalledWith({
        pId: (tasks_selector_store.currentSelector as ListProject).id,
        status: TaskStatus.ACTIVE,
      })
    })
  })

  describe('find project', () => {
    it('should find project by id', async () => {
      const list_project_store = useListProjectsStore()

      const name = '学校'
      await list_project_store.createProject(name)
      const project = list_project_store.findProject(list_project_store.projects[0].id)

      expect(project).toEqual(list_project_store.projects[0])
    })

    it('should find project by name', async () => {
      const list_project_store = useListProjectsStore()

      const name = '学校'
      await list_project_store.createProject(name)
      const project = list_project_store.findProject(list_project_store.projects[0].name)

      expect(project).toEqual(list_project_store.projects[0])
    })

    it('should not find project', async () => {
      const list_project_store = useListProjectsStore()

      const name = '学校'
      await list_project_store.createProject(name)
      const project = list_project_store.findProject('家庭')

      expect(project).not.toEqual(list_project_store.projects[0])
    })
  })

  describe('check project is exist', () => {
    it('should check project is exist', async () => {
      const list_project_store = useListProjectsStore()

      const name = '学校'
      await list_project_store.createProject(name)
      const is_exist = list_project_store.checkProjectIsExist(name)

      expect(is_exist).toBeTruthy()
    })

    it('should check project is not exist', async () => {
      const list_project_store = useListProjectsStore()

      const name = '学校'
      await list_project_store.createProject(name)
      const is_exist = list_project_store.checkProjectIsExist('家庭')

      expect(is_exist).toBeFalsy()
    })
  })
})
