import { sign, verify } from "hono/jwt"

import appConfig from "@/db/config/config"
import { now } from "@/utils/helpers/times"

export const signJwt = async <T extends object>(
  payload: T,
  expiration?: number
) => {
  return await sign(
    {
      payload,
      exp: expiration ? expiration : appConfig.security.jwt.expiresIn,
      nbf: now,
      iat: now,
    },
    appConfig.security.jwt.secret,
    appConfig.security.jwt.algorithm
  )
}

export const decodeJwt = async (jwt: string, secret?: string) => {
  return await verify(
    jwt,
    secret ? secret : appConfig.security.jwt.secret,
    appConfig.security.jwt.algorithm
  )
}

export const isJwtExpired = (exp: number) => {
  const expiryTimeInSeconds = exp

  const currentTimeInSeconds = Math.floor(Date.now() / 1000)

  return currentTimeInSeconds >= expiryTimeInSeconds
}
