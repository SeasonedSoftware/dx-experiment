import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import identity from 'lodash/identity'
import ListItem from 'components/list-item'
import FooterInfo from 'components/footer-info'
import ListFooter from 'components/list-footer'
import Form from 'components/form'
import { useCroods, useHydrate } from 'croods'
import { Action, findAction, onAction, Task } from 'domain-logic'
import { tasks } from 'domain-logic/tasks'

const baseUrl = '/api/croods'
const FILTERS = ['all', 'active', 'completed']

const createTask = (text: string): Task => ({
  text,
  id: `${Math.random()}`,
  completed: false,
})

export default function TodosPage({
  filter,
  allTasks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useHydrate({ name: 'tasks', value: allTasks })
  const [{ list: taskList }, { save, destroy, fetch: fetchTasks }] = useCroods<Task>({
    baseUrl: baseUrl as any,
    debugActions: true,
    debugRequests: true,
    parseParams: identity,
    name: 'tasks'
  })

  const addTask = ({ text }: { text: string }) => {
    const newTask = createTask(text)
    save({})(newTask)
  }

  const clearCompleted = async () => {
    // await tasks['clear-completed'].execute() 
    await fetch(`${baseUrl}/tasks/clear-completed`, { method: 'POST' })
    fetchTasks({})()
  }

  return (
    <div className="layout">
      <h1 className="text-center text-8xl text-red-800 dark:text-green-600 font-thin">
        todos
      </h1>
      <section className="mt-8 bg-white dark:bg-gray-800 shadow-xl flex flex-col w-full max-w-[35rem]">
        <Form addTask={addTask} />
        <section>
          <ul className="flex flex-col divide-y dark:divide-gray-600 shadow-inner">
            {taskList
              .filter(({ completed }) => {
                switch (filter) {
                  case 'active':
                    return !completed
                  case 'completed':
                    return completed
                  default:
                    return true
                }
              })
              .map((task, idx) => (
                <ListItem
                  key={`task-${idx}`}
                  task={task}
                  update={save({ id: task.id })}
                  destroy={destroy({ id: task.id })}
                />
              ))}
          </ul>
        </section>
        <ListFooter
          filters={FILTERS}
          current={filter}
          tasks={taskList}
          clearAll={clearCompleted}
        />
      </section>
      <FooterInfo />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: FILTERS.map((filter) => ({ params: { filter } })),
    fallback: false,
  }
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ filter: string }>,
) => {
  const action = findAction('http')('tasks', 'get') as Action
  const allTasks: Task[] = await onAction(
    action,
    (_errors) => [],
    (data) => JSON.parse(JSON.stringify(data))
  )()

  return {
    props: {
      filter: context.params?.filter ?? 'all',
      allTasks,
    },
    revalidate: 1,
  }
}