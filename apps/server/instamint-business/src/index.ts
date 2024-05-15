import { serve } from "@hono/node-server"
import type { Server as HTTPServer } from "node:http"

import appConfig from "./db/config/config"
import server from "./server"

import { initWs } from "@/sockets"

server(appConfig).then((app) => {
  const serv = serve({
    fetch: app.fetch,
    port: appConfig.port,
  })

  initWs(serv as HTTPServer)
})
