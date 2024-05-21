import { Hono } from "hono"
import { Knex } from "knex"
import Redis from "ioredis"
import { ContainerClient } from "@azure/storage-blob"

export type RouteParams = {
  app: Hono
  db?: Knex
  redis?: Redis
  azure?: ContainerClient
}

export type ApiRoutes = (params: RouteParams) => void
export type PrepareRoutes = (ctx: RouteParams) => void

export type SimpleHeaders = { [key: string]: string }
