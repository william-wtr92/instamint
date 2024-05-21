import { sentry } from "@hono/sentry"
import { type Context, Hono } from "hono"
import { cors } from "hono/cors"
import { etag } from "hono/etag"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { secureHeaders } from "hono/secure-headers"
import knex from "knex"

import type { AppConfig } from "./db/config/configTypes"
import BaseModel from "./db/models/BaseModel"

import { auth } from "@/middlewares/auth"
import { isAdmin } from "@/middlewares/perms"
import prepareRoutes from "@/prepareRoutes"
import { redis } from "@/utils/redis/instance"

const server = async (appConfig: AppConfig) => {
  const db = knex(appConfig.db)
  BaseModel.knex(db)

  const app = new Hono()
  app.use(
    "*",
    cors({
      origin: appConfig.security.cors.origin,
      credentials: appConfig.security.cors.credentials,
    }),
    secureHeaders(),
    sentry({ dsn: appConfig.sentry.dsn }),
    etag(),
    logger(),
    prettyJSON()
  )

  app.use("/admin/*", auth, isAdmin)

  app.get("/", (c: Context) => {
    return c.text("Instamint Business API!")
  })

  prepareRoutes({ app, db, redis })

  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${appConfig.port}`)

  return app
}

export default server
