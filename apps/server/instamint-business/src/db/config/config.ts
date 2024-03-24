import { config } from "dotenv"

import { AppConfig, configTypes } from "./configTypes"
import { oneDay } from "../../utils/times"

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" })
} else {
  config()
}

const appConfig = configTypes.parse({
  port: 3001,
  db: {
    client: "pg",
    connection: {
      host: process.env.DB_CONNECTION_HOST!,
      user: process.env.DB_CONNECTION_USER!,
      password: process.env.DB_CONNECTION_PWD!,
      database: process.env.DB_CONNECTION_DB!,
      // ssl: true,
      // sslmode: "require",
    },
    migrations: {
      directory: "./src/db/migrations",
      loadExtensions: [".ts"],
      stub: "./src/db/migration.stub",
    },
    seeds: {
      directory: "./src/db/seeds",
      loadExtensions: [".ts"],
    },
  },
  security: {
    jwt: {
      secret: process.env.SECURITY_JWT_SECRET!,
      expiresIn: oneDay,
    },
    password: {
      saltlen: 512,
      keylen: 512,
      iterations: 10000,
      digest: "sha512",
      pepper: process.env.SECURITY_PASSWORD_PEPPER!,
    },
  },
  sentry: {
    dsn: process.env.SENTRY_DSN!,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY!,
    sender: process.env.SENDGRID_SENDER!,
  },
  microservices: {
    files: process.env.FILES_SERVICE_URL!,
  },
}) satisfies AppConfig

export default appConfig
