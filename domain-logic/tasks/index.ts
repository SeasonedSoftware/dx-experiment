import { z } from 'zod'
import { Prisma, PrismaClient } from '@prisma/client'
import { makeAction, exportDomain } from '../prelude'
import { makePrismaPublisher } from '../publisher'

const prisma = new PrismaClient()

const taskCreateParser = z.object({ text: z.string() })
const taskDeleteParser = z.object({ id: z.string() })
const taskUpdateParser = z.object({
  id: z.string(),
  text: z.string().optional(),
  completed: z.boolean().optional(),
})

const { query, mutation } = makeAction('tasks').http
const { mutation: notifyMutation } = makeAction('tasks').notification
const { mutation: timerMutation } = makeAction('tasks').timer

const databasePublisherChannel: string =
  process.env.CHANNEL ?? 'database-publisher-channel'

const publishInNamespace = makePrismaPublisher(prisma, databasePublisherChannel)
const publish = publishInNamespace('tasks')

const tasks = exportDomain({
  post: mutation<Task, typeof taskCreateParser>(taskCreateParser)(
    async (input) => prisma.task.create({ data: input })
  ),
  get: query<Task[]>()(async () => prisma.task.findMany()),
  delete: mutation<Task, typeof taskDeleteParser>(taskDeleteParser)(
    async (input) => prisma.task.delete({ where: input })
  ),
  put: mutation<Task, typeof taskUpdateParser>(taskUpdateParser)(
    async (input) =>
      prisma.task.update({ where: { id: input.id }, data: input })
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
    await prisma.task.deleteMany({
      where: { completed: true },
    })
    return prisma.task.findMany()
  }),
})

type Task = Prisma.TaskCreateInput

export { tasks }
export type { Task }
