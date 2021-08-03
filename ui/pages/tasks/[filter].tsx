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
import useSWR from 'swr'

const FILTERS = ['all', 'active', 'completed']

export default function TodosPage({
  filter,
  initialData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: allTasks, mutate } = useSWR('tasks', tasks.all.run, {
    initialData,
  })
  const addTask = async (payload: { text: string }) => {
    await tasks.create.run(payload)
    mutate()
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
            {allTasks
              ?.filter(({ completed }) => {
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
                  update={async ({ text, completed }: Partial<Task>) => {
                    await tasks.update.run({ id: task.id!, text, completed })
                    mutate()
                  }}
                  destroy={async () => {
                    await tasks.delete.run({ id: task.id! })
                    mutate()
                  }}
                />
              ))}
          </ul>
        </section>
        {allTasks && (
          <ListFooter
            filters={FILTERS}
            current={filter}
            tasks={allTasks}
            clearAll={async () => {
              await tasks['clear-completed'].run()
              mutate()
            }}
          />
        )}
      </section>
      <FooterInfo />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: FILTERS.map((filter) => ({ params: { filter } })),
  fallback: false,
})

export const getStaticProps = async (
  context: GetStaticPropsContext<{ filter: string }>
) => {
  const allTasks = await tasks.all.run()

  return {
    props: {
      initialData: allTasks,
      filter: context.params?.filter ?? 'all',
    },
    revalidate: 1,
  }
}
