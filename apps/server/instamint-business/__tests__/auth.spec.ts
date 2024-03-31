import knex from "knex"
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import { SC } from "@instamint/server-types"

import server from "@/server"
import appConfig from "@/db/config/config"
import { authMessages } from "@/def"

beforeAll(async () => {
  const db = knex(appConfig.db)
  await db.migrate.latest()
})

afterAll(async () => {
  const db = knex(appConfig.db)
  await db.migrate.rollback()
  await db.destroy()
})

describe("/auth/sign-up endpoint", () => {
  test("POST /auth/sign-up - Create a new user successfully", async () => {
    const appContext = server(appConfig)

    const userData = {
      username: "instamint01",
      email: "test@example.com",
      password: "Password123==+",
      gdprValidation: true,
    }

    const app = await appContext
    const response = await app.request("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    expect(response.status).toBe(SC.success.CREATED)
    expect(data).toHaveProperty("message", authMessages.userCreated.message)
  })
})
