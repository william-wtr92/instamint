import { serve } from "@hono/node-server"

import appConfig from "./db/config/config"
import server from "./server"

server(appConfig).then((app): void => {
  serve({
    fetch: app.fetch,
    port: appConfig.port,
  })
})
