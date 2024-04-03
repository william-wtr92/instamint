/* Current time in seconds + x */
export const now = Math.floor(Date.now() / 1000)

/* Times to live */
export const tenMinutesTTL = 10 * 60

/* Scheduled times */
export const scheduledTimes = {
  deleteAccountJob: "0 0,12 * * *",
} as const
