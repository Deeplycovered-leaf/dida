import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { TaskStatus, useTasksStore } from '../tasks'
import { useTasksSelectorStore } from '../tasksSelector'
import { completeSmartProject } from '../smartProjects'
import { fetchAllTasks, fetchCompleteTask, fetchCreateTask, fetchMoveTaskToProject, fetchRemoveTask, fetchRestoreTask, fetchUpdateTaskContent, fetchUpdateTaskPosition, fetchUpdateTaskTitle, fetch_update_task_property } from '@/api'
import { liveListProject } from '@/tests/fixture'

vi.mock('@/api')

let position = 0
let _id = 0
function create_task_response(title: string, status: TaskStatus = TaskStatus.ACTIVE) {
  return {
    title,
    content: '',
    status,
    projectId: '1',
    _id: `${_id++}`,
    position: position++,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  }
}

vi.mocked(fetchCreateTask).mockImplementation(async (title: string) => create_task_response(title))
vi.mocked(fetchAllTasks).mockResolvedValue([])

describe('tasks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    _id = 0
    position = 0

    const tasksSelectorStore = useTasksSelectorStore()
    tasksSelectorStore.currentSelector = liveListProject

    // vi.mocked(fetchCreateTask).mockClear()
    vi.clearAllMocks()
  })

  describe('add task', () => {
    // it('should add task', async () => {
    //   const tasks_store = useTasksStore()
    //   const tasksSelectorStore = useTasksSelectorStore()

    //   tasksSelectorStore.currentSelector = liveListProject
    //   const task = await tasks_store.addTask('吃饭')

    //   expect(task?.title).toBe('吃饭')
    //   expect(tasks_store.tasks[0]).toEqual(task)
    //   expect(tasks_store.currentActiveTask).toEqual(task)
    //   expect(fetchCreateTask).toBeCalledWith(task?.title, liveListProject.id)
    // })

    it('should add task to first position', async () => {
      const tasks_store = useTasksStore()

      await tasks_store.addTask('first')
      const task = await tasks_store.addTask('吃饭')

      expect(task?.title).toBe('吃饭')
      expect(tasks_store.tasks[0]).toEqual(task)
      expect(tasks_store.currentActiveTask).toEqual(task)
      expect(fetchCreateTask).toBeCalledWith(task?.title, liveListProject.id)
    })

    it('should not add task when currentActiveTask is undefind', async () => {
      const tasks_store = useTasksStore()
      const tasksSelectorStore = useTasksSelectorStore()

      tasksSelectorStore.currentSelector = undefined
      const task = await tasks_store.addTask('吃饭')

      expect(task).toBeUndefined()
      expect(tasks_store.tasks.length).toBe(0)
      expect(tasks_store.currentActiveTask).toBeUndefined()
      expect(fetchCreateTask).not.toBeCalled()
    })

    it('should not add task when currentSelector type is smartProject', async () => {
      const tasks_store = useTasksStore()
      const tasksSelectorStore = useTasksSelectorStore()

      tasksSelectorStore.currentSelector = completeSmartProject
      const task = await tasks_store.addTask('吃饭')

      expect(task).toBeUndefined()
      expect(tasks_store.tasks.length).toBe(0)
      expect(tasks_store.currentActiveTask).toBeUndefined()
      expect(fetchCreateTask).not.toBeCalled()
    })
  })

  it('should remove task', async () => {
    const tasks_store = useTasksStore()

    const task = await tasks_store.addTask('吃饭')
    await tasks_store.removeTask(task!)

    expect(fetchRemoveTask).toBeCalledWith(task?.id)
    expect(tasks_store.tasks.length).toBe(0)
    expect(tasks_store.currentActiveTask).toBeUndefined()
  })

  it('should complete task', async () => {
    const tasks_store = useTasksStore()

    const task = (await tasks_store.addTask('吃饭'))!
    await tasks_store.completeTask(task)

    expect(fetchCompleteTask).toBeCalledWith(task.id)
    expect(tasks_store.tasks.length).toBe(0)
    expect(tasks_store.currentActiveTask).toBeUndefined()
  })

  it('should restore task', async () => {
    const tasks_store = useTasksStore()

    const task = await tasks_store.addTask('吃饭')
    await tasks_store.restoreTask(task!)

    expect(fetchRestoreTask).toBeCalledWith(task?.id)
    expect(tasks_store.tasks.length).toBe(0)
    expect(tasks_store.currentActiveTask).toBeUndefined()
  })

  it('should move task to project', async () => {
    const tasks_store = useTasksStore()

    const task = (await tasks_store.addTask('吃饭'))!
    const projectId = '2'
    await tasks_store.moveTaskToProject(task, projectId)

    expect(fetchMoveTaskToProject).toBeCalledWith(task.id, projectId)
    expect(tasks_store.tasks.length).toBe(0)
    expect(tasks_store.currentActiveTask).toBeUndefined()
  })

  it('should update task', () => {
    const tasks_store = useTasksStore()

    tasks_store.updateTasks([create_task_response('吃饭')])

    expect(tasks_store.tasks.length).toBe(1)
  })

  describe('change active task', () => {
    it('should change active task by id', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      tasks_store.changeActiveTask(task.id)

      expect(tasks_store.currentActiveTask).toEqual(task)
    })

    it('should change active task by task', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      tasks_store.changeActiveTask(task)

      expect(tasks_store.currentActiveTask).toEqual(task)
    })

    it('should change active task by undefined', async () => {
      const tasks_store = useTasksStore()

      await tasks_store.addTask('first')
      await tasks_store.addTask('吃饭')

      tasks_store.changeActiveTask(undefined)

      expect(tasks_store.currentActiveTask).toBeUndefined()
    })
  })

  it('should find all tasks not removed', async () => {
    const tasks_store = useTasksStore()

    await tasks_store.findAllTasksNotRemoved()

    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.ACTIVE })
    expect(fetchAllTasks).toBeCalledWith({ status: TaskStatus.COMPLETED })
  })

  describe('cancel complete task', () => {
    it('should cancel complete task', async () => {
      const tasks_store = useTasksStore()

      await tasks_store.addTask('first')
      const task = (await tasks_store.addTask('吃饭'))!
      await tasks_store.addTask('three')
      await tasks_store.completeTask(task)
      await tasks_store.cancelCompleteTask(task)

      expect(fetchRestoreTask).toBeCalledWith(task.id)
      expect(task.status).toBe(TaskStatus.ACTIVE)
      expect(tasks_store.tasks.length).toBe(3)
      expect(tasks_store.tasks[1]).toEqual(task)
    })

    it('should cancel complete task the last task', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      await tasks_store.addTask('睡觉')
      await tasks_store.addTask('代码')
      await tasks_store.completeTask(task)

      await tasks_store.cancelCompleteTask(task)

      expect(fetchRestoreTask).toBeCalledWith(task.id)
      expect(task.status).toBe(TaskStatus.ACTIVE)
      expect(tasks_store.tasks[2]).toEqual(task)
    })

    it('should add task when only one task', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      await tasks_store.completeTask(task)
      await tasks_store.cancelCompleteTask(task)

      expect(fetchRestoreTask).toBeCalledWith(task.id)
      expect(task.status).toBe(TaskStatus.ACTIVE)
      expect(tasks_store.tasks[0]).toEqual(task)
    })
  })

  describe('update task detail', () => {
    it('should update task title', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      const new_title = '吃肉肉'
      await tasks_store.updateTaskTitle(task, new_title)

      expect(fetchUpdateTaskTitle).toBeCalledWith(task.id, new_title)
      expect(task.title).toBe(new_title)
    })

    it('should not update task title when title has not changed', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      const new_title = '吃饭'
      await tasks_store.updateTaskTitle(task, new_title)

      expect(fetchUpdateTaskTitle).not.toBeCalled()
      expect(task.title).toBe(new_title)
    })

    it('should update task content', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      const new_content = '吃肉肉'
      await tasks_store.updateTaskContent(task, new_content)

      expect(fetchUpdateTaskContent).toBeCalledWith(task.id, new_content)
      expect(task.content).toBe(new_content)
    })

    it('should not update task content when content has not changed', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      const new_content = ''
      await tasks_store.updateTaskContent(task, new_content)

      expect(fetchUpdateTaskContent).not.toBeCalled()
      expect(task.content).toBe(new_content)
    })

    it('should update task position', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      const new_position = 1
      await tasks_store.updateTaskPosition(task, new_position)

      expect(fetchUpdateTaskPosition).toBeCalledWith(task.id, new_position)
      expect(task.position).toBe(new_position)
    })

    it('should not update task content when content has not changed', async () => {
      const tasks_store = useTasksStore()

      const task = (await tasks_store.addTask('吃饭'))!
      const new_position = 0
      await tasks_store.updateTaskPosition(task, new_position)

      expect(fetchUpdateTaskPosition).not.toBeCalled()
      expect(task.position).toBe(new_position)
    })
  })

  it('should update task property', async () => {
    const tasks_store = useTasksStore()

    const task = (await tasks_store.addTask('吃饭'))!
    const new_title = '吃肉肉'
    // const new_content = '吃肉肉'
    // const new_position = 1

    const property = {
      title: new_title,
      // content: new_content,
      // position: new_position,
    }
    await tasks_store.update_task_property(task, property)

    expect(fetch_update_task_property).toBeCalledWith(task.id, property)
    expect(task.title).toBe(new_title)
    // expect(task.content).toBe(new_content)
    // expect(task.position).toBe(new_position)
  })
})
