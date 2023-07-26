import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTasksSelectorStore } from '../tasksSelector'
import { SmartProjectName, completeSmartProject, trashSmartProject, useSmartProjects } from '../smartProjects'

describe('smart projects store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should be select complete project when project name is complete', async () => {
    const smart_project_store = useSmartProjects()
    const tasks_selector_store = useTasksSelectorStore()

    smart_project_store.selectProject(SmartProjectName.Complete)

    expect(tasks_selector_store.currentSelector).toEqual(completeSmartProject)
  })

  it('should be select trash project when project name is trash', async () => {
    const smart_project_store = useSmartProjects()
    const tasks_selector_store = useTasksSelectorStore()

    smart_project_store.selectProject(SmartProjectName.Trash)

    expect(tasks_selector_store.currentSelector).toEqual(trashSmartProject)
  })
})
