import type { NextApiRequest, NextApiResponse } from 'next'
import { Action, findAction, onAction } from 'domain-logic'
import defaults from 'lodash/defaults'
import isNil from 'lodash/isNil'

const findHttpAction = findAction('http')

const makeHandler =
  (action: Action) =>
    async (input: any, req: NextApiRequest, res: NextApiResponse) => {
      if (req.method === 'GET' && action.mutation) {
        res.setHeader('Allow', 'POST, PATCH, PUT, DELETE')
        return res.status(405).end()
      }
      onAction(action,
        (errors) => res.status(400).json(errors),
        (data) => res.status(200).json(data)
      )(input)
    }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const [namespace, requestedAction] = req.query.actionPath as string[]
  const maybeRequestedAction = findHttpAction(namespace, requestedAction)
  const maybeResolvedAction =
    maybeRequestedAction || findHttpAction(namespace, req.method!.toLowerCase())

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
