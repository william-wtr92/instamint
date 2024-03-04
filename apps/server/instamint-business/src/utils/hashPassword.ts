import { pbkdf2 as pbkdf2Callback, randomBytes } from "crypto"
import { promisify } from "util"
import confApi from "../db/config/config"

const pbkdf2 = promisify(pbkdf2Callback)

export const hashPassword = async (
  password: string,
  salt: string = randomBytes(confApi.security.password.saltlen).toString("hex")
) => {
  const key = await pbkdf2(
    `${password}${confApi.security.password.pepper}`,
    salt,
    confApi.security.password.iterations,
    confApi.security.password.keylen,
    confApi.security.password.digest
  )

  return [key.toString("hex"), salt]
}
