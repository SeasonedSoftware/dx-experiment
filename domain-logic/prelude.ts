import { z, ZodTypeAny } from 'zod'
import zipObject from 'lodash/zipObject'
import isEmpty from 'lodash/isEmpty'
import superjson from 'superjson'

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
}

const allHelpers = ALL_TRANSPORTS.map((el) => ({
  query:
    <O, P extends ZodTypeAny | undefined = undefined>(parser?: P) =>
    (run: (input: P extends ZodTypeAny ? z.infer<P> : void) => Promise<O>) => ({
      transport: el,
      mutation: false,
      parser,
      run,
    }),

  mutation:
    <O, P extends ZodTypeAny | undefined = undefined>(parser?: P) =>
    (run: (input: P extends ZodTypeAny ? z.infer<P> : void) => Promise<O>) => ({
      transport: el,
      mutation: true,
      parser,
      run,
    }),
}))

const makeAction = zipObject(ALL_TRANSPORTS, allHelpers)

type Actions = Record<string, Action>
type DomainActions = Record<string, Actions>

const findActionInDomain =
  (rules: DomainActions) =>
  (transport: Transport) =>
  (namespace: string, actionName: string): Action | undefined => {
    const action = rules[namespace][actionName]
    return action && (action.transport === transport ? action : undefined)
  }

const onAction =
  <T extends Action>(
    { parser, run }: T,
    onError: (r: any) => any,
    onSuccess: (r: any) => any
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

const exportDomain = <T extends Actions>(namespace: string, domain: T): T => {
  Object.keys(domain).forEach((key) => {
    const oldRun = domain[key].run
    const newRun = async (input: Parameters<typeof oldRun>[0]) => {
      return serverOrBrowser(
        () => oldRun(input),
        async () => {
          let fetchPromise = null
          if (domain[key].mutation) {
            fetchPromise = fetch(`/api/actions/${namespace}/${key}`, {
              method: 'POST',
              body: superjson.stringify(input),
            })
          } else {
            const qs = isEmpty(input)
              ? key
              : key + '?' + new URLSearchParams(input).toString()

            fetchPromise = fetch(`/api/actions/${namespace}/${qs}`)
          }
          const result = await fetchPromise
          const json = superjson.parse(await result.text())
          if (!result.ok) {
            throw json
          }
          return json
        }
      )
    }
    domain[key].run = newRun
  })
  return domain
}

const serverOrBrowser = <T>(server: () => T, browser: () => T) =>
  typeof window === 'undefined' ? server() : browser()

export {
  exportDomain,
  findActionInDomain,
  makeAction,
  onAction,
  serverOrBrowser,
}
export type { Action }
