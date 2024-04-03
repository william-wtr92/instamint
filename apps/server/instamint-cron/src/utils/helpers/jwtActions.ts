import jwt from "jsonwebtoken"

import config from "@/config"

export const signJwt = <T extends object>(payload: T, expiration?: number) => {
  return jwt.sign(payload, config.jwt.secret, {
    algorithm: config.jwt.algorithm,
    expiresIn: expiration ? expiration : config.jwt.expiresIn,
  })
}
