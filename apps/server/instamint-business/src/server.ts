import { Context, Hono } from "hono"
import { logger } from "hono/logger"
import { cors } from "hono/cors"
import { prettyJSON } from "hono/pretty-json"
import { etag } from "hono/etag"
import { secureHeaders } from "hono/secure-headers"
import { sentry } from "@hono/sentry"
import knex from "knex"
import Redis from "ioredis"

import { AppConfig } from "./db/config/configTypes"
import prepareRoutes from "./prepareRoutes"
import BaseModel from "./db/models/BaseModel"

const server = async (appConfig: AppConfig) => {
  const db = knex(appConfig.db)
  BaseModel.knex(db)

  const redis = new Redis({
    port: parseInt(appConfig.redis.port),
    host: appConfig.redis.host,
  })

  const app = new Hono()
  app.use(
    "*",
    cors(),
    secureHeaders(),
    sentry({ dsn: appConfig.sentry.dsn }),
    etag(),
    logger(),
    prettyJSON()
  )

  app.get("/", (c: Context) => {
    return c.text("Instamint Business API!")
  })

  prepareRoutes({ app, db, redis })

  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${appConfig.port}`)

  return app
}

export default server
