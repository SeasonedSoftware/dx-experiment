import { z, ZodTypeAny } from 'zod'
import { PrismaClient } from '@prisma/client'
import zipObject from 'lodash/zipObject'
import { makePrismaPublisher } from './publisher'

const prisma = new PrismaClient()
const databasePublihserChannel: string =
  process.env.CHANNEL ?? 'database-publisher-channel'

const publishInNamespace = makePrismaPublisher(prisma, databasePublihserChannel)

type Errors = Record<string, string>
type Result<T = unknown> =
  | { kind: 'empty' }
  | { kind: 'success'; data: T }
  | { kind: 'error'; errors: Errors }

type ActionResult<T> = Result<T> | Promise<Result<T>>

const success = <T>(data: T): Result<T> => ({ kind: 'success', data })
const empty = (): Result => ({ kind: 'empty' })
const error = (errors: Errors): Result => ({ kind: 'error', errors })

const ALL_TRANSPORTS = [
  'http',
  'websocket',
  'terminal',
  'notification',
  'timer',
] as const
type Transport = typeof ALL_TRANSPORTS[number]

type Action<I extends ZodTypeAny = ZodTypeAny, O = unknown> = {
  transport: Transport
  mutation: boolean
  parser?: I
  run: (input: z.infer<I>) => ActionResult<O>
  name: string | null
}

const allHelpers = (namespace: string) =>
  ALL_TRANSPORTS.map((el) => ({
    query:
      <O, P extends ZodTypeAny | undefined = undefined>(parser?: P) =>
      (
        run: (
          input: P extends ZodTypeAny ? z.infer<P> : void,
        ) => ActionResult<O>,
      ) => ({
        transport: el,
        mutation: false,
        parser,
        run,
        name: null,
      }),

    mutation:
      <O, P extends ZodTypeAny | undefined = undefined>(parser?: P) =>
      (
        run: (
          input: P extends ZodTypeAny ? z.infer<P> : void,
        ) => ActionResult<O>,
      ) => ({
        transport: el,
        mutation: true,
        parser,
        run,
        name: null,
      }),
  }))

const makeAction = (namespace: string) =>
  zipObject(ALL_TRANSPORTS, allHelpers(namespace))

type Actions = Record<string, Action>
type DomainActions = Record<string, Actions>

const findActionInDomain =
  (rules: DomainActions) =>
  (transport: Transport) =>
  (namespace: string, actionName: string): Action | undefined => {
    const action = rules[namespace]?.[actionName]
    return action && (action.transport === transport ? action : undefined)
  }

const onAction =
  <T extends Action>(
    { parser, run }: T,
    onError: (r: Errors) => any,
    onSuccess: (r: any) => any,
  ) =>
  async (input?: ZodTypeAny): Promise<any> => {
    const parsedInput = (parser && parser.parse(input)) || input
    const taskResult = await run(parsedInput)
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
  findActionInDomain,
}
