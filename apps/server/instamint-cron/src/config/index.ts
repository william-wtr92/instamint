import { config as dotenv } from "dotenv"

import { configSchema } from "./configSchema"
import { tenMinutesTTL } from "@/utils/helpers/times"

dotenv()

const config = configSchema.parse({
  baseUrl: process.env.BUSINESS_SERVICE_URL,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    secret: process.env.SECURITY_CRON_JWT_SECRET,
    expiresIn: tenMinutesTTL,
    algorithm: "HS512",
    scopes: {
      deleteAccount: process.env.SECURITY_CRON_JWT_SCOPE_DELETE_ACCOUNT,
    },
  },
})

export default config
