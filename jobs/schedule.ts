import { ScheduledJob, scheduleEveryXSeconds, scheduleJobs } from './timer'

const jobs: ScheduledJob[] = [
  // scheduleEveryXSeconds(10)('tasks', 'deliver-reminder-notifications')
]

const schedule = () => {
  const scheduledJobs = scheduleJobs(jobs)
  console.log('\nScheduling jobs:\n', { scheduledJobs })
}

export default schedule
