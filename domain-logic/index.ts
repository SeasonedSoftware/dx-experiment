import { Action, findActionInDomain, onAction } from './prelude'
import { Task, tasks } from './tasks'

const domain = { tasks }

const findAction = findActionInDomain(domain)

export { Action, Task, findAction, onAction, domain }