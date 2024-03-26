import { Hono } from "hono"
import { Knex } from "knex"
import Redis from "ioredis"

export type RouteParams = {
  app: Hono
  db?: Knex
  redis?: Redis
}

export type ApiRoutes = (params: RouteParams) => void
export type PrepareRoutes = (ctx: RouteParams) => void
