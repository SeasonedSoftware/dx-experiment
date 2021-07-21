import { z, ZodTypeAny } from 'zod'
import { PrismaClient } from '@prisma/client'
import zipObject from 'lodash/zipObject'
import { makePrismaPublisher } from './publisher'

const prisma = new PrismaClient()
const databasePublihserChannel: string = process.env.CHANNEL ?? 'database-publisher-channel'

const publishInNamespace = makePrismaPublisher(prisma, databasePublihserChannel)

type Errors = Record<string, string>
type Result<T> = { kind: 'empty' } | { kind: 'success'; data: T } | { kind: 'error'; errors: Errors }

type ActionResult<T> = Result<T> | Promise<Result<T>>

const success: <T>(r: T) => Result<T> =
  (r) => ({ kind: 'success', data: r })

const empty: <T>() => Result<T> =
  () => ({ kind: 'empty' })

const error = (r: Errors) => ({ kind: 'error', errors: r })

const ALL_TRANSPORTS = ['http', 'websocket', 'terminal', 'notification', 'timer'] as const
type Transport = typeof ALL_TRANSPORTS[number]

type Action<I extends ZodTypeAny = ZodTypeAny, O = unknown> = {
  transport: Transport
  mutation: boolean
  parser?: I
  execute: (input: z.infer<I>) => ActionResult<O>
}

const allHelpers = ALL_TRANSPORTS.map((el) => (
  {
    query: <O, P extends ZodTypeAny | undefined = undefined>(parser?: P) => (execute: (input: P extends ZodTypeAny ? z.infer<P> : void) => ActionResult<O>) =>
    ({
      transport: el,
      mutation: false,
      parser,
      execute,
    }),

    mutation: <O, P extends ZodTypeAny | undefined = undefined>(parser?: P) => (execute: (input: P extends ZodTypeAny ? z.infer<P> : void) => ActionResult<O>) =>
    ({
      transport: el,
      mutation: true,
      parser,
      execute,
    })
  }
))

const makeAction = zipObject(ALL_TRANSPORTS, allHelpers)

type Actions = Record<string, Action>
type DomainActions = Record<string, Actions>

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

const onAction:
  <T extends Action>(
    action: T,
    onError: (r: Errors) => any,
    onSuccess: (r: any) => any
  ) => (input?: ZodTypeAny) => any =
  ({ parser, execute }, onError, onSuccess) => async (input) => {
    const parsedInput = parser && parser.parse(input) || input
    const taskResult = await execute(parsedInput)
    switch (taskResult.kind) {
      case 'success':
        return onSuccess(taskResult.data)
      case 'empty':
        return onSuccess(null)
      case 'error':
        return onError(taskResult.errors)
    }
  }

export {
  Action,
  Actions,
  DomainActions,
  makeAction,
  publishInNamespace,
  success,
  empty,
  error,
  onAction,
  findActionInDomain
}