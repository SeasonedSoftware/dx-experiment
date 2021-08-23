import type { NextApiRequest, NextApiResponse } from 'next'
import { Action, findAction, onAction } from 'domain-logic'
import isNil from 'lodash/isNil'
import superjson from 'superjson'

const findHttpAction = findAction('http')

const makeHandler =
  (action: Action) =>
  async (input: any, req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET' && action.mutation) {
      res.setHeader('Allow', 'POST, PATCH, PUT, DELETE')
      return res.status(405).end()
    }

    return onAction(
      action,
      (errors) => res.status(500).json({ errors, input }),
      (data) => res.status(200).json(superjson.stringify(data))
    )(input)
  }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const [namespace, requestedAction] = req.query.actionPath as [string, string]
  const maybeRequestedAction = findHttpAction(namespace, requestedAction)
  const maybeResolvedAction =
    maybeRequestedAction || findHttpAction(namespace, req.method!.toLowerCase())

  if (isNil(maybeResolvedAction)) {
    return res.status(404).end()
  } else {
    const resolvedAction: Action = maybeResolvedAction
    const id =
      isNil(maybeRequestedAction) && requestedAction ? requestedAction : null

    console.log({
      namespace,
      requestedAction,
      method: req.method!.toLowerCase(),
      id,
    })

    const body = req.body ? superjson.parse(req.body) : undefined
    return makeHandler(resolvedAction)(body, req, res)
  }
}
