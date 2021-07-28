import { findActionInDomain, onAction } from './prelude'
import { tasks } from './tasks'
import { messages } from './messages'
import type { Action } from './prelude'
import type { Task } from './tasks'

const rules = { tasks, messages }

const findAction = findActionInDomain(rules)

export { Action, Task, findAction, onAction }
