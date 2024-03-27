import knex from "knex"
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"

import server from "@/server"
import appConfig from "@/db/config/config"
import { userCreated } from "@/utils/messages"

beforeAll(async () => {
  const db = knex(appConfig.db)
  await db.migrate.latest()
})

afterAll(async () => {
  const db = knex(appConfig.db)
  await db.migrate.rollback()
  await db.destroy()
})

describe("/users endpoint", () => {
  test("POST /users - Create a new user successfully", async () => {
    const appContext = server(appConfig)

    const userData = {
      username: "instamint01",
      email: "test@example.com",
      password: "Password123==+",
      gdprValidation: true,
    }

    const app = await appContext
    const response = await app.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    expect(response.status).toBe(201)
    expect(data).toHaveProperty("message", userCreated)
  })
})
