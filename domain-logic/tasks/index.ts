import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { makeAction, exportDomain } from '../prelude'
import { makePrismaPublisher } from '../publisher'
import { getPrisma } from '../db'

const taskCreateParser = z.object({ text: z.string() })
const taskDeleteParser = z.object({ id: z.string() })
const taskUpdateParser = z.object({
  id: z.string(),
  text: z.string().optional(),
  completed: z.boolean().optional(),
})

const { query, mutation } = makeAction.http
const { mutation: notifyMutation } = makeAction.notification
const { mutation: timerMutation } = makeAction.timer

const databasePublisherChannel: string =
  process.env.CHANNEL ?? 'database-publisher-channel'

const publishInNamespace = makePrismaPublisher(
  getPrisma,
  databasePublisherChannel
)
const publish = publishInNamespace('tasks')

const tasks = exportDomain('tasks', {
  create: mutation<Task, typeof taskCreateParser>(taskCreateParser)(
    async (input) => getPrisma().task.create({ data: input })
  ),
  all: query<Task[]>()(async () => getPrisma().task.findMany()),
  delete: mutation<Task, typeof taskDeleteParser>(taskDeleteParser)(
    async (input) => getPrisma().task.delete({ where: input })
  ),
  update: mutation<Task, typeof taskUpdateParser>(taskUpdateParser)(
    async (input) =>
      getPrisma().task.update({ where: { id: input.id }, data: input })
  ),
  'send-completed-notifications': query<void>()(async () => {
    const payload = { hello: 'world', superExpensiveOperation: true }
    publish('deliver-completed-notifications', payload)
  }),
  'deliver-completed-notifications': notifyMutation<void>()(
    async (input: any) => {
      console.log('deliver-completed-notifications event handler received: ', {
        input,
      })
    }
  ),
  'deliver-reminder-notifications': timerMutation<void>()(
    async (input: any) => {
      console.log('deliver-reminder-notifications event handler received: ', {
        input,
      })
    }
  ),
  'clear-completed': mutation<Task[]>()(async () => {
    await getPrisma().task.deleteMany({
      where: { completed: true },
    })
    return getPrisma().task.findMany()
  }),
})

type Task = Prisma.TaskCreateInput

export { tasks }
export type { Task }
