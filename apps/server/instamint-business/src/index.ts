import { serve } from "@hono/node-server"
import config from "./db/config/config"
import server from "./server"

server(config).then((app): void => {
  serve({
    fetch: app.fetch,
    port: config.port,
  })
})
