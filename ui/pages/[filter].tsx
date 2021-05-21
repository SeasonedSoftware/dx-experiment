import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import identity from 'lodash/identity'
import ListItem from 'components/list-item'
import FooterInfo from 'components/footer-info'
import ListFooter from 'components/list-footer'
import Form from 'components/form'
import { useCroods, useHydrate } from 'croods'

import 'todomvc-app-css/index.css'
import 'todomvc-common/base.css'
import { Task } from 'domain-logic/resources/task'
import { CroodsTuple } from 'croods/dist/types/typeDeclarations'

const baseUrl = 'http://localhost:3000/api/croods'
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
  createdAt: new Date(),
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
    <>
      <Head>
        <title>Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="todoapp">
        <Form addTask={addTask} />
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
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
    </>
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
  const results = await fetch(`${baseUrl}/tasks`)
  const allTasks: Task[] = await results.json()
  return {
    props: {
      filter: context.params?.filter ?? 'all',
      allTasks,
    },
    revalidate: 1,
  }
}
