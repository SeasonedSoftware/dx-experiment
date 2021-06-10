import { DomainActions, Action, findActionInDomain, onAction } from './prelude'
import { Task, tasks } from './tasks'

const rules: DomainActions = { tasks }

const findAction = findActionInDomain(rules)

export { Action, Task, findAction, onAction }