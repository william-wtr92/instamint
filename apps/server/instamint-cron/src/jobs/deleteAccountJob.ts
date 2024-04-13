import { scheduleJob } from "node-schedule"
import { request } from "undici"

import config from "@/config"
import { redis } from "@/utils/redis/instance"
import { now, scheduledTimes, tenMinutesTTL } from "@/utils/helpers/times"
import { routes, redisKeys, jwtKeys } from "@/def"
import { signJwt } from "@/utils/helpers/jwtActions"

export const deleteAccountsJob = scheduleJob(
  scheduledTimes.deleteAccountJob,
  async () => {
    const payload = {
      payload: {
        jobId: `${jwtKeys.cron.deleteAccount.jobId}${Date.now()}`,
      },
      scope: jwtKeys.cron.deleteAccount.scope,
      iat: now,
      nbf: now,
    }

    const jobJwt = signJwt(payload)

    await redis.set(
      redisKeys.cron.deleteAccountToken,
      jobJwt,
      "EX",
      tenMinutesTTL
    )

    const { statusCode } = await request(
      `${config.baseUrl}${routes.users.deleteAccount}`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (statusCode !== 200) {
      await redis.del(redisKeys.cron.deleteAccountToken)
    }

    // eslint-disable-next-line no-console
    console.info("🗑️ Delete accounts job finished!")
  }
)
