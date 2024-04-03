export const now = Math.floor(Date.now() / 1000)
export const oneHour = Math.floor(Date.now() / 1000) + 60 * 60
export const oneDay = Math.floor(Date.now() / 1000) + 60 * 60 * 24

/* Times not based on now */
export const tenMinutesTTL = 10 * 60
export const oneHourTTL = 60 * 60
export const oneDayTTL = 60 * 60 * 24
export const twoDaysTTL = 60 * 60 * 24 * 2
