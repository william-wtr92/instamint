import { serve } from "@hono/node-server"

import appConfig from "@/config"
import server from "@/server"

server().then((app): void => {
  serve({
    fetch: app.fetch,
    port: appConfig.port,
  })
})
