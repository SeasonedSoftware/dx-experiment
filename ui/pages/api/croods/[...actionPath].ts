import type { NextApiRequest, NextApiResponse } from 'next'
import { Action, findAction, onResult } from 'domain-logic'
import defaults from 'lodash/defaults'
import isNil from 'lodash/isNil'

const makeHandler =
  ({ mutation, parser, action }: Action) =>
    async (input: any, req: NextApiRequest, res: NextApiResponse) => {
      if (req.method === 'GET' && mutation) {
        res.setHeader('Allow', 'POST, PATCH, PUT, DELETE')
        return res.status(405).end()
      }
      const parsedInput = parser && parser.parse(input)
      const taskResult = await action(parsedInput)
      console.log({ taskResult })
      return onResult(
        (errors) => res.status(400).json(errors),
        (data) => res.status(200).json(data),
        taskResult,
      )
    }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const [namespace, requestedAction] = req.query.actionPath as string[]
  const maybeRequestedAction = findAction(namespace, requestedAction)
  const maybeResolvedAction =
    maybeRequestedAction || findAction(namespace, req.method!.toLowerCase())

  if (isNil(maybeResolvedAction)) {
    return res.status(404).end()
  } else {
    const resolvedAction: Action = maybeResolvedAction
    const id =
      isNil(maybeRequestedAction) && requestedAction ? requestedAction : null

    let params = { id }
    console.log({
      resolvedAction,
      namespace,
      requestedAction,
      method: req.method!.toLowerCase(),
      id,
    })
    return makeHandler(resolvedAction)(defaults(params, req.body), req, res)
  }
}
