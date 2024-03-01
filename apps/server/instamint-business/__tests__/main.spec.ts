import server from "@/server"
import config from "@/db/config/config"
import { describe, test, expect } from "@jest/globals"

const appContext = server(config)
describe("Base route test", () => {
  test("Base route test", async () => {
    await appContext.then(async (app) => {
      const res = await app.request("/")
      expect(res.status).toBe(200)
      expect(await res.text()).toBe("Instamint Business API!")
    })
  })
})
