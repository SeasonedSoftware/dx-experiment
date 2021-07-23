import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import ListItem from 'components/list-item'
import FooterInfo from 'components/footer-info'
import ListFooter from 'components/list-footer'
import Form from 'components/form'
import { Task, tasks } from 'domain-logic/tasks'

const FILTERS = ['all', 'active', 'completed']

export default function TodosPage({
  filter,
  allTasks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const addTask = (payload: { text: string }) => {
    fetch('/api/croods/tasks/post', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  const clearCompleted = () =>
    fetch('/api/croods/tasks/clear-completed', { method: 'POST' })

  return (
    <div className="layout">
      <h1 className="text-center text-8xl text-red-800 dark:text-green-600 font-thin">
        todos
      </h1>
      <section className="mt-8 bg-white dark:bg-gray-800 shadow-xl flex flex-col w-full max-w-[35rem]">
        <Form addTask={addTask} />
        <section>
          <ul className="flex flex-col divide-y dark:divide-gray-600 shadow-inner">
            {allTasks
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
                  update={({ text, completed }: Partial<Task>) =>
                    fetch('/api/croods/tasks/put', {
                      method: 'POST',
                      body: JSON.stringify({ id: task.id, text, completed }),
                    })
                  }
                  destroy={() =>
                    fetch('/api/croods/tasks/delete', {
                      method: 'POST',
                      body: JSON.stringify({ id: task.id }),
                    })
                  }
                />
              ))}
          </ul>
        </section>
        <ListFooter
          filters={FILTERS}
          current={filter}
          tasks={allTasks}
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
  const allTasks = await tasks.get.run()

  return {
    props: {
      allTasks,
      filter: context.params?.filter ?? 'all',
    },
    revalidate: 1,
  }
}
