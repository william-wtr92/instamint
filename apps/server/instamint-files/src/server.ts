import { type Context, Hono } from "hono"
import { cors } from "hono/cors"
import { showRoutes } from "hono/dev"
import { etag } from "hono/etag"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { secureHeaders } from "hono/secure-headers"

import appConfig from "@/config"
import prepareRoutes from "@/prepareRoutes"
import { blobStorage } from "@/utils/azure/blob"

const server = async () => {
  const app = new Hono()

  app.use(
    "*",
    cors({
      origin: appConfig.cors.origin,
      allowMethods: ["POST", "DELETE"],
    }),
    secureHeaders(),
    etag(),
    logger(),
    prettyJSON()
  )

  app.get("/", (c: Context) => {
    return c.json("Instamint Files Service!")
  })

  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${appConfig.port}`)

  prepareRoutes({ app, azure: blobStorage })

  showRoutes(app)

  return app
}

export default server
