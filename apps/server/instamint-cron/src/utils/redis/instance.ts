import Redis from "ioredis"

import config from "@/config"

export const redis = new Redis({
  port: parseInt(config.redis.port),
  host: config.redis.host,
})
