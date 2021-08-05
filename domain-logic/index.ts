import { findActionInDomain, onAction } from './prelude'
import { messages } from './messages'
import { stories } from './stories'
import type { Action } from './prelude'

const rules = { messages, stories }

const findAction = findActionInDomain(rules)

export { Action, findAction, onAction }
