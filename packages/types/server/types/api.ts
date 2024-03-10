import { Hono } from "hono"
import { Knex } from "knex"

export type RouteParams = {
  app: Hono
  db?: Knex
}

export type ApiRoutes = (params: RouteParams) => void
export type PrepareRoutes = (ctx: RouteParams) => void
