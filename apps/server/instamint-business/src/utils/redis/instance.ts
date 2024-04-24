import Redis from "ioredis"

import appConfig from "@/db/config/config"

export const redis = new Redis({
  port: parseInt(appConfig.redis.port),
  host: appConfig.redis.host,
  password: appConfig.redis.password,
})
