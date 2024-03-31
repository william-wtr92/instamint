import { z } from "zod"

const dbConfigSchema = z.object({
  client: z.string(),
  connection: z.object({
    host: z.string(),
    user: z.string(),
    password: z.string(),
    database: z.string(),
  }),
  migrations: z.object({
    directory: z.string(),
    loadExtensions: z.array(z.string()),
    stub: z.string(),
  }),
  seeds: z.object({
    directory: z.string(),
    loadExtensions: z.array(z.string()),
  }),
})

const redisConfigSchema = z.object({
  host: z.string(),
  port: z.string(),
  password: z.string(),
})

const securityConfigSchema = z.object({
  jwt: z.object({
    secret: z.string(),
    expiresIn: z.number(),
    algorithm: z.literal("HS512"),
  }),
  cookie: z.object({
    secret: z.string(),
    maxAge: z.number(),
  }),
  password: z.object({
    saltlen: z.number(),
    keylen: z.number(),
    iterations: z.number(),
    digest: z.string(),
    pepper: z.string(),
  }),
  cors: z.object({
    origin: z.string(),
    credentials: z.boolean(),
  }),
})

const sentryConfigSchema = z.object({
  dsn: z.string(),
})

const sendgridConfigSchema = z.object({
  baseUrl: z.string(),
  apiKey: z.string(),
  sender: z.string(),
  templates: z.object({
    emailValidation: z.string(),
    resetPassword: z.string(),
    confirmResetPassword: z.string(),
  }),
})

const microservicesConfigSchema = z.object({
  files: z.string(),
})

export const baseConfig = z.object({
  port: z.number(),
  db: dbConfigSchema,
  redis: redisConfigSchema,
  security: securityConfigSchema,
  sentry: sentryConfigSchema,
  sendgrid: sendgridConfigSchema,
  microservices: microservicesConfigSchema,
})

export type AppConfig = z.infer<typeof baseConfig>
