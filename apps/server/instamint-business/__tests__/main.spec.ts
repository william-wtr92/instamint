import { describe, test, expect } from "@jest/globals"
import { SC } from "@instamint/server-types"

import server from "@/server"
import config from "@/db/config/config"

const appContext = server(config)
describe("Base route test", () => {
  test("Base route test", async () => {
    await appContext.then(async (app) => {
      const res = await app.request("/")
      expect(res.status).toBe(SC.success.OK)
      expect(await res.text()).toBe("Instamint Business API!")
    })
  })
})
