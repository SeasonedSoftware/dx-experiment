import { Action, findAction } from 'domain-logic'
import isNil from 'lodash/isNil'
import reduce from 'lodash/reduce'
import compose from 'lodash/fp/compose'
import map from 'lodash/fp/map'
import { Job, scheduleJob } from 'node-schedule'

type ScheduleUnit =
  | { kind: 'every'; unit?: number }
  | { kind: 'on'; unit?: number }

// Constructors
const every: (unit?: number) => ScheduleUnit = (unit) => ({
  kind: 'every',
  unit,
})

const on: (unit?: number) => ScheduleUnit = (unit) => ({ kind: 'on', unit })

// Destructor
const scheduleUnitToString: (scheduleUnit: ScheduleUnit) => string = (
  scheduleUnit,
) =>
  isNil(scheduleUnit.unit)
    ? '*'
    : scheduleUnit.kind === 'every'
    ? `*/${scheduleUnit.unit}`
    : `${scheduleUnit.unit}`

type Schedule = {
  second: ScheduleUnit
  minute: ScheduleUnit
  hour: ScheduleUnit
  dayOfMonth: ScheduleUnit
  month: ScheduleUnit
  dayOfWeek: ScheduleUnit
}

// Constructors
const everyXSeconds: (second: number) => Schedule = (second) => ({
  second: every(second),
  minute: every(),
  hour: every(),
  dayOfMonth: every(),
  month: every(),
  dayOfWeek: every(),
})

// Destructors
const scheduleToString: (schedule: Schedule) => string = (schedule) =>
  reduce(
    schedule,
    (memo, value) => memo + scheduleUnitToString(value) + ' ',
    '',
  )

type ScheduledJob = {
  name: string
  schedule: Schedule
  action: Action
}

// Constructors
const scheduleAction: (
  schedule: Schedule,
) => (namespace: string, actionName: string) => ScheduledJob =
  (schedule: Schedule) =>
  (namespace: string, actionName: string, actionParameters?: any) => {
    const maybeAction = findAction('timer')(namespace, actionName)

    if (isNil(maybeAction)) {
      throw 'ActionNotFound'
    } else {
      return {
        name: `${actionName}@${namespace}@${scheduleToString(schedule)}`,
        schedule,
        action: maybeAction,
      }
    }
  }

const scheduleEveryXSeconds = compose(scheduleAction, everyXSeconds)

const scheduleJobs: (allJobs: ScheduledJob[]) => Job[] = map((s) => {
  const j = scheduleJob(s.name, scheduleToString(s.schedule), s.action.run)
  console.log(s.name, j)
  return j
})

export { ScheduledJob, scheduleEveryXSeconds, scheduleJobs }
