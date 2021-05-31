import { z } from 'zod'
import { ZodTypeAny } from 'zod'
import { PrismaClient } from '@prisma/client'
import zipObject from 'lodash/zipObject'
import { makePrismaPublisher } from './publisher'

const prisma = new PrismaClient()
const databasePublihserChannel: string = process.env.CHANNEL ?? 'database-publisher-channel'

const publishInNamespace = makePrismaPublisher(prisma, databasePublihserChannel)

const taskCreateParser = z.object({ text: z.string() })
const taskDeleteParser = z.object({ id: z.string() })
const taskUpdateParser = z.object({
  id: z.string(),
  text: z.string().optional(),
  completed: z.boolean().optional(),
})

type Errors = Record<string, string>
type Result = { success: true; data: any } | { success: false; errors: Errors }

type ActionResult = Result | Promise<Result>

const onResult = (
  onError: (r: any) => any,
  onSuccess: (r: any) => any,
  r: Result,
) =>
  r.success ? onSuccess(r.data) : onError(r.errors)

const success = (r: any) => ({ success: true, data: r } as Result)
const error = (r: Errors) => ({ success: false, errors: r } as Result)

const ALL_TRANSPORTS = ['http', 'websocket', 'terminal', 'notification', 'timer'] as const
type Transport = typeof ALL_TRANSPORTS[number]

type Action = {
  transport: Transport
  mutation: boolean
  parser?: ZodTypeAny
  action: (input: any) => ActionResult
}

type Actions = Record<string, Action>

const allHelpers = ALL_TRANSPORTS.map((el) => (
  {
    query: (action: (input: any) => ActionResult, parser?: ZodTypeAny) =>
    ({
      transport: el,
      mutation: false,
      parser,
      action,
    } as Action),

    mutation: (action: (input: any) => ActionResult, parser?: ZodTypeAny) =>
    ({
      transport: el,
      mutation: true,
      parser,
      action,
    } as Action)
  }
))

const makeAction = zipObject(ALL_TRANSPORTS, allHelpers)

const { query, mutation } = makeAction.http
const { mutation: notifyMutation } = makeAction.notification
const { mutation: timerMutation } = makeAction.timer

const publish = publishInNamespace('tasks')

const tasks: Actions = {
  post: mutation(
    async (input: z.infer<typeof taskCreateParser>) =>
      success(await prisma.task.create({ data: input })),
    taskCreateParser,
  ),
  get: query(async () => success(await prisma.task.findMany())),
  delete: mutation(
    async (input: z.infer<typeof taskDeleteParser>) =>
      success(
        await prisma.task.delete({
          where: input,
        }),
      ),
    taskDeleteParser,
  ),
  put: mutation(
    async (input: z.infer<typeof taskUpdateParser>) =>
      success(
        await prisma.task.update({
          where: { id: input.id },
          data: input,
        }),
      ),
    taskUpdateParser,
  ),
  'send-completed-notifications': query((input: any) => {
    const payload = { hello: 'world', superExpensiveOperation: true }
    console.log({ payload })
    publish('deliver-completed-notifications', payload)
    return success(null)
  }),
  'deliver-completed-notifications': notifyMutation((input: any) => {
    console.log('deliver-completed-notifications event handler received: ', { input })
    return success(null)
  }),
  'deliver-reminder-notifications': timerMutation((input: any) => {
    console.log('deliver-reminder-notifications event handler received: ', { input })
    return success(null)
  }),

  'clear-completed': mutation(async () => {
    await prisma.task.deleteMany({
      where: { completed: true },
    })
    return success(prisma.task.findMany())
  }),
}

type DomainActions = Record<string, Actions>

const rules: DomainActions = { tasks }

const findActionInDomain:
  (rules: DomainActions) =>
    (transport: Transport) =>
      (namespace: string, actionName: string) =>
        Action | undefined =
  (rules) =>
    (transport) =>
      (namespace, actionName) => {
        const action = rules[namespace]?.[actionName]
        return action && (action.transport === transport ? action : undefined)
      }

const findAction = findActionInDomain(rules)

export { Action, findAction, onResult }