import { ZodTypeAny } from 'zod'
import { PrismaClient } from '@prisma/client'
import zipObject from 'lodash/zipObject'
import { makePrismaPublisher } from './publisher'

const prisma = new PrismaClient()
const databasePublihserChannel: string = process.env.CHANNEL ?? 'database-publisher-channel'

const publishInNamespace = makePrismaPublisher(prisma, databasePublihserChannel)

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

export {
  Action,
  Actions,
  DomainActions,
  makeAction,
  publishInNamespace,
  success,
  error,
  onResult,
  findActionInDomain
}