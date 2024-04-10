import { redis } from "@/utils/redis/instance"
import { globalsMessages } from "@/def"

if (!redis) {
  throw new Error(globalsMessages.redisInstanceNotConnected.message)
}

export * from "./jobs/deleteAccountJob"
