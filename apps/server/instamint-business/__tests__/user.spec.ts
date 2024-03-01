import server from "@/server"
import config from "@/db/config/config"
import knex from "knex"
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"

beforeAll(async () => {
  const db = knex(config.db)
  await db.migrate.latest()
})

afterAll(async () => {
  const db = knex(config.db)
  await db.migrate.rollback()
  await db.destroy()
})

describe("/user endpoint", () => {
  test("POST /user create a new user successfully", async () => {
    const appContext = server(config)

    const userData = {
      email: "test@example.com",
      password: "Password123==+",
      firstname: "Test",
      lastname: "User",
      roleId: "1",
    }

    const app = await appContext
    const response = await app.request("/user", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    expect(response.status).toBe(201)
    expect(data).toHaveProperty("message", "User created")
  })
})
