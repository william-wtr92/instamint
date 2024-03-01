import { serve } from "@hono/node-server"
import { Context, Hono } from "hono"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"

const app: Hono = new Hono()

app.use("*", logger(), prettyJSON())

app.get("/", (c: Context) => {
  return c.json("Hello Hono!")
})

const port: number = 3002

// eslint-disable-next-line no-console
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
