import crypto from "crypto"

import appConfig from "@/db/config/config"

export const generateRoomName = (
  userAuthenticated: string,
  userTargeted: string
): string => {
  const users: string[] = [userAuthenticated, userTargeted].sort()

  return crypto
    .createHmac("sha256", appConfig.security.jwt.secret)
    .update(users.join(":"))
    .digest("hex")
}
