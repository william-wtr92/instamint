import { pbkdf2 as pbkdf2Callback, randomBytes } from "crypto"
import { promisify } from "util"

import appConfig from "../db/config/config"

const pbkdf2 = promisify(pbkdf2Callback)

export const hashPassword = async (
  password: string,
  salt: string = randomBytes(appConfig.security.password.saltlen).toString(
    "hex"
  )
) => {
  const key = await pbkdf2(
    `${password}${appConfig.security.password.pepper}`,
    salt,
    appConfig.security.password.iterations,
    appConfig.security.password.keylen,
    appConfig.security.password.digest
  )

  return [key.toString("hex"), salt]
}
