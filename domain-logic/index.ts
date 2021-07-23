import { findActionInDomain, onAction } from './prelude'
import { tasks } from './tasks'
import type { Action } from './prelude'
import type { Task } from './tasks'

const rules = { tasks }

const findAction = findActionInDomain(rules)

export { Action, Task, findAction, onAction }
