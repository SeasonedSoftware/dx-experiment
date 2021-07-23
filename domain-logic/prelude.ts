import { z, ZodTypeAny } from 'zod'
import { PrismaClient } from '@prisma/client'
import zipObject from 'lodash/zipObject'
import { makePrismaPublisher } from './publisher'

const prisma = new PrismaClient()
const databasePublihserChannel: string =
  process.env.CHANNEL ?? 'database-publisher-channel'

const publishInNamespace = makePrismaPublisher(prisma, databasePublihserChannel)

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
  run: (input: z.infer<I>) => Promise<O>
  name: string | null
}

const allHelpers = (namespace: string) =>
  ALL_TRANSPORTS.map((el) => ({
    query:
      <O, P extends ZodTypeAny | undefined = undefined>(parser?: P) =>
      (
        run: (input: P extends ZodTypeAny ? z.infer<P> : void) => Promise<O>,
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
        run: (input: P extends ZodTypeAny ? z.infer<P> : void) => Promise<O>,
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
    onError: (r: any) => any,
    onSuccess: (r: any) => any,
  ) =>
  async (input?: ZodTypeAny): Promise<any> => {
    try {
      const parsedInput = parser?.parse(input) ?? input
      const result = await run(parsedInput)
      return onSuccess(result)
    } catch (err: unknown) {
      return onError(err)
    }
  }

type NamedRecord = Record<string, { name: string | null }>
const exportDomain = <T extends NamedRecord>(domain: T): T => {
  Object.keys(domain).forEach((k) => {
    domain[k].name = k
  })
  return domain
}

export {
  exportDomain,
  findActionInDomain,
  makeAction,
  onAction,
  publishInNamespace,
}
export type { Action }
