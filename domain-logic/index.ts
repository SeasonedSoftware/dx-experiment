import { findActionInDomain, onAction } from './prelude'
import { tasks } from './tasks'
import { messages } from './messages'
import { stories } from './stories'
import type { Action } from './prelude'

const rules = { tasks, messages, stories }

const findAction = findActionInDomain(rules)

export { Action, findAction, onAction }
