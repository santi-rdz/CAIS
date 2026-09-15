import cron from 'node-cron'
import { cleanupExpiredRecords } from '#jobs/cleanupExpiredRecords.js'
import { CLEANUP_CRON_SCHEDULE } from '#lib/constants.js'

let cleanupTask = null

export function startScheduler() {
  cleanupTask = cron.schedule(
    CLEANUP_CRON_SCHEDULE,
    async () => {
      const result = await cleanupExpiredRecords()
      console.log('cleanupExpiredRecords:', result)
    },
    { name: 'cleanup-expired-records', noOverlap: true }
  )

  cleanupTask.on('execution:failed', (ctx) => {
    console.error('cleanupExpiredRecords failed:', ctx.execution?.error)
  })

  return cleanupTask
}

export function stopScheduler() {
  cleanupTask?.stop()
}
