import { config } from "dotenv"

import { type AppConfig, baseConfig } from "./configTypes"
import { oneDay } from "../../utils/helpers/times"

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" })
} else {
  config()
}

const appConfig = baseConfig.parse({
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
  redis: {
    host: process.env.REDIS_HOST!,
    port: process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD!,
  },
  security: {
    jwt: {
      secret: process.env.SECURITY_JWT_SECRET!,
      expiresIn: oneDay,
      algorithm: "HS512",
      cron: {
        secret: process.env.SECURITY_CRON_JWT_SECRET!,
        scopes: {
          deleteAccount: process.env.SECURITY_CRON_JWT_SCOPE_DELETE_ACCOUNT!,
        },
      },
    },
    cookie: {
      secret: process.env.SECURITY_COOKIE_SECRET!,
      maxAge: 86400,
    },
    password: {
      saltlen: 512,
      keylen: 512,
      iterations: 10000,
      digest: "sha512",
      pepper: process.env.SECURITY_PASSWORD_PEPPER!,
    },
    cors: {
      origin: process.env.CORS_ORIGIN!,
      credentials: true,
    },
  },
  sentry: {
    dsn: process.env.SENTRY_DSN!,
  },
  sendgrid: {
    baseUrl: process.env.SENDGRID_BASE_URL!,
    apiKey: process.env.SENDGRID_API_KEY!,
    sender: process.env.SENDGRID_SENDER!,
    templates: {
      emailValidation: process.env.SENDGRID_TEMPLATE_EMAIL_VALIDATION!,
      resetPassword: process.env.SENDGRID_TEMPLATE_RESET_PASSWORD!,
      confirmResetPassword:
        process.env.SENDGRID_TEMPLATE_CONFIRM_RESET_PASSWORD!,
      confirmDeleteAccount:
        process.env.SENDGRID_TEMPLATE_CONFIRM_ACCOUNT_DELETION!,
      reactivateAccount: process.env.SENDGRID_TEMPLATE_ACCOUNT_REACTIVATION!,
      confirmReactivateAccount:
        process.env.SENDGRID_TEMPLATE_ACCOUNT_CONFIRM_REACTIVATION!,
    },
  },
  microservices: {
    files: process.env.FILES_SERVICE_URL!,
  },
}) satisfies AppConfig

export default appConfig
