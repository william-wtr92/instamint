import { globalsMessages } from "@/def"
import { redis } from "@/utils/redis/instance"

if (!redis) {
  throw new Error(globalsMessages.redisInstanceNotConnected.message)
}

export * from "./jobs/deleteAccountJob"
