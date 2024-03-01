import { Hono, Env } from "hono"
import { Knex } from "knex"

export type RouteParams<T extends Env = Env> = {
  app: Hono<T>
  db?: Knex
}

export type ApiRoutes<T extends Env = Env> = (params: RouteParams<T>) => void
export type PrepareRoutes<T extends Env = Env> = (ctx: RouteParams<T>) => void
