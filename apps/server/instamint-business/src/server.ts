import { Context, Hono } from "hono"
import { logger } from "hono/logger"
import { cors } from "hono/cors"
import { prettyJSON } from "hono/pretty-json"
import { etag } from "hono/etag"
import { secureHeaders } from "hono/secure-headers"
import { sentry } from "@hono/sentry"
import knex, { Knex } from "knex"

import { AppConfig } from "./db/config/configTypes"
import prepareRoutes from "./prepareRoutes"
import BaseModel from "./db/models/BaseModel"

const server = async (config: AppConfig): Promise<Hono> => {
  const db: Knex = knex(config.db)
  BaseModel.knex(db)

  const app: Hono = new Hono()
  app.use(
    "*",
    cors(),
    secureHeaders(),
    sentry({ dsn: config.sentry.dsn }),
    etag(),
    logger(),
    prettyJSON(),
  )

  app.get("/", (c: Context) => {
    return c.text("Instamint Business API!")
  })

  prepareRoutes({ app, db })

  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${config.port}`)

  return app
}

export default server
