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
import { Task, Action, findAction, onResult } from 'domain-logic'
import { CroodsTuple } from 'croods/dist/types/typeDeclarations'

const baseUrl = '/api/croods'
const FILTERS = ['all', 'active', 'completed']
const croodsConfig = {
  baseUrl,
  debugActions: true,
  debugRequests: true,
  parseParams: identity,
}
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
  const [{ list: tasks }, { save, destroy, fetch: fetchTasks }]: [
    { list: Task[] },
    CroodsTuple[1],
  ] = useCroods({
    ...croodsConfig,
    name: 'tasks',
  })

  const addTask = ({ text }: { text: string }) => {
    const newTask = createTask(text)
    save({})(newTask)
  }

  const clearCompleted = async () => {
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
            {tasks
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
          tasks={tasks}
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
  const { action } = findAction('http')('tasks', 'get') as Action
  const taskResult = await action(null)
  const allTasks: Task[] = onResult(
    (_errors) => [],
    (data) => JSON.parse(JSON.stringify(data)),
    taskResult,
  )

  return {
    props: {
      filter: context.params?.filter ?? 'all',
      allTasks,
    },
    revalidate: 1,
  }
}
