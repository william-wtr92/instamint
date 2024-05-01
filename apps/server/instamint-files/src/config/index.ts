import { config } from "dotenv"

import { configSchema } from "@/config/configSchema"

config()

const appConfig = configSchema.parse({
  port: parseInt(process.env.PORT_FILES!),
  cors: {
    origin: process.env.CORS_ORIGIN_BUSINESS!,
  },
  azure: {
    accountName: process.env.AZURE_ACCOUNT_NAME!,
    accountKey: process.env.AZURE_ACCOUNT_KEY!,
    blob: {
      connection: process.env.AZURE_BLOB_CONNECTION!,
      container: process.env.AZURE_BLOB_CONTAINER!,
    },
  },
})

export default appConfig
